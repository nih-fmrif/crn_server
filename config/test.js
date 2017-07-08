const config = require('../config');

module.exports = Object.assign({}, config, {
    api: {
        port: {
            http: 8111,
            https: 8433
        }
    },
    mongodb: {
        type: 'memory'
    }
});
