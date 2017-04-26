/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 12/5/2016.
 */

var textViewModel = require("../viewModels/textViewModel");
var suscriptionViewModel = require("../viewModels/subscriptionViewModel");
exports.newsletterFunction = function (culture,token,coin, cb) {

  textViewModel.getByGroupArray(culture, ["general", "newsletter", "slugs","frequently-questions"], function (err, text) {
    if (!err && text) {
      suscriptionViewModel.getbyToken(token, function(err,susc){
        if(err || !susc){
          cb(err,false);
        }else{
          var suscrip = {
            text:text,
            susc:susc
          };
          cb(false,suscrip);
        }
      });
    }else{
      cb(err,false);
    }
  });
};