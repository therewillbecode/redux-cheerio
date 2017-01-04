import { expect } from 'chai';
import scraperMiddleware, { isScrapingTask } from '../src/index';
import configureStore from 'redux-mock-store';
import nock from 'nock';

describe('scraper middleware', () => {
    const middlewares = [scraperMiddleware]
    const mockStore = configureStore(middlewares)
    const doDispatch = () => {};
    const doGetState = () => {};
    const nextHandler = scraperMiddleware({
        dispatch: doDispatch,
        getState: doGetState
    });

    const defaultScrapingAction = {
        type: 'SCRAPING_TASK',
        payload: {
            url: 'http://www.example.com',
            jQuerySelector: 'div'
        }
    };

    const defaultPendingAction = {
        type: 'SCRAPING_TASK_PENDING',
        payload: {
            url: 'http://www.example.com',
            jQuerySelector: 'div'
        }
    }


    const defaultFulfilledAction = {
        type: 'SCRAPING_TASK_FULFILLED',
        payload: 'promiseValue'
    };

    const defaultRejectedAction = {
        type: 'SCRAPING_TASK_REJECTED',
        error: true,
        payload: 'promiseReason'
    };

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

                beforeEach(() => {});

                afterEach(() => {});

                it('mock store is set up correctly', () => {
                  // Initialize mockstore with empty state
                  const initialState = {}
                  const store = mockStore(initialState)

                  // Dispatch the action
                  store.dispatch(defaultScrapingAction)

                  // Test if your store dispatched the expected actions
                  const actions = store.getActions()
                  const expectedPayload = [defaultPendingAction, defaultScrapingAction]
                  expect(actions).eql(expectedPayload)
                })


                it('should dispatch ACTION_PENDING once', () => {
                    // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                    nock("http://www.example.com")
                        .filteringPath(function(path) {
                            return '/';
                        })
                        .get("/")
                        .reply(200, '<!doctype html><html><body><div>text</div></body></html>');

                    // Initialize mockstore with empty state
                    const initialState = {}
                    const store = mockStore(initialState)

                    // Dispatch the action
                    store.dispatch(defaultScrapingAction)

                    // Test if your store dispatched the expected actions
                    const actions = store.getActions()
                    const expectedPayload = defaultPendingAction
                    expect(actions).contain(expectedPayload)
                });

                it('should dispatch ACTION_FULFILLED once', () => {
                    // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                    nock("http://www.example.com")
                        .filteringPath(function(path) {
                            return '/';
                        })
                        .get("/")
                        .reply(200, '<!doctype html><html><body><div>text</div></body></html>');

                    // DISPATCH INITIAL ACTION

                    const expectActions = [defaultScrapingAction, defaultPendingAction, defaultFulfilledAction]
                    const store = mockStore();
                    return store.dispatch(expectActions[0]).then(() => {
                        expect(store.getActions()).to.eql(expectActions);
                    })

                });

                it('should dispatch ACTION_REJECTED once', () => {
                    // CREATE A MOCK RESPONSE FROM SERVER I.E  mockAxiosClient.onGet('/test').reply(200, 'response');
                    // DISPATCH INITIAL ACTION

                    const expectActions = [defaultScrapingAction, defaultPendingAction, defaultRejectedAction]
                    const store = mockStore();
                    return store.dispatch(expectActions[0]).then(() => {
                        expect(store.getActions()).to.eql(expectActions);
                    })
                });
            });

            describe('when action is not a scraping task', () => {
                it('does not dispatch any other actions', () => {
                    const actionObj = {
                        type: 'ACTION'
                    };

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
                    const actionObj = {
                        type: 'ACTION'
                    };

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
                url: 'http://www.example.com',
                jQuerySelector: 'div'
            }
        };

        expect(isScrapingTask(actionObj)).to.be.true;
    });

    it('should return false for actions that are not scraping tasks', () => {
        const actionObj = {};
        expect(isScrapingTask(actionObj)).to.be.false;
    });
});