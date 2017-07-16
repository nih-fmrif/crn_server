const config = require('../config');

module.exports = Object.assign({}, config, {
    api: {
        port: {
            http: 8111,
            https: 8433
        }
    },
    mongodb: {
        type: 'mongodb'
    },
    globus: {
        clientId: 'e8c97607-e511-4408-a9e7-d9ab9901b7b2',
        clientSecret: '<secret>',
        accessTokenUri: 'https://auth.globus.org/v2/oauth2/token',
        authorizationUri: 'https://auth.globus.org/v2/oauth2/authorize',
        redirectUri: '<env>',
        userInfoUri: 'https://auth.globus.org/v2/oauth2/userinfo',
        scopes: ['urn:globus:auth:scope:transfer.api.globus.org:all', 'openid', 'profile', 'email', 'offline_access']
    }
});
