# redux-scraper
Cheerio based Web scraping middleware for Redux - redux middleware

Scraping is done using Cheerio and Request

## Rationale

Decompose complex web scraping workflows into discrete redux actions that represent small scraping tasks.


First, install with npm: npm i redux-scraper -S

## Guide

import scraperMiddleware from 'redux-scraper';

composeStoreWithMiddleware = applyMiddleware(
  scraperMiddleware()
)(createStore);


To use the middleware, dispatch an action that has a payload property that is an object.

This object must consist of a url and callback function
const payload = { 
   url: 'www.newsite.com/article/1',

payload: {
            scrapeTask {
              url: 'www.newsite.com/article/1',
              task: () => $('div').text
            } 
         }

const foo = () => ({
  type: 'GET_NEWS_ARTICLE',
  payload
});


The action will return a promise.


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