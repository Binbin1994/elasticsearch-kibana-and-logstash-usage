module.exports = function(RED) {
    function SetTime(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.time=config.time;
        node.on('input', function(msg) {
            var string=node.time;
            var minutes=parseInt(string.split(':')[0]);
            var second=parseInt(string.split(':')[1]);
            var totalsecond=second+minutes*60;
            var second=totalsecond*1000;
            msg.payload = msg.payload;
            setTimeout(() => {
            node.send(msg);
          }, second);
            //node.send(msg);
        })
    }




    RED.nodes.registerType("timer",SetTime);
}

