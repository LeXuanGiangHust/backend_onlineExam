// Server
const hostname = '127.0.0.1';
const port = '8080';

exports.hostname = hostname;
exports.port = port;
exports.ROOT_FOLDER = 'C:\\online_exam_images';

// Mongo
const url = 'mongodb://localhost:27017/';
const db_name = 'online_exam';
const url_db = url + db_name;

// collection name
exports.db_collection = {
  users: 'users',
  questions: 'questions',
  feedbacks: 'feedbacks',
  fieldQuestions: 'fieldQuestions',
  groupExams: 'groupExams',
  subjects: 'subjects',
  roles: 'roles',
};

exports.url = url;
exports.url_db = url_db;
exports.db_name = db_name;

// type action
exports.TYPE = {
  add: 'ADD',
  find: 'FIND',
  delete: 'DELETE',
  sort: 'SORT',
  edit: 'EDIT'
};

exports.limit = 200;
exports.skip = 0;

exports.TYPE_DATA = {
  OBJECTID: 'ObjectId',
  STRING: 'String',
  NUMBER: 'Number',
  OBJECT: 'Object',
  ARRAY: 'Array',
  BOOLEAN: 'Boolean'
}