import axios from 'axios';
import cheerio from 'cheerio';

const isString = (myVar) =>  typeof myVar === 'string' || myVar instanceof String

// verifies that action should be handled by middleware
export function isScrapingTask(action){
		try {
      // TODO MOVE INTO OWN FUNC
      if(typeof action.payload.task === 'function'  
         && isString(action.payload.url) === true
         && action.type === "SCRAPING_TASK") {
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

	  if (isScrapingTask(action)===true){
      const pendingAction = {
        type: `${action.type}_PENDING`,
        payload: action.payload
      }

      dispatch(pendingAction)
      
      axios.get(action.payload.url)
            .then(response => {
              let $ = cheerio.load(response.data)
              let parsedData = action.payload.task($)
             
              const fulfilledAction = {
                type: `${action.type}_FULFILLED`, 
                payload: { 
                  parsedData 
                }
              }

            })
            .catch( err => {
                const rejectedAction = {
                type: `${action.type}_REJECTED`, 
                payload: { 
                  err 
                }
              }

              dispatch(rejectedAction)
             });
	   }
  
		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

