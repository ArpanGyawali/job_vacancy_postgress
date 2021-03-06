import React, { useState, useEffect, Fragment } from 'react';
import { postJob } from '../../Actions/job';
import { jobCount } from '../../Actions/job';
import { getJobs } from '../../Actions/job';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PostJobForm = ({
	postJob,
	jobCount,
	getJobs,
	auth: { user, isAuthenticated },
	count,
	job: { jobs },
}) => {
	const recruiter = isAuthenticated && user.name;
	useEffect(() => {
		jobCount();
		getJobs();
	}, [jobCount, getJobs]);
	const [jobData, setJobData] = useState({
		company: '',
		title: '',
		catagory: '',
		level: '',
		hremail: '',
		vacancyno: 1,
		deadline: Date.now,
		type: '',
		salary: 'Negotiable',
		location: '',
		skillsandqualifications: '',
		description: '',
	});

	const {
		company,
		title,
		catagory,
		level,
		vacancyno,
		deadline,
		hremail,
		type,
		salary,
		location,
		skillsandqualifications,
		description,
	} = jobData;

	const handleChange = (ele) =>
		setJobData({
			...jobData,
			[ele.target.name]: ele.target.value,
		});

	const handleAdd = (selectId, textId) => {
		let ddl = document.getElementById(selectId);
		let option = document.createElement('OPTION');
		option.innerHTML = document.getElementById(textId).value;
		ddl.options.add(option);
	};

	const handleSubmit = (ele) => {
		ele.preventDefault();
		postJob(jobData);
	};
	const role = user && user.role;

	let Catagories = jobs.map((job) => job.catagory);
	let uniqueCatagories = [...new Set(Catagories)];
	return (
		<Fragment>
			<h1 className='large text-primary'>Post Job</h1>
			<p className='lead'>
				{role === 'admin' ? (
					<Fragment>
						<i className='fas fa-briefcase'></i>{' '}
						{`Let your student know what opportunities are presented for them by various companies`}
					</Fragment>
				) : (
					<Fragment>
						<i className='fas fa-briefcase'></i>{' '}
						{`Let people out there know what ${recruiter} is looking for. Its for the best! `}
					</Fragment>
				)}
			</p>
			<small>
				<strong>* = required field</strong>
			</small>

			<form className='form' onSubmit={(ele) => handleSubmit(ele)}>
				{role === 'admin' && (
					<Fragment>
						<div className='form-group'>
							<select
								id='comp'
								name='company'
								value={company}
								onChange={(ele) => handleChange(ele)}
							>
								<option value='0'>* Select company</option>
								{count.companies.map((company) => (
									<option value={!count.isLoading && company.name}>
										{!count.isLoading && company.name}
									</option>
								))}
							</select>
							<small className='form-text'>
								<strong>Important Note: </strong>
								If the company is new.i.e. not included in drop down, then add
								the company to the list from below and select it from dropdown
							</small>
						</div>
						<div className='form-group'>
							<input type='text' placeholder='New Company Name' id='new' />
							<input
								type='button'
								value='Add'
								onClick={() => handleAdd('comp', 'new')}
							/>
						</div>
						<hr />
					</Fragment>
				)}
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Job Title'
						name='title'
						value={title}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>Enter an appropriate job title</small>
				</div>
				<hr />
				<Fragment>
					<div className='form-group'>
						<select
							id='cat'
							name='catagory'
							value={catagory}
							onChange={(ele) => handleChange(ele)}
						>
							<option value='0'>* Select catagory</option>
							{uniqueCatagories.map((catagory) => (
								<option value={catagory}>{catagory}</option>
							))}
						</select>
						<small className='form-text'>
							<strong>Important Note: </strong>
							If the catagory is not found in the dropdown, please do add a new
							catagory from below to the list and again select from dropdown.
						</small>
					</div>
					<div className='form-group'>
						<input type='text' placeholder='New Catagory' id='newCat' />
						<input
							type='button'
							value='Add'
							onClick={() => handleAdd('cat', 'newCat')}
						/>
					</div>
				</Fragment>
				<hr />
				<div className='form-group'>
					<select
						name='level'
						value={level}
						onChange={(ele) => handleChange(ele)}
					>
						<option value='0'>* Select job level</option>
						<option value='Internship'>Internship</option>
						<option value='Employed'>Junior</option>
						<option value='Assistent'>Assistent</option>
						<option value='Mid'>Mid</option>
						<option value='Senior'>Senior</option>
						<option value='Other'>Other</option>
					</select>
				</div>
				<hr />
				<div className='form-group'>
					<input
						type='number'
						placeholder='Number of vacancy'
						name='vacancyno'
						value={vacancyno}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						* Enter the number of vacancies opened.
					</small>
				</div>
				<hr />
				<h5>* Deadline</h5>
				<div className='form-group'>
					<input
						type='date'
						name='deadline'
						value={deadline}
						onChange={(ele) => handleChange(ele)}
					/>
				</div>
				<hr />
				<div className='form-group'>
					<select
						name='type'
						value={type}
						onChange={(ele) => handleChange(ele)}
					>
						<option value='0'>* Select job type</option>
						<option value='Full Time'>Full Time</option>
						<option value='Part Time'>Part Time</option>
					</select>
				</div>
				<hr />
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Exact Job Location'
						name='location'
						value={location}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						* Enter the location where employee need to work. You can specify
						Online if job is online
					</small>
				</div>
				<hr />
				<div className='form-group'>
					<input
						type='text'
						placeholder='Salary'
						name='salary'
						value={salary}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						You can leave this field if salary negotiable. Otherwise provide the
						number
					</small>
				</div>
				<hr />
				<div className='form-group'>
					<textarea
						placeholder='* Education, skills and other qualification required for this job'
						name='skillsandqualifications'
						value={skillsandqualifications}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						* Seperate different quallifications by enter key(Next line) so that
						it appears as a list.
					</small>
				</div>
				<hr />
				<div className='form-group'>
					<textarea
						placeholder='* Short description about the job'
						name='description'
						value={description}
						onChange={(ele) => handleChange(ele)}
					/>
				</div>
				<hr />
				<div className='form-group'>
					<input
						type='text'
						placeholder='Email of HR or anyone concerned with management of this job'
						name='hremail'
						value={hremail}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						This is so that the appliers can email hr for more queries or to
						apply.
					</small>
				</div>
				<input type='submit' value='Post' className='btn btn-primary my-1' />
			</form>
		</Fragment>
	);
};

PostJobForm.propTypes = {
	postJob: PropTypes.func.isRequired,
	getJobs: PropTypes.func.isRequired,
	jobCount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	count: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	job: state.job,
	count: state.count,
});

export default connect(mapStateToProps, { postJob, jobCount, getJobs })(
	PostJobForm
);
