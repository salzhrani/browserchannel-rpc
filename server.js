var browserChannel = require('browserchannel').server;
var RSVP = require('rsvp');
var rpc;
module.exports.server = rpc = function(procedures, options) {
	if(options === undefined)
	{
		options = {};
	}
	return browserChannel(options,function(session){
		session.on('message', function(data) {
			// the rpc method name is under the rpc property

			if(data.pId && data.rpc && procedures[data.rpc])
			{
				// a valid request

				try {
					procedures[data.rpc](session,data.data,function(err,rData){
						if(err){
							session.send({pId:data.pId,err:err,data:null});
						}
						else
						{
							session.send({pId:data.pId,err:null,data:rData});
						}
					});
				}
				catch(e)
				{
					session.send({pId:data.pId,err:e,data:null});
				}
			}
			else if (!data.rpc || (data.rpc && procedures[data.rpc] === undefined))
			{
				// rpc missing or unknown
				session.send({pId:data.pId,err:'Missing or Unknown RPC',data:null});
			}
		});
	});
};