const admin = require("firebase-admin");
var serviceAccount = require("../config/service-account.json");


var payloadx = {
    topic: "test",
    data:{test:"nnnnnn"},
    webpush: {
        
        headers: {
          Urgency: "high"
        },
        notification: {
          title: "New proposal in group BOIDONJUNGLE",
          body: "You are a custodian and a new proposal needs your attention.",
          requireInteraction: "true",//display close btn in system notification
          badge: "https://i.ibb.co/cYGz2xq/36450.png",
          icon:"https://i.ibb.co/cYGz2xq/36450.png"
        },
        
        fcm_options: {
          link: "https://eosgroups.netlify.com"
        }
      } 
};



class FirebaseAdmin{

    constructor(){
        this.messaging = null;
        this.init();
    }

    init(){
        if(!this.messaging){
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            this.messaging = admin.messaging();
        }
        console.log('Firebase initialized');
    }

    send(payload){
        this.messaging.send(payload).catch(function(error) {
            console.log('Error pushing message', error);
            return false;
          });
    }

    async subscribe(tokens, topic){
        let res = await this.messaging.subscribeToTopic(tokens, topic).catch(function(error) {
          console.log('Error subscribing to topic:', error);
          return false;
        });
        if(res){
            console.log(res);
            return true;
        }
        else{
            return false;
        }
    }

    async unsubscribe(tokens, topic){
        let res = await this.messaging.unsubscribeFromTopic(tokens, topic).catch(function(error) {
          console.log('Error subscribing to topic:', error);
          return false;
        });
        if(res){
            console.log(res);
            return true;
        }
        else{
            return false;
        }
    }
}

const fb = new FirebaseAdmin();

module.exports = fb;