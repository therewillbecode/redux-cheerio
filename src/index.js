import axios from 'axios';
const isString = (myVar) =>  typeof myVar === 'string' || myVar instanceof String

// verifies that action should be handled by middleware
export function isScrapingTask(action){
		try {
      // TODO MOVE INTO OWN FUNC
      if(isString(action.payload.jQuerySelector) === true  
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
         type: `${action.type}_PENDING`, payload: action.payload }

         console.log(pendingAction)
      dispatch(pendingAction)

      // Make the request
      axios.get(action.payload.url)
        .then(response => {
      //    console.log(response.status);
    //      console.log(response.data);
       //   console.log(response.error);
        })
        .catch( error => {
     //      console.log(response.status);
       //    console.log(response.data);
         //  console.log(response.error);       
         });
	   }
  
		return next(action);
	}
}

const scraperMiddleware = createScraperMiddleware();

export default scraperMiddleware;

