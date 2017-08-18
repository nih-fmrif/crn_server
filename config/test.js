const config = require('../config');

module.exports = Object.assign({}, config, {
    app: {
        url: 'https://localhost:9876'
    },
    api: {
        url: 'https://localhost:8433',
        port: {
            http: 8111,
            https: 8433
        }
    },
    mongodb: {
        type: 'memory'
    },
    globus: {
        clientId: '<env>',
        clientSecret: '<secret>',
        accessTokenUri: 'https://auth.globus.org/v2/oauth2/token',
        authorizationUri: 'https://auth.globus.org/v2/oauth2/authorize',
        redirectUri: '<env>',
        userInfoUri: 'https://auth.globus.org/v2/oauth2/userinfo',
        scopes: ['urn:globus:auth:scope:transfer.api.globus.org:all', 'openid', 'profile', 'email', 'offline_access']
    }
});
