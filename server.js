// Require packages and set the port
const const_env = require('./const_env');
const express = require('express');
const port = const_env.port;
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var Util = require('./Util');

Util.setupStore();
// setup
Util.setupDatabase();

// Use Node.js body parsing middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// users
var api_user = require('./api/user.api');
api_user.get(app);
api_user.post(app);
api_user.patch(app);
api_user.delete(app);

// fieldQuestion
var api_fieldQuestion = require('./api/fieldQuestion.api');
api_fieldQuestion.get(app);
api_fieldQuestion.post(app);
api_fieldQuestion.patch(app);
api_fieldQuestion.delete(app);

// subject
var api_subject = require('./api/subject.api');
api_subject.get(app);
api_subject.post(app);
api_subject.patch(app);
api_subject.delete(app);

// question
var api_question = require('./api/question.api');
api_question.get(app);
api_question.post(app);
api_question.patch(app);
api_question.delete(app);
api_question.uploadFile(app);

// feedback
var api_feedback = require('./api/feedback.api');
api_feedback.get(app);
api_feedback.post(app);
api_feedback.patch(app);
api_feedback.delete(app);

// group exam
var api_groupExam = require('./api/groupExam.api');
api_groupExam.get(app);
api_groupExam.post(app);
api_groupExam.patch(app);
api_groupExam.delete(app);

// role
var api_role = require('./api/role.api');
api_role.get(app);
api_role.post(app);
api_role.patch(app);
api_role.delete(app);

app.post('/login', (req, res) => {
  let const_env = require('./const_env');
  let action = require('./controllers/users');
  let link_collection = `/${const_env.db_collection.users}`;
  action.action(const_env.TYPE.find, req.body).then((data) => {
    if (data.total) {
      var token = Util.createToken(req.body);
      res.send({
        accessToken: token,
        username: data.data[0].username,
        name: data.data[0].name,
        role: data.data[0].role,
        email: data.data[0].email,
        _id: data.data[0]._id
      });
    } else {
      res.send({});
    }
  });
})

app.post('/random-question', (req, res) => {
  var query = req.body;
  Util.getAll({
    fieldQuestionId: query.fieldId,
    virtual: {
      $ne: true
    }
  }, const_env.db_collection.questions).then((data) => {
    let arr = [];
    Object.keys(query.level).forEach((key) => {
      let listQuestion = data.data.filter(e => e.level == key);
      listQuestion = Util.shuffle(listQuestion);
      let randomNumber = query.level[key];
      for (let index = 0; index < listQuestion.length; index++) {
        if(randomNumber === 0){
          break;
        }
        arr.push(listQuestion[index]);
        randomNumber--;
      }
    });
    res.send(arr);
  })
});

app.post('/random-test', (req, res) => {
  var query = req.body;
  Util.getAll({
    fieldQuestionId: query.fieldId,
    virtual: {
      $eq: true
    }
  }, const_env.db_collection.questions).then((data) => {
    let arr = [];
    Object.keys(query.level).forEach((key) => {
      let listQuestion = data.data.filter(e => e.level == key);
      let randomNumber = query.level[key];
      let space = Math.floor(listQuestion.length / randomNumber);
      for (let i = 0; i + space < listQuestion.length; i += space) {
        let ran = Math.floor(Math.random() * space) + i;
        arr.push(listQuestion[ran]);
      }
    });
    res.send(arr);
  })
})

// app.get('/tests', (req, res) => {
//   console.log('----------------------------------------------------------------------------------------------');
//   console.log(req.query);
//   console.log(JSON.parse(req.query['array']));
//   console.log('----------------------------------------------------------------------------------------------');
//   res.send('ok');
// })

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
});