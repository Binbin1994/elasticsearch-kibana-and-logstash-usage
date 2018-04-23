module.exports = function(RED) {
    function LOGSNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.cmd=config.cmd;
        node.on('input',function(msg){
        var tem=[];
        var array= msg.payload.fdn;
        for(var i=0;i<array.length;i++){
          if(array[i].indexOf('MeContext') != -1){
              //var index=array[i].search('MeContext');
              var string=array[i].split(',');
              var index;
              for(var i=0;i<string.length;i++){
                   if(string[i].indexOf('MeContext')!= -1){
                      console.log(i);
                      index=i;
                   }
                   }
 
              //var index=string.indexOf('MeContext');
              //console.log(index);
              //console.log(string[index]);
              var Mecontext=string[index].replace('MeContext=','');
              var command='python '+'ne_logs.py '+Mecontext;
              excute(command,msg); 
          }
          else{
               node.error("it does not contain MeContext");
          }
        }
        
   });
      

      function excute(command,msg){
        var exec = require('child_process').exec;
        var child = exec(command);
        child.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
          send(data,msg);
        });
        child.stderr.on('data', function(data) {
         console.log('stdout: ' + data);
       });

      }

      function send(output,msg){           
         msg.payload=output;
         node.send(msg);
      }




}

    RED.nodes.registerType("ne-logs",LOGSNode);
}
