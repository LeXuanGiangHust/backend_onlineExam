var Util = require('../Util');
var const_env = require('../const_env');
const collection_name = const_env.db_collection.roles;
// const url = const_env.url;
// const db_name = const_env.db_name;
const schema = require('../models/role');
const type = const_env.TYPE_DATA;

module.exports = {
  async action(type, obj, skip, limit, sort_query) {
    var result;
    switch (type) {
      case const_env.TYPE.find:
        result = await Util.find(obj, collection_name, skip ? skip : const_env.skip, limit ? limit : const_env.limit);
        break;
      case const_env.TYPE.sort:
        result = await Util.sort(sort_query, obj, collection_name, skip ? skip : const_env.skip, limit ? limit : const_env.limit);
        break;
      case const_env.TYPE.add:
        result = await Util.add(obj, collection_name);
        break;
      case const_env.TYPE.delete:
        result = await Util.delete(obj, collection_name);
        break;
      case const_env.TYPE.edit:
        result = await Util.edit(obj, collection_name);
        break;
      default: break;
    }
    return result;
  },

  validateModel(query_object) {
    return Util.validateModel(query_object, schema);
  }
}