/**
 * Created by ernestomr87@gmail.com on 12/16/2015.
 */

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var _ = require("lodash");
var shipViewModel = require("./../../App/viewModels/shipViewModel");
var session = require("./../../middlewares/session");
var util = require("../utils/functions");

var PATH = "/service/ships";
var ship = {
  registerRoutes: function(app) {

    /*General*/
    app.get(PATH, session.hasPermitionsService, session.nocache, this.list);
    app.post(PATH, session.hasPermitionsService, session.nocache, this.create);
    app.put(PATH, session.hasPermitionsService, session.nocache, this.update);
    app.delete(PATH, session.hasPermitionsService, session.nocache, this.delete);
    app.post(PATH + "/status", session.isShipOwnerService, session.nocache, this.status);
    app.post(PATH + "/publish", session.isAdmin, session.nocache, this.publish);
    app.put(PATH + "/technicalDetails", session.hasPermitionsService, session.nocache, this.technicalDetails);
    app.post(PATH + "/photos", session.hasPermitionsService, multipartMiddleware, session.nocache, this.addPhotos);
    app.delete(PATH + "/photos", session.hasPermitionsService, session.nocache, this.delPhotos);
    app.put(PATH + "/photos", session.hasPermitionsService, session.nocache, this.setAsDefaultPhoto);
    /*Equipments*/
    app.put(PATH + "/equipments", session.hasPermitionsService, session.nocache, this.updateEquipments);
    /*Events*/
    app.post(PATH + "/event", session.hasPermitionsService, session.nocache, this.createEvent);
    app.put(PATH + "/event", session.hasPermitionsService, session.nocache, this.updateEvent);
    app.delete(PATH + "/event", session.hasPermitionsService, session.nocache, this.removeEvent);
    /*Seasons*/
    app.post(PATH + "/season", session.hasPermitionsService, session.nocache, this.createSeason);
    app.put(PATH + "/season", session.hasPermitionsService, session.nocache, this.updateSeason);
    app.delete(PATH + "/season", session.hasPermitionsService, session.nocache, this.removeSeason);
    /*Others*/
    app.post(PATH + "/updateLocalization", session.hasPermitionsService, session.nocache, this.updateLocalization);
    /*Conditions*/
    app.post(PATH + "/conditions", session.hasPermitionsService, session.nocache, this.saveConditions);
    app.put(PATH + "/discounts", session.hasPermitionsService, session.nocache, this.saveDiscounts);
    app.post(PATH + "/available", session.hasPermitionsService, session.nocache, this.available);
    app.post(PATH + "/coin", session.nocache, this.updateCoin);
    app.get(PATH + "/listFront", session.nocache, this.listFront);
  },
  create: function(req, res) {
    var name = req.body.name,
      title = req.body.title,
      tags = req.body.tags,
      description = req.body.description,
      manufacturer = req.body.manufacturer,
      model = req.body.model,
      year = req.body.year,
      lastRedecorate = req.body.lastRedecorate || null,
      shipType = req.body.shipType,
      rentType = req.body.rentType,
      noindex = req.body.noindex,
      nofollow = req.body.nofollow;

    var error = {
      errmsg: ""
    };

    if (_.isEmpty(name) || _.isEmpty(manufacturer) || _.isEmpty(model)) {
      error.errmsg = "Form incorrect";
      res.json({
        res: false,
        error: error
      });
    } else {
      shipViewModel.create(req.user._id, name, title, description, manufacturer, model, year, lastRedecorate, shipType, rentType, tags, noindex, nofollow, function(err, ship) {
        return res.json({
          res: ship,
          error: err
        });
      });
    }

  },
  technicalDetails: function(req, res) {
    var id = req.body.id,
      habitability = req.body.habitability,
      measurements = req.body.measurements,
      engine = req.body.engine,
      deposits = req.body.deposits;

    shipViewModel.technicalDetails(id, habitability, measurements, engine, deposits, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },
  updateEquipments: function(req, res) {
    var id = req.body.id,
      equipments = req.body.equipments;

    shipViewModel.updateEquipments(id, equipments, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });


  },
  updateLocalization: function(req, res) {
    var id = req.body.id;
    var localization = req.body.localization;
    shipViewModel.updateLocalization(id, localization, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },
  update: function(req, res) {
    var id = req.body.id,
      tags = req.body.tags,
      name = req.body.name,
      title = req.body.title,
      description = req.body.description,
      manufacturer = req.body.manufacturer,
      model = req.body.model,
      year = req.body.year,
      lastRedecorate = req.body.lastRedecorate || null,
      shipType = req.body.shipType,
      rentType = req.body.rentType,
      finder = req.body.finder,
      noindex = req.body.noindex,
      nofollow = req.body.nofollow;

    var error = {
      errmsg: ""
    };

    if (_.isEmpty(name) || _.isEmpty(manufacturer) || _.isEmpty(model)) {
      error.errmsg = "Form incorrect";
      res.json({
        res: false,
        error: error
      });
    } else {

      shipViewModel.update(id, req.user._id, name, title, description, manufacturer, model, year, lastRedecorate, shipType, rentType, finder, tags, noindex, nofollow, function(err, ship) {
        return res.json({
          res: ship,
          error: err
        });
      });
    }

  },
  list: function(req, res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var status = req.query.status || null;
    var string = req.query.string;
    var userid = req.query.userid || null;
    var countryid = req.query.countryid || null;
    var cityid = req.query.cityid || null;
    var areaid = req.query.areaid || null;
    var portid = req.query.portid || null;


    var user = req.user;
    shipViewModel.list(limit, skip, string, status, user, userid, countryid, cityid, areaid, portid, function(err, ships, count) {
      if (err || !ships) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: ships,
          cont: count
        });
      }
    });
  },
  //culture, limit, skip, filter, coin
  listFront: function(req, res) {
    var culture = req.session.lang,
      limit = req.query.limit,
      skip = 0,
      filter = req.query.filter,
      coin = req.session.coin;
    if (!_.isEmpty(culture) || !_.isEmpty(limit)) {
      shipViewModel.listFront(culture, limit, skip, filter, coin, function(err, ships, cont) {
        if (err || !ships) {
          return res.status(500).send(err);
        } else {
          if (cont % 10) {
            var last = parseInt(cont / 10) + 1;
          } else {
            var last = cont / 10;
          }
          var current = (limit - 10) / 10 + 1;
          var aux = {
            list: ships,
            cont: cont,
            first: 1,
            next: null,
            back: null,
            currentPage: current,
            last: last
          };
          return res.status(200).send(aux);
        }
      });
    } else {
      return res.status(400).send("Bad Request");
    }
  },
  delete: function(req, res) {
    var id = req.query.id;
    shipViewModel.remove(id, req.user, function(err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: id,
          error: err
        });
      }
    });
  },
  status: function(req, res) {
    var id = req.body.id;
    shipViewModel.status(id, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },
  publish: function(req, res) {
    var id = req.body.id;
    shipViewModel.publish(id, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },

  createEvent: function(req, res) {
    var id = req.body.id,
      event = req.body.event;

    var newEvent = {
      start: new Date(event.start.year, event.start.month, event.start.day),
      end: new Date(event.end.year, event.end.month, event.end.day),
      title: event.title
    };
    shipViewModel.createEvent(id, newEvent, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },
  updateEvent: function(req, res) {
    var id = req.body.id,
      event = req.body.event;


    var newEvent = {
      id: event.id,
      start: new Date(event.start.year, event.start.month, event.start.day),
      end: new Date(event.end.year, event.end.month, event.end.day),
      title: event.title
    };

    shipViewModel.updateEvent(id, newEvent, function(err, ship, event) {
      if (err) {
        return res.json({ res: null, error: err });
      } else {
        return res.json({ res: ship, event: event });
      }
    });
  },
  removeEvent: function(req, res) {
    var id = req.query.id,
      event = JSON.parse(req.query.event);

    shipViewModel.removeEvent(id, event, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },

  createSeason: function(req, res) {
    var id = req.body.id,
      season = req.body.season;
    shipViewModel.createSeason(id, season, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },

  updateSeason: function(req, res) {
    var id = req.body.id,
      season = req.body.season;
    shipViewModel.updateSeason(id, season, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },

  removeSeason: function(req, res) {
    var id = req.query.id,
      season = JSON.parse(req.query.season);

    shipViewModel.removeSeason(id, season, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },


  saveConditions: function(req, res) {
    var id = req.body.id,
      conditions = req.body.conditions;

    shipViewModel.saveConditions(id, conditions, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },

  addPhotos: function(req, res) {
    var id = req.body.id;
    var files = req.files;
    shipViewModel.addPhotos(id, files, function(err, success) {
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
  delPhotos: function(req, res) {
    var id = req.query.id;
    var photo = JSON.parse(req.query.photo);
    shipViewModel.delPhotos(id, photo, function(err, success) {
      return res.json({
        res: success,
        error: err
      });
    });
  },
  setAsDefaultPhoto: function(req, res) {
    var id = req.body.id;
    var photo = req.body.photo;
    shipViewModel.setAsDefaultPhoto(id, photo, function(err, success) {
      return res.json({
        res: success,
        error: err
      });
    });
  },


  saveDiscounts: function(req, res) {
    var id = req.body.id,
      discounts = req.body.discounts;

    shipViewModel.saveDiscounts(id, discounts, function(err, ship) {
      return res.json({
        res: ship,
        error: err
      });
    });
  },
  available: function(req, res) {
    var day = req.body.day;

    shipViewModel.available(day, req.user, function(err, ships) {
      return res.json({
        res: ships,
        error: err
      });
    });
  },
  updateCoin: function(req, res) {
    var currency = req.body.currency;
    if (!_.isEmpty(currency)) {
      shipViewModel.updateCoin(currency, function(err, coin) {
        return res.json({
          res: coin,
          err: err
        });
      });
    } else {
      shipViewModel.updateCoin("EUR", function(err, coin) {
        return res.json({
          res: coin,
          err: err
        });
      });
    }
  }


};
module.exports = ship;