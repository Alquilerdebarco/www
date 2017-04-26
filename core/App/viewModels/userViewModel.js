/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

var utils = require("./../../middlewares/utils");
var functions = require("./../utils/functions");
var bcrypt = require("bcrypt-nodejs");
var async = require("async");
var mediaViewModel = require("./mediaViewModel");
var uuid = require("node-uuid");
var notificationViewModel = require("./notificationViewModel");
var entity = "user";
var subscriptionViewModel = require("./subscriptionViewModel");
var languageView = require("./languageViewModel");

function ReplaceAll(str, find, replace) {
  var repeat = true;
  while (repeat) {
    var newStr = str.replace(find, replace);
    if (str == newStr) {
      repeat = false;
    } else {
      str = newStr;
    }
  }
  return str;
}
function formatUser(user) {

  var us = {
    _id: user._doc._id.toString(),
    name: user._doc.name,
    surname: user._doc.surname,
    slug: user._doc.slug,
    email: user._doc.email,
    // telephone: user._doc.telephone,
    mobile: user._doc.mobile,
    registerDate: user._doc.registerDate,
    permissions: user._doc.permissions,
    address: user._doc.address,
    status: user._doc.status,
    avatar: user._doc.avatar,
    contact: user._doc.contact,
    invoice: user._doc.invoice,
    commission: user._doc.commission,
    web: user._doc.web
  };
  return us;
}
function formatUsers(users, cb) {
  async.map(users, function (user, cbm) {
    db.Offers.find({
      shipowner: user._id
    })
      .exec(function (err, offers) {
        if (err || !offers) {
          cbm(err, offers);
        } else {
          var aux = {
            book: 0,
            cancel: 0,
            done: 0,
            total: 0,
          };

          var conversations = [];
          for (var i = 0; i < offers.length; i++) {
            if (offers[i].status == "cancel") {
              aux.cancel++;
            }
            if (offers[i].status == "accept") {
              var today = new Date();
              if (today < offers[i].bookDate) {
                aux.book++;
              } else {
                aux.done++;
              }
            }
            var tmp = {
              offer: offers[i]._id,
              conversation: JSON.parse(JSON.stringify(offers[i].conversation))
            };
            conversations.push(tmp);
            aux.total++;
          }
          user.conversations = conversations;
          user.books = aux;
          cbm(null, user);
        }
      });
  }, function (err, result) {
    cb(err, result);
  });


}
var userFunctions = {
  create: function (name, surname, email, password, telephone, mobile, address, permissions, subscription, web, lang, cb) {
    db.Users.findOne({
      email: email
    }).exec(function (err, user) {
      if (err) {
        cb(err, null);
      } else {
        if (user) {
          var err = {
            code: "11000",
            message: "Email is using!"
          }
          cb(err, null);
        } else {
          if (permissions != null) {
            var aux = permissions.typeShipOwner || permissions;
            var userDb = db.Users({
              name: name,
              surname: surname,
              slug: utils.getSlug(email + surname),
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
              email: email,
              telephone: telephone,
              mobile: mobile,
              address: address,
              registerDate: functions.dateToUtc(new Date()),
              activationKey: utils.generateUid(),
              permissions: {
                isShipOwner: true,
                typeShipOwner: parseInt(aux)
              },
              web: web,
              invoice: {
                email: email,
                mobile: mobile
              }
            });
          } else {
            var userDb = db.Users({
              name: name,
              surname: surname,
              slug: utils.getSlug(email + surname),
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
              email: email,
              telephone: telephone,
              mobile: mobile,
              address: address,
              registerDate: functions.dateToUtc(new Date()),
              activationKey: utils.generateUid()
            });
          }
          userDb.save(function (err, user) {
            if (err || !user) {
              cb(err, user);
            } else {
              notificationViewModel.sendMailRegister("5669b342ef0fa2841b956b38", user, user._doc.activationKey, function (err, success) {
                console.log(err, success);
              });
              var us = formatUser(user);
              if (subscription) {
                subscriptionViewModel.create(lang, user.email, function (err, success) {
                  if (err) {
                    if (err.code && err.code == "11000") {
                      cb(null, us);
                    } else {
                      cb(err, success);
                    }

                  } else {
                    cb(null, us);
                  }
                });
              } else {
                cb(null, us);
              }
            }
          });
        }

      }

    });


  },
  get: function (id, cb) {
    try {
      db.Users.findOne({
        _id: id,
        remove: false
      }).exec(function (err, user) {
        if (err) {
          cb(err, user);
        } else {
          var us = formatUser(user);
          cb(null, us);
        }

      });
    } catch (err) {
      cb(err, false);
    }
  },
  list: function (limit, skip, string, status, permissions, sortOptions, user, cb) {
    var sortAux = {
      _id: 1
    };
    if (sortOptions) {
      sortAux = {};
      sortAux[sortOptions.field] = sortOptions.sort;
    }

    if (status == null) {
      var query = {
        _id: {
          $ne: user._id
        },
        remove: false,
        "permissions.isShipOwner": permissions

      };
      if (string.length) {
        var word = new RegExp(string, "i");
        query = {
          _id: {
            $ne: user._id
          },
          remove: false,
          $or: [{
            name: word
          }, {
            surname: word
          }, {
            email: word
          }],
          "permissions.isShipOwner": permissions
        };
      }
    } else {
      status = eval(status);
      var query = {
        _id: {
          $ne: user._id
        },
        remove: false,
        status: status,
        "permissions.isShipOwner": permissions
      };
      if (string.length) {
        var word = new RegExp(string, "i");
        query = {
          _id: {
            $ne: user._id
          },
          remove: false,
          status: status,
          $or: [{
            name: word
          }, {
            surname: word
          }, {
            email: word
          }],
          "permissions.isShipOwner": permissions
        };
      }
    }
    async.parallel([
      function (cb) {
        db.Users.count(query).exec(function (err, count) {
          cb(err, count);
        });
      },
      function (cb) {
        db.Users.find(query).sort(sortAux).limit(limit).skip(skip).exec(function (err, data) {
          for (var i = 0; i < data.length; i++) {
            data[i] = formatUser(data[i]);
          }
          cb(err, data);
        });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        formatUsers(results[1], function (err, users) {
          cb(null, users, results[0]);
        });

      }
    });
  },
  update: function (id, name, surname, email, telephone, mobile, address, permissions, commission, web, cb) {
    try {
      var aux = {
        name: name,
        surname: surname,
        email: email,
        slug: utils.getSlug(email + surname),
        telephone: telephone,
        mobile: mobile,
        address: address,
        web: web
      };
      if (commission) {
        aux.commission = parseFloat(commission);
      }

      if (permissions) {
        permissions.typeShipOwner = eval(permissions.typeShipOwner) ? 1 : 0;
        aux.permissions = permissions;
      }


      db.Users.findByIdAndUpdate({
        _id: id,
        remove: false
      }, {
        $set: aux
      }, {
        new: true
      })
        .exec(function (err, user) {
          if (err || !user) {
            cb(err, null);
          } else {
            var us = formatUser(user);
            cb(null, us);
          }
        });
    } catch (err) {
      cb(err, false);
    }
  },
  status: function (id, cb) {
    try {
      db.Users.findById(id).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          var query = {
            $set: {
              status: !doc._doc.status
            }
          };
          if (!doc._doc.status) {
            query = {
              $set: {
                status: !doc._doc.status,
                activationKey: null
              }
            };
          }
          db.Users.findByIdAndUpdate({
            remove: false,
            _id: id
          }, query, {
            new: true
          })
            .exec(function (err, user) {
              if (err || !user) {
                cb(err, null);
              } else {
                var us = formatUser(user);
                cb(null, us);
              }
            });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  permissionsOwner: function (id, cb) {
    try {
      db.Users.findById(id).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          db.Users.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              "permissions.isShipOwner": !doc._doc.permissions.isShipOwner
            }
          }, {
            new: true
          })
            .exec(function (err, user) {
              if (err || !user) {
                cb(err, null);
              } else {
                var us = formatUser(user);
                cb(null, us);
              }
            });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  permissionsAdmin: function (id, cb) {
    try {
      db.Users.findById(id).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          db.Users.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              "permissions.isAdmin": !doc._doc.permissions.isAdmin
            }
          }, {
            new: true
          })
            .exec(function (err, user) {
              if (err || !user) {
                cb(err, null);
              } else {
                var us = formatUser(user);
                cb(null, us);
              }
            });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  activate: function (activationKey, cb) {
    try {
      db.Users.findOne({
        activationKey: activationKey,
        status: false,
        remove: false
      }).exec(function (err, user) {
        if (err || !user) {
          cb(err, user);
        } else {
          db.Users.findOneAndUpdate({
            _id: user._doc._id
          }, {
            $set: {
              status: true,
              activationKey: null
            }
          }, {
            new: true
          }).exec(function (err, success) {
            cb(err, success);
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  remove: function (id, email, cb) {
    try {

      async.waterfall([
        function (cbp) {
          db.Users.findOne({
            _id: id,
            remove: false,
            "permissions.isAdmin": true
          }, function (err, user) {
            if (err) {
              cbp(err, null);
            } else {
              if (user) {
                var error = {
                  message: "Lo sentimos! No se puede eliminar un Admin."
                };
                cbp(error, null);
              } else {
                db.Users.findByIdAndUpdate({
                  remove: false,
                  _id: id
                }, {
                  $set: {
                    remove: true,
                    status: false,
                    email: email + "," + uuid.v4(),
                    slug: uuid.v4(),
                  }
                })
                  .exec(function (err, user) {
                    if (err || !user) {
                      cbp(err, null);
                    } else {
                      var us = formatUser(user);
                      cbp(null, us);
                    }
                  });
              }
            }
          });
        },
        function (us, cbp) {
          if (us.permissions.isShipOwner) {
            db.Ships.update({
              user: us._id
            }, {
              $set: {
                remove: true
              }
            }).exec(function (err, success) {
              if (err) {
                cbp(err, success);
              } else {
                cbp(null, us);
              }
            });
          } else {
            cbp(null, us);
          }

        }
      ], function (err, results) {
        cb(err, results);

      });


    } catch (err) {
      cb(err, false);
    }
  },
  addAvatar: function (id, file, cb) {
    db.Users.findOne({
      _id: id
    }).exec(function (err, user) {
      if (err || !user) {
        cb(err, user);
      } else {
        async.parallel([
          function (callback) {
            if (user.avatar) {
              mediaViewModel.remove(user._doc.avatar, function (err, success) {
                callback(err, success);
              });
            } else {
              callback(null, true);
            }
          },
          function (callback) {
            mediaViewModel.createAvatar(file, function (err, medias) {
              if (err) {
                callback(err, medias);
              } else {
                try {
                  db.Users.findByIdAndUpdate({
                    remove: false,
                    _id: id
                  }, {
                    $set: {
                      avatar: medias._doc._id
                    }
                  }, {
                    new: true
                  })
                    .exec(function (err, success) {
                      if (err || !success) {
                        callback(err, success);
                      } else {
                        callback(null, success);
                      }
                    });
                } catch (error) {
                  callback(error, false);
                }
              }
            });
          }
        ], function (err, result) {
          if (err || !result) {
            cb(err, result);
          } else {

            var us = formatUser(result[1]);
            cb(null, us);
          }
        });

      }
    });
  },
  applyChangePassword: function (email, cb) {
    try {
      var activationKey = utils.generateUid();
      db.Users.findOneAndUpdate({
          email: email,
          status: true,
          remove: false
        }, {
          $set: {
            activationKey: activationKey
          }
        }, {
          new: true
        },
        function (err, user) {
          if (err || !user) {
            cb(err, user);
          } else {
            notificationViewModel.sendMailRecoveryPassword(user._doc.language, user, activationKey, function (err, success) {
              console.log(err, success);
            });
            cb(err, activationKey);
          }
        }
      );
    } catch (err) {
      cb(err, false);
    }
  },
  checkTokenUser: function (token, cb) {
    try {
      if (token) {
        db.Users.findOne({
          activationKey: token,
          remove: false
        })
          .populate("avatar")
          .exec(function (err, user) {
            if (err || !user) {
              cb(err, user);
            } else {

              var aux = {
                data: "/backend/gentelella/images/user.png"
              };

              var us = {
                _id: user._id.toString(),
                name: user._doc.name,
                surname: user._doc.surname,
                activationKey: user._doc.activationKey,
                avatar: user._doc.avatar || aux
              };

              cb(null, us);
            }

          });
      } else {
        cb(true, null);
      }

    } catch (err) {
      cb(err, false);
    }
  },
  changePassword: function (id, token, password, cb) {
    try {
      var pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      db.Users.update({
        _id: id,
        activationKey: token,
        remove: false,
        status: true
      }, {
        $set: {
          password: pass,
          activationKey: null
        }
      }).exec(function (err, success) {
        cb(err, success);
      });
    } catch (err) {
      cb(err, false);
    }
  },
  userChangePassword: function (id, password, cb) {
    try {
      var pass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      db.Users.update({
        _id: id,
        remove: false
      }, {
        $set: {
          password: pass
        }
      }).exec(function (err, success) {
        cb(err, success);
      });
    } catch (err) {
      cb(err, false);
    }
  },
  invoice: function (id, fiscalName, nifCif, dni, swift, iban, email, mobile, address, postalCode, city, country, cb) {
    db.Users.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        complete: true,
        "invoice.fiscalName": fiscalName,
        "invoice.nifCif": nifCif,
        "invoice.dni": dni,
        "invoice.swift": swift,
        "invoice.iban": iban,
        "invoice.email": email,
        "invoice.mobile": mobile,
        "invoice.address": address,
        "invoice.postalCode": postalCode,
        "invoice.city": city,
        "invoice.country": country
      }
    }, {
      new: true
    }).exec(function (err, success) {
      if (err || !success) {
        cb(err, success);
      } else {
        var us = formatUser(success);
        cb(null, us);
      }
    });
  },
  findUserByEmail: function (email, password, cb) {
    try {
      //password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      db.Users.findOne({
        email: email,
        status: true
      }).exec(function (err, user) {
        if (err || !user) {
          cb(err, false);
        } else {
          user.validPassword(password, function (err, isValid) {
            if (err || !isValid)
              cb(null, false);

            var us = formatUser(user);
            if (us) {
              cb(null, us);
            } else {
              cb(true, false);
            }


          });
          //
        }
      });
    } catch (e) {
      cb(e, false);
    }
  },
  contract: function (id, culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (err) {
        cb(err, null);
      }
      else {
        db.Users.findOne({
          _id: id,
          remove: false
        }).exec(function (err, user) {
          if (user.permissions.isShipOwner) {
            db.Configurations.findOne()
              .select("contract")
              .populate({
                path: "contract.enterprise",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
              .populate({
                path: "contract.particular",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
              .exec(function (err, conf) {
                if (err) {
                  cb(err, null);
                } else {
                  var type = parseInt(user.permissions.typeShipOwner);
                  var body;
                  var td = new Date();
                  var month = td.getMonth() + 1;
                  var day = td.getDate();
                  if (month < 10) month = "0" + month;
                  if (day < 10) day = "0" + day;
                  if (type) {
                    body = conf.contract.enterprise[0]._doc.value;
                    body = ReplaceAll(body, "[fiscal_name]", user.invoice.fiscalName);
                    body = ReplaceAll(body, "[fiscal_address]", user.invoice.address);
                    body = ReplaceAll(body, "[postal_code]", user.invoice.postalCode);
                    body = ReplaceAll(body, "[city]", user.invoice.city);
                    body = ReplaceAll(body, "[country]", user.invoice.country);
                    body = ReplaceAll(body, "[cif]", user.invoice.nifCif);
                    body = ReplaceAll(body, "[fiscal_email]", user.invoice.email);
                    body = ReplaceAll(body, "[date]", day + "/" + month + "/" + td.getFullYear());
                    cb(null, body);
                  }
                  else {
                    body = conf.contract.particular[0]._doc.value;
                    body = ReplaceAll(body, "[user_name]", user.name + " " + user.surname);
                    body = ReplaceAll(body, "[user_address]", user.invoice.address);
                    body = ReplaceAll(body, "[postal_code]", user.invoice.postalCode);
                    body = ReplaceAll(body, "[city]", user.invoice.city);
                    body = ReplaceAll(body, "[country]", user.invoice.country);
                    body = ReplaceAll(body, "[dni]", user.invoice.dni);
                    body = ReplaceAll(body, "[user_email]", user.invoice.email);
                    body = ReplaceAll(body, "[date]", day + "/" + month + "/" + td.getFullYear());
                    cb(null, body);
                  }
                }
              });
          }
          else {
            cb(null, false);
          }
        });
      }
    });
  },
  accept: function (id, accept, cb) {
    db.Users.update({
      _id: id
    }, {
      $set: {
        accept: accept
      }
    }).exec(function (err, success) {
      cb(err, success);
    });
  }
};
module.exports = userFunctions;