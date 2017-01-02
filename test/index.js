import { expect } from 'chai';
import scraperMiddleware, { isScrapingTask } from '../src/index';
import configureMockStore from 'redux-mock-store';


describe('scraper middleware', () => {
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
    payload: 'promiseValue'
   };

   const defaultRejectedAction = {
    type: `${defaultScrapingAction.type}_REJECTED`,
    error: true,
    payload: 'promiseReason'
   };
    
    const doDispatch = () => {};
	const doGetState = () => {};
	const nextValue = scraperMiddleware({dispatch: doDispatch, getState: doGetState});
    
    // test first nested function in middleware
    it('middleware must return a function to handle next', () => {
    	expect(nextHandler).to.be.a('function');
    })
    // test second nested function in middleware
    describe('handle next', () => {
      it('must return a function to handle action', () => {
        const actionHandler = nextValue();

        expect(actionHandler).to.be.a('function')
      });

    describe('handle action', () => {
          describe('when action is a scraping task', () => {

           beforeEach(() => {
             store = makeStore();
           });

            afterEach(() => {
              firstMiddlewareThunk.spy.reset();
              lastMiddlewareModifies.spy.reset();
           });
      

            it('should dispatch ACTION_PENDING', () => {
                // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                // DISPATCH INITIAL ACTION

                const expectActions = [defaultScrapingAction, defaultPendingAction]
                const store = mockStore();
                return store.dispatch(expectActions[0]).then(() => {
                  expect(store.getActions()).to.shallowDeepEqual(expectActions);
              })
            });

            it('should dispatch ACTION_FULFILLED', () => {
                // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                // DISPATCH INITIAL ACTION

                const expectActions = [defaultScrapingAction, defaultPendingAction, defaultFulfilledAction]
                const store = mockStore();
                return store.dispatch(expectActions[0]).then(() => {
                  expect(store.getActions()).to.shallowDeepEqual(expectActions);
                })

            });

            it('should dispatch ACTION_REJECTED', () => {
                // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                // DISPATCH INITIAL ACTION

                const expectActions = [defaultScrapingAction, defaultPendingAction, defaultRejectedAction]
                const store = mockStore();
                return store.dispatch(expectActions[0]).then(() => {
                  expect(store.getActions()).to.shallowDeepEqual(expectActions);
                })
            });
        });

        describe('when action is not a scraping task', () => {
            it('does not dispatch any other actions', () => {
                const mockStore = configureStore([nextValue()]);
                const store = mockStore({});
                store.dispatch(defaultScrapingAction);

                expect([defaultScrapingAction]).to.eql(store.getActions());
          });

          it('must pass action to next if not a scraping task', done => {
            const actionObj = {};

            const actionHandler = nextHandler(action => {
            expect(action).to.eql(actionObj);
            done();
          });

          actionHandler(actionObj);
         });

        
        });
    });
        
  });
})

  describe('isScrapingTask', () => {
    it('should return true for actions that are scraping tasks', done => {
        const actionObj = {
            type: 'SCRAPING_TASK',
            payload: {
               scrapeTask: {
                url: 'www.example.com',
                task: () => Promise()
               } 
            }
        };

      expect(isScrapingTask(actionObj)).to.be.true; 
    });
    
    it('should return false for actions that are not scraping tasks', done => {
       const actionObj = {};
       expect(isScrapingTask(actionObj)).to.be.false;
    });
});
