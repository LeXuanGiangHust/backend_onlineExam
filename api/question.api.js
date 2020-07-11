const const_env = require('../const_env');
var action = require('../controllers/questions');
const Util = require('../Util');
const link_collection = `/${const_env.db_collection.questions}`;
const fs = require('fs');
const multer = require('multer');

module.exports = {
  get(app) {
    app.get(link_collection, (req, res) => {
      var query_obj = action.validateModel(req.query);
      action.action(const_env.TYPE.find, query_obj).then((data) => {
        res.send(data);
      });
    });
  },

  post(app) {
    app.post(link_collection, (req, res) => {
      var query_obj = req.body;
      action.action(const_env.TYPE.add, query_obj)
        .then((data) => {
          res.send(data);
        })
        .catch(err => res.send(Object.keys(err).length ? err : { message: 'Object exist' }));
    });
  },

  patch(app) {
    app.patch(link_collection, (req, res) => {
      var query_obj = req.body;
      action.action(const_env.TYPE.edit, query_obj)
        .then((data) => {
          res.send(data);
        })
        .catch(err => res.send(Object.keys(err).length ? err : { message: 'Object not exist' }));
    });
  },

  delete(app) {
    app.delete(link_collection, (req, res) => {
      var query_obj = action.validateModel(req.body);
      action.action(const_env.TYPE.delete, query_obj).then((data) => {
        res.send(data);
      })
        .catch(err => res.send(Object.keys(err).length ? err : { message: 'Object not exist' }));
    });
  },

  uploadFile(app) {
    let _date = new Date();
    const _rootFolder = `${const_env.ROOT_FOLDER}`;
    if (!fs.existsSync(_rootFolder)) {
      fs.mkdirSync(_rootFolder);
    }
    const upload = multer({ dest: _rootFolder });
    app.post(`/uploads`, upload.single('images'), (req, res) => {
      const processedFile = req.file || {};
      let orgName = processedFile.originalname || '';
      const fullPathInServer = processedFile.path;
      const newFullPath = `${_rootFolder}\\${req.body._id}-${orgName}`;
      fs.renameSync(fullPathInServer, newFullPath);
      let query = {
        _id: req.body._id,
        image: newFullPath
      }
      Util.edit(query, const_env.db_collection.questions).then((data) => {
        res.send(data);
      })
    });
  }

}
