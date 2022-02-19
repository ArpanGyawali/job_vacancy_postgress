//const User = require('../Models/User');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const SECRET = config.get('APP_SECRET');

// Function to login the users (SEEKER, RECRUITER, ADMIN)

const userLogin = async (userCreds, role, res) => {
	try {
		const { username, password } = userCreds;
		// Firse, Check wheatheer the username is in database
		let user = await pool.query('SELECT * FROM users WHERE username = $1', [
			username,
		]);

		const userRow = user.rows[0];
		//const user = await User.findOne({ username });
		//if (!user) {
		if (user.rowCount === 0) {
			return res.status(404).json({
				message: [{ msg: 'Username not found. Invalid login credentials' }],
				success: false,
			});
		}
		// Then, Check the role
		//if (user.role !== role) {
		if (userRow.role !== role) {
			return res.status(403).json({
				message: [{ msg: 'You are logging in from wrong portal' }],
				success: false,
			});
		}
		// Now user is valid. Lets compare the password
		//let isMatch = await bcrypt.compare(password, user.password);
		let isMatch = await bcrypt.compare(password, userRow.pw);
		if (!isMatch) {
			return res.status(404).json({
				message: [{ msg: 'Incorrect password. Invalid login credentials' }],
				success: false,
			});
		}
		// Password Matches. Lets generate a token

		// let data = {
		//    role: user.role,
		//    username: user.username,
		//    email: user.email ,
		//    avatar: user.avatar,
		//    token: `Bearer ${ token }`,
		//    expiresIn: 120
		// }

		const payload = {
			user_id: userRow.userid,
			username: userRow.username,
			email: userRow.email,
		};

		jwt.sign(payload, SECRET, { expiresIn: '5 days' }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token,
				message: `You are logged in`,
				success: true,
			});
		});
	} catch (err) {
		return res.status(400).json({
			message: `Unable to log in \n${err}`,
			success: false,
		});
	}
};

module.exports = {
	userLogin,
};
