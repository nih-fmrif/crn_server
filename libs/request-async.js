import config  from '../config';
import request from 'request-promise';

const { forbiddenRequestUrls } = require('../config');

/**
 * Request
 *
 * A wrapper of npm 'request' to allow for
 * genericizing request and response manipulations.
 */
export default {
    get: errbackWrapper(get),
    getProxy,
    post: errbackWrapper(post),
    put: errbackWrapper(put),
    del: errbackWrapper(del)
};

function get(url, options) {
    const req = prepareRequest(url, options);
    return getFilteredRequest(() => request.get(req), forbiddenRequestUrls);
}

/**
 * GET PROXY
 *
 * Functions the same as a get request but takes a
 * response object instead of a callback and pipes
 * the request response to the response object.
 */
function getProxy(url, options, res) {
    const req = prepareRequest(url, options);

    return getFilteredRequest(url, forbiddenRequestUrls, () => {
        request.get(req).on('response', (resp) => {
            if (options.status) {
                resp.statusCode = options.status;
            }
        }).pipe(res);
    })();
}

function post(url, options) {
    const req = prepareRequest(url, options);
    return getFilteredRequest(url, forbiddenRequestUrls, () => request.post(req))();
}

function put(url, options) {
    const req = prepareRequest(url, options);
    return getFilteredRequest(url, forbiddenRequestUrls, () => request.put(req))();
}

function del(url, options) {
    const req = prepareRequest(url, options);
    return getFilteredRequest(url, forbiddenRequestUrls, () => request.del(req))();
}

/**
 * Errback wrapper
 *
 * The purpose is this function is to translate
 * async call results to errback calls
 */
export function errbackWrapper(actionFunc) {
    return (url, options, callback) => {
        try {
            Promise.resolve(actionFunc(url, options))
                .then(result => callback(null, result))
                .catch(error => callback(new Error(error)));
        } catch (error) {
            callback(error);
        }
    };
}

export function getFilteredRequest(url, filters, requestFunc) {
    if (filters.some(regexp => regexp.test(url))) {
        return () => {
            throw new Error('Agave calls are not permitted.');
        };
    } else {
        return requestFunc;
    }
}

export function prepareRequest(url, options) {
    return parseOptions({
        url: url,
        headers: {},
        qs: {},
        json: {}
    }, options);
}

/**
 * Parse Options
 *
 * Normalizes request options.
 */
function parseOptions(req, options) {
    if (options.query) {req.qs = options.query;}
    if (options.body) {req.json = options.body;}
    if (options.hasOwnProperty('encoding')) {req.encoding = options.encoding;}
    if (req.url && req.url.indexOf(config.scitran.url) > -1 && options.droneRequest !== false) {
        req.headers = {
            'X-SciTran-Auth': config.scitran.secret,
            'User-Agent': 'SciTran Drone CRN Server'
        };
    }
    if (options.headers) {
        for (let key in options.headers) {
            req.headers[key] = options.headers[key];
        }
    }
    return req;
}