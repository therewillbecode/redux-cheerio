import { expect } from 'chai';
import scraperMiddleware, { isScrapingTask } from '../src/index';
import configureStore from 'redux-mock-store';



describe('scraper middleware', () => {
const middlewares = [scraperMiddleware]
const mockStore = configureStore(middlewares)
let scrapingAction;
let pendingAction;
let fulfilledAction;
let rejectedAction;

let payload = {
 url: 'www.google.com',
 jQuerySelector: 'div'
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
const nextHandler = scraperMiddleware({dispatch: doDispatch, getState: doGetState});


it('mock store is set up correctly', () => {

  // Initialize mockstore with empty state
  const initialState = {}
  const store = mockStore(initialState)

  // Dispatch the action
  store.dispatch(defaultScrapingAction)

  // Test if your store dispatched the expected actions
  const actions = store.getActions()
  const expectedPayload = defaultScrapingAction
  expect(actions).eql([expectedPayload])
})

   // test first nested function in middleware
    it('middleware must return a function to handle next', () => {
    	expect(nextHandler).to.be.a('function');
    })

    // test second nested function in middleware
    describe('handle next', () => {
      it('must return a function to handle action', () => {
        const actionHandler = nextHandler();

        expect(actionHandler).to.be.a('function')
      });

      describe('handles actions', () => {
          describe('when action is a scraping task correct actions are dispatched', () => {

           beforeEach(() => {
           });

            afterEach(() => {
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
                const actionObj = { type: 'ACTION' };

                // Initialize mockstore with empty state
                const initialState = {}
                const store = mockStore(initialState)

                // Dispatch the action
                store.dispatch(actionObj)

                // Test if your store dispatched the expected actions
                const actions = store.getActions()
                const expectedPayload = defaultScrapingAction
                expect(actions).eql([actionObj])
          });

          it('must pass action to next if not a scraping task', done => {
            const actionObj = { type: 'ACTION' };

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
    it('should return true for actions that are scraping tasks', () => {
        const actionObj = {
            type: 'SCRAPING_TASK',
            payload: {
               scrapeTask: {
                url: 'www.example.com',
                jQuerySelector: 'div'
               } 
            }
        };

      expect(isScrapingTask(actionObj)).to.be.true; 
    });
    
    it('should return false for actions that are not scraping tasks', () => {
       const actionObj = {};
       expect(isScrapingTask(actionObj)).to.be.false;
    });
});
