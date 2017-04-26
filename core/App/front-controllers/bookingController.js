/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 11/5/2016.
 */

var textViewModel = require("../viewModels/textViewModel");
var offerViewModel = require("../viewModels/offerViewModel");
var engineViewModel = require("../viewModels/engineViewModel");
var _ = require("lodash");
exports.bookingFunctions = function(culture, token, coin, cb) {
  textViewModel.getByGroupArray(culture, ["general", "slugs", "ship-details"], function(err, text) {
    if (!err && text) {
      offerViewModel.getFront(token, culture, coin, function(err, book) {
        if (err || !book) {
          cb(err, false);
        } else {
          if (!_.isEmpty(book.request)) {
            engineViewModel.prepareRedsys(book, function(err, data) {
              var booking;
              if (err) {
                booking = {
                  text: text,
                  book: book
                };
              } else {
                booking = {
                  text: text,
                  book: book,
                  redsys: data
                };
              }
              cb(false, booking);
            });
          } else {
            cb(false, false);
          }

        }
      });
    } else {
      cb(err, false);
    }
  });
};