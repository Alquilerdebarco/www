/**
 * Created by ernestomr87@gmail.com on 3/10/2016.
 */


var PATH = "/service/engine";
var server;
var engineViewModel = require("./../viewModels/engineViewModel");
var session = require("./../../middlewares/session");
var urlUtil = require("url");


var engine = {
  registerRoutes: function (app) {
    server = app;
    app.get(PATH + "/book/:token", this.book);
    app.get(PATH + "/return", this.return);
    app.get(PATH + "/returnRedsys", this.returnRedsys);
    app.get(PATH + "/cancel", this.cancel);
    app.post(PATH + "/refund", session.nocache, this.refund);
    app.post(PATH + "/invoice", session.authService, this.invoice);
    app.put(PATH + "/invoice", session.authService, this.getInvoice);
    app.get(PATH + "/invoice", session.authService, this.adminInvoice);
    app.post(PATH + "/graphic", session.authService, this.graphic);
    app.put(PATH + "/graphic", session.authService, this.userGraphic);
    app.post(PATH + "/session", this.saveSession);
  },
  saveSession: function (req, res) {
    var token = JSON.parse(req.body.token) || null;
    if (token && (token.offer && token.method)) {
      req.session.sale = {
        offer: token.offer,
        method: token.method
      };
      res.json({
        res: token,
        error: null
      });
    }
  },
  book: function (req, res) {
    var token = JSON.parse(req.params.token);
    req.session.sale = {
      offer: token.offer,
      method: token.method
    };
    var iso = req.session.lang || "es";
    engineViewModel.book(iso, token.offer, token.method, function (err, success, url) {
      if (err) {
        req.session.sale = null;
        if (url) {
          res.redirect(url);
        } else {
          res.json({
            res: false,
            error: err
          });
        }
      } else {
        res.redirect(url);
      }
    });
  },
  return: function (req, res) {
    var offer = req.session.sale.offer,
      method = req.session.sale.method;
    var payerId = req.query.PayerID || null,
      paymentId = req.query.paymentId || null,
      token = req.query.token || null;
    var iso = req.session.lang || "es";

    engineViewModel.return(iso, offer, method, payerId, paymentId, token, function (err, success, url) {
      req.session.sale = null;
      if (err) {
        if (url) {
          return res.redirect(url);
        } else {
          return res.json({
            res: false,
            error: err
          });
        }
      } else {
        return res.redirect(url);
      }
    });
  },
  returnRedsys: function (req, res) {
    var offer = req.session.sale.offer,
      method = req.session.sale.method;
    var dsMerchantParameters = req.query.Ds_MerchantParameters;
    var dsSignature = req.query.Ds_Signature;
    var dsSignatureVersion = req.query.Ds_SignatureVersion;

    var iso = req.session.lang || "es";
    engineViewModel.returnRedsys(iso, offer, method, dsMerchantParameters, dsSignature, dsSignatureVersion, function (err, success, url) {
      req.session.sale = null;
      if (err) {
        if (url) {
          return res.redirect(url);
        } else {
          return res.json({
            res: false,
            error: err
          });
        }
      } else {
        return res.redirect(url);
      }
    });
  },
  refund: function (req, res) {
    var offer = req.body.offer;
    engineViewModel.refund(offer, req.user, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: err
        });
      }
    });
  },
  invoice: function (req, res) {
    engineViewModel.invoice(req.user, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: err
        });
      }
    });
  },
  graphic: function (req, res) {
    var start = req.body.start || null;
    var end = req.body.end || null;

    engineViewModel.graphic(start, end, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: err
        });
      }
    });
  },
  userGraphic: function (req, res) {
    engineViewModel.userGraphic(req.user, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: err
        });
      }
    });
  },
  getInvoice: function (req, res) {
    var month = req.body.month;
    engineViewModel.getInvoice(month, req.user, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: err
        });
      }
    });
  },
  adminInvoice: function (req, res) {
    var month = req.query.month;
    var year = req.query.year || new Date().getFullYear();
    var email = req.query.email;
    var type = req.query.type;
    var limit = req.query.limit,
      skip = req.query.skip;
    var order = req.query.order;
    engineViewModel.adminInvoice(email, month, year, req.user, type, limit, skip, order, function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: err
        });
      }
    });
  },
  cancel: function (req, res) {
    var errorEsPage = "/es/estado-reserva";
    var errorEnPage = "/en/booking-status";
    var errorPage;
    if (req.session.lang == 'es') {
      errorPage = errorEsPage;
    }
    else {
      errorPage = errorEnPage;
    }
    var url = urlUtil.resolve("/", errorPage);
    return res.redirect(url);
  }
};

module.exports = engine;