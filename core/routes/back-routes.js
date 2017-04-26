/**
 * Created by ernestomr87@gmail.com on 11/25/2015.
 */

var async = require("async");
var path = "backEnd/";
var session = require("./../middlewares/session");
var PATH_ROUTE = "/backoffice";
var userModelView = require("./../App/viewModels/userViewModel");
var languageModelView = require("./../App/viewModels/languageViewModel");
var textViewModel = require("./../App/viewModels/textViewModel");
var configurationViewModel = require("./../App/viewModels/configurationViewModel");
var messageViewModel = require("./../App/viewModels/messageViewModel");
var _ = require("lodash");


function today() {
  var date = new Date();
  date = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate()
  };
  return date;
};

function prepareData(user, group, cb) {
  async.parallel([
    function (callback) {
      languageModelView.listActivates(function (err, data) {
        if (err || !data) {
          callback(null, []);
        } else {
          callback(null, data);
        }
      });
    },
    function (callback) {
      textViewModel.getAdminText(user, "admin_general", function (err, texts) {
        callback(err, texts);
      });
    },
    function (callback) {
      textViewModel.getAdminText(user, group, function (err, texts) {
        callback(err, texts);
      });
    },
    function (callback) {
      configurationViewModel.listDurationsAndExperiences(user.language._id, function (err, list) {
        callback(err, list);
      });
    },
    function (callback) {
      messageViewModel.notification(user, function (err, list) {
        if (err || !list) {
          callback(err, list);
        } else {
          var messages = [];
          var max = list.length;
          if (max > 4) {
            max = 4;
          }
          for (var i = 0; i < max; i++) {
            messages.push(list[i]);
          }
          var aux = {
            cont: list.length,
            messages: messages
          };
          callback(false, aux);
        }
      });
    },
    function (callback) {
      async.parallel([
        function (cbp) {
          db.Users.count({remove: false}).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Users.count({
            remove: false,
            registerDate: {$gte: lastWeek, $lte: today}
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Ships.count({remove: false}).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Ships.count({
            remove: false,
            createDate: {$gte: lastWeek, $lte: today}
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Offers.count({status: "accept"}).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Offers.count({
            status: "accept",
            createDate: {$gte: lastWeek, $lte: today}
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Offers.count({status: "cancel"}).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Offers.count({
            status: "cancel",
            cancelDate: {$gte: lastWeek, $lte: today}
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Subscriptions.count({remove: false}).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Subscriptions.count({
            registerDate: {$gte: lastWeek, $lte: today},
            remove: false
          }).exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          db.Particulars.count().exec(function (err, count) {
            cbp(err, count);
          });
        },
        function (cbp) {
          var today = new Date();
          today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          today = new Date(today.getTime() + 86400000);
          var lastWeek = new Date(today.getTime() - (7 * 86400000));
          db.Particulars.count({
            registerDate: {$gte: lastWeek, $lte: today}
          }).exec(function (err, count) {
            cbp(err, count);
          });
        }
      ], function (err, success) {
        callback(err, success);
      });
    },
    function (callback) {
      db.Equipments.find().populate("name items.name").sort({_id: 1}).exec(function (err, data) {
        callback(err, data);
      });
    }
  ], function (err, result) {
    if (err || !result) {
      cb(err, result);
    } else {
      var texts = {
        languages: result[0],
        general: result[1],
        page: result[2],
        durations: result[3].durations,
        experiences: result[3].experiences,
        messages: result[4],
        users: result[5],
        equipments: result[6]
      };
      cb(null, texts);
    }
  });
};

function routeMessage(req, res, message) {
  prepareData(req.user, "admin_messages", function (err, data) {
    if (err || !data) {
      res.status(404).render(path + "page_404");
    } else {
      res.render(path + "bases/base-template", {
        title: "Alquiler de Barco",
        page: "offers",
        message: message,
        M_USER: req.user,
        M_LANGUAGES: data.languages,
        experiences: data.experiences,
        durations: data.durations,
        texts: {
          general: data.general,
          page: data.page
        },
        newMessages: data.messages,
        TODAY: today(),
        timezone: global.config.timezone,
        production: global.config.production
      });
    }
  });
};

exports.configRoutes = function (app) {

  app.get(PATH_ROUTE + "/login", session.noAuth, function (req, res, next) {
    res.render(path + "login", {success: true, type: "login"});
  });
  app.get(PATH_ROUTE + "/login/failure", session.noAuth, function (req, res, next) {
    res.render(path + "login", {success: false, type: "login"});
  });
  app.get(PATH_ROUTE + "/login/activate", session.noAuth, function (req, res, next) {
    res.render(path + "login", {success: true, type: "activate"});
  });
  app.get(PATH_ROUTE + "/login/activate/failure", session.noAuth, function (req, res, next) {
    res.render(path + "login", {success: false, type: "activate"});
  });
  app.get(PATH_ROUTE + "/reset_pass/:token", function (req, res, next) {

    //var token = req.query.token;
    var token = req.originalUrl.replace(PATH_ROUTE + "/reset_pass/", "");


    userModelView.checkTokenUser(token, function (err, success) {
      if (err || !success) {
        res.redirect(PATH_ROUTE + "/login");
      } else {
        var avatar = success.avatar.id ? "/service/media/" + success._id : "../backend/gentelella/images/user.png";
        res.render(path + "reset_pass", {user: success, avatar: avatar});
      }
    });
  });

  //AUTH USERS

  app.get(PATH_ROUTE, session.auth, function (req, res, next) {
    if (!req.user.permissions.isAdmin) {
      if (req.user.permissions.isShipOwner) {
        prepareData(req.user, "admin_boats", function (err, data) {
          if (err || !data) {
            res.status(404).render(path + "page_404");
          } else {
            res.render(path + "bases/base-template", {
              title: "Alquiler de Barco",
              page: "boats",
              M_USER: req.user,
              M_LANGUAGES: data.languages,
              experiences: data.experiences,
              durations: data.durations,
              equipments: data.equipments,
              texts: {
                general: data.general,
                page: data.page
              },
              newMessages: data.messages,
              TODAY: today(),
              timezone: global.config.timezone,
              production: global.config.production
            });
          }
        });
      } else {
        prepareData(req.user, "admin_profile", function (err, data) {
          if (err || !data) {
            res.status(404).render(path + "page_404");
          } else {
            res.render(path + "bases/base-template", {
              title: "Alquiler de Barco",
              page: "contact",
              M_USER: req.user,
              M_LANGUAGES: data.languages,
              texts: {
                general: data.general,
                page: data.page
              },
              newMessages: data.messages,
              TODAY: today(),
              timezone: global.config.timezone,
              production: global.config.production
            });
          }
        });
      }
    } else {
      prepareData(req.user, "admin_home", function (err, data) {
        if (err || !data) {
          res.status(404).render(path + "page_404");
        } else {
          res.render(path + "bases/base-template", {
            title: "Alquiler de Barco",
            page: "index",
            M_USER: req.user,
            M_LANGUAGES: data.languages,
            Totals: data.users,
            texts: {
              general: data.general,
              page: data.page
            },
            newMessages: data.messages,
            TODAY: today(),
            timezone: global.config.timezone,
            production: global.config.production
          });
        }
      });
    }
  });

  app.get(PATH_ROUTE + "/statistics", session.hasPermitions, function (req, res, next) {
    prepareData(req.user, "admin_profile", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "statistics",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/contact", session.auth, function (req, res, next) {
    prepareData(req.user, "admin_profile", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "contact",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/invoice", session.hasUser, function (req, res, next) {
    prepareData(req.user, "admin_profile", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "invoice",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });
  //PERMISSIONS USERS

  app.get(PATH_ROUTE + "/boats", session.hasPermitions, function (req, res, next) {
    prepareData(req.user, "admin_boats", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "boats",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          experiences: data.experiences,
          durations: data.durations,
          equipments: data.equipments,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  //ADMIN USERS

  app.get(PATH_ROUTE + "/users", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_users", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "users",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/owners", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_users", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "owners",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/particulars", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_users", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "particulars",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/subscripts", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_users", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "subscripts",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/languages", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_languages", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "languages",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/localizations", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_users", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "localizations",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/texts", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_texts", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "texts",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/tool", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_texts", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "tool",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/configuration", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_configuration", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "configuration",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/notifications", session.isAdmin, function (req, res, next) {
    prepareData(req.user, "admin_notifications", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "notifications",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/requests", session.hasPermitions, function (req, res, next) {
    prepareData(req.user, "admin_requests", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "requests",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          experiences: data.experiences,
          durations: data.durations,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production,
          request: null,
          method: null
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/requests/:method/:id", session.isShipOwner, function (req, res, next) {
    prepareData(req.user, "admin_requests", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "requests",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          experiences: data.experiences,
          durations: data.durations,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production,
          request: req.params.id,
          method: req.params.method
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/error-booking", session.auth, function (req, res, next) {
    routeMessage(req, res, "error-booking");
  });

  app.get(PATH_ROUTE + "/occupied-booking", session.auth, function (req, res, next) {
    routeMessage(req, res, "occupied-booking");
  });

  app.get(PATH_ROUTE + "/invoices", session.auth, function (req, res, next) {
    prepareData(req.user, "admin_invoices", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {

        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "invoices",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          experiences: data.experiences,
          durations: data.durations,
          texts: {
            general: data.general,
            page: data.page
          },
          iva: global.config.iva,
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "/landings", session.isAdmin, function (req, res, next) {

    prepareData(req.user, "admin_landings", function (err, data) {
      if (err || !data) {
        res.status(404).render(path + "page_404");
      } else {
        res.render(path + "bases/base-template", {
          title: "Alquiler de Barco",
          page: "landings",
          M_USER: req.user,
          M_LANGUAGES: data.languages,
          experiences: data.experiences,
          durations: data.durations,
          texts: {
            general: data.general,
            page: data.page
          },
          newMessages: data.messages,
          TODAY: today(),
          timezone: global.config.timezone,
          production: global.config.production
        });
      }
    });
  });

  app.get(PATH_ROUTE + "*", function (req, res) {
    res.status(404).render(path + "page_404");
  });


};