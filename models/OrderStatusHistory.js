// models/orderStatusHistory.js
const Sequelize = require('sequelize');
const db = require('../util/db');

const OrderStatusHistory = db.define('order_status_history', {
	id: { 
		type: Sequelize.INTEGER, 
		autoIncrement: true, 
		primaryKey: true, 
		allowNull: false 
	},
	orderId: { 
		type: Sequelize.INTEGER, 
		allowNull: false 
	},
	status: { 
		type: Sequelize.STRING, 
		allowNull: false 
	},
	changedBy: { 
		type: Sequelize.INTEGER, 
		allowNull: true 
	},
	note: { 
		type: Sequelize.TEXT 
	},
	timestamp: { 
		type: Sequelize.DATE, 
		allowNull: false, 
		defaultValue: Sequelize.NOW 
	}
});

module.exports = OrderStatusHistory;
