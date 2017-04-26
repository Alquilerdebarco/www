/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 14/2/2016.
 */
var textViewModel = require("../viewModels/textViewModel");
exports.rentFunctions = function (culture, cb) {
  textViewModel.getByGroupArray(culture, ["general", "rent-ship", "rent_private", "rent_enterprise","slugs"], function (err, text) {
    if (!err) {
      cb(false, text);
    } else {
      cb(err, false);
    }
  });
};