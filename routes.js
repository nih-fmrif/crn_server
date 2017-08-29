// dependencies ------------------------------------

import express    from 'express';
import users      from './handlers/users';
import jobs       from './handlers/jobs';
import validation from './handlers/validation';
import datasets   from './handlers/datasets';
import auth       from './libs/auth';
import scitran    from './libs/scitran';
import globus     from './libs/globus';

let routes = [
    // authentication flow -------------------------
    {
        method: 'get',
        url: '/auth/globus',
        middleware: [],
        handler: globus.redirectUri
    },
    {
        method: 'post',
        url: '/auth/globus/refresh',
        middleware: [],
        handler: globus.refreshToken
    },
    {
        method: 'get',
        url: '/auth/globus/callback',
        middleware: [],
        handler: globus.handleAuthCallback
    },

    // users ---------------------------------------

    {
        method: 'get',
        url: '/users/self',
        middleware: [],
        handler: scitran.verifyUser
    },
    {
        method: 'post',
        url: '/users',
        middleware: [],
        handler: users.create
    },
    {
        method: 'post',
        url: '/users/blacklist',
        middleware: [auth.superuser],
        handler: users.blacklist
    },
    {
        method: 'get',
        url: '/users/blacklist',
        middleware: [auth.superuser],
        handler: users.getBlacklist
    },
    {
        method: 'delete',
        url: '/users/blacklist/:id',
        middleware: [auth.superuser],
        handler: users.unBlacklist
    },

    // datasets ------------------------------------
    // Note: most dataset interactions are sent directly to Scitran.
    // These manage those that need to be modified or proxied.

    {
        method: 'post',
        url: '/datasets/:datasetId/permissions',
        middleware: [],
        handler: datasets.share
    },

    // validation ----------------------------------

    {
        method: 'post',
        url: '/datasets/:datasetId/validate',
        middleware: [auth.user],
        handler: validation.validate
    },

    // jobs ----------------------------------------

    {
        method: 'get',
        url: '/apps',
        middleware: [],
        handler: jobs.getApps
    },
    {
        method: 'post',
        url: '/datasets/:datasetId/jobs',
        middleware: [auth.datasetAccess()],
        handler: jobs.postJob
    },
    {
        method: 'get',
        url: '/datasets/:datasetId/jobs',
        middleware: [auth.datasetAccess({optional: true})],
        handler: jobs.getDatasetJobs
    },
    {
        method: 'delete',
        url: '/datasets/:datasetId/jobs',
        middleware: [auth.datasetAccess()],
        handler: jobs.deleteDatasetJobs
    },
    {
        method: 'post',
        url: '/jobs/:jobId/results',
        middleware: [],
        handler: jobs.postResults
    },
    {
        method: 'get',
        url: '/datasets/:datasetId/jobs/:jobId',
        middleware: [auth.datasetAccess()],
        handler: jobs.getJob
    },
    {
        method: 'post',
        url: '/datasets/:datasetId/jobs/:jobId/retry',
        middleware: [auth.datasetAccess()],
        handler: jobs.retry
    },
    {
        method: 'get',
        url: '/datasets/:datasetId/jobs/:jobId/results/ticket',
        middleware: [auth.datasetAccess()],
        handler: jobs.getDownloadTicket
    },
    {
        method: 'get',
        url: '/jobs',
        middleware: [auth.optional],
        handler: jobs.getJobs
    },
    {
        method: 'get',
        url: '/jobs/:jobId/results/:fileName',
        middleware: [auth.ticket],
        handler: jobs.getFile
    }

];

// initialize routes -------------------------------

let router = express.Router();

for (let route of routes) {
    let arr = route.middleware;
    arr.unshift(route.url);
    arr.push(route.handler);
    router[route.method].apply(router, arr);
}

// export ------------------------------------------

export default router;
