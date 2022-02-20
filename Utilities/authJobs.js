const Job = require('../Models/Job');
const mongoose = require('mongoose');
const { RecruiterProfile } = require('../Models/Profile');
const User = require('../Models/User');
const Company = require('../Models/AdminCompany');
const pool = require('../db');
const { CommandCompleteMessage } = require('pg-protocol/dist/messages');
// const User = require('../Models/User');

const addJob = async (req, res) => {
	const {
		company,
		title,
		catagory,
		level,
		vacancyno,
		hremail,
		deadline,
		type,
		salary,
		location,
		skillsandqualifications,
		description,
	} = req.body;

	const skillsAndQualifications = skillsandqualifications.split('\n');
	try {
		const adminCompany = await pool.query(
			'SELECT * FROM companies WHERE companyname = $1',
			[company]
		);
		let query;
		if (hremail) {
			if (req.user.role === 'admin') {
				query = {
					text: 'INSERT INTO jobs (userid, title, catagory, level, vacancyno, deadline, hremail, location, skillsandqualifications, description, type, salary, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
					values: [
						req.user.userid,
						title,
						catagory,
						level,
						vacancyno,
						deadline,
						hremail,
						location,
						skillsAndQualifications,
						description,
						type,
						salary,
						company,
					],
				};
			} else {
				query = {
					text: 'INSERT INTO jobs (userid, title, catagory, level, vacancyno, deadline, hremail, location, skillsandqualifications, description, type, salary, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
					values: [
						req.user.userid,
						title,
						catagory,
						level,
						vacancyno,
						deadline,
						hremail,
						location,
						skillsAndQualifications,
						description,
						type,
						salary,
						req.user.name,
					],
				};
			}
		} else {
			query = {
				text: 'INSERT INTO jobs (userid, title, catagory, level, vacancyno, deadline, location, skillsandqualifications, description, type, salary, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
				values: [
					req.user.userid,
					title,
					catagory,
					level,
					vacancyno,
					deadline,
					location,
					skillsAndQualifications,
					description,
					type,
					salary,
					req.user.name,
				],
			};
		}
		const job = await pool.query(query);
		const jobItem = job.rows[0];
		if (job.rowCount != 0 && req.user.role === 'admin') {
			if (adminCompany.rowCount != 0) {
				await pool.query(
					'UPDATE companies SET noofjobs = noofjobs + $1 WHERE companyname = $2',
					[1, company]
				);
			} else {
				await pool.query(
					'INSERT INTO companies (companyname, noofjobs) VALUES ($1, $2)',
					[company, 1]
				);
			}
		} else if (job.rowCount != 0 && req.user.role === 'recruiter') {
			await pool.query(
				'UPDATE recruiter SET noofjobs = noofjobs + $1 WHERE userid = $2',
				[1, req.user.userid]
			);
		}
		return res.status(200).json(jobItem);
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const viewJobs = async (req, res) => {
	try {
		let jobs;
		if (req.body.sortBy === 'vacancyNo') {
			jobs = await pool.query(
				`SELECT j.*, u.role, u.avatar
				FROM jobs AS j 
				INNER JOIN users AS u 
				ON j.userid = u.userid
				ORDER BY j.vacancyno DESC `
			);
		} else {
			jobs = await pool.query(
				`SELECT j.*, u.role, u.avatar
				FROM jobs AS j 
				INNER JOIN users AS u 
				ON j.userid = u.userid
				ORDER BY j.posted DESC `
			);
		}
		if (jobs.rowCount > 0) {
			return res.json(jobs.rows);
		} else {
			return res.status(404).json({
				message: `No Jobs Found`,
				success: false,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const viewJobById = async (req, res) => {
	try {
		const job = await pool.query(
			`
		SELECT j.*, u.role, u.avatar 
		FROM jobs AS j
		INNER JOIN users as u
		ON j.userid = u.userid
		WHERE j.jobid = $1`,
			[req.params.jobId]
		);

		if (job.rowCount == 0) {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		return res.json(job.rows[0]);
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const viewJobByUserId = async (req, res) => {
	try {
		const jobs = await pool.query(
			`
		SELECT j.*, u.role, u.avatar 
		FROM jobs AS j
		INNER JOIN users as u
		ON j.userid = u.userid
		WHERE j.userid = $1
		ORDER BY j.vacancyno DESC`,
			[req.params.userId]
		);
		if (jobs.rowCount > 0) {
			return res.json(jobs.rows);
		} else {
			return res.status(404).json({
				message: `No Jobs Found`,
				success: false,
			});
		}
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `No Jobs Found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const viewAppliedJobs = async (req, res) => {
	try {
		const appliedJobs = await pool.query(
			`SELECT j.*, u.role, u.avatar 
		FROM jobs as j
		INNER JOIN appliers as a ON a.jobid = j.jobid
		INNER JOIN users as u ON u.userid = j.userid
		WHERE a.userid = $1`,
			[req.params.userId]
		);
		// const jobs = await Job.find({
		// 	'appliers.user': req.params.userId,
		// }).populate('user', ['role']);
		if (appliedJobs.rowCount > 0) {
			return res.json(appliedJobs.rows);
		} else {
			return res.status(404).json({
				message: `No Jobs Applied`,
				success: false,
			});
		}
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `No Jobs Applied`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const deleteById = async (req, res) => {
	try {
		const jobCompany = await pool.query(
			'DELETE FROM jobs WHERE jobid = $1 RETURNING company',
			[req.params.jobId]
		);
		// const job = await Job.findById(req.params.jobId);

		// if (!job) {
		// 	return res.status(404).json({
		// 		message: `Job not found`,
		// 		success: false,
		// 	});
		// }

		// // Check User
		// if (job.user.toString() !== req.user._id.toString()) {
		// 	return res.status(401).json({
		// 		message: `You cannot delete the job`,
		// 		success: false,
		// 	});
		// }
		await pool.query(
			'UPDATE recruiter SET noofjobs = noofjobs - $1 WHERE userid = $2',
			[1, req.user.userid]
		);

		// Updating the count
		if (req.user.role === 'admin') {
			await pool.query(
				'UPDATE companies SET noofjobs = noofjobs - $1 WHERE companyname = $2',
				[1, jobCompany.rows[0].company]
			);
		}

		return res.status(200).json({
			message: `Job deleated`,
			success: true,
		});
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

// Apply for a job
const applyJob = async (req, res) => {
	try {
		console.log('/*-/-*/-*/-*/-/*/-*/-*/-**/-*/');
		const applier = await pool.query(
			'INSERT INTO appliers (userid, jobid, filename) VALUES ($1, $2, $3)',
			[req.user.userid, req.params.jobId]
		);
		const user = await User.findById(req.user.id).select('-password');
		const job = await Job.findById(req.params.jobId);
		const newApply = {
			user: req.user.id,
			name: user.name,
			avatar: user.avatar,
			resume: req.body.resume,
		};
		if (!job) {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		// Check if the post is already applied
		if (
			job.appliers.filter(
				(applier) => applier.user.toString() === req.user.id.toString()
			).length > 0
		) {
			return res.status(400).json({
				message: 'Job already applied',
				success: false,
			});
		}
		job.appliers.unshift(newApply);
		await job.save();
		res.json(job.appliers);
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

// Apply for a job
const applyFile = async (req, res, file) => {
	try {
		// const user = await User.findById(req.user.id).select('-password');
		// const job = await Job.findById(req.params.jobId);
		// const newApply = {
		// 	user: req.user.id,
		// 	name: user.name,
		// 	avatar: user.avatar,
		// 	file: file.id,
		// 	filename: file.originalname,
		// };
		// Check if the job is already applied
		const applier = await pool.query(
			'SELECT * FROM appliers WHERE userid = $1 AND jobid = $2',
			[req.user.userid, req.params.jobId]
		);
		if (applier.rowCount != 0) {
			return res.status(400).json({
				message: 'Job already applied',
				success: false,
			});
		}
		const newApplier = await pool.query(
			'INSERT INTO appliers (userid, jobid, filename, fileid) VALUES ($1, $2, $3, $4) RETURNING *',
			[req.user.userid, req.params.jobId, file.originalname, file.id]
		);
		// job.appliers.unshift(newApply);
		// await job.save();
		// res.json(job.appliers);
		res.json(newApplier.rows[0]);
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `Job not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const getAppliers = async (req, res) => {
	try {
		const appliers = await pool.query(
			`SELECT a.*, u.name, u.avatar 
			FROM appliers as a
			INNER JOIN users as u
			ON a.userid = u.userid
			WHERE a.jobid = $1`,
			[req.params.jobid]
		);
		if (appliers.rowCount > 0) {
			res.json(appliers.rows);
		}
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `Appliers not found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const countJobs = async (req, res) => {
	try {
		const companies = await pool.query(
			'SELECT * FROM companies ORDER BY noofjobs DESC'
		);
		if (companies.rowCount != 0) {
			return res.json(companies.rows);
		} else {
			return res.status(404).json({
				message: `No Companies Found`,
				success: false,
			});
		}
	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({
				message: `No Companies Found`,
				success: false,
			});
		}
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const deleteFile = async (req, res, gfs) => {
	try {
		await pool.query('DELETE FROM appliers WHERE fileid = $1 AND jobid = $2', [
			req.params.fileId,
			req.params.jobId,
		]);
		//res.redirect(`/api/jobs/view-jobs`);
		await gfs.delete(
			new mongoose.Types.ObjectId(req.params.fileId),
			async (err, data) => {
				if (err)
					return res.status(404).json({
						message: err.msg,
						success: false,
					});
			}
		);
		res.status(200).json(req.params.fileId);
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

const findFileId = async (req, res) => {
	try {
		// const job = await Job.findById(req.params.jobId);
		const filteredApplier = await pool.query(
			'SELECT * FROM appliers WHERE jobid = $1 AND userid = $2',
			[req.params.jobId, req.params.userId]
		);
		// const filteredApplier =
		// 	job &&
		// 	job.appliers.filter(
		// 		(applier) => applier.user.toString() === req.params.userId.toString()
		// 	);
		if (filteredApplier.rowCount > 0) {
			const fileData = {
				id: filteredApplier.rows[0].fileid,
				name: filteredApplier.rows[0].filename,
			};
			res.json(fileData);
		} else {
			res.status(404).json({
				message: 'No file found',
				success: false,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: `Server error ${err}`,
			success: false,
		});
	}
};

// View Appliers
// const viewAppliers = async(req, res) => {
// 	try {
// 		const job = await Job.findById(req.params.jobId);
// 		if(job.appliers.length() === 0){
// 			return res.status(404).json({
// 				message: `No appliers`,
// 				success: false,
// 			});
// 		}
// 		return res.json(job.appliers)
// 	}
// }

module.exports = {
	addJob,
	viewJobs,
	viewJobById,
	deleteById,
	applyJob,
	viewJobByUserId,
	viewAppliedJobs,
	countJobs,
	applyFile,
	deleteFile,
	findFileId,
	getAppliers,
};
