/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 12/2/2016.
 */

//var PATH_ROUTE = '/:culture/seafarer-guide';
var textViewModel = require("../viewModels/textViewModel");
exports.frequentlyQuestionsFunctions = function (culture,cb) {
  textViewModel.getByGroupArray(culture, ["general", "frequently-questions","slugs"], function (err, text) {
    if (!err) {
      cb(false,text);
    }else{
      cb(err,false);
    }
  });
};
