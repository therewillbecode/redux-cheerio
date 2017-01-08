# redux-cheerio
Cheerio [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) for Redux

##Rationale

#### Parse nearly any HTML or XML document from an API by just dispatching an action.

## Background

Click [here](https://github.com/cheeriojs/cheerio) for more info on Cheerio

## Installation

```
npm install cheerioMiddleware --save
```

To use this piece of middleware, just put it into the middleware chain like you would with any other piece of middleware

## Example

#### configureStore.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import cheerioMiddleware from 'redux-cheerio';
import reducers from './reducers';

const reducer = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(cheerioMiddleware)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
```

#### app.js

```js
const store = configureStore(initialState);
```

## Usage

To use the middleware, dispatch an action takes the following form.

This object must consist of a url and function that can take
Cheerio tasks must take the following format 

```js
const defaultCheerioAction = {
    type: 'CHEERIO_TASK',
    payload: {
        url: 'http://www.example.com',
        task: function justACheerioFunc($){ return $('div').text() }
    }
};  
```

## How it works

The first cheerio action will return a promise.

After the promise is settled, a second action will be dispatched. 

If the the promise is resolved, e.g., if it was successful, a "fulfilled" action is dispatched. If the promise is rejected, e.g., if an error occurred, the "rejected" action is dispatched. The fulfilled and rejected type suffixes are _FULFILLED and _REJECTED respectively. The middleware will always dispatch one of these two actions.

```js
// fulfilled action
{
  type: 'CHEERIO_TASK_FULFILLED'
  payload: {
    ...
  }
}

// rejected action
{
  type: 'CHEERIO_TASK_REJECTED'
  error: true,
  payload: {
    ...
  }
}
```

## Composability

Cheerio actions return promises meaning that Cheerio tasks can be chained.

```js
Promise.all([
  dispatch(cheerioTask1()),
  dispatch(cheerioTask2())
]).then((fetchedData) => {
  dispatch(
    cheerioTask3(fetchedData)
  )
})
```

I.e useful for webscraping as the results of one scrape and cheerio parse will set the course of action for the next scraping task.


## Webscraping

Flux implementation is a useful mental model for webscraping.

The webscraping model using cheerio middleware

1. Actions are attempts to extract data from the outside world
2. These actions return raw information about the outside world to the reducers
3. Reducers then extract the valueable information from this raw data and place it in the store
4. We can now dispatch more informed actions based on the data we extracted in the previous round


Scrape in a declarative manner in Redux. Just create a cheerio action with a url and a function representing a scraping task.

Decompose complex web scraping workflows into discrete redux actions that represent small scraping tasks.

Dispatch an action with a jquery selector and a url and the resulting data or error will be sent
through the rest of your middleware and end up in your reducer.

Therefore the state of your app can be modified according to the state of other websites.

#### Example uses for webscraping

1. logging other websites and tracking given selectors over time
2. keeping your app in sync with data from websites that do not have an api

