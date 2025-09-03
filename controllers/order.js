const User = require('../models/user.js');
const Order = require('../models/order.js');
const OrderItem = require('../models/orderItem.js');
const Inventory = require('../models/inventory.js');
const OrderStatusHistory = require('../models/OrderStatusHistory.js');
const Product = require('../models/product.js');
const ProductUom = require('../models/productUom.js');
const { sequelize } = require('../util/db')

async function convertToBase(productId, quantity, uom) {
	const p = await Product.findByPk(productId);
	if (!p) throw new Error('Product not found');

	if (uom === p.base_uom) return parseFloat(quantity);

	const row = await ProductUom.findOne({
		where: {
			productId: productId, 
			uom: uom 
		}
	});
	if (!row) throw new Error(`UOM ${uom} not supported for product ${productId}`);

	return parseFloat(row.conversion_factor) * parseFloat(quantity);
}

exports.placeOrder = async (req, res, next) => {
	const { 
		supplierId, 
		items, 
		buyerId
	} = req.body;
	if(!supplierId || !Array.isArray(items) || items.length === 0){
    return res.status(400).json({ message: 'Missing supplierId or items' });
  }
	const t = await sequelize.transaction();
	try {
		let total = 0;
		const processed = [];
		for(const it of items) {
      const { 
        productId, 
        quantity, 
        uom 
      } = it;
      if (!productId || quantity == null || !uom) throw new Error('Invalid item format');
      const product = await Product.findByPk(
        productId, { 
          transaction: t 
        }
      );
      if (!product) throw new Error(`Product ${productId} not found`);
      if (product.supplierId !== parseInt(supplierId)) throw new Error(`Product ${productId} does not belong to supplier ${supplierId}`);

      const qtyBase = await convertToBase(productId, quantity, uom);

      const pricePerBase = parseFloat(product.price);
      const itemTotal = pricePerBase * qtyBase;
      total += itemTotal;
      processed.push({ product, qtyBase, quantity, uom, pricePerBase, itemTotal });
		}

		const order = await Order.create({ 
      buyerId, 
      supplierId, 
      total_amount: total.toFixed(2), 
      status: 'pending' 
    }, { transaction: t });

		for (const p of processed) {
		await OrderItem.create({
			orderId: order.id,
			productId: p.product.id,
			quantity: p.quantity,
			uom: p.uom,
			price_per_base: p.pricePerBase,
			total_price: p.itemTotal.toFixed(2)
		}, { transaction: t });
		}

		await OrderStatusHistory.create({ orderId: order.id, status: 'pending', changedBy: buyerId, note: 'Order placed' }, { transaction: t });

		await t.commit();
		return res.status(201).json({ orderId: order.id });
	} catch (err) {
		await t.rollback();
		console.error(err);
		return res.status(400).json({ message: err.message || 'Could not place order' });
	}
};

exports.getOrders = (req, res, next) => {
  const user = req.body;
  const where = {};
  if (user.role === 'buyer') where.buyerId = user.id;
  if (user.role === 'supplier') where.supplierId = user.id;
  if (req.query.supplier_id && user.role === 'admin') where.supplierId = req.query.supplier_id;

  Order.findAll({
    where,
    include: [
      { model: OrderItem, as: 'items', include: [ { model: Product } ] },
      { model: OrderStatusHistory, as: 'history', order: [['timestamp', 'ASC']] },
      { model: User, as: 'buyer', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'supplier', attributes: ['id', 'name', 'email'] }
    ],
    order: [['createdAt', 'DESC']]
  })
  .then(orders => res.status(200).json({ orders }))
  .catch(err => { console.error(err); res.status(500).json({ message: 'DB Error' }) });
};


exports.changeOrderStatus = async (req, res, next) => {
  const user = req.user;
  const orderId = req.params.id;
  const { status } = req.body;
  if (!['approved','fulfilled','cancelled'].includes(status)) 
    return res.status(400).json({
      message: 'Invalid status'
    });

  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { 
      include: [{ model: OrderItem, as: 'items' }], 
      transaction: t, 
      lock: true 
    });
    if (!order) { 
      await t.rollback(); 
      return res.status(404).json({ 
        message: 'Order not found' 
      }); 
    }

    const prevStatus = order.status;
    if (prevStatus === status) { 
      await t.rollback(); 
      return res.status(400).json({ 
        message: 'Order already in that status' 
      }); 
    }

    if (status === 'approved') {
      for (const it of order.items) {
        const qtyBase = await convertToBase(it.productId, it.quantity, it.uom);
        const inventory = await Inventory.findOne({ where: { productId: it.productId, supplierId: order.supplierId }, transaction: t, lock: true });
        if (!inventory || parseFloat(inventory.quantity_in_base) < qtyBase) {
          throw new Error(`Out of stock for product ${it.productId}`);
        }
      }

      for (const it of order.items) {
        const qtyBase = await convertToBase(it.productId, it.quantity, it.uom);
        const inventory = await Inventory.findOne({ where: { productId: it.productId, supplierId: order.supplierId }, transaction: t, lock: true });
        inventory.quantity_in_base = parseFloat(inventory.quantity_in_base) - qtyBase;
        await inventory.save({ transaction: t });
      }
    }

    order.status = status;
    await order.save({ transaction: t });

    await OrderStatusHistory.create({ orderId: order.id, status, changedBy: user.id, note: `Changed from ${prevStatus} to ${status}` }, { transaction: t });

    await t.commit();

    return res.status(200).json({ orderId: order.id, status });
  }catch(err){
    await t.rollback();
    console.error(err);
    return res.status(400).json({ message: err.message || 'Could not change status' });
  }
};
