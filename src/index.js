import axios from "axios";
import cheerio from "cheerio";

const isString = myVar => typeof myVar === "string" || myVar instanceof String;

// verifies that action should be handled by middleware
export function isCheerioTask(action) {
  try {
    if (
      typeof action.payload.task === "function" &&
      isString(action.payload.url) === true &&
      action.type === "CHEERIO_TASK"
    ) {
      return true;
    }
  } catch (e) {
    if (e instanceof TypeError === true) {
      return false;
    }
  }
  return false;
}

const createCheerioMiddleware = () => ({
  dispatch,
  getState
}) => next => action => {
  if (isCheerioTask(action) === true) {
    const pendingAction = {
      type: `${action.type}_PENDING`,
      payload: action.payload
    };

    dispatch(pendingAction);

    return axios
      .get(action.payload.url)
      .then(response => {
        const $ = cheerio.load(response.data);
        const parsedData = action.payload.task($);
        const fulfilledAction = {
          type: `${action.type}_FULFILLED`,
          payload: {
            parsedData
          }
        };

        dispatch(fulfilledAction);
      })
      .catch(err => {
        const rejectedAction = {
          type: `${action.type}_REJECTED`,
          payload: {
            err
          }
        };

        dispatch(rejectedAction);
      });
  }

  return next(action);
};

const cheerioMiddleware = createCheerioMiddleware();

export default cheerioMiddleware;
