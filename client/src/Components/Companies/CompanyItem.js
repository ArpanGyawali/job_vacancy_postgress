import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CompanyItem = ({
	profile: { userid, name, avatar, location, noofjobs, description },
}) => {
	return (
		<div className='profile bg-light'>
			<img src={avatar} alt='display profile pic' className='round-img' />
			<div>
				<h2>{name}</h2>
				<p>{description && <span>{description}</span>}</p>
				<p className='my-1'>{location && <span>{location}</span>}</p>
				<Link to={`/recruiterProfile/${userid}`} className='btn btn-primary'>
					Take a Peek
				</Link>
			</div>
			<div className='center'>
				<h2>Provided</h2>
				<div className='dot'>
					<div className='dot-text'>{noofjobs}</div>
				</div>
				<p>Jobs</p>
			</div>
		</div>
	);
};

CompanyItem.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default CompanyItem;
