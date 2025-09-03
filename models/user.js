const Sequelize = require('sequelize')
const db = require('../util/db.js')

const User = db.define('user',{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name:{
		type: Sequelize.STRING,
		allowNull: false
	},
	email:{
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	role:{
		type: Sequelize.ENUM('buyer', 'supplier', 'admin'),
		allowNull: false,
		defaultValue: 'buyer'
	}
})

module.exports = User;