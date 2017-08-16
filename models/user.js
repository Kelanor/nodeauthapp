const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Scheme
const UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		require: true
	},
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function (username, callback) {
	const query = { username: username };
	User.findOne(query, callback);
}

module.exports.addUser = function (user, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				throw err;
			}

			user.password = hash;
			user.save(callback);
		})
	})
}

module.exports.comparePassword = function (password, hash, callback) {
	bcrypt.compare(password, hash, (err, isMatch) => {
		if (err)
			throw err;

		callback(null, isMatch);
	});
}