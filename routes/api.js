
/*
 * GET video data.
 */
exports.video = {
	getData: function(req,res,next){
		var videoID = req.params.id;
		var http = require('http');
		var options = {
		  host: "www.youtube.com",
		  path: "/oembed?url=http%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D"+videoID+"&format=json"
		};
		callback = function(response) {
		  var str = '';
		  response.on('data', function (chunk) {
		    str += chunk;
		  });
		  response.on('end', function () {
		    res.setHeader("Content-Type", "application/json");
		    res.send(str);
		  });
		}
		http.request(options, callback).end();
	}
}