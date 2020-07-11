const const_env = require('../const_env');
var action = require('../controllers/feedbacks');
const link_collection = `/${const_env.db_collection.feedbacks}`;

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
      // var query_obj = action.validateModel(req.body)
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
      // var query_obj = action.validateModel(req.body);
      var query_obj = req.query;
      action.action(const_env.TYPE.edit, query_obj)
        .then((data) => {
          res.send(data);
        })
        .catch(err => res.send(Object.keys(err).length ? err : { message: 'Object not exist' }));
    });
  },

  delete(app) {
    app.delete(link_collection, (req, res) => {
      var query_obj = action.validateModel(req.query);
      action.action(const_env.TYPE.delete, query_obj).then((data) => {
        res.send(data);
      })
        .catch(err => res.send(Object.keys(err).length ? err : { message: 'Object not exist' }));
    });
  }

}
