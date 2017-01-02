import { expect } from 'chai';
import phantomMiddleware from '../src/index';

describe('phantom middleware', () => {
	const doDispatch = () => {};
	const doGetState = () => {};
	const nextHandler = phantomMiddleware({dispatch: doDispatch, getState: doGetState});
    
    it('must return a function to handle next', () => {
    	console.log(nextHandler)
    	expect(nextHandler).to.be.a('function');
    })
})