/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var config = require('./config');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var RedisStore = require('connect-redis')(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.store = new RedisStore({port: config.redis.port, host: config.redis.host, pass: config.redis.passwd});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieSession({secret: config.session.secret}));
app.use(express.session({
    secret: config.session.secret,
    store: app.store,
    cookie: config.cookie
})
);
app.use(function (req, res, next) {
    //res.locals.user = req.session.user;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/edit', routes.edit);
app.get('/test', routes.test);
app.get('/users', user.list);


console.log(config);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

