const Sequelize = require('sequelize')
const db = require('../util/db.js')

const Order = db.define('order', {
	id: { 
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true, 
		allowNull: false 
	},
	price: { 
		type: Sequelize.DECIMAL(12, 2), 
		allowNull: false 
	},
	status:{
		type: Sequelize.ENUM('pending', 'approved', 'fulfilled', 'cancelled'),
		allowNull: false
	},
	shipping_address: {
		type: Sequelize.STRING,
		allowNull: false
	},
	buyer_id:{
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id'
		}
	},
	supplier_id:{
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id'
		}
	}
});

module.exports = Order;