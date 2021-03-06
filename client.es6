import {Client} from 'node-rest-client';


export default class OpenstackClient{

	/**
	 * This gets the ball rolling with authentication with OpenStack
	 * @param authEndpoint {String} The endpoint of the keystone token manager (ex: "http://10.0.0.10:5000")
	 * @param username {String,{}} Either the username of the user to login as (ex: "admin") OR the complete object you wish to authenticate with.
	 * @param password {String} The password you wish to authenticate with (ex: "admin")
	 * @param project {String} The project/tenant name you want to use for authentication (ex: "ethode")
	 */
	constructor(authEndpoint,username,password,project){

		if(!authEndpoint || !username){
			throw new Exception("You must specify an authentication endpoint and authentication data!");
		}

		if(typeof username == "string"){
			this.authData = {
				"passwordCredentials": {
					"username": username,
					"password": password
				},
				"tenantName": project
			}
		}else{
			this.authData = username;
		}

		this.authEndpoint = authEndpoint;
		this.client = new Client();
		this.token = false;

		this.waiting = [];

		this._initToken();
	}

	/**
	 * This get's our token and will run any pre-requested code
	 * @param cb {Function} The function to execute upon completion
	 * @private
	 */
	_initToken(cb){

		var self = this;

		this.client.post(this.authEndpoint + "/v2.0/tokens", {
			data: {
				"auth": this.authData
			},
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			}
		}, function (data) {
			self.token = data.access.token.id;

			if(cb) cb(self.token);

			console.info("Got Token: " + self.token);

			self.waiting.forEach(function(item){
				self._do(item.type, item.url, item.data, item.cb);
			});
		});



	}

	/**
	 * Performs a GET request on the url given
	 * @param url {String} The URL to hit for your request
	 * @param cb {Function} The function to call when request succeeds (ex: function(data, response){})
	 * @returns {*} This/Myself
	 */
	get(url,cb){
		return this._do("get",url,{},cb);
	}

	/**
	 * Performs a POST request on the url given
	 * @param url {String} The URL to hit for your request
	 * @param data {*} Whatever you want to send in your request to the server
	 * @param cb {Function} The function to call when request succeeds (ex: function(data, response){})
	 * @returns {*} This/Myself
	 */
	post(url,data,cb){
		return this._do("post",url,data,cb);
	}

	/**
	 * Performs a PUT request on the url given
	 * @param url {String} The URL to hit for your request
	 * @param data {*} Whatever you want to send in your request to the server
	 * @param cb {Function} The function to call when request succeeds (ex: function(data, response){})
	 * @returns {*} This/Myself
	 */
	put(url,data,cb){
		return this._do("put",url,data,cb);
	}

	/**
	 * Will call the function passed into this function when a token has been successfully obtained
	 * @param cb {Function} The function to call when request succeeds (ex: function(data, response){})
	 * @returns {*} This/Myself
	 */
	onReady(cb){
		return this._do("onReady", false, false, cb);
	}

	/**
	 * Actually does the requests
	 * @param type {String} post/get/put/etc
	 * @param url The URL we want to hit
	 * @param data The data to send, this must NEVER be NULL or everything iwll break
	 * @param cb
	 * @returns {*}
	 * @private
	 */
	_do(type,url,data,cb){

		if(!this.token){
			this.waiting.push({
				type:type,
				url:url,
				data:data,
				cb:cb
			});
			return this;
		}


		if(type=="onReady"){
			if(cb) cb();
			return;
		}

		console.info("Running Request (" + type + "): " + url);

		var args = {
			data: data,
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-Auth-Token": this.token,
				"X-Auth-Project-Id": this.authData.tenantName
			}
		};

		this.client[type](url,args,cb);

		return this;

	}


}


