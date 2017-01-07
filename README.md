# cheerio-scraper
Cheerio middleware for Redux - redux middleware

#Rationale
Flux implementation is a useful mental model for webscraping.

The model

1. Actions are attempts to extract data from the outside world
2. These actions return raw information about the outside world to the reducers
3. Reducers then extract the valueable information from this raw data and place it in the store
4. We can now dispatch more informed actions based on the data we extracted in the previous round


## Background


Scrape in a declarative manner in Redux. Just create an action with a url and a function representing a scraping task.

Dispatch an action with a jquery selector and a url and the resulting data or error will be sent
through the rest of your middleware and end up in your reducer.

Therefore the state of your app can be modified according to the state of other websites.

uses - 

1. logging other websites and tracking given selectors over time
2. keeping your app in sync with data from websites that do not have an api

Scraping is done using axios for requests and cheerio for parsing the dom

Decompose complex web scraping workflows into discrete redux actions that represent small scraping tasks.

First, install with npm: npm i redux-scraper -S

## Guide

import scraperMiddleware from 'redux-scraper';

composeStoreWithMiddleware = applyMiddleware(
  scraperMiddleware()
)(createStore);


To use the middleware, dispatch an action that has a payload property the props that define the scraping task

This object must consist of a url and callback function
const defaultScrapingAction = {
    type: 'SCRAPING_TASK',
    payload: {
        url: 'http://www.example.com',
        task: ($) => {
                     /* Parse HTML with jQuery Selector /* 
                     return $('div').text
                     } 
    } 
    
};

## Composability

scraper actions return promises meaning that scraping tasks can be chained.

I.e the results of one scrape will set the course of action for the next scraping task.

Promise.all([
  dispatch(ScrapeLocationList()),
  dispatch(ScrapeLocationMapping())
]).then((scrapedData) => {
  dispatch(
    scrapeLocations(locations=data)
  )
})

## INTERNALS

The first scraping task action will return a promise.


After the promise is settled, a second action will be dispatched. 

If the the promise is resolved, e.g., if it was successful, a "fulfilled" action is dispatched. If the promise is rejected, e.g., if an error occurred, the "rejected" action is dispatched. The fulfilled and rejected type suffixes are _FULFILLED and _REJECTED respectively. The middleware will always dispatch one of these two actions.

// fulfilled action
{
  type: 'GET_NEWS_ARTICLE_FULFILLED'
  payload: {
    ...
  }
}

// rejected action
{
  type: 'GET_NEWS_ARTICLE_REJECTED'
  error: true,
  payload: {
    ...
  }
}
