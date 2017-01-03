const isString = (myVar) =>  typeof myVar === 'string' || myVar instanceof String

// verifies that action should be handled by middleware
export function isScrapingTask(action){
		if(isString(action.payload.scrapeTask.jQuerySelector) === true  
         && isString(action.payload.scrapeTask.url) === true){
      return true
    }
   
    return false
}

function createScraperMiddleware() {
	return ({ dispatch, getState }) => next => action => {
	
	/****  isScrapingTask(action)===true{
               requestPromise(action.payload.url).then(res => 
                   dispatch({
                   type: ACTION_FULFILLED,
                   payload: actionl.payload.task(res.body)
                 }))
               ).catch(err => dispatch({
                   type: ACTION_REJECTED,
                   err
                 }))

	        }
    *****/
		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

