function createPhantomMiddleware() {
	return ({ dispatch, getState }) => next => action => {
		return next(action);
	}
}

export default createPhantomMiddleware;

