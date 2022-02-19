import React, { useState, useEffect, Fragment } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createUpdate, getProfileById } from '../../Actions/profile';

const EditSeekerProfile = (props) => {
	const {
		createUpdate,
		getProfileById,
		history,
		profile: { profile, isLoading },
	} = props;
	const {
		auth: { user, isAuthenticated },
	} = props;
	const id = isAuthenticated && user.userid;
	const [seekerProfileData, setSeekerProfileData] = useState({
		location: '',
		jobinterest: '',
		currentstatus: '',
		contactno: '',
		description: '',
		social: '',
	});

	useEffect(() => {
		getProfileById(id, 'seeker');

		setSeekerProfileData({
			location: isLoading || !profile.location ? '' : profile.location,
			jobinterest:
				isLoading || !profile.jobinterest ? '' : profile.jobinterest.join(', '),
			contactno: isLoading || !profile.contactno ? '' : profile.contactno,
			currentstatus:
				isLoading || !profile.currentstatus ? '' : profile.currentstatus,
			description: isLoading || !profile.description ? '' : profile.description,
			social: isLoading || !profile.social ? '' : profile.social,
		});
	}, [isLoading, getProfileById]);

	const {
		location,
		jobinterest,
		currentstatus,
		contactno,
		description,
		social,
	} = seekerProfileData;

	let back = useHistory();

	const handleChange = (ele) =>
		setSeekerProfileData({
			...seekerProfileData,
			[ele.target.name]: ele.target.value,
		});

	const handleSubmit = (ele) => {
		ele.preventDefault();
		createUpdate(seekerProfileData, history, 'seeker', id);
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Edit Your Profile</h1>
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
						Add a contact no in case the companies want to contact you
					</small>
				</div>
				<div className='form-group'>
					<select
						name='currentstatus'
						value={currentstatus}
						onChange={(ele) => handleChange(ele)}
					>
						<option value='0'>* Select your current status</option>
						<option value='Unemployed'>Unemployed</option>
						<option value='Employed'>Employed/Intern</option>
						<option value='Student'>Student/Learning</option>
						<option value='Other'>Other</option>
					</select>
					<small className='form-text'>
						Give us an idea of where you are at in your career
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Job Interest'
						name='jobinterest'
						value={jobinterest}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>
						Write all your field of interests for the job seperated by comma.
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
						placeholder='A short bio of yourself'
						name='description'
						value={description}
						onChange={(ele) => handleChange(ele)}
					/>
					<small className='form-text'>Tell us a little about yourself</small>
				</div>

				<input type='submit' className='btn btn-primary my-1' />
				<button className='btn btn-light my-1' onClick={() => back.goBack()}>
					Go Back
				</button>
			</form>
		</Fragment>
	);
};

EditSeekerProfile.propTypes = {
	createUpdate: PropTypes.func.isRequired,
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	createUpdate,
	getProfileById,
})(withRouter(EditSeekerProfile)); //this allows us to use history object as props
