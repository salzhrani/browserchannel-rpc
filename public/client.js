var BCRPC = function(url,options){
	this.log = {};
	this.socket = new BCSocket(url,options);
	var that = this;
	this.socket.onmessage = function(message){
		var promise = that.log[message.pId];
		if(message.err !== null)
			promise.reject(message.err);
		else
			promise.resolve(message.data);
		delete that.log[message.pId];
	};
	this.emit = function(fname,data){
		var promise = RSVP.defer();

		var id =generateGUID();

		this.socket.send({rpc:fname,pId:id,data:data});

		this.log[id] = promise;

		return promise.promise;
	};
	generateGUID = function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
			v = c === 'x' ? r : r & 3 | 8;
			return v.toString(16);
		});
	};
};