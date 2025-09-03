const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234efgh5678';

router.get('/token/:userId', async (req, res) => {
	const user = await User.findByPk(req.params.userId);
	if (!user){
		return res.status(404).json({ 
			message: 'User not found' 
		});
	}
	const token = jwt.sign({ 
		userId: user.id 
		}, 
		JWT_SECRET,{
		expiresIn: '7d' 
	});
	res.json({ token });
});

module.exports = router;