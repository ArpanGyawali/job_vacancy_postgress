import { APPLY_JOB, APPLY_ERROR, GET_APPLIERS } from '../Actions/constants';

const initialState = {
	applier: null,
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
				applier: payload,
				isLoading: false,
			};
		case GET_APPLIERS:
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
