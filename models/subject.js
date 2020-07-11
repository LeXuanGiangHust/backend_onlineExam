const type = require('../const_env').TYPE_DATA;

module.exports = {
  _id: type.OBJECTID,
  timeOpen: type.STRING,
  timeClose: type.STRING,
  timeLive: type.STRING,
  listQuestions: type.OBJECT,
  level: type.OBJECT,
  fieldQuestionId: type.STRING,
  code: type.code,
  virtual: type.BOOLEAN,
  author: type.STRING
}