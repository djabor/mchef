var db = require('../models');
function handle(err,doc,req,res,next){
	res.setHeader("Content-Type", "application/json");
	if (typeof(req.headers['x-requested-with']) == 'undefined' 
			|| req.headers['x-requested-with']  != 'XMLHttpRequest') {
		var err = {
			message: 'XMLHR request refused'
		};
	}
	if (err) {
		return handleError(err,req,res,next);
	} 
	var object = {
		error: 0,
		method: req.originalMethod
	};
	if (doc > 1)
		object.data = doc + ' docs updated';
	else if (doc == 1)
		object.data = doc + ' doc updated'; 
	else 
		object.data = doc;
	return res.send(object);
}
function handleError(err,req,res,next){
	var object = {
		error: err,
		method: req.originalMethod
	};
	return res.send(object);
}

module.exports = {
	test: {
		test: function(req,res,next){
			//populate with default settings
			// var data = {
			// 	defaultRedirect: 'test',
			// 	auditionState: true,
			// 	mainState: false,
			// }
			//
			// db.Settings.populate(data, function(err,doc){
			// 	if(err)
			// 		return console.log(err);
			// 	return res.send(doc);
			// });

			//set Main page state (enabled/disabled)
			// db.Settings.setMainState(true, function(err,doc){
			// 	if(err)
			// 		return console.log(err);
			// 	return res.send(doc);
			// });

			//get all images in settings
			// db.images.getAll(function(err,doc){
			// 	if(err)
			// 		return console.log(err);
			// 	return res.send(doc);
			// });
			//add image to settings
			// db.images.add({keyName:'LOGO_IMAGE', valueName:'image4.jpg'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });
			//get image
			// db.images.get({_id:'5088e64f5a72230000000003'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });
			//edit image
			// db.images.edit({keyName: 'LOGO_IMAGE'}, {valueName: 'logo666.jpg'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });

			//get all texts in settings
			// db.texts.getAll(function(err,doc){
			// 	if(err)
			// 		return console.log(err);
			// 	return res.send(doc);
			// });
			//add text to settings
			// db.texts.add({keyName:'ADDITIONAL_TEXT', valueName:'foo bar'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });
			//get text
			// db.texts.get({keyName: 'SOME_TEXT'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });
			//edit text
			// db.texts.edit({keyName: 'SOME_TEXT'}, {valueName: 'whoopla'}, function(err,doc){
			// 	if(err)
			// 		return res.send(err);
			// 	return res.send(doc);
			// });
		}
	},
	settings: {
		/*
		 * Settings Operations
		 */
		getAll: function(req,res,next){
			db.Settings.get(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		setModeState: function(req,res,next){
			db.Settings.setModeState(req.body.state, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},	
		setAuditionState: function(req,res,next){
			db.Settings.setAuditionState(req.body.state, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		setMainState: function(req,res,next){
			db.Settings.setMainState(req.body.state, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		setCurrentUser: function(req,res,next){
			db.Settings.setCurrentUser(req.body.id, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		setVideoUrl: function(req,res,next){
			db.Settings.setVideoUrl(req.body.url, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		}
	},
	users: {
		/*
		 * User Operations
		 */
		getAll: function(req,res,next){
			db.Users.getAll(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Users.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Users.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		update: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Users.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		delete: function(req,res,next){
			var id = req.params.id;
			db.Users.delete({_id:id}, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		setVote: function(req,res,next){
		
		},
		setRate: function(req,res,next){
		
		}
	},
	recipes: {
		/*
		 * Recipes Operations
		 */
		getAll: function(req,res,next){
			db.Recipes.getAll(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Recipes.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Recipes.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		update: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Recipes.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		delete: function(req,res,next){
			var id = req.params.id;
			db.Recipes.delete({_id:id}, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		
	},
	videos: {
		/*
		 * Video Operations
		 */
		getAll: function(req,res,next){
			db.Videos.getAll(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Videos.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Videos.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		update: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Videos.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		delete: function(req,res,next){
			var id = req.params.id;
			db.Videos.delete(id, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
	},
	tips: {
		/*
		 * Tips Operations
		 */
		getAll: function(req,res,next){
			db.Tips.getAll(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Tips.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Tips.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		update: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Tips.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		delete: function(req,res,next){
			var id = req.params.id;
			db.Tips.delete({_id:id}, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
	},
	ticks: {
		/*
		 * Ticker Operations
		 */
		getAll: function(req,res,next){
			db.Ticker.getAll(function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		add: function(req,res,next){
			var data = req.body;
			db.Ticker.add(data, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		get: function(req,res,next){
			var id = req.params.id;
			db.Ticker.get({_id:id},function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
		update: function(req,res,next){
			var id = req.params.id;
			var data = req.body;
			db.Ticker.edit({_id:id}, data, function(err,doc){
				return handle(err,doc,req,res,next);
			});

		},
		delete: function(req,res,next){
			var id = req.params.id;
			db.Ticker.delete({_id:id}, function(err,doc){
				return handle(err,doc,req,res,next);
			});
		},
	}
}