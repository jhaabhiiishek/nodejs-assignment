const Sequelize = require('sequelize')
const db = require('../util/db.js')

const Product = db.define('product', {
	id: { 
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true, 
		allowNull: false
	},
	name: { 
		type: Sequelize.STRING, 
		allowNull: false 
	},
	description: { 
		type: Sequelize.TEXT, 
		allowNull: true 
	},
	price: { 
		type: Sequelize.DECIMAL(12, 2), 
		allowNull: false 
	},
	base_uom: { 
		type: Sequelize.STRING, 
		allowNull: false 
	}, 
	supplierId: { 
		type: Sequelize.INTEGER, 
		allowNull: false,
		references: {
			model: 'users',
			key: 'id'
		}
	}
});

module.exports = Product;