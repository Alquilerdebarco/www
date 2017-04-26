var loadData = require("./tools.js");
loadData.getRestoreDataInfo(function(dbInfo) {
  for (var i = 0; i < dbInfo.length; i++) {
    for (var j = 0; j < dbInfo[i].cant; j++) {
      var obj = loadData.getRestoreData(dbInfo[i].name)[j];
      loadData.testcreateMongoDbObject(obj);
      console.log(obj);
      loadData.saveData(obj, dbInfo[i].name, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("ok");
        }
      });
    }
  }
});