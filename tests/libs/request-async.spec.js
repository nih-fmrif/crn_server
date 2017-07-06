const expect = require('expect');

import {
    prepareRequest,
    getFilteredRequest,
    errbackWrapper
} from '../../libs/request-async';

describe('libs/request-async.js', () => {
    describe('prepareRequest', () => {
        it('should get back with the prepared request object', () => {
            expect(prepareRequest('http://', {})).toEqual({ url: 'http://', headers: {}, qs: {}, json: {} });
            expect(prepareRequest('http://', { query: { test: 1 } })).toEqual({ url: 'http://', headers: {}, qs: { test: 1 }, json: {} });
        });
    });

    describe('getFilteredRequest', () => {
        it('should reject request where the url points to Agave', async () => {
            const actionFunc = expect.createSpy();
            const filters = [/agave/];

            expect(getFilteredRequest('http://agave', filters, actionFunc)).toThrow();
            expect(actionFunc).toNotHaveBeenCalled();

        });
        it('should let request go when no filter match', async () => {
            const actionFunc = expect.createSpy();
            const filters = [/agave/];

            getFilteredRequest('http://someapi', filters, actionFunc)();
            expect(actionFunc).toHaveBeenCalled();
        });
    });

    describe('errbackWrapper', () => {
        it('should call errback with error if the function has thrown error', () => {
            const errback = expect.createSpy();
            const error = new Error();
            errbackWrapper(() => {
                throw error;
            })('', '', errback);
            expect(errback).toHaveBeenCalledWith(error);
        });
        it('should call errback with result', () => {
            errbackWrapper(() => 1)('', '', (err, res) => {
                expect(err).toBe(null);
                expect(res).toBe(1);
            });

        });
    });
});