var db = require('../models');

/*
 * GET home page.
 */
exports.index = function(req, res){
	db.Settings.get(function(err,doc){
		if(err)
			return console.log(err);
		return (doc.modeState) ? res.redirect('/site/auditions') : res.redirect('/site/main');
	});
};

/*
 * GET auditions page
 */
exports.auditions = function(req, res){
	var settings = db.Settings.get(function(err,doc){
		if (err)
			return console.log(err);
		return res.render('site/auditions.jade', {title: 'auditions'});
	});
};

/*
 * GET main application page
 */

exports.main = function(req, res){
	res.render('site/index.jade', {title: 'Main'});
};

 /*
 * GET Admin main page
 */

exports.admin = function(req, res){
	return res.render('admin/index.jade', {title: 'Admin'});
};

exports.partial = function(req, res){
	res.render('admin/partials/' + req.params.partial, {} );
}