/**
 * Created by ernestomr87@gmail.com on 2/25/2016.
 */

var async = require("async");
var shipViewModel = require("../viewModels/shipViewModel");
var userViewModel = require("../viewModels/userViewModel");
var configurationViewModel = require("../viewModels/configurationViewModel");

var notificationViewModel = require("./notificationViewModel");
var entity = "request";

var validator = require("validator");
var validateObject = function (object) {
  var today = new Date();
  if (!validator.isAlphanumeric(object.ship)) {
    return false;
  }
  if (!validator.isAlphanumeric(object.experience)) {
    return false;
  }
  if (!validator.isDate(object.bookDate) || today > object.bookDate) {
    return false;
  }
  if (!validator.isInt(object.duration.unity) || object.duration.unity < 0) {
    return false;
  }
  if (!validator.isInt(object.duration.quantity) || object.duration.quantity < 1) {
    return false;
  }
  if (!validator.isInt(object.numPas || object.numPas < 0)) {
    return false;
  }
  if (!validator.isBoolean(object.patron)) {
    return false;
  }
  if (!validator.isEmail(object.email)) {
    return false;
  }
  if (!validator.isLength(object.name, 1)) {
    return false;
  }
  if (!validator.isLength(object.mobile, 6, 15)) {
    return false;
  }
  return true;
};

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

function formatRequests(requests, iso, cb) {
  async.map(requests, function (request, callback) {
    async.waterfall([
      function (cbw) {
        request._doc.createDate = (new Date(request._doc.createDate)).getTime();
        request._doc.bookDate = (new Date(request._doc.bookDate)).getTime();
        cbw(null, request);
      },
      function (req, cbw) {
        shipViewModel.get(iso, req._doc.ship, function (err, ship) {
          if (err || !ship) {
            callback(err, ship);
          } else {
            req._doc.ship = ship;
            cbw(null, req);
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

var requestFunctions = {
  create: function (request, iso, cb) {
    request.bookDate = new Date(parseInt(request.bookDate));
    request.duration.unity = parseInt(request.duration.unity);
    request.duration.quantity = parseInt(request.duration.quantity);
    request.numPas = parseInt(request.numPas);
    request.patron = JSON.parse(request.patron);

    if (validateObject(request)) {
      var value = request;
      db.Ships.findOne({
        _id: value.ship,
        remove: false
      }).exec(function (err, ship) {
        if (err || !ship) {
          var error = {
            code: "END",
            message: "Lo sentimos!. El barco no esta disponible."
          };
          cb(error, null);
        } else {
          db.Languages.findOne({
            iso: iso
          }).exec(function (err, lang) {
            if (err || !lang) {
              cb(err, lang);
            } else {
              db.Requests.find({}, {
                index: 1
              }).sort({
                index: -1
              }).limit(1).exec(function (err, index) {
                if (err || !index) {
                  cb(err, index);
                } else {
                  var req = db.Requests({
                    index: index[0] ? index[0].index + 1 : 1,
                    shipowner: ship._doc.user,
                    shipName: ship._doc.name,
                    ship: value.ship,
                    bookDate: value.bookDate,
                    duration: {
                      unity: value.duration.unity,
                      quantity: value.duration.quantity,
                    },
                    numPas: value.numPas,
                    patron: value.patron,
                    name: value.name,
                    email: value.email,
                    mobile: value.mobile,
                    message: value.message,
                    experience: value.experience,
                    language: lang._doc._id
                  });

                  if (request.client) req.client = request.client;

                  req.save(function (err, r) {
                    db.Requests.findOne({
                      _id: r._doc._id
                    })
                      .populate("shipowner")
                      .exec(function (err, rDoc) {
                        var array = [];
                        array.push(rDoc);
                        async.parallel([
                          function (cbp) {
                            formatRequests(array, lang.iso, function (err, req0) {
                              cbp(err, req0);
                              notificationViewModel.sendMailUserRequest(lang._doc._id, req0[0], function (err, success) {
                                console.log(err, success);
                              });
                            });
                          },
                          function (cbp) {
                            getIsoByUser(rDoc._doc.shipowner._doc._id, function (err, user) {
                              formatRequests(array, user._doc.language.iso, function (err, req0) {
                                cbp(err, req0);
                                notificationViewModel.sendMailOwnerRequest(req0[0]._doc.shipowner.language, req0[0], function (err, success) {
                                  console.log(err, success);
                                });
                              });
                            });

                          }
                        ], function (err, result) {
                          cb(err, result[0][0]);
                        });
                      });
                  });
                }
              });

            }
          });


        }
      });
    } else {
      var error = {
        message: "Lo sentimos!. Formulario incorrecto."
      };
      cb(error, null);
    }
  },
  list: function (limit, skip, check, status, user, iso, string, sortOptions, cb) {
    var query = {
        status: "send"
      },
      sort = {};
    if (user.permissions.isShipOwner) {
      query.shipowner = user._id;
    }
    if (check) {
      query.check = check;
    }
    if (!check && status) {
      query.status = status;
    }

    if (string.length) {
      var word = new RegExp(string, "i");
      query["$or"] = [{
        name: word
      }, {
        shipName: word
      }];
    }
    sort[sortOptions.field] = sortOptions.sort;

    db.Requests.find(query)
      .populate("shipowner")
      .sort(sort)
      .exec(function (err, data) {
        if (err || !data) {
          cb(err, data);
        } else {
          var total = data.length;
          if (total) {
            var tmp = [];
            for (var i = parseInt(skip); i < parseInt(skip) + parseInt(limit) && i < total; i++) {
              tmp.push(data[i]);
            }
            formatRequests(tmp, iso, function (err, requests) {
              if (err) {
                cb(err, requests);
              } else {
                cb(null, requests, total);
              }
            });
          } else {
            cb(null, [], 0);
          }
        }
      });

  },
  get: function (id, iso, cb) {
    db.Requests.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        check: true
      }
    }, {
      new: true
    })
      .populate("shipowner")
      .exec(function (err, request) {
        if (err || !request) {
          cb(err, request);
        } else {
          var aux = [];
          aux.push(request);
          formatRequests(aux, iso, function (err, requests) {
            cb(err, requests[0]);
          });
        }
      });
  },
  remove: function (id, user, cb) {
    db.Requests.remove({
      _id: id
    })
      .exec(function (err, request) {
        activityViewModel.create(entity, "remove", id, user._id, function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            cb(err, request);
          }
        });
      });
  },
  unavailable: function (id, iso, user, cb) {
    db.Requests.findOne({
      _id: id
    }).populate("ship").exec(function (err, req) {
      if (err || !req) {
        cb(err, req);
      } else {
        db.Requests.update({
          _id: id,
          shipowner: user._id
        }, {
          $set: {
            status: "reject"
          }
        })
          .exec(function (err, request) {
            activityViewModel.create(entity, "unavailable", id, user._id, function (err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                cb(err, request);
                notificationViewModel.sendMailRejectRequest(iso, req, function (err, mail) {
                  console.log(err, mail);
                });

              }
            });
          });
      }
    });


  },
};

module.exports = requestFunctions;