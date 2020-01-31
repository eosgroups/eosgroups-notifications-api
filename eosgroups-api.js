const MongoWrapper = require('./classes/mongowrapper');
const ApiServer = require('./classes/apiserver');
const dfuse_provider = require('./classes/dfuse_provider');
const config = require('./config/config.jungle.json');
const setupProxy = require('./proxyServer')
new dfuse_provider();
new ApiServer(new MongoWrapper(config.mongo.url, config.mongo.dbname), config);
setupProxy(443,'http://localhost:' + config.api.port)