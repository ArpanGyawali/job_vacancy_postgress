import React, { useState, useEffect, Fragment } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createUpdate, getProfileById } from '../../Actions/profile';
import { connect } from 'react-redux';

const EditRecruiterProfile = (props) => {
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
	const [recruiterProfileData, setRecruiterProfileData] = useState({
		location: '',
		website: '',
		contactno: '',
		description: '',
		social: '',
	});

	useEffect(() => {
		getProfileById(id, 'recruiter');

		setRecruiterProfileData({
			location: isLoading || !profile.location ? '' : profile.location,
			website: isLoading || !profile.website ? '' : profile.website,
			contactno: isLoading || !profile.contactno ? '' : profile.contactno,
			description: isLoading || !profile.description ? '' : profile.description,
			social: isLoading || !profile.social ? '' : profile.social,
		});
	}, [isLoading, getProfileById]);

	const { location, website, contactno, description, social } =
		recruiterProfileData;

	let back = useHistory();

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
				<button className='btn btn-light my-1' onClick={() => back.goBack()}>
					Go Back
				</button>
			</form>
		</Fragment>
	);
};

EditRecruiterProfile.propTypes = {
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
})(withRouter(EditRecruiterProfile)); //
