/**
 * Created by ernestomr87@gmail.com on 10/11/2014.
 */

var tool = require("../tools");

exports.getDataInfo = function(req, res) {
  tool.getRestoreDataInfo(function(collections) {
    res.json({ res: collections });
  });
};

exports.loadData = function(req, res) {
  var dbInfo = req.body.dbInfo;

  tool.restoreCollection();
  for (var i = 0; i < dbInfo.length; i++) {
    for (var j = 0; j < dbInfo[i].cant; j++) {
      if (dbInfo[i].active) {
        var obj = tool.createMongoDbObject(tool.getRestoreData(dbInfo[i].name)[j]);
        tool.saveData(obj, dbInfo[i].name, function(err) {
          if (err) {
            return res.json({ res: false });
          } else {
            return res.json({ res: true });
          }
        });
      }
    }
  }
};

exports.loadCollection = function(req, res) {
  var collection = req.body.collection;
  tool.restoreCollection(collection.name, function(err) {
    if (err) {
      return res.json({ coll: collection, res: false });
    } else {
      return res.json({ coll: collection, res: true });
    }
  });
};

exports.removeCollection = function(req, res) {
  var collection = req.body.collection;
  tool.removeData(collection.name, function(err) {
    if (err) {
      return res.json({ coll: collection, res: false });
    } else {
      return res.json({ coll: collection, res: true });
    }
  });
};

exports.removeSession = function(req, res) {

  try {
    req.logout();
    return res.json({ res: true });
  } catch (e) {
    return res.json({ res: false });
  }


};