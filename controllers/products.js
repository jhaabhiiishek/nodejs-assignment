const { Op } = require('sequelize');
const Product = require('../models/product.js');
const ProductUOM = require('../models/productUom.js');
const Inventory = require('../models/inventory.js');

exports.searchProducts = (req, res, next) => {
	const { query,price } = req.body;
	Product.findAll({
		where:{
			name: { 
				[Op.like]: `%${query.q || ''}%`
			},
			price: price ? { [Op.lte]: parseFloat(price) } : { [Op.gte]: 0 }
		}
	})
	.then(products => res.status(200).json({ products }))
	.catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};

exports.listAllProducts = (req, res, next) => {
	Product.findAll({})
	.then(products => res.status(200).json({ products }))
	.catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};
exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findAll({
		where: {
			id: productId
		}
	})
	.then(products => res.status(200).json({ products }))
	.catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};
exports.listAllProductsSupplier = (req, res, next) => {
	const { supplierId } = req.body;
	Product.findAll({
		where: {
			supplierId: supplierId
		}
	})
	.then(products => res.status(200).json({ products }))
	.catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};

// Supplier creates product
exports.createProduct = (req, res, next) => {
	const { 
		name,
		description, 
		price, 
		base_uom, 
		uoms,
		supplierId,
	} = req.body;
	if (!name || !price || !base_uom || !supplierId){
		return res.status(400).json({ message: 'Missing fields' });
	}

	Product.create({ name, description, price, base_uom, supplierId })
	.then(async product => {
		if (Array.isArray(uoms)) {
		await Promise.all(uoms.map(u => ProductUOM.create({
			productId: product.id,
			uom: u.uom,
			conversion_factor: u.conversion_factor
		})));
		}
		res.status(201).json({ product });
	})
	.catch(err => { 
		console.error(err); 
		res.status(500).json({ 
			message: 'DB Error' 
		})
	});
};

exports.updateProduct = (req, res, next) => {
	const { 
		supplierId, 
		productId, 
		new_name,
		new_description,
		new_price,
		new_base_uom
	} = req.body;

	Product.findOne({ 
		where: { 
			id: productId, 
			supplierId 
		}
	})
	.then(product => {
		if (!product) 
			return res.status(404).json({ 
				message: 'Product not found or not your product' 
			});
		return product.update({
			name: new_name,
			description: new_description,
			price: new_price,
			base_uom: new_base_uom
		});
	})
	.then(updated => res.status(200).json({ product: updated }))
	.catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};

// PATCH /products/:id/stock
// body: { quantity: 123.45, uom: 'kg' } -> quantity is relative to provided uom
exports.updateStock = async (req, res, next) => {
	const { 
		supplierId,
		productId,
		quantity,
		uom
	} = req.body;
	if (quantity == null || !uom) 
		return res.status(400).json({ 
			message: 'Missing quantity or uom' 
		});

	try {
		const product = await Product.findOne({ 
			where: { 
				id: productId,
				supplierId: supplierId
			}
		});
		if (!product) return res.status(404).json({ 
			message: 'Product not found or not yours' 
		});

		const uomRow = await ProductUOM.findOne({ 
			where: { 
				productId: productId,
				uom: uom
			}
		});
		if (!uomRow) return res.status(400).json({ 
			message: 'UOM not supported for product' 
		});

		const increment = parseFloat(uomRow.conversion_factor) * parseFloat(quantity); // in base units
		let inventory = await Inventory.findOne({ 
			where: { 
				productId: productId,
				supplierId: supplierId
			}
		});
		if (!inventory) {
			inventory = await Inventory.create({ 
				productId: productId,
				supplierId: supplierId,
				quantity_in_base: increment
			});
		} else {
			inventory.quantity_in_base = parseFloat(inventory.quantity_in_base) + increment;
			await inventory.save();
		}
		return res.status(200).json({ 
			inventory
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ 
			message: 'DB error' 
		});
	}
};
