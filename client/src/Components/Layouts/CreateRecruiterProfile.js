import React, { useState, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createUpdate } from '../../Actions/profile';
import { connect } from 'react-redux';

const CreateRecruiterProfile = (props) => {
	const { createUpdate, history } = props;
	const {
		auth: { user, isAuthenticated },
	} = props;
	const id = isAuthenticated && user !== null && user.userid;
	const [recruiterProfileData, setRecruiterProfileData] = useState({
		location: '',
		website: '',
		contactno: '',
		description: '',
		social: '',
	});

	const { location, website, contactno, description, social } =
		recruiterProfileData;

	const handleChange = (ele) =>
		setRecruiterProfileData({
			...recruiterProfileData,
			[ele.target.name]: ele.target.value,
		});

	const handleSubmit = (ele) => {
		ele.preventDefault();
		createUpdate(recruiterProfileData, history, 'recruiter', id);
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Create Your Profile</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Let's get some information
			</p>
			<small>
				<strong>All the fields are required</strong>
			</small>
			<form className='form' onSubmit={(ele) => handleSubmit(ele)}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Current Location'
						name='location'
						value={location}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						City & state suggested (eg. Dhumbarahi, Kathmandu)
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Contact Number'
						name='contactno'
						value={contactno}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						Add a contact no in which other can call for queries
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Website'
						name='website'
						value={website}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						If your company has a website, please add it. Otherwise any other
						links to find information about your company.
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Social Media url'
						name='social'
						value={social}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						Enter any of your associated social media link.
					</small>
				</div>
				<div className='form-group'>
					<textarea
						placeholder='A short intro'
						name='description'
						value={description}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						Tell us a little about your company
					</small>
				</div>

				<input type='submit' className='btn btn-primary my-1' />
			</form>
		</Fragment>
	);
};

CreateRecruiterProfile.propTypes = {
	createUpdate: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { createUpdate })(
	withRouter(CreateRecruiterProfile)
);
