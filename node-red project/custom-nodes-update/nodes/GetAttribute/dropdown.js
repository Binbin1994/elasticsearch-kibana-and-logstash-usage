module.exports = function (RED) {
    function DropNode(config) {
        RED.nodes.createNode(this, config);
        this.MO = config.MO;
        this.Attr = config.Attr;
        var node = this;
        var json = {};

        var fs = require('fs');
        json = JSON.parse(fs.readFileSync('node_model.json', 'utf8'));


        RED.httpAdmin.get("/mo", RED.auth.needsPermission('mo.read'), function (req, res) {

            res.send(json);

        });


        node.on('input', function (msg) {
            //var fdn= msg.payload.fdn;
            //var id=msg.payload.id
            //var exec = require('child_process').exec;
            //
            //console.log(fdn);
            
            if (node.MO == "" || node.Attr == "") {
                this.status({ fill: "red", shape: "ring", text: "select required" });
            }
            else {
                this.status({});
                var fdn = msg.payload.fdn;
                console.log(fdn);
                for (var i = 0; i < fdn.length; i++) {
                    //console.log(i);
                    //console.log(fdn[i]);
                    var id = msg.payload.incidentid;
                    console.log(id);
                    var string = fdn[i];
                   
                    var Mecontext=context(string);
                    console.log(Mecontext);
                    //console.log(command);
                    if(Mecontext!=null){
                        var command = 'python' + ' ' + 'enm_cm.py ' + Mecontext + " " + node.MO + "." + node.Attr;
                        exectuteFunction(command, msg, string, id);
                        console.log(string);
                    }
                    else{node.error("it does not contain mecontext field");  }
                  
                    //console.log(string);              
                    //console.log(output);                 
                }
            }
        });

        function exectuteFunction(command, msg, string, id) {
            var exec = require('child_process').exec;
            exec(command, function (error, stdout, stderr) {
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                //console.log(string);
                //console.log(stdout);
                //return stdout;        
                //msg.payload=string+'&data='+stdout;
                //node.send(msg);
                send(stdout, msg, string, id)
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        }

        function context(string) {
            var split = string.split(',');
            for (var i = 0; i < split.length; i++) {
                if (split[i].includes('MeContext')) {
                    var value=split[i].split('=')[1];
                    return value;              
                }              
            }

            return null;   

        }



        function send(output, msg, string, id) {
            console.log(output);
            var split = output.split('\n');
            var array1=[];
            var array2=[];            
            var object = new Object();
           
            //object.id = id;
            //object.topology = string;
            //object.data = attribute;
            //object.flowid = msg.payload.flowid;
            for(var i=0;i<split.length;i=i+3){
                 array1.push(split[i]);          
            }  
            for(var i=1;i<split.length;i=i+3){
                array2.push(split[i]);
            }
            for(var i=0;i<array1.length;i++){
               var fdn=array1[i].split(':')[1];
               var attribute=array2[i].split(':')[1];
               if(fdn&&attribute){
               object.id=id;
               object.flowid=msg.payload.flowid;           
               object.topology=fdn;
               object.data=attribute;
               msg.payload=object;
               console.log(msg);
               node.send(msg);
              }
               else{
                console.log('it is null value');
              }
            }                 
        }


        //this.on('input', function(msg) {
        //var fdn=msg.payload;
        //for(var i=0;i<fdn.length;i++){
        //msg.payload='python'+' '+'enm_cm.py '+fdn[i]+" "+node.method+"."+node.attribute;
        //console.log(fdn[i]);
        //node.send(msg);} 
        //});




    }
    RED.nodes.registerType("dropdown", DropNode);
}

