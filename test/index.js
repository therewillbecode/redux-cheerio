import { expect } from 'chai';
import phantomMiddleware from '../src/index';

describe('phantom middleware', () => {
	const doDispatch = () => {};
	const doGetState = () => {};
	const nextHandler = phantomMiddleware({dispatch: doDispatch, getState: doGetState});
    
    it('middleware must return a function to handle next', () => {
    	expect(nextHandler).to.be.a('function');
    })

    describe('handle next', () => {
      it('must return a function to handle action', () => {
        const actionHandler = nextHandler();
        expect(actionHandler).to.be.a('function')
      });
    });
})