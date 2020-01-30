const fb = require('../classes/firebaseadmin');

const apiRouter = function (api, db, config) {
    

    api.post('/subscribe_notifications', async function(request,response){
        // token, topic
        console.log(request.body);
        let res = await fb.subscribe(request.body.token, request.body.topic);
        if(res){
            response.send(`subscribed to topic ${request.body.topic}`);
        }
        else{
            response.status(500).send('Something broke!');
        }
        
    });

    api.post('/unsubscribe_notifications', async function(request,response){
        // token, topic
        console.log(request.body);
        let res = await fb.unsubscribe(request.body.token, request.body.topic);
        if(res){
            response.send(`unsubscribed from topic ${request.body.topic}`);
        }
        else{
            response.status(500).send('Something broke!');
        }
        
    });

    api.post('/push_msg', async function(request,response){
        var payload = {
            topic: request.body.group,
            data:{test:"nnnnnn"},
            webpush: {
                headers: {
                  Urgency: "high"
                },
                notification: {
                  title: `New proposal in group ${request.body.group}`,
                  body: `${request.body.proposer} just made a proposal that needs your attention`,
                  requireInteraction: "true",//display close btn in system notification
                  badge: request.body.img,
                  icon: request.body.img
                },
                
                fcm_options: {
                  link: config.website+"/manage/piecestest55/proposals"
                }
              } 
        };
        fb.send(payload);
        
    });

}



// {
//     action: propose,
//     group: state.activeGroup,
//     proposer: rootState.ual.accountName,
//     img: state.activeGroupConfig.ui.logo
//   }

module.exports = apiRouter;