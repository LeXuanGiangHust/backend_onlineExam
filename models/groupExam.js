const type = require('../const_env').TYPE_DATA;

module.exports = {
  _id: type.OBJECTID,
  userId: type.STRING,
  fieldQuestionId: type.STRING,
  score: type.STRING,
  history: type.ARRAY
}
