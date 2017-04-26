/**
 * Created by ernestomr87@gmail.com on 13/11/2015.
 */

global.conection = false;
exports.connect = function (cb) {
  var mongoose = require("mongoose");
  var mongoseServerConf = {
    auto_reconnect: true,
    poolSize: 50,
    socketOptions: {
      keepAlive: 1
    }
  };

// the application is executed on the local machine ...
  var mongoseDB = mongoose.connection;

  mongoseDB.on("connecting", function () {
    console.log("connecting to MongoDB...");
  });
  mongoseDB.on("error", function (error) {
    console.error("Error in MongoDb connection: " + error);
    global.conection = false;
    mongoose.disconnect();
  });
  mongoseDB.on("connected", function () {
    global.conection = true;
    if (cb) {
      cb(mongoose);
    }
    console.log("MongoDB connected!");
  });
  mongoseDB.once("open", function () {
    console.log("MongoDB connection opened!");
  });
  mongoseDB.on("reconnected", function () {
    console.log("MongoDB reconnected!");
  });
  mongoseDB.on("disconnected", function () {
    console.log("MongoDB disconnected!");
    mongoose.connect(global.config.mongoUrl, {server: mongoseServerConf});
  });

  mongoose.connect(global.config.mongoUrl, {server: mongoseServerConf});


  global.db = {
    mongoose: mongoose,
    Configurations: require("./../core/App/models/configurationModel")(mongoose),
    Currencies: require("./../core/App/models/currencyModel")(mongoose),
    Equipments: require("./../core/App/models/equipmentModel")(mongoose),
    Events: require("./../core/App/models/eventModel")(mongoose),
    IsoFields: require("./../core/App/models/isoFieldModel")(mongoose),
    Landings: require("./../core/App/models/landingModel")(mongoose),
    Languages: require("./../core/App/models/languageModel")(mongoose),
    Localizations: require("./../core/App/models/localizationModel")(mongoose),
    Mails: require("./../core/App/models/mailModel")(mongoose),
    Medias: require("./../core/App/models/mediaModel")(mongoose),
    Messages: require("./../core/App/models/messageModel")(mongoose),
    Notifications: require("./../core/App/models/notificationModel")(mongoose),
    Offers: require("./../core/App/models/offerModel")(mongoose),
    Particulars: require("./../core/App/models/particularModel")(mongoose),
    Requests: require("./../core/App/models/requestModel")(mongoose),
    Ships: require("./../core/App/models/shipModel")(mongoose),
    Subscriptions: require("./../core/App/models/subscriptionModel")(mongoose),
    Tags: require("./../core/App/models/tagModel")(mongoose),
    Texts: require("./../core/App/models/textModel")(mongoose),
    Users: require("./../core/App/models/userModel")(mongoose),
    pageMedias: require("./../core/App/models/pageMedia")(mongoose),
    shipTypes: require("./../core/App/models/shipTypeModel")(mongoose)
  };
};
