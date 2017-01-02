const isString = (myVar) =>  typeof myVar === 'string' || myVar instanceof String

// verifies that action should be handled by middleware
export function isScrapingTask(action){
	if(typeof action.payload.scrapeTask.task === 'function'  && isString(action.payload.scrapeTask.url) === true){
		return true
	}
    return false
}

function createScraperMiddleware() {
	return ({ dispatch, getState }) => next => action => {
	   

		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

