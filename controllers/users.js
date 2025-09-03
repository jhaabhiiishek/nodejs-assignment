const { where } = require('sequelize');
const User = require('../models/user.js');


//Crud controllers:

exports.getUsers = (req,res,next)=>{
	User.findAll()
	.then(users=>{
		res.status(200).json({users: users})
	})
	.catch(err=>{console.log(err)})
}

exports.getUser = (req,res,next)=>{
	const userId = req.params.userId;
	User.findByPk(userId)
	.then(user=>{
		if(!user){
			return res.status(404).json({message: 'User not found'})
		}
		res.status(200).json({user: user})
	})
	.catch(err=>{
		console.log(err);
	})
}


exports.createUser = (req,res,next)=>{
	const name = req.body.name;
	const email = req.body.email;
	User.create({name:name, email:email})
	.then(result=>{
		console.log("User Created")
		res.status(201).json({user: result,message: 'User created successfully'})
	})
	.catch(err=>{
		console.log(err);
	})
}

exports.updateUser = (req,res,next)=>{
	const userId = req.params.userId;
	const updatedName = req.body.name;
	const updatedEmail = req.body.email;
	User.findByPk(userId)
	.then(user=>{
		if(!user){
			return res.status(404).json({message: 'User not found'})
		}
		user.name = updatedName;
		user.email = updatedEmail;
		return user.save();
	})
	.then(result=>{
		res.status(200).json({user: result,message: 'User updated successfully'})
	})
	.catch(err=>{
		console.log(err);
	})
}


exports.deleteUser = (req,res,next)=>{
	const userId = req.params.userId;
	User.findByPk(userId)
	.then(user=>{
		if(!user){
			return res.status(404).json({message: 'User not found'})
		}
		return user.destroy({
			where:{
				id:userId
			}
		});
	})
	.then(result=>{
		res.status(200).json({message: 'User deleted successfully'})
	})
	.catch(err=>{
		console.log(err);
	})
}

