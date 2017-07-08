let config = {
    'url': process.env.CRN_SERVER_URL,
    'port': 8111,
    'apiPrefix': '/crn/',
    'location': '/srv/crn-server',
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'content-type, Authorization'
    },
    'scitran': {
        'url':       process.env.SCITRAN_URL || null,
        'secret':    process.env.SCITRAN_CORE_DRONE_SECRET || null,
        'fileStore': process.env.SCITRAN_PERSISTENT_DATA_PATH || null
    },
    'agave': {
        'url':               process.env.CRN_SERVER_AGAVE_URL || null,
        'username':          process.env.CRN_SERVER_AGAVE_USERNAME || null,
        'password':          process.env.CRN_SERVER_AGAVE_PASSWORD || null,
        'clientName':        process.env.CRN_SERVER_AGAVE_CLIENT_NAME || null,
        'clientDescription': process.env.CRN_SERVER_AGAVE_CLIENT_DESCRIPTION || null,
        'consumerKey':       process.env.CRN_SERVER_AGAVE_CONSUMER_KEY || null,
        'consumerSecret':    process.env.CRN_SERVER_AGAVE_CONSUMER_SECRET || null,
        'storage':           process.env.CRN_SERVER_AGAVE_STORAGE || null
    },
    'mongo': {
        'url': 'mongodb://mongo:27017/'
    },
    'notifications': {
        'email': {
            'service': process.env.CRN_SERVER_MAIL_SERVICE || null,
            'user':    process.env.CRN_SERVER_MAIL_USER || null,
            'pass':    process.env.CRN_SERVER_MAIL_PASS || null
        }
    }
};

export default config;
