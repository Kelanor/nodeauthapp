const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			res.json({ success: false,  msg: 'Failed to register user' });
		} else {
			res.json({ success: true });
		}
	});
})

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if (err)
			throw err;

		if (!user) {
			return res.json({ success: false,  msg: 'User not found' });
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err)
				throw err;

			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token: 'Bearer ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else {
				return res.json({ success: false,  msg: 'Wrong password' });
			}
		});
	});
})

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json({user: req.user});
})

// List
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	User.getUsers(function (error, users) {
		if (error) 
			throw error;

		res.json(users.map((current, index, array) => {
			return {
				id: current._id,
				name: current.name,
				username: current.username,
				email: current.email
			}
		}));
	})
})

// Get user
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	User.getUserById(req.params.id, function (error, user) {
		if (error) 
			throw error;

		res.json({
			id: user._id,
			name: user.name,
			username: user.username,
			email: user.email
		});
	})
})

// Edit user
router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => {

	var callbackFunc = (err, user) => {
		if (err) {
			return res.json({ success: false,  msg: 'Failed to edit user' });
		}

		return res.json({ success: true });
	}

	User.getUserById(req.params.id, function (error, user) {
		if (error) 
			throw error;

		user.name = req.body.name;
		user.username = req.body.username;
		user.email = req.body.email;

		if (req.body.changePassword) {
			User.comparePassword(req.body.oldPassword, user.password, (err, isMatch) => {
				if (err)
					throw err;

				if (!isMatch) {
					return res.json({ success: false,  msg: 'Wrong password' });
				}

				user.password = req.body.newPassword;
				User.editUserWithPassword(user, callbackFunc);
			});
		} else {
			User.editUser(user, callbackFunc);
		}
	})
})

module.exports = router;