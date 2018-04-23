module.exports = function (RED) {
    function setAttrNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.Attr = config.Attr;
        this.AttrVal = config.AttrVal;
        var fs = require('fs');
        var Post=require('./post');
        json = JSON.parse(fs.readFileSync('/home/cloud-user/nodes/GetAttribute/node_model.json', 'utf8'));
        RED.httpAdmin.get("/set", RED.auth.needsPermission('set.read'), function (req, res) {

            res.send(json);

        });
        node.on('input', function (msg) {
            if (node.MO == "" || node.Attr == "") {
                this.status({ fill: "red", shape: "ring", text: "select required" });
            }
            else {
                this.status({});
                var id = msg.payload.incidentid;
                var fdn = msg.payload.fdn;
                for (var i = 0; i < fdn.length; i++) {
                    var string=fdn[i];
                    //console.log(string);
                    var command = 'python' + ' ' + 'cmedit_set.py ' + string + " " + node.Attr + "=" + node.AttrVal;
                    console.log(command);
                    exectuteFunction(command, msg, string, id);

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
        function send(stdout, msg, string, id) {
            var str = stdout.split('\n');
            var found = str.includes('1 instance(s) updated');
            var data;
            if (found == true) {
                data = str[3];
            }
            else {
                for (var i = 0; i < str.length; i++) {
                    data = data + str[i];
                }
            }
            console.log(data);
            var object = new Object();
            object.topology = string;
            object.flowid = msg.payload.flowid;
            object.data = data;
            object.id = id;
            var message="id="+id+"&topology="+string+"&data="+data;
            Post.post(message);  
            msg.payload = object;
            node.send(msg);

        }

    }
    RED.nodes.registerType("setAttribute", setAttrNode);
}
