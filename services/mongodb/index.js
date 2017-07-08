import config from 'config';
import mongoDb from 'mongodb';
import mongoDbMock from 'mongo-mock';

export default function() {
    return {
        'memory': mongoDbMock
    }[config.get('mongodb.type')] || mongoDb;
}