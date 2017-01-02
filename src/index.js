function createPhantomMiddleware() {
	return ({ dispatch, getState }) => next => action => {
	   

		return next(action);
	}
}

const phantomMiddleware = createPhantomMiddleware();

export default phantomMiddleware;

