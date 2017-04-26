var async = require("async");
var request = require("request");
var languageModelView = require("../viewModels/languageViewModel");
var configurationView = require("../viewModels/configurationViewModel");
var textViewModel = require("../viewModels/textViewModel");
var landingViewModel = require("../viewModels/landingViewModel");


var functions = {
  generateUid: function () {

    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;

  },
  formatDate: function (date) {
    date = new Date(date);
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return date;
  },
  validateCulture: function (culture, cb) {
    languageModelView.exist(culture, function (err, lang) {
      if (err || !lang) {
        cb(false);
      } else {
        if (lang._doc.iso == culture) {
          cb(lang);
        } else {
          cb(false);
        }
      }
    });
  },
  loadData: function (culture, limit, skip, filter, coin, cb) {
    var l = limit || 10;
    var s = skip || 0;
    // Filtro [Pais,Ciudad,Zona,Puerto,Experiencia,Duración,Día]
    filter = filter ? filter : [0, 0, 0, 0, 0, 0, 0];
    async.parallel([
      function (callback) {
        languageModelView.listFront(function (err, langs) {
          if (err || !langs) {
            callback(null, []);
          } else {
            var languages = [];
            for (var i = 0; i < langs.length; i++) {
              var aux = {
                iso: langs[i]._doc.iso,
                name: langs[i]._doc.name
              };
              languages.push(aux);
            }
            callback(null, languages);
          }
        });
      },
      function (callback) {
        try {
          var shipModelView = require("../viewModels/shipViewModel");
          shipModelView.listFront(culture, l, s, filter, coin, function (err, data, cont) {
            if (err || !data) {
              callback(null, []);
            } else {
              var last = 0;
              if (cont % 10) {
                last = parseInt(cont / 10) + 1;
              } else {
                last = cont / 10;
              }
              var current = s / 10 + 1;
              var next = current == last ? null : current + 1;
              var back = current == 1 ? null : current - 1;
              var aux = {
                list: data,
                cont: cont,
                first: 1,
                next: next,
                back: back,
                currentPage: current,
                last: last
              };
              callback(null, aux);
            }
          });
        } catch (err) {
          callback(err, null);
        }
      },
      function (callback) {
        try {
          async.waterfall([
            function (cbw) {
              configurationView.getPhotos(function (err, photos) {
                if (err || !photos) {
                  callback(err, null);
                } else {
                  var array = [];
                  for (var i = 0; i < photos.length; i++) {
                    var aux = {
                      pos: i,
                      img: photos[i]
                    };
                    array.push(aux);
                  }
                  cbw(false, array);
                }
              });
            },
            function (photos, cbw) {
              textViewModel.getByGroup(culture, "slogans", function (err, slogans) {
                if (err || !slogans) {
                  cbw(err, false);
                } else {
                  var cont = 0;
                  for (var i = 0; i < photos.length; i++) {
                    photos[i].text = slogans[cont];
                    cont++;
                    if (cont >= slogans.length) cont = 0;
                  }
                  cbw(false, photos);
                }
              });
            }
          ], function (err, result) {
            callback(err, result);
          })
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          configurationView.getMetabyLang(culture, function (err, conf) {
            if (err || !conf) {
              callback(err, null);
            } else {
              callback(false, conf);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          textViewModel.getByGroup(culture, "slogans", function (err, slogans) {
            if (err || !slogans) {
              callback(err, false);
            } else {
              callback(false, slogans);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          landingViewModel.listFront(culture, 12, 0, function (err, landing) {
            if (err || !landing) {
              callback(err, false);
            } else {
              callback(false, landing);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          landingViewModel.getEmptyLanding(culture, function (err, landing) {
            if (err || !landing) {
              callback(err, false);
            } else {
              callback(false, landing);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          configurationView.listDurationAndXpFront(culture, function (err, types) {
            if (err || !types) {
              callback(null, []);
            } else {
              callback(null, types);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          configurationView.listFrontShipType(culture, function (err, types) {
            if (err || !types) {
              callback(null, []);
            } else {
              callback(null, types);
            }
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          configurationView.get(function (err, conf) {
            callback(err, conf);
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          landingViewModel.listMenu(culture, function (err, landings) {
            callback(err, landings);
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        try {
          textViewModel.listMenu(culture, function (err, texts) {
            callback(err, texts);
          });
        } catch (err) {
          callback(err, false);
        }
      },
      function (callback) {
        configurationView.listFrontCurrencies(function (err, currencies) {
          callback(err, currencies);
        });
      },
    ], function (err, result) {
      cb(err, result);
    });
  },
  currencyService: function (callback) {
    db.Currencies.find()
      .sort({
        pos: "asc"
      }).exec(function (err, currencies) {
      if (err) {
        callback(err, currencies);
      }
      else {
        //%22EURUSD%22%2C%20%22EURGBP%22
        var string = "";
        for (var i = 0; i < currencies.length; i++) {
          if (currencies[i]._doc.text !== "EUR") {
            string += "%22EUR" + currencies[i]._doc.text + "%22";
            if (i < (currencies.length - 1)) {
              string += "%2C%20";
            }
          }

        }

        request.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(" + string + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var query = JSON.parse(body);
            var coins = {};
            for (var i = 0; i < currencies.length; i++) {
              var price = 1;
              if (currencies[i]._doc.text !== "EUR") price=query.query.results.rate[i].Rate
              coins[currencies[i]._doc.text] = {
                price: price,
                symbol: currencies[i]._doc.symbol
              }
            }
            // var coins = {
            //   USD: {
            //     price: query.query.results.rate[0].Rate,
            //     symbol: "$"
            //   },
            //   GBP: {
            //     price: query.query.results.rate[1].Rate,
            //     symbol: "₤"
            //   },
            //   EUR: {
            //     price: 1,
            //     symbol: "€"
            //   }
            // };
            callback(false, coins);
          } else {
            callback(true, false);
          }


        });
      }

    });

  },
  goToIndex: function (req, res, status) {
    if (!status) status = "200";
    var message = "Page not found";
    var error = {
      status: status,
      stack: "Not available"
    };
    res.render("frontEnd/404", {
      message: message,
      error: error
    });


  },
  construction: function (req, res, next) {
    db.Configurations.findOne().select("general").exec(function (err, success) {
      if (err || !success) {
        var status = "404";
        req.body.local = true;
        functions.goToIndex(req, res, status);
      } else {
        if (success._doc.general.siteOffline) {
          res.render("frontEnd/construction", {
            message: success._doc.general.offlineMessage
          });
        } else {
          return next();
        }
      }
    });
  },
  dateToUtc: function (dateToChange) {
    var date = new Date(Date.parse(dateToChange));
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    var h = date.getHours();
    var M = date.getMinutes();
    var newDate = new Date();

    newDate.setUTCFullYear(y);
    newDate.setUTCMonth(m);
    newDate.setUTCDate(d);
    newDate.setUTCHours(h);
    newDate.setUTCMinutes(M);

    return newDate.toISOString().slice(0, -8);
  },
  getSEO: function (cb) {
    configurationView.getSEO(function (err, data) {
      if (err || !data) {
        cb(err, null);
      } else {
        cb(false, data._doc.seo);
      }
    });
  },
  front_path: "frontEnd/",
  front_base: "bases/base"
};

module.exports = functions;