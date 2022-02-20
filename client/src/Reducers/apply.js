import { APPLY_JOB, APPLY_ERROR } from '../Actions/constants';

const initialState = {
	appliers: [],
	isLoading: true,
	error: '',
};

const apply = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case APPLY_JOB:
			return {
				...state,
				appliers: payload,
				isLoading: false,
			};
		case APPLY_ERROR:
			return {
				...state,
				error: payload,
				isLoading: false,
			};
		default:
			return state;
	}
};

export default apply;
