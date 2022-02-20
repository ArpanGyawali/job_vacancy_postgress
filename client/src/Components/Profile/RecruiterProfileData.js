import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const RecruiterProfileData = ({
	profile: {
		location,
		noofjobs,
		description,
		website,
		contactno,
		social,
		name,
		username,
		avatar,
	},
	recruiter: { email },
}) => {
	return (
		<div>
			<div class='profile-top bg-primary p-2'>
				<img class='round-img my-1' src={avatar} alt='' />
				<h1 class='large'>{name}</h1>
				<p class='lead'>
					<i>{username}</i>
				</p>
				<p>{location && <span>{location}</span>}</p>
				<div class='icons my-1'>
					{website && (
						<a href={website} target='_blank' rel='noopener noreferrer'>
							<i class='fas fa-globe fa-2x'></i>
						</a>
					)}
					{social && (
						<a href={social} target='_blank' rel='noopener noreferrer'>
							<i class='fa fa-heart fa-2x'></i>
						</a>
					)}
				</div>
			</div>
			<div class='profile-about bg-light p-2'>
				{description && (
					<Fragment>
						<h2 class='text-primary'>About</h2>
						<p>{description}</p>
						<div class='line'></div>
					</Fragment>
				)}

				<h2 class='text-primary'>Info</h2>
				<div class='skills'>
					<div class='p-1'>
						<i class='fa fa-envelope'></i>
						<strong>Email: </strong>
						<span>{`${email}  | `}</span>
						<i class='fa fa-phone'></i>
						<strong>Contact Number: </strong>
						{contactno && <span>{`${contactno}  | `} </span>}
						<i class='fa fa-briefcase'></i>
						<strong>No of Jobs Provided: </strong>
						<span>{noofjobs}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

RecruiterProfileData.propTypes = {
	profile: PropTypes.object.isRequired,
	recruiter: PropTypes.object.isRequired,
};

export default RecruiterProfileData;
