/**
 * Created by ernestomr87@gmail.com on 3/10/2016.
 */

var PATH = "/service/landing";
var session = require("./../../middlewares/session");
var landingViewModel = require("./../viewModels/landingViewModel");
var _ = require("lodash");


var landing = {
  registerRoutes: function (app) {
    app.post(PATH, session.isAdmin, this.create);
    app.put(PATH, session.isAdmin, this.update);
    app.get(PATH + "/front", this.listFront);
    app.get(PATH, session.isAdmin, this.list);
    app.delete(PATH, session.isAdmin, this.remove);
    app.post(PATH + "/publish", session.isAdmin, this.publish);
    app.post(PATH + "/noindex", session.isAdmin, this.noindex);
    app.post(PATH + "/nofollow", session.isAdmin, this.nofollow);
    app.post(PATH + "/menu", session.isAdmin, this.menu);
    app.post(PATH + "/create", this.createLandig);
  },
  create: function (req, res) {
    var filter = req.body.filter;
    landingViewModel.create(filter, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  update: function (req, res) {
    var landing = req.body.landing;
    landingViewModel.update(landing, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  list: function (req, res) {
    var limit = parseInt(req.query.limit);
    var skip = parseInt(req.query.skip);
    var menu = req.query.menu;
    landingViewModel.list(limit, skip, menu, function (err, success, count) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: success, cont: count});
      }
    });
  },
  listFront: function (req, res) {
    var limit = parseInt(req.query.limit);
    var skip = parseInt(req.query.skip);
    var culture = req.query.culture;
    landingViewModel.listFront(culture, limit, skip, function (err, success, count) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: success, cont: count});
      }
    });

  },
  remove: function (req, res) {
    var id = req.query.id;
    landingViewModel.remove(id, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  publish: function (req, res) {
    var id = req.body.id;
    landingViewModel.publish(id, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  noindex: function (req, res) {
    var id = req.body.id;
    landingViewModel.noindex(id, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  nofollow: function (req, res) {
    var id = req.body.id;
    landingViewModel.nofollow(id, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });

  },
  createLandig: function (req, res) {
    var filter = JSON.parse(req.body.filter);
    var lang = req.body.lang;
    if (!_.isEmpty(filter) || !_.isEmpty(lang)) {
      landingViewModel.createLanding(filter, lang, function (err, landing) {
        if (err || !landing) {
          return res.json({res: false, error: err});
        } else {
          return res.json({res: landing, error: false});
        }
      });
    } else {
      return res.json({res: false, error: "Invalid Form"});
    }
  },
  menu: function (req, res) {
    var id = req.body.id;
    var action = req.body.action;
    landingViewModel.menu(id, action, function (err, success) {
      if (err || !success) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: true, error: err});
      }
    });
  }
};

module.exports = landing;