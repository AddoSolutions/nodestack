# NodeStack - OpenStack API Tool for Node.JS

This is simply a lack of any other tool to work with OpenStack for me in Node.JS and learning many painful lessons on it's usage.

## Installing

```javascript
npm install nodestack --save
```

From there you can include the library with:

```javascript
var OpenstackClient = require('nodestack');
```

or with

```javascript
import OpenstackClient from 'nodestack';
```

## Usage

This application will first do all the authentication for you, and then will add all the needed headers for you to do anything further.  You can see this in practice in `test.js`

There are two ways to authenticate, the main way is:

```javascript
var client = new OpenstackClient("http://10.0.0.10:5000", "admin","password","ethode");
```

The second way (if you have some other preferred way of authentication) is:

```javascript
var client = new OpenstackClient("http://10.0.0.10:5000", {
	"passwordCredentials": {
		"username": "admin",
		"password": "password"
	},
	"tenantName": "ethode"
});
```

You can see how this is done here: http://developer.openstack.org/api-ref-identity-v2.html.  This application is using **authentication API version 2.0**.

## Making Calls


Once you have your working `client` then you can do whatever you need:

```javascript
client.get("http://10.0.0.10:8774/v2/{object-id}/servers/detail", function(data){
	console.log("Found " + data.servers.length + " servers!");
});
```

Be sure to check out the docs to learn how to actually do things! http://developer.openstack.org/api-ref-compute-v2.1.html



## Things I'd like to do:

- [ ] Automatically get URL's for each service and map an object to it (ex `client.compute.get(…)`)
- [ ] Better Error Checking
