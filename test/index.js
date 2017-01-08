import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import nock from 'nock';
import axios from 'axios';
import sinon from 'sinon';
import scraperMiddleware, { isScrapingTask } from '../src/index';


const defaultScrapingAction = {
    type: 'SCRAPING_TASK',
    payload: {
        url: 'http://www.example.com',
        task: ($) => $('div').text()
    }
};

const defaultPendingAction = {
    type: 'SCRAPING_TASK_PENDING',
    payload: {
        url: 'http://www.example.com',
        task: ($) => $('div').text()
    }
}

const defaultFulfilledAction = {
    type: 'SCRAPING_TASK_FULFILLED',
    task: ($) => $('div').text(),
    payload: 'promiseValue'
};

const defaultRejectedAction = {
    type: 'SCRAPING_TASK_REJECTED',
    task: ($) => $('div').text(),
    error: true,
    payload: 'promiseReason'
};


describe('scraper middleware', () => {
    const middlewares = [scraperMiddleware]
    const mockStore = configureStore(middlewares)
    const doDispatch = () => {};
    const doGetState = () => {};
    const nextHandler = scraperMiddleware({
        dispatch: doDispatch,
        getState: doGetState
    });

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
                let store, setupNock = null
                let initialState = {} 

                beforeEach(() => {
                    store = mockStore(initialState)
                    const defaultResponse = '<!doctype html><html><body><div>text</div></body></html>'
                    setupNock = (statusCode=200, response=defaultResponse) => {
                        nock("http://www.example.com")
                        .filteringPath(function(path) {
                            return '/';
                        })
                        .get("/")
                        .reply(statusCode, response);
                    }
                });

                it('should dispatch ACTION_PENDING once', () => {
                    setupNock()

                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_PENDING')
                                    .length
                                    ).to.equal(1)
                    })
                });

                it('should dispatch ACTION_FULFILLED once', () => {
                    setupNock()

                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_FULFILLED')
                                    .length
                                    ).to.equal(1)
                    })
                });


                it('ACTION_FULFILLED should contain scraped data', () => {
                    setupNock()
                                   
                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_FULFILLED')[0]
                                    .payload
                                    .parsedData
                                    ).to.equal('text')
                    })
                });

                it('should dispatch ACTION_REJECTED once', () => {
                    const errMsg = '404 Error - not found'
                    const statusCode = 404
                    setupNock(statusCode, errMsg)
                   
                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_REJECTED')
                                    .length
                                    ).to.equal(1)
                    })
                });

                it('ACTION_REJECTED should contain error object', () => {
                    const errMsg = '404 Error - not found'
                    const statusCode = 404
                    setupNock(statusCode, errMsg)
                   
                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_REJECTED')[0]
                                    .payload
                                    .err
                                    ).to.be.defined
                    })
                });

                it('rejected promise should contain cheerio error message', () => {
                    const errMsg = '404 Error - not found'
                    const statusCode = 404
                    setupNock(statusCode, errMsg)

                    return store.dispatch(defaultScrapingAction).then(res => {
                        expect(store.getActions()
                                    .filter(e => e.type === 'SCRAPING_TASK_REJECTED')[0]
                                    .payload
                                    .err
                                    ).to.be.defined
                    })
                });
            });

            describe('when action is not a scraping task', () => {
                it('does not dispatch any other actions', () => {
                    const actionObj = {
                        type: 'ACTION'
                    };
                    const initialState = {}
                    const store = mockStore(initialState)
                    const actions = store.getActions()
                    const expectedPayload = defaultScrapingAction
                    store.dispatch(actionObj)
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
                task: () => null
            }
        };
        expect(isScrapingTask(actionObj)).to.be.true;
    });

    it('should return false for actions that are not scraping tasks', () => {
        const actionObj = {};
        expect(isScrapingTask(actionObj)).to.be.false;
        expect(isScrapingTask(defaultPendingAction)).to.be.false;
    })
});