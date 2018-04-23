module.exports = function(RED) {
    function LOGSNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.cmd=config.cmd;
        node.on('input',function(msg){ 
        var tem=[];       
        var array= msg.payload.fdn;
        var string=array.split(',');
        var Mecontext=string[1].replace('MeContext=','');
        var command='python '+'ne_logs.py '+Mecontext;
        var exec = require('child_process').exec;
        var child = exec(command);
        child.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
          msg.payload=data;
          node.send(msg);
        });
        child.stderr.on('data', function(data) {
         console.log('stdout: ' + data);
       });


        
   });
}

    RED.nodes.registerType("ne-logs",LOGSNode);
}


