const type = require('../const_env').TYPE_DATA;

module.exports = {
  _id: type.OBJECTID,
  content: type.STRING,
  listAnswers: type.OBJECT,
  type: type.STRING,
  answers: type.OBJECT,
  level: type.NUMBER,
  fieldQuestionId: type.STRING,
  virtual: type.BOOLEAN,
  author: type.STRING
}