const isString = (myVar) =>  typeof myVar === 'string' || myVar instanceof String

// verifies that action should be handled by middleware
export function isScrapingTask(action){
		try {
      if(isString(action.payload.jQuerySelector) === true  
         && isString(action.payload.url) === true){
      return true
    }
   }
   catch(e){
    if(e instanceof TypeError === true){
      return false
    }
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

