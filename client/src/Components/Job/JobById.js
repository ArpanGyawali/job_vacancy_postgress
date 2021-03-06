import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getJobById, getAppliers } from '../../Actions/job';
import Moment from 'react-moment';
import Spinner from '../Layouts/Spinner';
import ApplyResume from './ApplyResume';
import ApplyItem from './ApplyItem';
import { connect } from 'react-redux';

const JobById = ({
	getJobById,
	getAppliers,
	apply,
	job: { isLoading, job },
	auth: { isAuthenticated, user },
}) => {
	const { id } = useParams();

	useEffect(() => {
		getJobById(id);
		getAppliers(id);
	}, [getJobById, getAppliers, id]);

	// if (!isLoading) {
	// 	const {
	// 		company,
	// 		title,
	// 		catagory,
	// 		level,
	// 		type,
	// 		location,
	// 		deadline,
	// 		posted,
	// 		appliersNo,
	// 		skillsAndQualifications,
	// 		description,
	// 		vacancyNo,
	// 		salary,
	// 		avatar,
	// 		user,
	// 	} = job;
	// }

	return (
		<Fragment>
			{job === null || isLoading ? (
				<Spinner />
			) : (
				<Fragment>
					{job && (
						<Fragment>
							{job.role === 'recruiter' ? (
								<h2 className='text-primary'>
									{`${job.title} by `}
									<Link to={`/recruiterProfile/${job.userid}`}>
										{job.company}
									</Link>
								</h2>
							) : (
								<h2 className='text-primary'>
									{`${job.title} by ${job.company} posted by Admin`}
								</h2>
							)}
							<table className='GeneratedTable'>
								<tr>
									<th>Title</th>
									<td colSpan='3'>{job.title}</td>
								</tr>
								<tr>
									<th>Catagory</th>
									<td>{job.catagory}</td>
									<th>Level</th>
									<td>{job.level}</td>
								</tr>
								<tr>
									<th>Type</th>
									<td>{job.type}</td>
									<th>Salary</th>
									<td>{job.salary}</td>
								</tr>
								<tr>
									<th>No of Vacancy</th>
									<td>{job.vacancyno}</td>
									<th>No of appliers</th>
									{/* *****************************TO BE CHANGED********************************** */}
									{/* <td>{job.appliers.length}</td>							 */}
									<td>{apply.isLoading === false && apply.appliers.length}</td>
								</tr>
								<tr>
									<th>Posted In</th>
									<td>
										<Moment format='YYYY/MM/DD'>{job.posted}</Moment>
									</td>
									<th>Deadline</th>
									<td>
										<Moment format='YYYY/MM/DD'>{job.deadline}</Moment>
									</td>
								</tr>
								<tr>
									<th>Job Location</th>
									<td colSpan='3'>{job.location}</td>
								</tr>
								<tr>
									<th>Skills and Qualifications</th>
									<td colSpan='3'>
										{job.skillsandqualifications.map((item) => (
											<p className='my-1'>
												<i className='fa fa-arrow-right'></i> {` ${item}`}
											</p>
										))}
									</td>
								</tr>
								<tr>
									<th>Job Description</th>
									<td colSpan='3'>{job.description}</td>
								</tr>
							</table>
							{job.hremail && (
								<p>
									For more information about the job, email{' '}
									<strong>{job.hremail}</strong>
								</p>
							)}
							<br />

							{isAuthenticated && user.role === 'seeker' && (
								<ApplyResume key={user.userid} jobId={job.jobid} />
							)}
							{isAuthenticated &&
								job.userid == user.userid &&
								(user.role === 'recruiter' || user.role === 'admin') && (
									<Fragment>
										<h3 className='text-primary'>Appliers</h3>
										{/* *****************************TO BE CHANGED********************************** */}
										{/* {job.appliers.length === 0 && <h4>No one has applied</h4>}
										{job.appliers.map((apply) => (
											<ApplyItem key={apply._id} apply={apply} />
										))} */}
										{apply.isLoading === false &&
											apply.appliers.length === 0 && (
												<h4>No one has applied</h4>
											)}
										{apply.appliers.map((applier) => (
											<ApplyItem key={applier.applierid} apply={applier} />
										))}
									</Fragment>
								)}
						</Fragment>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

JobById.propTypes = {
	getJobById: PropTypes.func.isRequired,
	getAppliers: PropTypes.func.isRequired,
	job: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	apply: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	job: state.job,
	auth: state.auth,
	apply: state.apply,
});

export default connect(mapStateToProps, { getJobById, getAppliers })(JobById);
