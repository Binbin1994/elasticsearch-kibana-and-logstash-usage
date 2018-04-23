module.exports = function(RED) {
    function httpNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var request=require('request');
    
        node.on('input', function(msg) {                               
         var id=msg.payload.id;
         var topology=msg.payload.topology;
         var data=msg.payload.data;
         var string="id="+id+"&topology="+topology+"&data="+data; 
           var options = {
             method: 'post',
             body:string, 
             url: 'http://10.45.16.204:8080/associationmapper-app/rest/incidents/addIncidentEnrichment',
             headers: {
             'X-Requested-With':'XMLHttpRequest',
             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
           }
      }
         request(options, function (err, res, body) {
            if (err) {
             console.log('Error :', err)
           return
                }
             console.log(' Body :', body)
            });

        });
    }
    RED.nodes.registerType("http-post",httpNode);
}
