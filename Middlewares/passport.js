const User = require('../Models/User');
const pool = require('../db');
const config = require('config');
const SECRET = config.get('APP_SECRET');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { userAuth } = require('../Middlewares/userAuth');

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: SECRET,
};

const jwtPassport = (passport) => {
	passport.use(
		new Strategy(opts, async (payload, done) => {
			try {
				const currentUser = await pool.query(
					'SELECT * FROM users WHERE userid = $1',
					[payload.user_id]
				);
				const user = currentUser.rows[0];
				if (currentUser.rowCount != 0) {
					//we can implement our logger function here to keep track
					//of every logs using pakages like morgan or winston

					return done(null, user); //appends the user to the req obj
				}
				//logger function
				return done(null, false);
			} catch (err) {
				return done(null, err);
			}
		})
	);
};

const serializeUser = (user) => {
	return {
		role: user.role,
		username: user.username,
		email: user.email,
		name: user.name,
		userid: user.userid,
		avatar: user.avatar,
	};
};

module.exports = {
	jwtPassport,
	serializeUser,
};
