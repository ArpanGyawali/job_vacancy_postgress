import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const SeekerProfileData = ({
	profile: {
		location,
		description,
		jobinterest,
		currentstatus,
		contactno,
		social,
		name,
		username,
		avatar,
	},
	seeker: { email },
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
						<h2 class='text-primary'>Bio</h2>
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
						<strong>Contact: </strong>
						{contactno && <span>{`${contactno}  | `}</span>}
						<i class='fa fa-user'></i>
						<strong>Status: </strong>
						{currentstatus && <span>{`${currentstatus}`} </span>}
					</div>
				</div>
				<br />
				<div class='profile-about bg-light p-2'>
					<div class='skills'>
						<strong>Interested In: </strong>
						{jobinterest &&
							jobinterest.map((interest, index) => (
								<div key={index} className='p-1'>
									<i className='fa fa-check' aria-hidden='true'></i>
									<span>{interest}</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

SeekerProfileData.propTypes = {
	profile: PropTypes.object.isRequired,
	seeker: PropTypes.object.isRequired,
};

export default SeekerProfileData;
