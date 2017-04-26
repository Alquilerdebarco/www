var express = require("express");
var app = express();
var debug = require("debug")("http");

require("./config");
require("./config/dbConnection").connect();
require("./config/express").configExpress(app);
require("./core/middlewares/logging").configPassport(app);
require("./core/App/utils/scheduled").checkOffers();
//  require('./core/App/utils/scheduled').checkMails(app);
require("./core/routes/routes").configRoutes(app);


// db.Configurations.findOne()
//   .select("general.timeZone")
//   .exec(function (err, conf) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       if (conf.general.timeZone) {
//         var tz = conf.general.timeZone;
//         tz = tz.split(")");
//         global.config.timezone = tz[0].replace("(UTC", "");
//       }
//     }
//   });

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use(function (err, req, res) {
    res.status(err || 500);
    console.log(err.message);
    res.render("common/error", {
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render("common/error", {
    message: err.message,
    error: {}
  });
});

app.set("port", global.config.server.port);
app.set("ip", global.config.server.host);

app.listen(app.get("port"), app.get("ip"), function () {
  debug("Listening on ");
  console.warn("Listening on port %d", app.get("port"));
});