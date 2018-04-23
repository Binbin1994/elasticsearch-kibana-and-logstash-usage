module.exports = function(RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this,config);
        this.name=config.name;
        var node = this;
        var flow=this.z;
        var context = this.context().global;
        var Stomp = require('stomp-client');
        var destination = 'jms.topic.IncidentManagementIncidentNbiTopic';
        var stompopt={
           address:"10.45.16.204",
           port:61613,
           user: "imguest",
           pass: "imGuest1.1",
           reconnectOpts: {
                retries:1,
                delay:1
            }

         }
       var client = new Stomp(stompopt);
       

      
       
 
       var key=node.name;
       if(key==""){
          node.error("please input dimension key");
          this.status({fill:"red",shape:"ring",text:"User-input required"});                              
       }
        else{
         this.status({});        
         client.connect(function(sessionId) {
           client.subscribe(destination, function(body, headers) {
           console.log('This is the body of a message on the subscribed queue:', body);
           try {                     
                    var json=JSON.parse(body);
                }
             catch(e) {
                    var json=body;
                }
            var array=json.dimensionKeys;
            var found=array.includes(key);
            if(found==true){
            var fdn=[];
            var id=json.id;
            var jsonArg1=new Object();
            jsonArg1.fdn=[];
            jsonArg1.incidentid=id;
            jsonArg1.flowid=flow;   
            for(var i=0;i<json.fdns.length;i++){
               jsonArg1.fdn.push(json.fdns[i]);      
             } 
            var incidentLog = '{"flowid" : ' + flow + ', "incidentid"  : ' + id + ', "timestamp" : ' + Date.now() + '}';
            console.log(incidentLog);           
            //var jsonArray = JSON.parse(JSON.stringify(fdn));
            context.set("foo",id);
            context.set("mo",fdn);
            var msg={payload:jsonArg1};
            node.send(msg);}
            else{
                node.error("it does not match");
          }
                
        });
      });
            
       client.on("reconnecting", function() {
            node.status({fill:"red",shape:"ring",text:"reconnecting"});
            node.warn("reconnecting");
            console.log('reconnecting');
        });

        client.on("error", function(error) {
            node.status({fill:"grey",shape:"dot",text:"error"});
            node.warn(error);
        });

       node.on("close", function(done) {
            if (client) {
                // disconnect can accept a callback - but it is not always called.
                client.disconnect();
            }
            done();
        });



     
}
        
    }
    RED.nodes.registerType("jms-stomp",LowerCaseNode);
}
