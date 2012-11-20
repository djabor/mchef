var mongoose = require('mongoose')
, db = mongoose.createConnection('localhost', 'mcDB')
, extend = require('xtend');

function extendStaticMethods(modelName){
	var methods = {
		getAll: function(cb){
			this.model(modelName).find({}, function(err,doc){
				if (!err)
					return cb(null,doc);
				else
					return cb(err);
			});
		},
		get: function(params,cb){
			
			this.model(modelName).findOne(params, function(err,doc){
				if (!err) {
					return cb(null,doc);
				}else
					return cb(err);
			});
		},
		add: function(data,cb){
			var tmp = new this(data);
			tmp.save(function(err,doc){
				if(!err)
					return cb(null,doc);
				else
					return cb(err);
			});
		},
		edit: function(params,data,cb){
			this.model(modelName).findOne(params, function(err,doc){
				if (!err) {
					//extend(doc.image,data.image);
					doc.set(data);
					doc.save(function(e,d){
						return cb(null,doc);
					})
				} else
					return cb(err);
			});
		},
		delete: function(params,cb){
			this.remove(params, function(err,doc){
				if (!err)
					return cb(null,doc);
				else
					return cb(err);
			});
		}
	};
	return methods;
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	/*
	 * Images Schema
	 */
	var imagesSchema = new mongoose.Schema({
		keyName: {
			type: String,
			index: true,
			unique: true
		},
		valueName: String,
		width: Number,
		height: Number
	});

	/*
	 * Images Manipulation
	 */
	imagesSchema.statics = extendStaticMethods('Images');

	/*
	 * Images Model
	 */
	exports.images = db.model('Images', imagesSchema);

	/*
	 * Texts Schema
	 */
	var textsSchema = new mongoose.Schema({
		keyName: {
			type: String,
			index: true,
			unique: true
		},
		valueName: String,
		Language: {
			type: String,
			index: true
		}
	});

	/*
	 * Texts Manipulation
	 */
	textsSchema.statics = extendStaticMethods('Texts');

	/*
	 * Texts Model
	 */
	exports.texts = db.model('Texts', textsSchema);

	/*
	 * Settings Schema
	 */
	var settingsSchema = new mongoose.Schema({
		modeState: {type: Boolean, default: true},
		auditionState: {type: Boolean, default: true},
		mainState: {type: Boolean, default: true},
		currentUser: {type: Boolean, default: 'default'},
		videoUrl: {type: Boolean, default: 'default'}
	});
	
	/*
	 * Settings Manipulation
	 */
	settingsSchema.statics = {
		get: function(cb){
			this.model('Settings').findOne({}, function(err,doc){
				if(err)
					return cb(err);
				return cb(null,doc);
			});
		},
		populate: function(data,cb){
			this.model('Settings').find({}, function(err,doc){
				if (err)
					return cb(err)
				if (typeof(doc) == 'null' || typeof(doc) == 'undefined' || doc.length == 0) {
					var Settings = db.model('Settings', settingsSchema);
					var tmp = new Settings(data);
					tmp.save(function(err,doc){
						if (err)
							return cb(err)
						return cb(doc);
					});
				} else {
					return cb();
				}
			});
		},
		setModeState: function(value,cb){
			this.findOne({}, function(err,doc){
				if (err)
					return cb(err);
				doc.modeState = value;
				return doc.save(cb(null,doc));
			});
		},
		setAuditionState: function(value,cb){
			this.findOne({}, function(err,doc){
				if (err)
					return cb(err);
				doc.auditionState = value;
				return doc.save(cb(null,doc));
			});
		},
		setMainState: function(value,cb){
			this.findOne({}, function(err,doc){
				if (err)
					return cb(err);
				doc.mainState = value;
				return doc.save(cb(null,doc));
			});
		},
		setCurrentUser: function(value,cb){
			this.findOne({}, function(err,doc){
				if(err)
					return cb(err);
				doc.currentUser = value;
				return doc.save(cb(null,doc));
			});
		},
		setVideoUrl: function(value,cb){
			this.findOne({}, function(err,doc){
				if(err)
					return cb(err);
				doc.videoUrl = value;
				return doc.save(cb(null,doc));
			});
		}
	}
	
	/*
	 * Settings Model
	 */
	exports.Settings = db.model('Settings', settingsSchema);

	exports.Settings.count({}, function(err,c){
		if(err)
			return err;
		if (c == 0) {
			exports.Settings.populate({}, function(err, doc){
				if(err)
					return err;
			});
		} else 
			return;
	})


	/*
	 * User Votes Schema
	 */
	var votesSchema = new mongoose.Schema({
		voterIp: String,
		dateCreated: {type: Date, default: Date.now}
	});

	/*
	 * User Rating Schema
	 */
	var ratesSchema = new mongoose.Schema({
		rate: Number,
		raterIp: String,
		dateCreated: {type: Date, default: Date.now}
	});

	/*
	 * Users Schema
	 */
	var usersSchema = new mongoose.Schema({
		name: {
			first: String,
			last: String
		},
		image: {
			large: { type: String, default: 'http://placehold.it/200x200'},
			small: { type: String, default: 'http://placehold.it/100x100'},
			thumb: { type: String, default: 'http://placehold.it/50x50'}
		},
		description: String,
		hidden: {type: Boolean, default: true},
		dateCreated: {type: Date, default: Date.now},
		meta: {
			timer: Number,
			votes: [votesSchema],
			rates: [ratesSchema]
		}
	});

	/*
	 * Users manipulation
	 */
	usersSchema.statics = extendStaticMethods('Users');

	/*
	 * Users Model
	 */
	exports.Users = db.model('Users', usersSchema);

	
	/*
	 * Recipes Schema
	 */
	var recipesSchema = new mongoose.Schema({
		mainTitle: String,
		description: String,
		owner: String,
		images: {
			thumb: String,
			small: String,
			large: String
		},
		prepareTime: String,
		totalTime: String,
		category: String,
		difficulty: String,
		kosher: String,
		servings: Number,
		ingredients: Array,
		prepare: String,
		printURL: String,
		dateCreated: {type: Date, default: Date.now}
	});
	
	/*
	 * Recipes Manipulation
	 */
	recipesSchema.statics = extendStaticMethods('Recipes');

	/*
	 * Recipes Model
	 */
	exports.Recipes = db.model('Recipes', recipesSchema);


	/*
	 * Videos Schema
	 */
	var videosSchema = new mongoose.Schema({
		enabled: Boolean,
		videoURL: String,
		dateCreated: {type: Date, default: Date.now}
	});
	
	/*
	 * Videos Manipulation
	 */
	videosSchema.statics = extendStaticMethods('Videos');
	
	/*
	 * Videos Model
	 */
	exports.Videos = db.model('Videos', videosSchema);

	/*
	 * Tips Schema 
	 */
	var tipsSchema = new mongoose.Schema({
		title: String,
		description: String,
		dateCreated: {type: Date, default: Date.now}
	});

	/*
	 * Tips Manipulation
	 */
	tipsSchema.statics = extendStaticMethods('Tips');
	
	/*
	 * Tips Model
	 */	
	exports.Tips = db.model('Tips', tipsSchema);
	
	/*
	 * Ticker Schema
	 */
	var tickerSchema = new mongoose.Schema({
		title: String,
		order: Number,
		dateCreated: {type: Date, default: Date.now}
	});
	
	/*
	 * Ticker Manipulation
	 */
	tickerSchema.statics = extendStaticMethods('Ticker');
	
	/*
	 * Ticker Model
	 */
	exports.Ticker = db.model('Ticker', tickerSchema);
	
	/*
	 * System Users Schema
	 */
	var sysUserSchema = new mongoose.Schema({
		username: String,
		password: String,
		dateCreated: {type: Date, default: Date.now}
	});

	/*
	 * System User Manipulation
	 */
	sysUserSchema.statics = extendStaticMethods('sys');
	
	/*
	 * System User Model
	 */
	exports.sys = db.model('sys', sysUserSchema);
});