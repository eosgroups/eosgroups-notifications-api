const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../config/.env')});
global.fetch = require("node-fetch");
global.WebSocket = require("ws");
// const util = require("util");
const {createDfuseClient} = require("@dfuse/client");

const fb = require('./firebaseadmin.js');


class dfuse_provider{

    constructor(){
      
        this.dfuse_api_key = process.env.DFUSE_API_KEY;
        this.dfuse_network = process.env.DFUSE_NETWORK;
        
        this.graphql_query = `subscription {
          searchTransactionsForward(
            query:"receiver:${process.env.FACTORY_CONTRACT} account:${process.env.FACTORY_CONTRACT} action:messagebus",
            lowBlockNum:0,
            limit:20,
          ) {
            undo
            cursor
            trace {
              id
              matchingActions {
                receiver
                account
                name
                json
                creatorAction {
                  receiver
                  account
                  name
                  json
                }
              }
            }
          }
        }`;
        this.main().catch(error => console.log("Unexpected error", error));

    }

    async main() {
        console.log("Dfuse watcher running");
        const client = createDfuseClient({
          apiKey: this.dfuse_api_key,
          network: this.dfuse_network
        });

        const stream =  await client.graphql(this.graphql_query, async (message) => {
          if(!message.type=="data" || !message.data) return;
          if(!message.data.searchTransactionsForward) return;
          const cursor = message.data.searchTransactionsForward.cursor;
          stream.mark({ cursor });

          if(message.data.searchTransactionsForward.trace!=null){
            const matchingActions = message.data.searchTransactionsForward.trace.matchingActions;
            for(let i=0; i < matchingActions.length; ++i){
              let group = matchingActions[i].json.sender_group;
              let event_type = matchingActions[i].json.event;
              let message = matchingActions[i].json.message;
              let creator_action = matchingActions[i].creatorAction.json;
              console.log('creator_action', creator_action);
              //push message
              let template = {
                topic: `${group}`,
                data: {type: event_type},
                webpush: {
                    headers: {
                      Urgency: "high"
                    },
                    notification: {
                      title: `New proposal in group ${group}`,
                      body: `${message}`,
                      requireInteraction: "true",//display close btn in system notification
                      badge: "",
                      icon:""
                    },
                    
                    fcm_options: {
                      link: `https://eosgroups.netlify.com/manage/${group}/proposals`
                    }
                  } 
              };
              try{
                fb.send(template);
              }
              catch(e){};
              

            }
          }
        });
        //stream.mark({ cursor })
        await stream.join();
        await client.release();
    }
}

module.exports = dfuse_provider;