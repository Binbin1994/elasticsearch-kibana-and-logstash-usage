module.exports = function(RED) {
	function TestAttributeNode(config){
		RED.nodes.createNode(this, config);
		this.checkall=config.checkall;
		this.attr=config.attr;
		var node = this;

		node.on('input', function(msg){
			var attribute = msg.payload.data;
			if(attribute === ""){
				node.send([null, msg]);
			}
			console.log(attribute);
			if(String(node.checkall) == "=="){
				if(attribute == node.attr){
					var message=msg.payload;
					msg.payload=message;
					node.send([msg, null]);
				}else{
                    var message=msg.payload;
					msg.payload=message;
					node.send([null, msg]);
				}
			}else if(String(node.checkall) == ">"){
				if(attribute > node.attr){
					var message=msg.payload;
					msg.payload=message;
					node.send([msg, null]);
				}else{
                    var message=msg.payload;
					msg.payload=message;
					node.send([null, msg]);
				}
			}else if(String(node.checkall) == "<"){
				if(attribute < node.attr){
					var message=msg.payload;
					msg.payload=message;
					node.send([msg, null]);
				}else{
                    var message=msg.payload;
					msg.payload=message;
					node.send([null, msg]);
				}
			}else if(String(node.checkall) == "contains"){
				if(attribute.indexOf(node.attr) != -1){
					var message=msg.payload;
					msg.payload=message;
					node.send([msg, null]);
				}else{
                    var message=msg.payload;
					msg.payload=message;
					node.send([null, msg]);
				}
			}
		});
	}
	RED.nodes.registerType('test-attribute', TestAttributeNode);
}