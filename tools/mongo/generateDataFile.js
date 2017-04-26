/**
 * Created by jeandy.bryan@isofact.com on 11/10/2014.
 */
var exec = require("child_process");
var fs = require("fs");
var util = require("util");

var config = {
  host: "127.0.0.1",
  port: "27017",
  dataBase: "AlquilerDeBarcos",
  collectionList: [
    "configurations",
    "equipment",
    "isofields",
    "landings",
    "languages",
    "localizations",
    "media",
    "notifications",
    "pagemedias",
    "ships",
    "shiptypes",
    "texts",
    "users",
    "currencies"
  ],
  compress: false
};

function generateDataFile(collectionList, pos, data, cb) {
  if (collectionList.length == pos) {
    data.end("}");
    for (var i = 0; i < collectionList.length; i++) {
      fs.unlinkSync(collectionList[i] + ".tmp");
    }

    cb(true);

  } else {
    var mongoexportArgs = util.format("mongoexport -h %s --port %s -d %s --jsonArray -c %s -o %s.tmp",
      config.host,
      config.port,
      config.dataBase,
      collectionList[pos],
      collectionList[pos]);
    console.log(mongoexportArgs);
    exec.exec(mongoexportArgs,
      function(error, stdout, stderr) {
        if (error) {
          console.log(error);
        }
        if (stdout) {
          console.log(stdout);
          var fileName = collectionList[pos] + ".tmp";
          var newFile = fs.createReadStream(fileName);
          data.write(collectionList[pos] + ":", function() {
            newFile.pipe(data, { end: false });
            newFile.on("end", function() {
              if (pos == collectionList.length - 1) {
                generateDataFile(collectionList, pos + 1, data, cb);
              } else
                data.write(",", function() {
                  generateDataFile(collectionList, pos + 1, data, cb);
                });
            });
          });
        }
        if (stderr) {
          console.log(stderr);
        }
      });
  }
}

fs.writeFileSync("data.js", "exports.data={");
var data = fs.createWriteStream("data.js", {
  flags: "r+",
  start: 14
});
generateDataFile(config.collectionList, 0, data, function() {
  console.log("finish");
});