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

app.get('/quiz/save', function(req, res){
  console.log('Loaded /quiz/save');
  console.log(res);
  console.log(req);
  /*
    var question = Question.build({
      message: msg,
      group_uuid: group_uuid,
      UserId: user.id,
    });
    message.save().success(function(p) {
      console.log('MESSAGE insert success');
      
      nowjs.getGroup(group_uuid).now.receiveMessage(message.message, user.user_uuid, user.name, message.message_id);
    }).error(function(error) {
      console.log('Insert failed :( ');
      console.log(error);
    });
  */
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
  question: Sequelize.STRING,
  user_id: Sequelize.INTEGER
});

var Option = sequelize.define('Option', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  question_id: Sequelize.INTEGER,
  value: Sequelize.STRING
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


var nowjs = require("now");
var everyone = nowjs.initialize(app);

 nowjs.on('connect', function(){
      console.log('User '+this.user.clientId+' connected');
      
      
 });
 
 nowjs.on('disconnect', function(){
    console.log('User '+this.user.clientId+' disconnected');
 });
 
 
everyone.now.createQuestion = function(data) {

  console.log(data);  
  
  var question = Question.build({
    question: data[0].value,
    user_id: 0 // TODO
  });
  
  question.save().success(function() {
    console.log('Question insert success');
    console.log(this);
    
    for(i = 1; i<data.length; i++) {
      var option = Option.build({
        value: data[i].value,
        question_id: this.id
      });
      
      option.save().success(function() { 
        console.log('Option insert success');
      }).error(function(error) {
        console.log('Option insert failed :( ');
        console.log(error);
      });
    }
  }).error(function(error) {
    console.log('Question insert failed :( ');
    console.log(error);
  });
  

  
};


/* Helpers */

var UUIDv4 = function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)};

var isMobile = function(req) {
  var ua = req.headers['user-agent'];
    
  $.Mobile = false;
  if (/mobile/i.test(ua))
    $.Mobile = true;
      
  return $.Mobile;
};