/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 8/4/2016.
 */
var textViewModel = require("../viewModels/textViewModel");
exports.our_shipsFunctions = function (culture, cb) {
  textViewModel.getByGroupArray(culture, ["general", "slugs"], function (err, text) {
    if (!err) {
      cb(false, text);
    } else {
      cb(err, false);
    }
  });
};