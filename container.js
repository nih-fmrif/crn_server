import mongodb from './services/mongodb';

import Bottle from 'bottlejs';
const di = Bottle();

di.service('mongodb', mongodb);

export default di.container;