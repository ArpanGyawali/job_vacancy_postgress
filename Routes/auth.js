const router = require('express').Router();
const { userAuth } = require('../Middlewares/userAuth');
//const User = require('../Models/User');
const pool = require('../db');

// For authorization and sending user object
///api/auth

router.get('/', userAuth, async (req, res) => {
	try {
		const currentUser = await pool.query(
			'SELECT * FROM users WHERE userid = $1',
			[req.user.userid]
		);
		const user = currentUser.rows[0];
		console.log(user);
		res.json(user);
	} catch (err) {
		return res.status(500).json({
			message: `Server Error ${err}`,
			success: false,
		});
	}
});

module.exports = router;
