const const_env = require('../const_env');
var action = require('../controllers/users');
const link_collection = `/${const_env.db_collection.users}`;
var Util = require('../Util');

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
      var query_obj = action.validateModel(req.body);
      Util.find({ username: query_obj.username }, const_env.db_collection.users, 0, 200).then(dataRes => {
        var _temp = dataRes.data.find(e => e.username === query_obj.username);
        if (_temp) {
          res.send({ total: 0, data: [] });
          return;
        }
        Util.find({}, const_env.db_collection.users, 0, 200).then(dataRes1 => {
          var _temp1 = dataRes1.data.find(e => e.email === query_obj.email);
          if (_temp1) {
            res.send({ total: 0, data: [] });
            return;
          }
          action.action(const_env.TYPE.add, query_obj)
            .then((data) => {
              res.send(data);
              return;
            })
        })
      })

    });
  },
  patch(app) {
    app.patch(link_collection, (req, res) => {
      var query_obj = action.validateModel(req.body);
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
  }

}
