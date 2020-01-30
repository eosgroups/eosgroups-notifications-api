const MongoClient = require('mongodb').MongoClient;

class MongoWrapper{

    constructor(mongourl, dbname){
        this.db = null;
        this.mongourl = mongourl;
        this.dbname = dbname;
    }

    async connect(){
        if(this.db === null){
            return await MongoClient.connect(this.mongourl, { useNewUrlParser: true, useUnifiedTopology: true }) 
            .then(mongo => {
                console.log('mongo connected');
                this.db = mongo.db(this.dbname);
                return true;
            })
            .catch(e => {
                console.log(e); 
                this.db = null;
                return false;
            });
        }
        else{
            console.log('mongo already connected');
            return true;
        }

    }
}

module.exports = MongoWrapper;