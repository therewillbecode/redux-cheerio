// verifies that action should be handled by middleware
export function isScrapingTask(){

}

function createScraperMiddleware() {
	return ({ dispatch, getState }) => next => action => {
	   

		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

