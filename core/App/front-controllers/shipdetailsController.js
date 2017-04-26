/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com>
 on 05/02/2016.
 */
var textViewModel = require("../viewModels/textViewModel");
var shipModelView = require("../viewModels/shipViewModel");
var configurationView = require("../viewModels/configurationViewModel");
exports.shipFunctions = function (culture, slug, xp, coin, cb) {
  shipModelView.getBySlug(culture, slug, coin,xp, function (err, ship, recomendations) {
    if (err || !ship) {
      cb(err, false);
    } else {
      textViewModel.getByGroupArray(culture, ["general", "ship-details", "slugs"], function (err, text) {
        if (err || !text) {
          cb(err, false);
        }
        else {
          configurationView.getXpbySlug(xp, culture, function (err, xp_ship) {
            if (err || !xp_ship) {
              cb(err, false);
            } else {
              ship.xp = xp_ship;
              var array = {
                ship: ship,
                recomend: recomendations,
                text: text
              };
              cb(false, array);
            }
          });
        }
      });
    }
  });

};
