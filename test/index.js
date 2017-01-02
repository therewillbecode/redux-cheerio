import { expect } from 'chai';
import scraperMiddleware from '../src/index';

describe('phantom middleware', () => {
   let store;
   let scrapingAction;
   let pendingAction;
   let fulfilledAction;
   let rejectedAction;

   let payload = {
     url: 'www.google.com',
     task: () => {
      
     }
   }

   const defaultScrapingAction = {
    type: 'ACTION',
    payload
   };

   const defaultPendingAction = {
    type: `${defaultScrapingAction.type}_PENDING`
   };

   const defaultFulfilledAction = {
    type: `${defaultScrapingAction.type}_FULFILLED`,
    payload: promiseValue
   };

   const defaultRejectedAction = {
    type: `${defaultScrapingAction.type}_REJECTED`,
    error: true,
    payload: promiseReason
   };

    const doDispatch = () => {};
	const doGetState = () => {};
	const nextHandler = scraperMiddleware({dispatch: doDispatch, getState: doGetState});
    
    it('middleware must return a function to handle next', () => {
    	expect(nextHandler).to.be.a('function');
    })

    describe('handle next', () => {
      it('must return a function to handle action', () => {
        const actionHandler = nextHandler();

        expect(actionHandler).to.be.a('function')
      });
})

  describe('isScrapingTask', () => {
    it('should return true for actions that are scraping tasks', done => {
        const actionObj = {
            type: 'SCRAPING_TASK'
            payload: {
                url: 'www.example.com',
                task: () => null
            }
        };

      expect(isScrapingTask(actionObj)).to.be.true; 
    });
    
    it('should return false for actions that are not scraping tasks', done => {
       const actionObj = {};
       expect(isScrapingTask(actionObj)).to.be.false;
    });
});
