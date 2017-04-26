/**
 * Created by ernestomr87@gmail.com on 2/26/2016.
 */

var PATH = "/service/offers";
var server;
var offerViewModel = require("./../viewModels/offerViewModel");
var session = require("./../../middlewares/session");

var offer = {
  registerRoutes: function(app) {
    server = app;
    app.post(PATH, session.authService, this.create);
    app.get(PATH, session.hasPermitionsService, this.listOwner);
    app.post(PATH + "/delete", session.hasPermitionsService, this.delete);
    app.get(PATH + "/:id", session.hasPermitionsService, this.get);
    // app.post(PATH + '/list', session.auth, this.list);
    // app.post(PATH + '/reject', session.auth, this.reject);
  },
  create: function(req, res) {
    var offer = req.body.offer;
    var user = req.user;
    offerViewModel.create(offer, user, function(err, text) {
      if (err || !text) {
        res.json({ res: false, error: err });
      } else {
        res.json({ res: true, error: null });
      }
    });
  },
  listOwner: function(req, res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var request = req.query.request;
    var status = req.query.status;


    offerViewModel.listOwner(limit, skip, request, status, req.user, function(err, offers, count) {
      if (err || !offers) {
        return res.json({ res: false, error: err });
      } else {
        return res.json({ res: offers, cont: count });
      }
    });
  },

  list: function(req, res) {
    var limit = req.body.limit;
    var skip = req.body.skip;
    var status = req.body.status;
    offerViewModel.list(limit, skip, status, req.user, function(err, offers, count) {
      if (err || !offers) {
        return res.json({ res: false, error: err });
      } else {
        return res.json({ res: offers, cont: count });
      }
    });
  },

  get: function(req, res) {
    var id = req.params.id;
    offerViewModel.get(id, req.user, function(err, offer) {
      if (err || !offer) {
        res.json({ res: false, error: err });
      } else {
        res.json({ res: offer, error: null });
      }
    });
  },
  delete: function(req, res) {
    var id = req.body.id;
    offerViewModel.delete(id, req.user, function(err, success) {
      if (err || !success) {
        res.json({ res: false, error: err });
      } else {
        res.json({ res: true, error: null });
      }
    });
  },
  reject: function(req, res) {
    var id = req.body.id;
    offerViewModel.reject(id, req.user, function(err, success) {
      if (err || !success) {
        res.json({ res: false, error: err });
      } else {
        res.json({ res: true, error: null });
      }
    });
  }
};

module.exports = offer;