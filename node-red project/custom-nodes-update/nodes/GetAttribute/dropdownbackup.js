module.exports = function(RED) {
    function DropNode(config) {
        RED.nodes.createNode(this,config);
        this.method=config.method;
        this.attribute=config.attribute;
        var node = this;
        var json={};
        
       
        //var sys = require('sys');
        var fs = require('fs');
        json = JSON.parse(fs.readFileSync('node_model.json', 'utf8')); 
      
                         
        RED.httpAdmin.get("/mo", RED.auth.needsPermission('mo.read'), function(req,res) {
                 
            res.send(json);
                
        });
       
       //var exec = require('child_process').exec;
        
       node.on('input',function(msg){
        var fdn= msg.payload;
        var temp=[];
        var exec = require('child_process').exec;

        var output=[];
        //var exec = require('child_process').exec;
        for(var i=1;i<fdn.length;i++){
        var id=fdn[0];        
        console.log(i);
        console.log(fdn[i]);
        temp.push(fdn[i]);
        //temp.unshift('i');
        //var string='id='+id+'&topology='+fdn[i];
        //console.log(string);
        var command='python'+' '+'enm_cm.py '+fdn[i]+" "+node.method+"."+node.attribute;
         
        //function puts(error, stdout, stderr) { sys.puts(stdout) }
         //console.log(command);
        //function execute(cmd,callback){
        //var result=exec(cmd, function(error, stdout, stderr) {
         //callback(stdout);
      //}); 
          //};
       
       var result=exec(command,function(error, stdout, stderr){

            console.log(stdout);
            //return stdout;           
      });
       console.log(result);

     }


   });

        
        //this.on('input', function(msg) {
        //var fdn=msg.payload;
        //for(var i=0;i<fdn.length;i++){
        //msg.payload='python'+' '+'enm_cm.py '+fdn[i]+" "+node.method+"."+node.attribute;
        //console.log(fdn[i]);
        //node.send(msg);} 
    //});
               
    }
    RED.nodes.registerType("dropdown",DropNode);
}
