/**
 * Created by ernestomr87@gmail.com on 3/10/2016.
 */


var async = require("async");
var _ = require("lodash");
var urlUtil = require("url");
var shipViewModel = require("../viewModels/shipViewModel");
var configurationViewModel = require("../viewModels/configurationViewModel");
var offerViewModel = require("../viewModels/offerViewModel");
var payments = require("../utils/payments");
var utils = require("../utils/functions");
var uuid = require("node-uuid");

var Sermepa = require("../utils/redsys/lib/apiBabel");
var uris = {
  real: "https://sis.redsys.es/sis/realizarPago",
  test: "https://sis-t.redsys.es:25443/sis/realizarPago"
};

var notificationViewModel = require("./notificationViewModel");
var entity = "book";

var errorPage = "/es/estado-reserva";
var unavailablePage = "/es/estado-reserva?code=3";
var successPage = "/es/estado-reserva?code=2";
var connectionPage = "/es/estado-reserva?code=1";


function matchCalendarBlock(a, b, c, d) {
  if (c < a && a < d) {
    return true;
  }
  if (c < b && b < d) {
    return true;
  }
  if (a < c && c < b) {
    return true;
  }
  if (a < d && d < b) {
    return true;
  }
  if (a.getTime() == c.getTime() && b.getTime() == d.getTime()) {
    return true;
  }
  return false;
}
function dontExistEvents(array, event) {
  if (array.length) {
    for (var i = 0; i < array.length; i++) {
      var start = new Date(array[i].start);
      var end = new Date(array[i].end);
      var eventEnd = event.end;

      if (matchCalendarBlock(start, end, event.start, eventEnd)) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
}
function formatOffers(offers, user, cb) {
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
        shipViewModel.get(user.language.iso, off._doc.ship, function (err, ship) {
          if (err || !ship) {
            callback(err, ship);
          } else {
            off._doc.ship = ship;
            cbw(null, off);
          }
        });
      },
      function (off, cbw) {
        configurationViewModel.getExperience(off._doc.experience, function (err, xp) {
          if (err) {
            cbw(err, null);
          }
          else {
            off._doc.experience = xp;
            cbw(null, off);
          }
        });

      }
    ], function (err, result) {
      callback(err, result);
    });
  }, function (err, result) {
    cb(err, result);
  });
}
function getShip(iso, id, cb) {
  db.Languages.findOne({
    iso: iso
  }).exec(function (err, lang) {
    if (err || !lang) {
      cb(err, lang);
    } else {
      db.Ships.findOne({
        _id: id
      })
        .populate({
          path: "title",
          select: "value",
          match: {
            language: lang._doc._id
          },
        })
        .populate({
          path: "description",
          select: "value",
          match: {
            language: lang._doc._id
          }

        }).exec(function (err, shipDoc) {
        cb(err, shipDoc);
      });
    }
  });
}
function executeRefund(offer, cb) {

  var total = (offer.price * offer.percentage) / 100;
  var refundPercentage = offer._doc.ship._doc.conditions.refund.percentage;
  total = (offer.price * refundPercentage) / 100;

  if (offer.sale.method == "paypal") {
    payments.paypalRefund(total, offer.sale.receipt, function (data) {
      if (data) {
        cb(null, data);
      } else {
        cb(null, false);
      }
    });
  } else {

    var form_data = payments.generateTPVFormRefun(restC._doc.payment.total, "Refund", restC._doc.payment.receipt);

    payments.postRefund(form_data, function (err, body) {
      cb(err, body);
    });
  }
}
function orderInvoice(list, sort, field) {
  if (sort > 0) {
    for (var i = 0; i < list.length - 1; i++) {
      for (var j = i + 1; j < list.length; j++) {
        var st = "list[" + i + "]." + field;
        var st1 = "list[" + j + "]." + field;
        if (eval(st) > eval(st1)) {
          var aux = list[i];
          list[i] = list[j];
          list[j] = aux;
        }
      }
    }
  }
  else {
    for (var i = 0; i < list.length - 1; i++) {
      for (var j = i + 1; j < list.length; j++) {
        var st = "list[" + i + "]." + field;
        var st1 = "list[" + j + "]." + field;
        if (eval(st) < eval(st1)) {
          var aux = list[i];
          list[i] = list[j];
          list[j] = aux;
        }
      }
    }
  }
  return list;
}
function findOfferbyQuery(aux, user, query, limit, skip, order, callback) {
  var sort = {};
  order = JSON.parse(order);
  if (sort.field !== 'request.name' && sort.field !== 'shipowner.name') sort[order.field] = order.sort;


  if (!user.permissions.isAdmin) {
    if (user.permissions.isShipOwner) {
      query.shipowner = user._id;
    }
    else {
      query.client = user._id;
    }
  }

  db.Offers.find(query)
    .sort(sort).limit(limit).skip(skip)
    .populate("client shipowner ship request")
    .exec(function (err, success) {
      if (err || !success) {
        callback(err, success);
      } else {
        if (success.length) {
          formatOffers(success, user, function (err, offers) {
            if (err || !offers) {
              callback(err, null);
            } else {
              var total = 0;
              for (var i = 0; i < offers.length; i++) {
                var gain = ((offers[i].price * offers[i].percentage) / 100);
                gain = gain - ((offers[i].price * offers[i].discount) / 100);
                gain = gain - ((offers[i].price * 20) / 100);

                if (offers[i]._doc.status === "refund") {
                  gain = gain - ((gain * offers[i].refundPercentage) / 100);
                }
                total += gain;
                offers[i]._doc.gain = gain;
              }

              aux = JSON.parse(JSON.stringify(aux));
              aux.total = total;

              if (order.field === 'request.name' || order.field === 'shipowner.name') {
                aux.list = orderInvoice(offers, order.sort, order.field);
              }
              else {
                aux.list = offers;
              }
              callback(err, aux);
            }
          });
        } else {
          callback(err, aux);
        }
      }
    });
}
var engineFunctions = {
  book: function (iso, offer, method, cb) {
    db.Offers.findOne({
      _id: offer
    })
      .populate("request shipowner ship")
      .exec(function (err, offerData) {
        if (err || !offerData) {
          var url = urlUtil.resolve("/", errorPage);
          cb(null, false, url);
        } else {
          if (offerData.status == "send" || (offerData.status == "accept" && offerData.secondPayment != "0" && offerData.secondPayment != "5")) {
            var price = 0;
            if (offerData.status == "accept") {
              price = offerData._doc.secondPrice;
            } else {
              price = offerData._doc.firstPrice;
            }
            var tempPrice = price.toFixed(2);

            if (global.config.production) {
              getShip(iso, offerData._doc.ship._id, function (err, shipDoc) {
                var data = {
                  name: shipDoc._doc.name,
                  price: tempPrice
                };
                payments.preparePayment(data, function (err, pay) {
                  var payment = pay;
                  payments.payWithPaypal(payment, function (success, url) {
                    if (!success) {
                      cb(true, success, url);
                    } else {
                      var sale = {
                        paymentId: success,
                        method: method
                      };

                      offerViewModel.update(offer, sale, function (err, success) {
                        if (err || !success) {
                          var aux = urlUtil.resolve("/", errorPage);
                          cb(null, false, aux);
                        } else {
                          //var url = urlUtil.resolve("/", "service/engine/return");
                          cb(null, false, url);
                        }
                      });
                    }

                  });
                });

              });
            } else {
              var url = urlUtil.resolve("/", "service/engine/return");
              cb(null, false, url);
            }
          } else {
            var url = urlUtil.resolve("/", errorPage);
            cb(null, false, url);
          }
        }
      });
  },

  return: function (iso, offer, method, payerId, paymentId, token, cb) {
    try {
      db.Offers.findOne({
        _id: offer
      })
        .populate("request shipowner ship")
        .exec(function (err, offerData) {
          if (err || !offerData) {
            var url = urlUtil.resolve("/", errorPage);
            cb(null, false, url);
          } else {
            if (offerData.status == "send" || (offerData.status == "accept" && offerData.secondPayment != "0" && offerData.secondPayment != "5")) {
              if (offerData.status == "accept") {
                if (global.config.production) {
                  offerData._doc.sale[0]._doc.PayerID = payerId;
                  offerData._doc.sale[0]._doc.paymentId = paymentId;
                  payments.executePayWithPaypall(offerData._doc.sale[1], function (data) {
                    if (data != false) {
                      engineFunctions.saveBook(iso, offer, method, data, token, function (err, success, url) {
                        cb(null, success, url);
                      });
                    } else {
                      var url = urlUtil.resolve("/", errorPage);
                      cb(null, false, url);
                    }
                  });
                } else {
                  engineFunctions.saveBook(iso, offer, method, "saleId", utils.generateUid(), function (err, success, url) {
                    cb(null, success, url);
                  });
                }
              } else {
                engineFunctions.validateBooking(offerData._doc.ship, offerData._doc.bookDate, offerData._doc.duration, function (data) {
                  if (data) {
                    if (global.config.production) {
                      offerData._doc.sale[0]._doc.PayerID = payerId;
                      offerData._doc.sale[0]._doc.paymentId = paymentId;
                      payments.executePayWithPaypall(offerData._doc.sale[0], function (data) {
                        if (data != false) {
                          engineFunctions.saveBook(iso, offer, method, data, token, function (err, success, url) {
                            cb(null, success, url);
                          });
                        } else {
                          var url = urlUtil.resolve("/", errorPage);
                          cb(null, false, url);
                        }
                      });
                    } else {

                      engineFunctions.saveBook(iso, offer, method, "saleId", utils.generateUid(), function (err, success, url) {
                        cb(null, success, url);
                      });
                    }
                  } else {
                    var url = urlUtil.resolve("/", unavailablePage);
                    cb(null, false, url);
                  }
                });
              }
            } else {
              var url = urlUtil.resolve("/", errorPage);
              cb(null, false, url);
            }

          }
        });
    } catch (err) {
      var url = urlUtil.resolve("/", errorPage);
      cb(null, false, url);
    }
  },

  returnRedsys: function (iso, offer, method, dsMerchantParameters, dsSignature, dsSignatureVersion, cb) {
    try {
      db.Offers.findOne({
        _id: offer
      })
        .populate("request shipowner ship")
        .exec(function (err, offerData) {
          var url;
          if (err || !offerData) {
            url = urlUtil.resolve("/", errorPage);
            cb(null, false, url);
          } else {
            if (offerData.status == "send" || (offerData.status == "accept" && offerData.secondPayment != "0" && offerData.secondPayment != "5")) {
              if (offerData.status == "accept") {
                if (global.config.production) {
                  var aux;
                  if (!offerData._doc.sale.length) {
                    aux = {
                      dsMerchantParameters: dsMerchantParameters,
                      dsSignature: dsSignature,
                      dsSignatureVersion: dsSignatureVersion
                    };
                    offerData._doc.sale.push(aux);
                  }

                  engineFunctions.saveBook(iso, offer, method, data, utils.generateUid(), function (err, success, url) {
                    cb(null, success, url);
                  });
                } else {
                  engineFunctions.saveBook(iso, offer, method, "saleId", utils.generateUid(), function (err, success, url) {
                    cb(null, success, url);
                  });
                }
              } else {
                engineFunctions.validateBooking(offerData._doc.ship, offerData._doc.bookDate, offerData._doc.duration, function (data) {
                  if (data) {
                    if (global.config.production) {
                      var aux;
                      if (!offerData._doc.sale.length) {
                        aux = {
                          dsMerchantParameters: dsMerchantParameters,
                          dsSignature: dsSignature,
                          dsSignatureVersion: dsSignatureVersion
                        };
                        offerData._doc.sale.push(aux);
                      }

                      engineFunctions.saveBook(iso, offer, method, data, utils.generateUid(), function (err, success, url) {
                        cb(null, success, url);
                      });

                    } else {
                      engineFunctions.saveBook(iso, offer, method, "saleId", utils.generateUid(), function (err, success, url) {
                        cb(null, success, url);
                      });
                    }
                  } else {
                    var url = urlUtil.resolve("/", unavailablePage);
                    cb(null, false, url);
                  }
                });
              }
            } else {
              url = urlUtil.resolve("/", errorPage);
              cb(null, false, url);
            }
          }
        });
    } catch (err) {
      var url = urlUtil.resolve("/", errorPage);
      cb(null, false, url);
    }
  },

  validateBooking: function (ship, date, duration, cb) {

    var tomorrow = new Date();
    tomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    tomorrow = new Date(tomorrow.getTime() + 86400000);

    date = new Date(date);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (tomorrow <= date) {

      var dur = 0;
      if (duration.unity == 0) {
        dur = 86400000;
      } else {
        dur = (86400000 * duration.unity * duration.quantity);
      }

      var event = {
        start: date,
        end: new Date(date.getTime() + dur)
      };

      var locks = ship._doc.locks;
      if (dontExistEvents(locks, event)) {
        cb(true);
      } else {
        cb(false);
      }
    } else {
      cb(false);
    }
  },

  saveBook: function (iso, offer, method, receipt, token, cb) {

    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    var sale = {
      method: method,
      token: token,
      receipt: receipt,
      bookingDate: today,
      //paymentId: {type: String},
    };

    var finish = false;

    db.Offers.findOne({
      _id: offer
    }).exec(function (err, offerDoc) {
      if (err || !offerDoc) {
        var url = urlUtil.resolve("/", errorPage);
        cb(null, false, url);
      } else {

        if (offerDoc.percentage == 100) {
          finish = true;
        }
        if ((offerDoc.secondPayment != "5" && offerDoc.secondPayment != "0") && offerDoc.sale.length > 1) {
          finish = true;
        }

        var token = uuid.v4();
        db.Offers.update({
          _id: offer,
        }, {
          $set: {
            status: "accept",
            finish: finish,
            token: token
          },
          $push: {
            sale: sale
          }
        }, {
          new: true
        })
          .exec(function (err, success) {
            if (err || !success) {
              var url = urlUtil.resolve("/", errorPage);
              cb(null, false, url);
            } else {
              db.Offers.findOne({
                _id: offer
              })
                .populate("request shipowner ship")
                .exec(function (err, offerData) {
                  if (err || !offerData) {
                    var url = urlUtil.resolve("/", errorPage);
                    cb(null, false, url);
                  } else {

                    if (offerData.finish && offerDoc.sale.length > 1) {
                      engineFunctions.sendMailConfirm(offerData, iso, function (err, success) {
                        console.log(err, success);
                        var url = urlUtil.resolve("/", successPage);
                        cb(null, false, url);
                      });
                    } else {
                      var dur = 0;
                      if (offerData._doc.duration.unity == 0) {
                        dur = 86400000;
                      } else {
                        dur = (86400000 * offerData._doc.duration.unity * offerData._doc.duration.quantity);
                      }

                      if (offerData._doc.duration.unity == 0) {
                        db.Requests.update({
                          _id: offerData._doc.request._doc._id
                        }, {
                          $set: {
                            status: "accept"
                          }
                        })
                          .exec(function (err, success) {
                            if (err || !success) {
                              var url = urlUtil.resolve("/", errorPage);
                              cb(null, false, url);
                            } else {
                              var url = urlUtil.resolve("/", successPage);
                              cb(null, false, url);
                            }
                            engineFunctions.sendMailConfirm(offerData, iso, function (err, success) {
                              console.log(err, success);
                            });
                          });
                      } else {
                        offerData._doc.bookDate = utils.formatDate(offerData._doc.bookDate);
                        var event = {
                          title: offerData._doc.ship._doc.name,
                          type: "booked",
                          start: new Date(offerData._doc.bookDate),
                          end: new Date(offerData._doc.bookDate.getTime() + dur),
                          offer: offerData._doc._id.toString()
                        };

                        shipViewModel.createEvent(offerData._doc.ship._doc._id, event, function (err, success) {
                          if (err || !success) {
                            var url = urlUtil.resolve("/", errorPage);
                            cb(null, false, url);
                          } else {
                            async.parallel([
                              function (cbp) {
                                if (offerData._doc.request) {
                                  db.Requests.update({
                                    _id: offerData._doc.request._doc._id
                                  }, {
                                    $set: {
                                      status: "accept"
                                    }
                                  })
                                    .exec(function (err, success) {
                                      cbp(err, success);
                                    });
                                } else {
                                  cbp(null, true);
                                }

                              },
                              function (cbp) {
                                engineFunctions.sendMailConfirm(offerData, iso, function (err, success) {
                                  cbp(err, success);
                                });
                              }
                            ], function (err, result) {
                              if (err || !result) {
                                var url = urlUtil.resolve("/", errorPage);
                                cb(null, false, url);
                              } else {
                                var url = urlUtil.resolve("/", successPage);
                                cb(null, false, url);
                              }
                            });
                          }
                        });
                      }
                    }
                  }
                });
            }
          });
      }
    });
  },

  refund: function (offer, user, cb) {
    offerViewModel.get(offer, user, function (err, offerDoc) {
      if (err || !offerDoc) {
        cb(err, offerDoc);
      } else {
        if (offerDoc._doc.ship._doc.conditions.refund.active) {
          if (global.config.production) {
            executeRefund(offerDoc, function (err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                engineFunctions.saveRefund(offer, user, function (err, success) {
                  cb(err, success);
                });
              }
            });
          } else {
            engineFunctions.saveRefund(offer, user, function (err, success) {
              cb(err, success);
            });
          }
        } else {
          engineFunctions.saveRefund(offer, user, function (err, success) {
            cb(err, success);
          });
        }

      }
    });
  },

  saveRefund: function (offer, user, cb) {
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    offerViewModel.get(offer, user, function (err, offerDoc) {
      if (err || !offerDoc) {
        cb(err, offerDoc);
      } else {
        if (offerDoc._doc.duration._doc.unity == 0) {
          db.Offers.update({
            _id: offer,
            client: user._id
          }, {
            $set: {
              status: "refund",
              refundDate: today,
              sale: null
            }
          }).exec(function (err, success) {
            cb(err, success);
          });
        } else {
          var locks = offerDoc._doc.ship.locks;
          var aux = [];
          for (var i = 0; i < locks.length; i++) {
            if (locks[i].offer.toString() != offerDoc._id.toString()) {
              aux.push(locks[i]);
            }
          }

          db.Ships.update({
            remove: false,
            _id: offerDoc._doc.ship._doc._id.toString()
          }, {
            $set: {
              locks: aux
            }
          }).exec(function (err, success) {
            if (err || !success) {
              cb(err, success);
            } else {
              db.Offers.update({
                _id: offer,
                client: user._id
              }, {
                $set: {
                  status: "refund",
                  refundDate: new Date(),
                  sale: null
                }
              }).exec(function (err, success) {
                cb(err, success);
              });
            }

          });

        }
      }
    });
  },

  invoice: function (user, cb) {
    db.Offers.find({
      client: user._id,
      $or: [
        {
          status: "accept"
        }, {
          status: "refund"
        }
      ]
    }).exec(function (err, offers) {
      if (err) {
        cb(err, false);
      } else {
        var invoice = {
          books: {
            cont: 0,
            total: 0
          },
          refunds: {
            cont: 0,
            total: 0
          },
          total: 0
        };
        if (offers.length) {
          for (var i = 0; i < offers.length; i++) {
            if (offers[i]._doc.status == "accept") {
              invoice.books.cont++;
              invoice.books.total = invoice.books.total + ((offers[i]._doc.price * offers[i]._doc.percentage) / 100);
              invoice.total = invoice.total + ((offers[i]._doc.price * offers[i]._doc.percentage) / 100);
            }
            if (offers[i]._doc.status == "refund") {
              invoice.refunds.cont++;
              var cost = (((offers[i]._doc.price * offers[i]._doc.percentage) / 100) * offers[i]._doc.refundPercentage) / 100;
              invoice.refunds.total = invoice.refunds.total + cost;
              invoice.total = invoice.total + cost;
            }
          }
        }
        cb(null, invoice);
      }
    });
  },

  graphic: function (start, end, cb) {
    if (start && end) {
      var minDay = start;
      var maxDay = end;
    } else {
      var today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var minDay = today.getTime() - (86400000 * 3);
      var maxDay = today.getTime() + (86400000 * 4);
    }


    var days = [];
    for (var i = minDay; i <= maxDay; i = i + 86400000) {
      var date = new Date(i);
      days.push(date);
    }
    async.map(days, function (day, callback) {
      async.parallel([
        function (cbp) {
          var newDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
          cbp(null, newDay.getTime() + 86400000);
        },
        function (cbp) {
          var newDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
          var dstart = newDay;
          var dend = new Date(newDay.getTime() + 86400000);

          var query = {
            status: "accept",
            $and: [
              {
                "sale.bookingDate": {
                  $gte: dstart
                }
              }, {
                "sale.bookingDate": {
                  $lte: dend
                }
              }
            ]
          };
          db.Offers.count(query).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Offers.count({
            status: "cancel",
            cancelDate: day
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
      ], function (err, results) {
        callback(err, results);
      });
    }, function (err, result) {
      cb(err, result);
    });
  },

  userGraphic: function (user, cb) {
    var year = new Date().getFullYear();
    var months = [];
    for (var i = 0; i < 12; i++) {
      var start = new Date(year, i, 1);
      var end = new Date(year, i + 1, 1);
      months.push({
        start: start,
        end: end
      });
    }

    async.map(months, function (month, callback) {
      var query = {
        status: "accept",
        client: user._id,
        $and: [
          {
            bookDate: {
              $gte: month.start
            }
          }, {
            bookDate: {
              $lt: month.end
            }
          }
        ]
      };
      var query1 = {
        status: "cancel",
        client: user._id,
        $and: [
          {
            bookDate: {
              $gte: month.start
            }
          }, {
            bookDate: {
              $lt: month.end
            }
          }
        ]
      };
      if (user.permissions.isShipOwner) {
        query = {
          status: "accept",
          shipowner: user._id,
          $and: [
            {
              bookDate: {
                $gte: month.start
              }
            }, {
              bookDate: {
                $lt: month.end
              }
            }
          ]
        };
        query1 = {
          status: "cancel",
          shipowner: user._id,
          $and: [
            {
              bookDate: {
                $gte: month.start
              }
            }, {
              bookDate: {
                $lt: month.end
              }
            }
          ]
        };
      }
      async.parallel([
        function (cbp) {
          db.Offers.count(query).exec(function (err, success) {
            cbp(err, success);
          });
        },
        function (cbp) {
          db.Offers.count(query1).exec(function (err, success) {
            cbp(err, success);
          });
        }
      ], function (err, results) {
        callback(err, results);
      });
    }, function (err, result) {
      cb(err, result);
    });
  },

  sendMailConfirm: function (offer, iso, cb) {

    shipViewModel.get(iso, offer._doc.ship._id, function (err, ship) {
      offer._doc.ship = ship;
      async.series([
          function (cbp) {
            notificationViewModel.sendMailOwnerConfirmation(offer._doc.shipowner.language, offer, function (err, success) {
              cbp(err, success);
            });
          },
          function (cbp) {
            notificationViewModel.sendMailUserConfirmation(iso, offer, function (err, success) {
              cbp(err, success);
            });
          }
        ],
        function (err, result) {
          cb(err, result);
        }
      );
    });
  },

  getInvoice: function (month, user, cb) {
    var aux = {
      list: [],
      total: 0
    };
    var today = new Date();
    var year = today.getFullYear();
    month = parseInt(month);
    if (month >= 0) {

      if (month == 11) {
        month = 0;
        year++;
      }
      var mAux = {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 1)
      };

      var query = {
        shipowner: user._id,
        $or: [
          {
            status: "cancel"
          }, {
            status: "accept"
          }
        ],
        $and: [
          {
            bookDate: {
              $gte: mAux.start
            }
          }, {
            bookDate: {
              $lt: mAux.end
            }
          }
        ]
      };

      db.Offers.find(query)
        .populate("client shipowner ship")
        .exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            if (success.length) {
              formatOffers(success, user, function (err, offers) {
                if (err || !offers) {
                  cb(err, offers);
                } else {
                  var total = 0;
                  for (var i = 0; i < offers.length; i++) {
                    var gain = ((offers[i].price * offers[i].percentage) / 100);
                    gain = gain - ((offers[i].price * offers[i].discount) / 100);


                    var lost = 0;
                    if (offers[i]._doc.status == "cancel") {
                      // 0	Se cambia el día o se devuelve el dinero
                      // 1	Se cambia el día o se devuelve el 75% de la reserva
                      // 2	Se cambia el día o se devuelve el 50% de la reserva
                      // 3	Se cambia el día
                      // 4	El cliente pierde el dinero

                      if (offers[i].refund == 1) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 75) / 100);
                      }
                      if (offers[i].refund == 2) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 50) / 100);
                      }
                      if (offers[i].refund == 4) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 100) / 100);
                      }

                    }
                    gain = gain - lost;
                    gain = gain - ((gain * 20) / 100); //todo change number 20 to user.commission
                    total += gain;
                    offers[i]._doc.gain = gain;
                  }
                  aux.list = offers;
                  aux.total = total;

                  cb(err, aux);
                }
              });
            } else {
              cb(err, aux);
            }

          }
        });
    } else {
      var start = new Date(year, 0, 1);
      var end = new Date(year + 1, 0, 1);
      var month = {
        start: start,
        end: end
      };
      var query = {
        shipowner: user._id,
        $or: [
          {
            status: "cancel"
          }, {
            status: "accept"
          }
        ],
        $and: [
          {
            bookDate: {
              $gte: month.start
            }
          }, {
            bookDate: {
              $lt: month.end
            }
          }
        ]
      };
      db.Offers.find(query)
        .populate("shipowner ship")
        .exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            if (success.length) {
              formatOffers(success, user, function (err, offers) {
                if (err || !offers) {
                  cb(err, offers);
                } else {
                  var total = 0;
                  for (var i = 0; i < offers.length; i++) {
                    var gain = ((offers[i].price * offers[i].percentage) / 100);
                    gain = gain - ((offers[i].price * offers[i].discount) / 100);


                    var lost = 0;
                    if (offers[i]._doc.status == "cancel") {
                      // 0	Se cambia el día o se devuelve el dinero
                      // 1	Se cambia el día o se devuelve el 75% de la reserva
                      // 2	Se cambia el día o se devuelve el 50% de la reserva
                      // 3	Se cambia el día
                      // 4	El cliente pierde el dinero

                      if (offers[i].refund == 1) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 75) / 100);
                      }
                      if (offers[i].refund == 2) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 50) / 100);
                      }
                      if (offers[i].refund == 4) {
                        lost = ((offers[i].price * offers[i].percentage) / 100);
                        lost = gain - ((offers[i].price * offers[i].discount) / 100);
                        lost = lost - ((lost * 100) / 100);
                      }

                      //gain = gain - offers[i].price
                    }
                    gain = gain - lost;
                    gain = gain - ((gain * 20) / 100);
                    total += gain;
                    offers[i]._doc.gain = gain;
                  }
                  aux.list = offers;
                  aux.total = total;

                  cb(err, aux);
                }
              });
            } else {
              cb(err, aux);
            }
          }
        });
    }
  },

  adminInvoice: function (email, month, year, user, type, limit, skip, order, cb) {
    var aux = {
      list: [],
      total: 0,
      owner: null
    };
    var query = {
      $or: [
        {
          status: "refund"
        }, {
          status: "accept"
        }
      ],
    };
    var today = new Date();
    var year = year;
    month = parseInt(month);

    if (month >= 0) {
      var mAux = {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 1)
      };
      query.$and = [
        {
          bookDate: {
            $gte: mAux.start
          }
        }, {
          bookDate: {
            $lt: mAux.end
          }
        },
        {
          bookDate: {
            $lte: today
          }
        }
      ];
      findOfferbyQuery(aux, user, query, limit, skip, order, function (err, offers) {
        cb(err, offers);
      });
    }
    else {
      var start = new Date(year, 0, 1);
      var end = new Date(year + 1, 0, 1);
      month = {
        start: start,
        end: end
      };
      query.$and = [
        {
          bookDate: {
            $gte: month.start
          }
        }, {
          bookDate: {
            $lt: month.end
          }
        },
        {
          bookDate: {
            $lte: today
          }
        }
      ];
      findOfferbyQuery(aux, user, query, limit, skip, order, function (err, offers) {
        cb(err, offers);
      });
    }

  },

  prepareRedsys: function (offer, cb) {
    async.waterfall([
      function (cbw) {
        db.Configurations.findOne().select("redsys general").exec(function (err, conf) {
          cbw(err, conf);
        });
      },
      function (conf, cbw) {
        var f = JSON.parse(JSON.stringify(conf));
        var server = f.general.domain;
        var rurl = server + "service/engine/returnRedsys";
        var curl = server + "service/engine/cancel";
        var uri = uris[f.redsys.mode];
        var comercio = f.redsys.commerce || "333099588";
        var clave = f.redsys.key || "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

        var price = parseFloat(offer.price) * 100;
        var obj = new Sermepa({
          Ds_Merchant_Amount: price,
          Ds_Merchant_Currency: 978,
          Ds_Merchant_Order: Date.now().toFixed().substr(5),
          Ds_Merchant_MerchantCode: comercio,
          Ds_Merchant_MerchantURL: server,
          Ds_Merchant_UrlOK: rurl,
          Ds_Merchant_UrlKO: curl,
          Ds_Merchant_Terminal: 1,
          Ds_Merchant_TransactionType: 0
        });

        try {
          var params = obj.createFormParameters(clave);
          var data = {
            uri: uri,
            params: JSON.stringify(obj.params, null, "\t"),
            fparams: params
          };
          cbw(null, data);
        } catch (err) {
          cbw(err, null);
        }
      }
    ], function (err, result) {
      if (err) {
        cb(null, null);
      } else {
        cb(err, result);
      }
    });
  }
};
module.exports = engineFunctions;