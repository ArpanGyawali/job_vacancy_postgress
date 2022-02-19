//const User = require('../Models/User');
const pool = require('../db');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const SECRET = config.get('APP_SECRET');

// Function to register the users (SEEKER, RECRUITER, ADMIN)

const userRegister = async (userCreds, role, res) => {
	try {
		const { name, username, password, email } = userCreds;
		//validate the username
		let usernameNotTaken = await validateUsername(username);
		if (!usernameNotTaken) {
			return res.status(400).json({
				message: [{ msg: 'Username is already taken' }],
				success: false,
			});
		}
		// Validate the email
		let emailNotTaken = await validateEmail(email);
		if (!emailNotTaken) {
			return res.status(400).json({
				message: [{ msg: 'Email is already registered' }],
				success: false,
			});
		}

		const avatar = gravatar.url(email, {
			s: '150',
			r: 'pg',
			d: 'mm',
		});

		// Get the hashed password
		const hashPassword = await bcrypt.hash(password, 10);

		// Create a new User
		const newUser = await pool.query(
			'INSERT INTO users (name, username, email, avatar, pw, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
			[name, username, email, avatar, hashPassword, role]
		);
		const newUserRow = newUser.rows[0];

		const payload = {
			user_id: newUserRow.userid,
			username: newUserRow.username,
			email: newUserRow.email,
		};

		jwt.sign(payload, SECRET, { expiresIn: 86400 }, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token,
				message: `You are registered and now logged in`,
				success: true,
			});
		});
	} catch (err) {
		// Check for validation error
		return res.status(500).json({
			message: `Server Error ${err}`,
			success: false,
		});
	}
};

const validateUsername = async (username) => {
	let user = await pool.query('SELECT * FROM users WHERE username = $1', [
		username,
	]);
	return user.rowCount != 0 ? false : true;
};

const validateEmail = async (email) => {
	let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
	return user.rowCount != 0 ? false : true;
};

module.exports = { userRegister };
