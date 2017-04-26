/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

var languageViewModel = require("./../viewModels/languageViewModel");
var PATH = "/service/language";
var session = require("./../../middlewares/session");

var language = {
  registerRoutes: function (app) {
    app.post(PATH, session.isAdmin, this.create);
    app.put(PATH, session.isAdmin, this.update);
    app.get(PATH, session.isAdmin, this.list);
    app.delete(PATH, session.isAdmin, this.toTrash);
    app.post(PATH + "/status", session.isAdmin, this.status);
    app.post(PATH + "/restore", session.isAdmin, this.toRestore);
    app.delete(PATH + "/restore", session.isAdmin, this.remove);
    app.post(PATH + "/active", session.isAdmin, this.listActivates);
    app.post(PATH + "/menu", session.isAdmin, this.menu);
  },
  create: function (req, res) {
    var iso = req.body.language.iso,
      name = req.body.language.name;
    languageViewModel.create(iso, name, false, false, function (err, lang) {
      res.json({
        res: lang,
        err: err
      });
    });
  },
  update: function (req, res) {
    var id = req.body.language._id,
      iso = req.body.language.iso,
      name = req.body.language.name;
    languageViewModel.update(id, iso, name, function (err, lang) {
      res.json({
        res: lang,
        err: err
      });
    });
  },
  list: function (req, res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var remove = req.query.remove;
    languageViewModel.list(limit, skip, remove, function (err, list, contT, contR) {
      if (err || !list) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: list,
          contT: contT,
          contR: contR
        });
      }
    });
  },
  status: function (req, res) {
    var id = req.body.id;
    languageViewModel.status(id, function (err, success) {
      res.json({
        res: success,
        err: err
      });
    });
  },
  toTrash: function (req, res) {
    var id = req.query.id;
    languageViewModel.toTrash(id, function (err, success) {
      res.json({
        res: success,
        err: err
      });
    });
  },
  toRestore: function (req, res) {
    var id = req.body.id;
    languageViewModel.toRestore(id, function (err, success) {
      res.json({
        res: success,
        err: err
      });
    });
  },
  remove: function (req, res) {
    var id = req.query.id;
    languageViewModel.remove(id, function (err, success) {
      res.json({
        res: success,
        err: err
      });
    });
  },
  listActivates: function (req, res) {
    languageViewModel.listActivates(function (err, success) {
      res.json({
        res: success,
        err: err
      });
    });
  },
  menu: function (req, res) {
    var id = req.body.id;
    var action = req.body.action;
    languageViewModel.menu(id, action, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: true,
          error: err
        });
      }
    });
  }
};
module.exports = language;