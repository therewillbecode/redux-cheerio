function createScraperMiddleware() {
	return ({ dispatch, getState }) => next => action => {
	   

		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

