//const { SeekerProfile, RecruiterProfile } = require('../Models/Profile');
//const User = require('../Models/User');
//const Job = require('../Models/Job');
const pool = require('../db');

// Common code for updating
const updateUser = async (req, res, role, profileFields) => {
	try {
		// Existing profile and need to update
		if (role === 'recruiter') {
			let rec = await pool.query('SELECT * FROM recruiter WHERE userid = $1', [
				req.user.userid,
			]);

			// Existing profile and need to update
			if (rec.rowCount != 0) {
				const query = `UPDATE recruiter SET 
				location = $1,  website = $2, contactno = $3, description = $4, social = $5
				WHERE userid = $6 RETURNING *`;
				const { user, location, description, social, website, contactno } =
					profileFields;

				rec = await pool.query(query, [
					location,
					website,
					contactno,
					description,
					social,
					user,
				]);
			} else {
				const query = `INSERT INTO recruiter (userid, location, website, contactno, description, social) 
				VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
				const { user, location, description, social, website, contactno } =
					profileFields;

				rec = await pool.query(query, [
					user,
					location,
					website,
					contactno,
					description,
					social,
				]);
			}
			return res.status(200).json(rec.rows[0]);
		} else if (role === 'seeker') {
			let sek = await pool.query('SELECT * FROM seeker WHERE userid = $1', [
				req.user.userid,
			]);

			// Existing profile and need to update
			if (sek.rowCount != 0) {
				const query = `UPDATE seeker SET 
				location = $1, contactno = $2, description = $3, social = $4, jobinterest = $5, currentstatus = $6
				WHERE userid = $7 RETURNING *`;
				const {
					user,
					location,
					description,
					social,
					contactno,
					currentstatus,
					jobinterest,
				} = profileFields;

				sek = await pool.query(query, [
					location,
					contactno,
					description,
					social,
					jobinterest,
					currentstatus,
					user,
				]);
			} else {
				const query = `INSERT INTO seeker (userid, location, contactno, description, social, jobinterest, currentstatus) 
				VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
				const {
					user,
					location,
					description,
					social,
					contactNo,
					jobinterest,
					currentstatus,
				} = profileFields;

				sek = await pool.query(query, [
					user,
					location,
					contactNo,
					description,
					social,
					jobinterest,
					currentstatus,
				]);
			}
			return res.status(200).json(sek.rows[0]);
		}
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};
// Create or update user profile
const userProfileUpdate = async (req, role, res) => {
	const {
		location,
		jobinterest,
		// workEmail,
		currentstatus,
		// currentJob,
		description,
		// facebook,
		// twitter,
		// linkedin,
		// github,
		// instagram,
		social,
		website,
		contactno,
	} = req.body;

	// BUild profile object
	const profileFields = {};
	profileFields.user = req.user.userid;
	if (location) profileFields.location = location;
	if (currentstatus) profileFields.currentstatus = currentstatus;
	if (description) profileFields.description = description;
	if (website) profileFields.website = website;
	if (contactno) profileFields.contactno = contactno;
	if (social) profileFields.social = social;

	if (jobinterest) {
		profileFields.jobinterest = jobinterest
			.split(',')
			.map((interest) => interest.trim());
	}

	// // Build social object
	// profileFields.social = {

	// };
	// if (facebook) profileFields.social.facebook = facebook;
	// if (linkedin) profileFields.social.linkedin = linkedin;
	// if (github) profileFields.social.github = github;
	// if (twitter) profileFields.social.twitter = twitter;
	// if (instagram) profileFields.social.instagram = instagram;
	updateUser(req, res, role, profileFields);
};

// Common code for getting by id
const getById = async (req, res, database) => {
	try {
		let query;
		if (database == 'seeker') {
			query = `SELECT * FROM seeker AS s 
			INNER JOIN users as u
			ON s.userid = u.userid
			WHERE s.userid = $1`;
		} else {
			query = `SELECT * FROM recruiter AS r
			INNER JOIN users as u
			ON r.userid = u.userid
			WHERE r.userid = $1`;
		}
		const profile = await pool.query(query, [req.params.user_id]);

		if (profile.rowCount == 0) {
			return res.status(400).json({
				message: `Profile Not found`,
				success: false,
			});
		}
		return res.json(profile.rows[0]);
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(400).json({
				message: `Profile Not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const getRecruiterById = async (req, res) => {
	getById(req, res, 'recruiter');
};

const getSeekerById = async (req, res) => {
	getById(req, res, 'seeker');
};

const deleteRecruiter = async (req, res) => {
	try {
		// Delete all Jobs of the user
		await pool.query('DELETE FROM jobs WHERE userid = $1', [req.user.userid]);
		// Delete Profile
		await pool.query('DELETE FROM recruiter WHERE userid = $1', [
			req.user.userid,
		]);
		// Delete Recruiter
		await pool.query('DELETE FROM users WHERE userid = $1', [req.user.userid]);
		return res.status(200).json({
			message: `User Deleated`,
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const deleteSeeker = async (req, res) => {
	try {
		// Delete Profile
		await pool.query('DELETE FROM seeker WHERE userid = $1', [req.user.userid]);
		// Delete Seeker
		await pool.query('DELETE FROM users WHERE userid = $1', [req.user.userid]);
		return res.status(200).json({
			message: `User Deleated`,
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

module.exports = {
	userProfileUpdate,
	getSeekerById,
	getRecruiterById,
	deleteRecruiter,
	deleteSeeker,
};
