const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("../routes/routes.js");

class ApiServer{

    constructor(mongo, config){
        this.mongo = mongo;
        this.config = config;
        this.api = express();
        this.api.use(bodyParser.json());
        this.api.use(bodyParser.urlencoded({ extended: true }));
        this.init();
    }

    async init(){
        if(!this.mongo.db){
            await this.mongo.connect();
        }

        //use cors
        if(this.config.api.enable_cors){
            this.api.use(function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
        }

        apiRouter(this.api, this.mongo, this.config);

        const server = this.api.listen(this.config.api.port, () => {
            console.log("Api server running on port", server.address().port);
        });
    }
}

module.exports = ApiServer;