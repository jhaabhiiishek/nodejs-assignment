const Sequelize = require('sequelize')
const db = require('../util/db.js')

const Inventory = db.define('inventory', {
	id: { 
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true, 
		allowNull: false 
	},
	supplier_id:{
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id'
		}
	},
	product_id: { 
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: 'products',
			key: 'id'
		}
	},
	quantity:{
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	}
});

module.exports = Inventory;