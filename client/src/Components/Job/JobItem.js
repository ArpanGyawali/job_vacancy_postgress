import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { deleteJob } from '../../Actions/job';
import Moment from 'react-moment';
import { connect } from 'react-redux';

const JobItem = ({
	deleteJob,
	jobb: {
		jobid,
		userid,
		company,
		avatar,
		title,
		catagory,
		level,
		location,
		deadline,
		vacancyno,
		posted,
		role,
	},
	auth,
}) => {
	const userr = auth.user;
	const { isLoading } = auth;
	if (userr && !userr.email.includes('@pcampus.edu.np')) {
		if (role === 'admin') {
			return null;
		}
	}
	return (
		<Fragment>
			<div className='post bg-white p-1 my-1'>
				{role === 'admin' ? (
					<div>
						<h4>{company}</h4>
					</div>
				) : (
					<div>
						<Link to={`/recruiterProfile/${userid}`}>
							<img className='round-img' src={avatar} alt='' />
							<h4>{company}</h4>
						</Link>
					</div>
				)}
				<div>
					<p className='my-1'>
						<strong>Title: </strong>
						{title}
					</p>
					<p className='job-date'>
						Posted on <Moment format='YYYY/MM/DD'>{posted}</Moment>
					</p>
					<br />

					<p className='my-1'>
						<strong>Catagory: </strong>
						{catagory} | <strong>Level: </strong>
						{level}
					</p>
					<p className='job-date'>
						Deadline: <Moment format='YYYY/MM/DD'>{deadline}</Moment>
					</p>
					<p className='my-1'>
						<strong>Vacancy: </strong>
						{vacancyno} | <strong>Locaion: </strong>
						{location}
					</p>
					<Link to={`/job/${jobid}`} className='btn btn-primary'>
						{'View More  '}
						<i className='fa fa-arrow-right'></i>
					</Link>
					{!isLoading && userr && userid === userr.userid && (
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => deleteJob(jobid)}
						>
							<i className='fas fa-trash'></i>
						</button>
					)}
				</div>
			</div>
		</Fragment>
	);
};

JobItem.propTypes = {
	deleteJob: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	jobb: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { deleteJob })(JobItem);
