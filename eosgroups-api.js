const MongoWrapper = require('./classes/mongowrapper');
const ApiServer = require('./classes/apiserver');
const dfuse_provider = require('./classes/dfuse_provider');
const config = require('./config/config.jungle.json');

new dfuse_provider();
new ApiServer(new MongoWrapper(config.mongo.url, config.mongo.dbname), config);