var express = require("express");
var app = express.createServer();

var SESSION;
var $ = {};

app.configure(function() {
  app.use(express.static(__dirname+'/assets'));
  app.set('views', __dirname + '/views');
  
  app.set('view engine', 'ejs');
  app.set("view options", {layout: false});
  
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "tgae54yw46r"  }));
  
  //app.use(app.router);
});

 
app.listen(8082);

app.get('/', function(req, res){
  console.log('Loaded /index');
  res.render('index', {
    
  });
});

app.get('/create', function(req, res){
  console.log('Loaded /create');
  res.render('create', {
    
  });
});

// Database connection
var Sequelize = require("sequelize");
var sequelize = new Sequelize('votetime', 'votetime', null, {
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

var User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  user_uuid: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING
});



var Question = sequelize.define('Question', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  text: Sequelize.STRING,
  user_id: Sequelize.INTEGER
});

var Option = sequelize.define('Option', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  question_id: Sequelize.INTEGER,
  text: Sequelize.STRING,
  
});

var Answer = sequelize.define('Answer', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: Sequelize.INTEGER,
  option_id: Sequelize.INTEGER
});

User.hasMany(Question);
Question.hasMany(Option);
Option.hasMany(Answer);

User.sync({force: true});
Question.sync({force: true});
Option.sync({force: true});
Answer.sync({force: true});





/* Helpers */

var UUIDv4 = function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

var isMobile = function(req) {
  var ua = req.headers['user-agent'];
    
  $.Mobile = false;
  if (/mobile/i.test(ua))
    $.Mobile = true;
      
  return $.Mobile;
}