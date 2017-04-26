/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 12/2/2016.
 */
var textViewModel = require("../viewModels/textViewModel");
exports.conditionsFunction = function (culture, cb) {

  textViewModel.getByGroupArray(culture, ["general", "service-conditions", "slugs","frequently-questions"], function (err, text) {
    if (!err) {
      cb(false, text);
    } else {
      cb(err, false);
    }
  });
};
