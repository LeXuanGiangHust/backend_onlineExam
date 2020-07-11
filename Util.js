var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var const_env = require('./const_env');
const url = const_env.url;
const db_name = const_env.db_name;
const typeData = const_env.TYPE_DATA;
var ObjectId = require('mongodb').ObjectId;
require('dotenv/config');
var jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
  createToken(obj) {
    let token = jwt.sign(
      {
        username: obj.username,
        password: obj.password,
        time: Date.now()
      },
      process.env.PRIVATE_KEY,
      {
        algorithm: 'HS256'
      }
    );
    return token;
  },

  async verifyToken(token) {
    let user_decode = jwt.decode(token);
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { return false; });
    if (!client) {
      return false;
    }
    try {
      const db = client.db(db_name);
      let collection = db.collection(const_env.db_collection.users);
      total = (await collection.find({
        username: user_decode.username,
        password: user_decode.password
      }).toArray());

      return total;
    } catch (err) {
      return false;
    }
  },

  async add(obj, collection_name) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }

    try {
      const db = client.db(db_name);
      let collection = db.collection(collection_name);
      let res;
      if (obj.length)
        res = await collection.insertMany(obj);
      else
        res = await collection.insertOne(obj);
      result = res.ops;
    } catch (err) {
      return {
        total: 0,
        err: err
      }
    } finally {
      client.close();
      return {
        total: result.length,
        data: result
      };
    }
  },

  async find(obj, collection_name, skip, limit) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }
    var result;
    var total = 0;
    var query = {};
    Object.keys(obj).forEach((e, i) => {
      if (e === '_id')
        query[e] = ObjectId(obj[e]);
      else if (typeof obj[e] == "string")
        query[e] = new RegExp(obj[e], 'i');
      else
        query[e] = obj[e];
    });
    try {
      const db = client.db(db_name);
      let collection = db.collection(collection_name);
      total = (await collection.find(query).toArray()).length;
      let res = await collection.find(query).skip(skip).limit(limit).toArray();
      result = res;
    } catch (err) {
      return {
        total: 0,
        err: err
      }
    } finally {
      client.close();
      return {
        total: total,
        data: result
      };
    }
  },

  async getAll(obj, collection_name) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }

    var result;
    try {
      const db = client.db(db_name);
      let collection = db.collection(collection_name);
      let res = await collection.find(obj).toArray();
      result = res;
    } catch (err) {
      return {
        err: err
      }
    } finally {
      client.close();
      return {
        data: result
      };
    }
  },

  async sort(sort_query, obj, collection_name, skip, limit) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }

    var result;
    var total = 0;
    var query = {};
    Object.keys(obj).forEach((e, i) => {
      if (e === '_id')
        query[e] = ObjectId(obj[e]);
      else
        query[e] = new RegExp(obj[e], 'i');
    })
    try {
      const db = client.db(db_name);
      let collection = db.collection(collection_name);
      total = (await collection.find(query).sort(sort_query).toArray()).length;
      let res = await collection.find(query).sort(sort_query).skip(skip).limit(limit).toArray();
      result = res;
    } catch (err) {
      return {
        total: 0,
        err: err
      }
    } finally {
      client.close();
      return {
        total: total,
        data: result
      };
    }
  },

  async delete(obj, collection_name) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }

    var result;
    try {
      const db = client.db(db_name);
      let collection = db.collection(collection_name);
      let res = await collection.deleteOne(obj);
      result = res;
    } catch (err) {
      return {
        err: err
      }
    } finally {
      client.close();
      return {
        message: 'Complete'
      };
    }
  },

  async edit(obj, collection_name) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
    if (!client) {
      return;
    }

    var result;
    try {
      const db = client.db(db_name);
      var my_query = { userId: obj.userId, fieldQuestionId: obj.fieldQuestionId };
      delete obj._id;
      delete obj.userId;
      delete obj.fieldQuestionId;

      var new_values = { $set: { ...obj } };
      let collection = db.collection(collection_name);
      let res = await collection.updateMany(my_query, new_values);
      result = res;
    } catch (err) {
      return {
        err: err
      }
    } finally {
      client.close();
      return {
        message: 'Edit Complete'
      };
    }
  },

  validateModel(query_object, schema) {
    let result = {};
    Object.keys(query_object).forEach((e) => {
      if (typeof query_object[e] == 'object') {
        result[e] = query_object[e];
      } else {

        switch (schema[e]) {
          case typeData.OBJECTID:
            result[e] = ObjectId(query_object[e]);
            break;
          case typeData.STRING:
            result[e] = query_object[e];
            break;
          case typeData.NUMBER:
            result[e] = Number(query_object[e]);
            break;
          case typeData.BOOLEAN:
            result[e] = query_object[e] == 'true' ? { $eq: true } : { $eq: false };
            break;
          case typeData.OBJECT:
            result[e] = JSON.parse(query_object[e]);
            break;
          default:
            break;
        }
      }
    });

    return result;
  },

  setupDatabase() {
    var MongoClient = require('mongodb').MongoClient;
    var url = const_env.url;
    var url_db = const_env.url_db;
    var db_name = const_env.db_name;

    // create database
    MongoClient.connect(url_db, function (err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });

    // create all collections
    Object.keys(const_env.db_collection).forEach(e => {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.createCollection(e, function (err, res) {
          if (err) throw err;
          console.log(`Collection ${e} created!`);
          db.close();
        });
      });
    });

    // create user admin
    this.find({ username: 'admin', password: '123456a@' }, const_env.db_collection.users, 0, 1)
      .then((user_admin) => {
        if (!user_admin.total) {
          this.add({
            name: 'admin',
            username: 'admin',
            password: '123456a@',
            email: 'admin0212@email.com',
            age: 18,
            role: 'admin',
            class: 'admin'
          }, const_env.db_collection.users);
        }
      })
  },

  setupStore() {
    if(!fs.existsSync(const_env.ROOT_FOLDER)){
      fs.mkdirSync(const_env.ROOT_FOLDER);
    }
  },

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
