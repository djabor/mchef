/**
* Module dependencies.
*/
var express = require('express')
	, http = require('http')
	, routes = require('./routes/site')
	, rest = require('./routes/rest')
	, api = require('./routes/api')
	, path = require('path')
	, app = express();
global.root = process.cwd() + '/';


/**
* App/Server Configuration
*/
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.compress());
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser({keepExtensions: true}));
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler());
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	console.log('development mode');
});

app.configure('production', function(){
	app.use(express.static(path.join(__dirname, 'public')));
	console.log('production mode');
});

/*
* Url restriction handler
*/

function checkAdminAuth(req, res, next){
	if (!req.session.user_id) {
		res.redirect('/Admin/loginForm');
	} else {
		next();
	}
}

function checkAuth(req, res, next){

}

/*
* Routing
*/

/*
* View Routes
*/
app.get('/', routes.index);
app.get('/site/auditions', routes.auditions);
app.get('/site/main', routes.main);
app.get('/Admin/loginForm', routes.adminLoginForm);
app.post('/Admin/login', routes.adminLogin);
app.get('/Admin/logout', routes.adminLogout);
app.get('/admin', checkAdminAuth, routes.admin);
app.get('/admin/:partial', checkAdminAuth, routes.partial);


/*
* Api Routes
*/

app.get('/api/getvideoData/:id', api.video.getData);
app.post('/api/fileUpload', api.files.imageUpload);

/*
* RESTful Routes
*/
app.get('/rest/test', rest.test.test);

//Settings
app.get('/rest/settings', rest.settings.getAll);
app.put('/rest/settings/modeState', rest.settings.setModeState);
app.put('/rest/settings/auditionState', rest.settings.setAuditionState);
app.put('/rest/settings/mainState', rest.settings.setMainState);
app.put('/rest/settings/currentUser', rest.settings.setCurrentUser);
app.put('/rest/settings/videoUrl', rest.settings.setVideoUrl);
//Users
app.get('/rest/users', rest.users.getAll);
app.post('/rest/users', rest.users.add);
app.get('/rest/users/:id', rest.users.get);
app.put('/rest/users/:id', rest.users.update);
app.del('/rest/users/:id', rest.users.delete);
app.post('/rest/users/:id/vote', rest.users.setVote);
app.post('/rest/users/:id/rate', rest.users.setRate);

//Recipes
app.get('/rest/recipes', rest.recipes.getAll);
app.post('/rest/recipes', rest.recipes.add);
app.get('/rest/recipes/:id', rest.recipes.get);
app.put('/rest/recipes/:id', rest.recipes.update);
app.del('/rest/recipes/:id', rest.recipes.delete);

//Videos
app.get('/rest/videos', rest.videos.getAll);
app.post('/rest/videos', rest.videos.add);
app.get('/rest/videos/:id', rest.videos.get);
app.put('/rest/videos/:id', rest.videos.update);
app.del('/rest/videos/:id', rest.videos.delete);

//Tips
app.get('/rest/tips', rest.tips.getAll);
app.post('/rest/tips', rest.tips.add);
app.get('/rest/tips/:id', rest.tips.get);
app.put('/rest/tips/:id', rest.tips.update);
app.del('/rest/tips/:id', rest.tips.delete);

//Ticker
app.get('/rest/ticks', rest.ticks.getAll);
app.post('/rest/ticks', rest.ticks.add);
app.get('/rest/ticks/:id', rest.ticks.get);
app.put('/rest/ticks/:id', rest.ticks.update);
app.del('/rest/ticks/:id', rest.ticks.delete);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1); 
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});