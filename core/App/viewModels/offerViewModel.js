/**
 * Created by ernestomr87@gmail.com on 2/26/2016.
 */

var async = require("async");
var uuid = require("node-uuid");
var validator = require("validator");
var currencyFormatter = require("currency-formatter");
var format = {
  symbol: "",
  decimal: ",",
  thousand: ".",
  precision: 2,
  format: "%v %s" // %s is the symbol and %v is the value
};
var shipViewModel = require("../viewModels/shipViewModel");
var notificationViewModel = require("../viewModels/notificationViewModel");
var languageView = require("../viewModels/languageViewModel");
var entity = "offer";


var validateObject = function (object) {
  var today = new Date();
  today = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (!validator.isAlphanumeric(object.request)) {
    return false;
  }
  if (!validator.isEmail(object.email)) {
    return false;
  }
  if (!validator.isAlphanumeric(object.ship)) {
    return false;
  }
  if (!validator.isInt(object.duration.unity) || object.duration.unity < 0) {
    return false;
  }
  if (!validator.isInt(object.duration.quantity) || object.duration.quantity < 1) {
    return false;
  }
  if (!validator.isBoolean(object.patron)) {
    return false;
  }
  object.discount = validator.toFloat(object.discount);
  if (object.discount > 100 || object.discount < 0) {
    return false;
  }
  object.pricePatron = validator.toFloat(object.pricePatron);
  if (object.pricePatron < 0) {
    return false;
  }
  object.priceRent = validator.toFloat(object.priceRent);
  if (object.priceRent < 0) {
    return false;
  }
  object.price = validator.toFloat(object.price);
  if (object.price < 0) {
    return false;
  }
  object.percentage = validator.toFloat(object.percentage);
  if (object.percentage > 100 || object.percentage < 0) {
    return false;
  }
  if (!validator.isLength(object.request, 6)) {
    return false;
  }

  if (!validator.isDate(object.bookDate)) {
    return false;
  }
  if (today > object.bookDate) {
    return false;
  }
  if (!validator.isInt(object.numPas || object.numPas < 0)) {
    return false;
  }
  return true;
};

function formatOffers(offers, iso, cb) {
  languageView.getLanguageByISO(iso, function (err, lang) {
    if (err || !lang) {
      cb(err, false);
    } else {
      async.map(offers, function (offer, callback) {
        async.waterfall([
          function (cbw) {
            offer._doc.createDate = (new Date(offer._doc.createDate)).getTime();
            offer._doc.bookDate = (new Date(offer._doc.bookDate)).getTime();

            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

            if (offer._doc.bookDate <= today) {
              offer._doc.expire = true;
            } else {
              offer._doc.expire = false;
            }
            cbw(null, offer);
          },
          function (off, cbw) {
            shipViewModel.get(iso, off._doc.ship, function (err, ship) {
              if (err || !ship) {
                callback(err, ship);
              } else {
                off._doc.ship = ship;
                cbw(null, off);
              }
            });
          },
          function (off, cbw) {
            db.shipTypes.findOne({
              _id: off._doc.ship._doc.shipType
            })
              .populate({
                path: "name",
                select: "value",
                match: {
                  language: lang._doc._id
                }

              })
              .exec(function (err, st) {
                off._doc.ship._doc.shipType = st;
                cbw(null, off);
              });
          },
        ], function (err, result) {
          callback(err, result);
        });
      }, function (err, result) {
        cb(err, result);
      });
    }
  });
}

function formatOffersAux(offers, iso, cb) {
  languageView.getLanguageByISO(iso, function (err, lang) {
    if (err || !lang) {
      cb(err, false);
    } else {
      async.map(offers, function (offer, callback) {
        async.waterfall([
          function (cbw) {
            offer.createDate = (new Date(offer.createDate)).getTime();
            offer.bookDate = (new Date(offer.bookDate)).getTime();

            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

            if (offer.bookDate <= today) {
              offer.expire = true;
            } else {
              offer.expire = false;
            }
            cbw(null, offer);
          },
          function (off, cbw) {
            shipViewModel.get(iso, off.ship, function (err, ship) {
              if (err || !ship) {
                callback(err, ship);
              } else {
                ship._doc.conditions.bail = formatNumber(ship._doc.conditions.bail);
                off.ship = ship;
                cbw(null, off);
              }
            });
          },
          function (off, cbw) {
            db.shipTypes.findOne({
              _id: off.ship._doc.shipType
            })
              .populate({
                path: "name",
                select: "value",
                match: {
                  language: lang._doc._id
                }

              })
              .exec(function (err, st) {
                off.ship._doc.shipType = st;
                cbw(null, off);
              });
          },
        ], function (err, result) {
          callback(err, result);
        });
      }, function (err, result) {
        cb(err, result);
      });
    }
  });
}

function formatNumber(num) {
  num = num.toString();
  //num = num.replace('.', '');
  num = num.toString();
  num = num.replace(",", ".");
  num = currencyFormatter.format(num, format).trim();
  return num;

}

function getIsoByUser(id, cb) {
  db.Users.findOne({
    _id: id
  }).populate("language").exec(function (err, user) {
    if (err || !user) {
      cb(err, user);
    } else {
      cb(null, user);
    }
  });
}

var offerFunctions = {
  create: function (offer, user, cb) {
    offer.bookDate = new Date(offer.bookDate.year, offer.bookDate.month, offer.bookDate.day);
    async.parallel([
      function (cbp) {
        db.Requests.findOne({
          _id: offer.request
        })
          .populate("language")
          .exec(function (err, req) {
            cbp(err, req);
          });
      },
      function (cbp) {
        if (validateObject(offer)) {
          var value = offer;
          db.Ships.findOne({
            _id: value.ship
          }).exec(function (err, ship) {
            if (err || !ship) {
              cbp(err, ship);
            } else {
              var aux = {
                value: value,
                ship: ship
              };
              cbp(err, aux);
            }

          });
        } else {
          var error = {
            message: "Lo sentimos!. Formulario incorrecto."
          };
          cb(error, null);
        }
      }
    ], function (err, result) {
      if (err || !result) {
        cb(err, result);
      } else {
        db.Offers.find({}, {index: 1}).sort({index: -1}).limit(1).exec(function (err, index) {
          if (err || !index) {
            cb(err, index);
          } else {
            var request = result[0];
            var value = result[1].value;
            var ship = result[1].ship;

            var price = (value.pricePatron + value.priceRent) - (((value.pricePatron + value.priceRent) * value.discount) / 100);
            var firstPrice = price * value.percentage / 100;
            var secondPrice = price - firstPrice;

            var off = db.Offers({
              index: index[0] ? index[0].index + 1 : 1,
              token: uuid.v4(),
              request: value.request,
              email: value.email,
              shipowner: ship._doc.user,
              ship: ship._doc._id,
              experience: value.experience,
              duration: {
                unity: value.duration.unity,
                quantity: value.duration.quantity
              },
              patron: value.patron,
              discount: value.discount,
              pricePatron: value.pricePatron,
              priceRent: value.priceRent,
              price: price,
              firstPrice: firstPrice,
              secondPrice: secondPrice,
              percentage: value.percentage,
              conditions: value.conditions,
              bookDate: value.bookDate,
              numPas: value.numPas,
              secondPayment: ship.conditions.secondPayment,
              refund: ship.conditions.refund,
              language: request._doc.language._doc._id,
              conversation: {
                client: {
                  email: value.email,
                  text: request._doc.message,
                  date: request._doc.createDate
                },
                owner: {
                  text: value.conditions
                }
              }
            });
            if (request.client) off.client = request.client;
            off.save(function (err, r) {
              cb(err, r);
              db.Offers.find({
                _id: r._doc._id
              })
                .populate("shipowner ship request")
                .exec(function (err, off) {
                  async.parallel([
                    function (cbp) {
                      formatOffers(off, request._doc.language._doc.iso, function (err, req) {
                        if (err || !req) {
                          cbp(err, off);
                        } else {
                          notificationViewModel.sendMailUserOffer(request._doc.language._doc.iso, off[0], function (err, success) {
                            cbp(err, success);
                          });
                        }
                      });
                    },
                    function (cbp) {
                      getIsoByUser(off[0]._doc.shipowner._doc._id, function (err, user) {
                        if (err || !user) {
                          cbp(err, user);
                        } else {
                          formatOffers(off, user.language.iso, function (err, req) {
                            if (err || !req) {
                              cbp(err, req[0]);
                            } else {
                              notificationViewModel.sendMailOwnerOffer(user.language._doc._id, off[0], function (err, success) {
                                cbp(err, success);
                              });
                            }
                          });
                        }
                      });
                    }
                  ], function (err, result) {
                    console.log(err, result);
                  });
                });
            });
          }
        });
      }
    });
  },
  get: function (token, iso, cb) {
    db.Offers.findOne({
      token: token
    })
      .populate("shipowner ship request")
      .exec(function (err, offer) {
        if (err || !offer) {
          cb(err, offer);
        } else {
          var offers = [];
          offers.push(offer);
          formatOffers(offers, iso, function (err, offers) {
            offers[0]._doc.password = null;
            cb(err, offers[0]);
          });
        }
      });
  },
  getFront: function (token, iso, coin, cb) {
    if (!coin)
      coin = {
        price: 1,
        symbol: "€"
      };
    db.Offers.findOne({
      token: token,
      status: "send"
    })
      .populate("shipowner ship request")
      .exec(function (err, offer) {
        if (err || !offer) {
          cb(err, offer);
        } else {
          // cb(err, );
          offer = JSON.parse(JSON.stringify(offer));

          offer.priceTotal = offer.priceRent + offer.pricePatron;
          offer.priceTotal = formatNumber(offer.priceTotal);

          offer.price *= coin.price;
          offer.price = formatNumber(offer.price);

          offer.firstPrice = formatNumber(offer.firstPrice);

          offer.pricePatron = formatNumber(offer.pricePatron);

          offer.priceRent *= coin.price;
          offer.priceRent = formatNumber(offer.priceRent);


          var offers = [];

          offers.push(offer);
          formatOffersAux(offers, iso, function (err, offers) {
            offers[0].password = null;
            cb(err, offers[0]);
          });

          // payment.generateTPVFormDiferido(offer.price, offer.ship.name, function (err, success) {
          //     if (err || !success) {
          //         cb(err, success);
          //     }
          //     else {
          //         //offer.tpv = success;
          //
          //
          //
          //     }
          // });


        }
      });
  },
  getRefund: function (token, iso, coin, cb) {
    if (!coin)
      coin = {
        price: 1,
        symbol: "€"
      };
    db.Offers.findOne({
      token: token,
      status: "accept"
    })
      .populate("shipowner ship request")
      .exec(function (err, offer) {
        if (err || !offer) {
          cb(err, offer);
        } else {
          offer.price *= coin.price;
          offer.pricePatron *= coin.price;
          offer.priceRent *= coin.price;
          var offers = [];
          offers.push(offer);
          formatOffers(offers, iso, function (err, offers) {
            offers[0]._doc.password = null;
            cb(err, offers[0]);
          });
        }
      });
  },
  listOwner: function (limit, skip, request, status, user, cb) {
    var query = {};
    if (user.permissions.isShipOwner) {
      query.shipowner = user._id;
    }
    if (request) {
      query.request = request;
    }
    if (status) {
      query.status = status;
    }
    async.parallel([
      function (callback) {
        db.Offers.count(query).exec(function (err, count) {
          callback(err, count);
        });

      },
      function (callback) {
        db.Offers.find(query)
          .populate("shipowner")
          .sort({
            createDate: -1
          }).limit(limit).skip(skip).exec(function (err, data) {
          if (err || !data) {
            callback(err, data);
          } else {
            getIsoByUser(user._id, function (err, userDoc) {
              if (err || !userDoc) {
                cb(err, userDoc);
              } else {
                formatOffers(data, user.language.iso, function (err, offers) {
                  callback(err, offers);
                });
              }
            });
          }
        });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        cb(null, results[1], results[0]);
      }
    });
  },

  delete: function (id, user, cb) {
    var query = {
      _id: id
    };
    if (!user.permissions.isAdmin && user.permissions.isShipOwner) {
      query.shipowner = user._id;
    }
    db.Offers.remove(query).exec(function (err, offer) {
      cb(err, offer);
    });
  },

  update: function (id, sale, cb) {
    db.Offers.findOne({
      _id: id,
      status: {
        $ne: "cancel"
      }
    })
      .exec(function (err, offer) {
        if (err || !offer) {
          cb(err, offer);
        } else {
          db.Offers.update({
            _id: id,
          }, {
            $push: {
              sale: sale
            }
          }).exec(function (err, success) {
            cb(err, success);
          });
        }
      });
  },
};

module.exports = offerFunctions;