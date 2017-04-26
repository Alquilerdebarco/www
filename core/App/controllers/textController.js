/**
 * Created by ernestomr87@gmail.com on1/18/2016.
 */

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var PATH = "/service/text";
var textViewModel = require("./../viewModels/textViewModel");
var pageMediaViewModel = require("./../viewModels/pageMediaViewModel");
var session = require("./../../middlewares/session");

var text = {
  registerRoutes: function (app) {
    app.post(PATH, session.isAdmin, this.create);
    app.get(PATH, session.isAdmin, this.list);
    app.get(PATH + "/:group", session.isAdmin, this.getGroupText);
    app.put(PATH, session.isAdmin, this.update);
    app.delete(PATH, session.isAdmin, this.remove);
    app.post(PATH + "/menu", session.isAdmin, this.menu);
    app.post(PATH + "/photos", session.isAdmin, multipartMiddleware, this.addPhotos);
    app.delete(PATH + "/photos", session.isAdmin, this.delPhotos);

    app.post(PATH + "/page/photos", session.isAdmin, multipartMiddleware, this.addPagePhoto);
    app.get(PATH + "/page/photos", session.isAdmin, multipartMiddleware, this.getPagePhoto);
    app.put(PATH + "/page/photos", session.isAdmin, multipartMiddleware, this.removePagePhoto);
  },
  create: function (req, res) {
    var text = req.body.text;
    textViewModel.create(text, function (err, text) {
      if (err || !text) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: null
        });
      }
    });
  },
  getGroupText: function (req, res) {
    var group = req.params.group;
    textViewModel.getGroupText(group, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }

    });
  },
  list: function (req, res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var list = req.query.list;


    textViewModel.list(limit, skip, list, function (err, texts, count) {
      if (err || !texts) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: texts,
          cont: count
        });
      }
    });
  },
  update: function (req, res) {
    var text = req.body.text;
    if (text) {
      textViewModel.update(text, function (err, text) {
        if (err || !text) {
          res.json({
            res: false,
            error: err
          });
        } else {
          res.json({
            res: true,
            error: null
          });
        }
      });
    } else {
      var err = new Error("Text No Found");
      res.json({
        res: false,
        error: err
      });
    }

  },
  remove: function (req, res) {
    var text = JSON.parse(req.query.text);
    textViewModel.remove(text._id, function (err, text) {
      if (err || !text) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: null
        });
      }
    });
  },
  addPhotos: function (req, res) {
    var id = req.body.id;
    var identification = req.body.identification;
    var file = JSON.parse(req.body.file);
    textViewModel.addPhotos(id, identification, file, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }

    });
  },
  delPhotos: function (req, res) {
    var id = req.query.id;
    var photo = req.query.photo;
    textViewModel.delPhotos(id, photo, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }
    });
  },
  addPagePhoto: function (req, res) {
    var page = req.body.page;
    var files = req.files;
    pageMediaViewModel.addPhotos(page, files, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }

    });
  },
  getPagePhoto: function (req, res) {
    var page = req.query.page;
    pageMediaViewModel.getPhotos(page, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }
    });
  },
  removePagePhoto: function (req, res) {
    var id = req.body.id;
    pageMediaViewModel.removePhoto(id, function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: err
        });
      }
    });

  },
  menu: function (req, res) {
    var id = req.body.id;
    var action = req.body.action;
    textViewModel.menu(id, action, function (err, success) {
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

module.exports = text;