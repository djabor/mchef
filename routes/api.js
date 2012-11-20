
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

exports.files = {
	imageUpload: function(req, res){
		var fs = require('fs')
		, ei = require('easyimage');
		var filename = req.files[req.body.target].path.split('.');
		var obj = {
			writename: req.body.userId + '_' + req.body.target + '.' + filename[1],
			realname: filename
		}
		var newPath = global.root + "/public/images/" + obj.writename;
		ei.resize({src:req.files[req.body.target].path, dst:newPath, width:100, height:100}, function(err, stdout, stderr) {
			if (err) 
				throw err;
			stdout.writeFolder = '/images/';
			res.send(stdout);
		});
	}
}