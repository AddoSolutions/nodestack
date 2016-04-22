var OpenstackClient = require('./');

var client = new OpenstackClient("http://10.0.0.10:5000", "admin","admin","ethode");

client.onReady(function(data){

	client.get("http://172.18.0.2:8774/v2/8e0d77698aed41fcb6546bc6472af1fe/servers/detail", function(data){
		console.log("Found " + data.servers.length + " servers!");
		console.log("Success with simple authentication!");
		//process.exit();
	});
});


var client = new OpenstackClient("http://10.0.0.10:5000", {
	"passwordCredentials": {
		"username": "admin",
		"password": "admin"
	},
	"tenantName": "ethode"
});

client.onReady(function(data){

	client.get("http://172.18.0.2:8774/v2/8e0d77698aed41fcb6546bc6472af1fe/servers/detail", function(data){
		console.log("Found " + data.servers.length + " servers!");
		console.log("Success with Object Authentication!");
		//process.exit();
	});
});