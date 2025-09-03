// controllers/admin.js
const  User = require('../models/user');
const Order = require('../models/order');
const { sequelize } = require('../util/db');

exports.analytics = async (req, res, next) => {
  try {
    const counts = await Order.findAll({
		attributes: ['status', [sequelize.fn('count', sequelize.col('id')), 'count']],
		group: ['status']
    });

    // revenue per supplier
    const revenue = await Order.findAll({
		attributes: ['supplierId', [sequelize.fn('sum', sequelize.col('total_amount')), 'revenue']],
		group: ['supplierId'],
		include: [{ model: User, as: 'supplier', attributes: ['id','name'] }]
    });

    return res.status(200).json({ counts, revenue });
  	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'DB error' });
  	}
};
