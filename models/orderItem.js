const Sequelize = require('sequelize')
const db = require('../util/db.js')

const OrderItem = db.define('order_item', {
	id: { 
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true, 
		allowNull: false 
	},
	orderId: { 
		type: Sequelize.INTEGER, 
		allowNull: false,
		references: {
			model: 'orders',
			key: 'id'
		}
	},
	productId: { 
		type: Sequelize.INTEGER, 
		allowNull: false,
		references: {
			model: 'products',
			key: 'id'
		}
	},
	quantity:{
		type: Sequelize.DECIMAL(18,6),
		allowNull: false
	},
	uom:{
		type: Sequelize.STRING,
		allowNull: false
	},
	price_per_base:{
		type: Sequelize.DECIMAL(12,2),
		allowNull: false
	},
	total_price:{
		type: Sequelize.DECIMAL(14,2),
		allowNull: false
	}
});

module.exports = OrderItem;