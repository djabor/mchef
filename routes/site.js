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
 * ADMIN
 */

exports.admin = function(req, res){
	return res.render('admin/index.jade', {title: 'Admin'});
};

exports.adminLoginForm = function(req,res){
	if (!req.session || !req.session.user_id) {
		res.render('admin/login.jade', {});
	} else {
		res.redirect('/Admin');
	}
}

exports.adminLogin = function(req,res){
	var post = req.body;
	db.powerUsers.get({username:post.username}, function(err,doc){
		if (err)
			return res.redirect('/Admin/loginForm');
		if (!doc || err)
			return res.redirect('/Admin/loginForm');
		if (post.password == doc.password){
			req.session.user_id = doc._id;
			res.redirect('/Admin');
		} else {
			res.redirect('/Admin/loginForm');
		}

	});
}

exports.adminLogout = function(req,res){
	if(req.session.user_id)
		delete req.session.user_id;
	res.redirect('/Admin/loginForm');
}

exports.partial = function(req, res){
	res.render('admin/partials/' + req.params.partial, {} );
}