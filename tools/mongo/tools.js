/**
 * Created by jeandy.bryan@isofact.com on 11/10/2014.
 */
var mongo = require("mongodb");
var restoreData = require("./data.js").data;
var util = require("util");
var traverse = require("traverse");

exports.getRestoreDataInfo = function(cb) {
  var resp = [];
  var pos = 0;
  for (collection in restoreData) {
    if (restoreData.hasOwnProperty(collection)) {
      resp[pos] = {
        name: collection,
        cant: restoreData[collection].length
      };
      pos++;
    }
  };
  if (cb) cb(resp);
};
exports.getRestoreData = function(collection) {
  return restoreData[collection];
};

exports.restoreCollection = function(collectionName, cb) {
  if (restoreData[collectionName]) {
    for (var i = 0; i < restoreData[collectionName].length; i++) {
      restoreData[collectionName][i] = exports.createMongoDbObject(restoreData[collectionName][i]);
    }

    mongo.MongoClient.connect(global.config.mongoUrl, function(err, db) {
      if (err) {
        cb(err, null);
      } else {
        console.log(collectionName);
        var collection = db
          .collection(collectionName);
        collection.insert(restoreData[collectionName], function(err, docs) {
          db.close(true, function() {
            if (err) {
              cb(err, null);
              console.log(err);
            } else {
              cb(null, docs);
            }
          });
        });
      }
    });
  } else {
    cb(err, null);
  }
};
exports.saveData = function(data, collectionName, cb) {

  mongo.MongoClient.connect(global.config.mongoUrl, function(err, db) {
    if (err) {
      cb(err, null);
    } else {
      var collection = db.collection(collectionName);
      collection.insert(data, function(err, docs) {
        db.close(true, function() {
          if (err) {
            cb(err, null);
          } else {
            cb(null, docs);
          }
        });
      });
    }
  });
};
exports.removeData = function(collectionName, cb) {
  mongo.MongoClient.connect(global.config.mongoUrl, function(err, db) {
    if (err) {
      cb(err, null);
    } else {
      db.dropCollection(collectionName, function(err, docs) {
        db.close(true, function() {
          if (err) {
            cb(err, null);
          } else {
            cb(null, docs);
          }
        });


      });
    }
  });
};
exports.oldcreateMongoDbObject = function(source, result) {
  if (result === undefined)
    result = {};

  for (field in source) {
    if (source.hasOwnProperty(field)) {

      if (util.isArray(source[field])) {
        result[field] = [];
        for (var i = 0; i < source[field].length; i++) {
          result[field][i] = source[field][i];
        }
      } else if (typeof source[field] == "object") {

        var BJson = convertToBSONPrimitiveField(source[field]);

        if (BJson) {
          result[field] = BJson;
        } else {
          result[field] = exports.createMongoDbObject(source[field], result[field]);
        }
      } else {
        result[field] = source[field];
      }
    }
  }
  return result;
};

function convertToBSONPrimitiveField(field) {

  if (field == null) {
    return null;
  }
  if (field.$oid !== undefined) {
    if (field.$oid == null) {
      console.log("asdasd");
    }
    return new mongo.ObjectID(field.$oid);
  } else if (field.$date !== undefined) {
    return new Date(field.$date);
  } else if (field.$binary !== undefined) {
    var buffer = new
      Buffer(field.$binary, "base64");
    return new mongo.Binary(buffer);
  } else if (field.$numberLong !== undefined) {
    return new mongo.Long(field.$numberLong);
  } else {
    return null;
  }
};

exports.createMongoDbObject = function(obj) {
  traverse(obj).forEach(function(x) {
    if (typeof x == "object") {
      var result = convertToBSONPrimitiveField(x);
      if (result) {
        this.update(result, true);
      }
    }
  });
  return obj;
};