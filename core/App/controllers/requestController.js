/**
 * Created by ernestomr87@gmail.com on 2/25/2016.
 */


var PATH = "/service/requests";
var requestViewModel = require("./../viewModels/requestViewModel");
var session = require("./../../middlewares/session");

var request = {
  registerRoutes: function (app) {
    app.post(PATH, this.create);
    app.get(PATH, session.hasPermitionsService, this.list);
    app.get(PATH + "/:id", session.hasPermitionsService, this.get);
    app.delete(PATH, session.hasPermitionsService, this.unavailable);
  },
  create: function (req, res) {
    var iso = req.session.lang || "es";
    var request = JSON.parse(req.body.request);
    if (req.user) {
      request.email = req.user.email;
      request.mobile = req.user.mobile;
      request.name = req.user.name + " " + req.user.surname;
      request.client = req.user._id;
    }
    requestViewModel.create(request, iso, function (err, text) {
      if (err || !text) {
        res.json({res: false, error: err});
      }
      else {
        res.json({res: text, error: null});
      }
    });
  },
  list: function (req, res) {
    var limit = req.query.limit,
      skip = req.query.skip,
      check = req.query.check,
      status = req.query.status,
      iso = req.session.lang || "es",
      string = req.query.string,
      sortOptions = req.query.sortOptions ? JSON.parse(req.query.sortOptions) : null;

    requestViewModel.list(limit, skip, check, status, req.user, iso, string, sortOptions, function (err, texts, count) {
      if (err || !texts) {
        return res.json({res: false, error: err});
      }
      else {
        return res.json({res: texts, cont: count});
      }
    });
  },
  get: function (req, res) {
    var id = req.params.id;
    var iso = req.session.lang || "es";
    requestViewModel.get(id, iso, function (err, request) {
      if (err || !request) {
        res.json({res: false, error: err});
      }
      else {
        res.json({res: request, error: null});
      }
    });
  },
  unavailable: function (req, res) {
    var id = req.query.request;
    var iso = req.session.lang || "es";
    requestViewModel.unavailable(id, iso, req.user, function (err, request) {
      if (err || !request) {
        res.json({res: false, error: err});
      }
      else {
        res.json({res: request, error: null});
      }
    });
  },
};

module.exports = request;
