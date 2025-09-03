const Sequelize = require('sequelize')
const db = require('../util/db.js')

const ProductUOM = db.define('product_uom', {
	id: { 
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true, 
		allowNull: false
	},
	productId: { 
		type: Sequelize.INTEGER, allowNull: false 
	},
	uom: { 
		type: Sequelize.INTEGER, allowNull: false 
	},
	conversion_factor: { 
		type: Sequelize.DECIMAL(18, 8), 
		allowNull: false 
	}
});

module.exports = ProductUOM;