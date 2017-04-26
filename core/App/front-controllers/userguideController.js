/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com>
 on 05/02/2016.
 */
var textViewModel = require("../viewModels/textViewModel");
var pageMediaViewModel = require("../viewModels/pageMediaViewModel");
var async = require("async");
exports.userFunctions = function (culture,cb) {
  async.parallel([
    function (callback) {
      textViewModel.getByGroupArray(culture, ["general", "user-guide", "slugs", "frequently-questions"], function (err, text) {
        if (!err) {
          callback(false, text);
        } else {
          callback(err, false);
        }
      });
    },
    function (callback) {
      pageMediaViewModel.getPhotos("user-guide", function (err, success) {
        if (!err) {
          callback(false, success ? success._doc.photos : []);
        } else {
          callback(err, false);
        }
      });
    }
  ], function (err, results) {
    if (err || !results) {
      cb(err, false);
    } else {
      cb(null, results);
    }
  });

};