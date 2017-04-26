/**
 * Created by ernestomr87@gmail.com on 1/25/2016.
 */

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var _ = require("lodash");
var configurationViewModel = require("./../../App/viewModels/configurationViewModel");
var session = require("./../../middlewares/session");
var notificationViewModel = require("./../viewModels/notificationViewModel");

var PATH = "/service/configurations";
var configuration = {
  registerRoutes: function (app) {
    app.get(PATH, this.get);

    app.post(PATH + "/general", session.isAdmin, session.nocache, this.saveGeneral);
    app.post(PATH + "/metaData", session.isAdmin, session.nocache, this.saveMetaData);
    app.post(PATH + "/mailSettings", session.isAdmin, session.nocache, this.saveMailSettings);
    app.post(PATH + "/photos", session.isAdmin, multipartMiddleware, session.nocache, this.addPhotos);
    app.delete(PATH + "/photos", session.isAdmin, session.nocache, this.delPhotos);
    app.post(PATH + "/duration", session.isAdmin, session.nocache, this.addDuration);
    app.delete(PATH + "/duration", session.isAdmin, session.nocache, this.delDuration);
    app.get(PATH + "/experience/:id", session.isAdmin, session.nocache, this.defaultExperience);
    app.get(PATH + "/experience", session.isAdmin, session.nocache, this.listExperience);
    app.post(PATH + "/experience", session.isAdmin, session.nocache, this.addExperience);
    app.put(PATH + "/experience", session.isAdmin, session.nocache, this.saveExperience);
    app.delete(PATH + "/experience", session.isAdmin, session.nocache, this.delExperience);
    app.post(PATH + "/experience/unCheck", session.isAdmin, session.nocache, this.unCheck);

    app.get(PATH + "/listFront", session.nocache, this.listFront);
    app.get(PATH + "/types", session.nocache, this.listShipType);
    app.get(PATH + "/typesFront", session.nocache, this.listShipFront);
    app.post(PATH + "/types", session.nocache, this.addShipType);
    app.delete(PATH + "/types", session.nocache, this.removeShipType);
    app.put(PATH + "/types", session.nocache, this.saveShipType);
    app.get(PATH + "/tags", session.nocache, this.listTags);
    app.post(PATH + "/tags", session.nocache, this.addTag);
    app.put(PATH + "/tags", session.nocache, this.saveTag);
    app.delete(PATH + "/tags", session.nocache, this.removeTag);
    /*Equipments*/
    app.get(PATH + "/equipments", session.isAdmin, session.nocache, this.listEquipments);
    app.post(PATH + "/equipments", session.isAdmin, session.nocache, this.createEquipments);
    app.put(PATH + "/equipments", session.isAdmin, session.nocache, this.updateEquipments);
    app.delete(PATH + "/equipments", session.isAdmin, session.nocache, this.removeEquipment);
    /*Equip*/
    app.post(PATH + "/equip", session.isAdmin, session.nocache, this.createEquip);
    app.delete(PATH + "/equip", session.isAdmin, session.nocache, this.removeEquip);
    app.put(PATH + "/equip", session.isAdmin, session.nocache, this.updateEquip);
    app.post(PATH + "/paypal", session.nocache, this.updatePaypal);
    app.post(PATH + "/redsys", session.nocache, this.updateRedsys);
    app.post(PATH + "/iva", session.nocache, this.updateIva);
    app.post(PATH + "/test", session.nocache, this.testMail);
    app.post(PATH + "/contract", session.nocache, this.saveContract);
    app.post(PATH + "/updateseo", session.nocache, this.updateSEO);
    app.get(PATH + "/currencies", session.isAdmin, session.nocache, this.listCurrencies);
    app.post(PATH + "/currencies", session.isAdmin, session.nocache, this.createCurrency);
    app.delete(PATH + "/currencies", session.isAdmin, session.nocache, this.removeCurrency);
    app.put(PATH + "/currencies", session.isAdmin, session.nocache, this.updateCurrency);
    app.post(PATH + "/currencies/menu", session.isAdmin, this.currencyMenu);

    app.get(PATH + "/backup", session.isAdmin, this.export);
    app.post(PATH + "/backup", session.isAdmin, multipartMiddleware, session.nocache, this.import);
  },
  saveGeneral: function (req, res) {
    var general = req.body.general;
    configurationViewModel.saveGeneral(general, function (err, success) {
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
  },
  saveMetaData: function (req, res) {
    var meta = req.body.meta;
    configurationViewModel.saveMetaData(meta, function (err, success) {
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
  },
  saveMailSettings: function (req, res) {
    var mailSettings = req.body.mailSettings;
    configurationViewModel.saveMailSettings(mailSettings, function (err, success) {
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
  },
  updatePaypal: function (req, res) {
    var data = req.body.data;
    configurationViewModel.updatePaypal(data, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  updateRedsys: function (req, res) {
    var data = req.body.data;
    configurationViewModel.updateRedsys(data, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  updateIva: function (req, res) {
    var iva = req.body.iva;
    configurationViewModel.updateIva(iva, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  get: function (req, res) {
    configurationViewModel.get(function (err, success) {
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
  addPhotos: function (req, res) {
    var files = req.files;
    configurationViewModel.addPhotos(files, function (err, success) {
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
    var photo = req.query.photo;
    configurationViewModel.delPhotos(photo, function (err, success) {
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
  addDuration: function (req, res) {
    var duration = req.body.duration;
    configurationViewModel.addDuration(duration, function (err, success) {
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
  delDuration: function (req, res) {
    var duration = JSON.parse(req.query.duration);
    configurationViewModel.delDuration(duration, function (err, success) {
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
  addExperience: function (req, res) {
    var experience = req.body.experience;
    configurationViewModel.addExperience(experience, function (err, success) {
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
  listExperience: function (req, res) {
    configurationViewModel.listExperience(function (err, success) {
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
  saveExperience: function (req, res) {
    var experience = req.body.experience;
    configurationViewModel.saveExperience(experience, function (err, success) {
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
  delExperience: function (req, res) {
    var experience = JSON.parse(req.query.experience);
    configurationViewModel.delExperience(experience, function (err, success) {
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
  defaultExperience: function (req, res) {
    var id = req.params.id;
    configurationViewModel.defaultExperience(id, function (err, success) {
      return res.json({
        res: success,
        error: err
      });

    });
  },
  unCheck: function (req, res) {
    var id = req.body.id;
    configurationViewModel.unCheck(id, function (err, success) {
      return res.json({
        res: success,
        error: err
      });
    });
  },
  listFront: function (req, res) {
    var culture = req.query.culture;
    if (!_.isEmpty(culture)) {
      configurationViewModel.listDurationAndXpFront(culture, function (err, xp) {
        if (err || !xp) {
          res.json({
            res: false,
            error: err
          });
        } else {
          res.json({
            res: xp,
            error: false
          });
        }
      });
    } else {
      res.json({
        res: false,
        error: "language is invalid"
      });
    }
  },
  listShipType: function (req, res) {
    configurationViewModel.listShipType(function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: types,
          error: false
        });
      }
    });
  },
  addShipType: function (req, res) {
    var data = req.body.data;
    configurationViewModel.addShipType(data, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  saveShipType: function (req, res) {
    var data = req.body.data;
    configurationViewModel.saveShipType(data, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  removeShipType: function (req, res) {
    var id = req.query.id;
    configurationViewModel.removeShipType(id, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  listShipFront: function (req, res) {
    var culture = req.query.culture;
    if (!_.isEmpty(culture)) {
      configurationViewModel.listFrontShipType(culture, function (err, shipsType) {
        if (err || !shipsType) {
          res.json({
            res: false,
            err: err
          });
        } else {
          res.json({
            res: shipsType,
            err: false
          });
        }
      });
    } else {
      res.json({
        res: false,
        err: "Invalid language"
      });
    }
  },
  listTags: function (req, res) {
    configurationViewModel.listTags(function (err, tags) {
      if (err || !tags) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: tags,
          error: false
        });
      }
    });
  },
  addTag: function (req, res) {
    var tag = req.body.tag;
    configurationViewModel.addTag(tag, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  saveTag: function (req, res) {
    var tag = req.body.tag;
    configurationViewModel.saveTag(tag, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  removeTag: function (req, res) {
    var id = req.query.id;
    configurationViewModel.removeTag(id, function (err, types) {
      if (err || !types) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: true,
          error: false
        });
      }
    });
  },
  listEquipments: function (req, res) {
    configurationViewModel.listEquipments(function (err, success) {
      if (err || !success) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: success,
          error: false
        });
      }
    });

  },
  createEquipments: function (req, res) {
    var name = req.body.name;

    configurationViewModel.createEquipments(name, function (err, equip) {
      if (err || !equip) {
        return res.json({
          res: equip,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  updateEquipments: function (req, res) {
    var equipment = req.body.equipment;

    configurationViewModel.updateEquipments(equipment, function (err, ship) {
      if (err || !ship) {
        return res.json({
          res: ship,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  removeEquipment: function (req, res) {
    var equipment = JSON.parse(req.query.equipment);

    configurationViewModel.removeEquipment(equipment, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: success
        });
      }
    });
  },
  createEquip: function (req, res) {
    var equipment_id = req.body.equipment._id,
      equip = req.body.equip;

    configurationViewModel.createEquip(equipment_id, equip, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {

        return res.json({
          res: true
        });
      }
    });
  },
  statusEquip: function (req, res) {
    var id = req.body.id,
      equipment_id = req.body.equipment,
      equip = req.body.equip;

    configurationViewModel.statusEquip(id, equipment_id, equip, function (err, ship) {
      if (err || !ship) {
        return res.json({
          res: ship,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  removeEquip: function (req, res) {
    var equipment = JSON.parse(req.query.equipment),
      equip = JSON.parse(req.query.equip);
    configurationViewModel.removeEquip(equipment, equip, function (err, doc) {
      if (err || !doc) {
        return res.json({
          res: doc,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  updateEquip: function (req, res) {
    var equipment = req.body.equipment,
      equip = req.body.equip;
    configurationViewModel.updateEquip(equipment, equip, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  saveContract: function (req, res) {
    var contract = req.body.contract;
    configurationViewModel.saveContract(contract, function (err, success) {
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
  },
  updateSEO: function (req, res) {
    var seo = req.body.seo;
    configurationViewModel.updateSEO(seo, function (err, success) {
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
  },
  testMail: function (req, res) {
    notificationViewModel.sendMailTest(function (err, success) {
      if (err || !success) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: success,
          error: false
        });
      }
    });
  },
  createCurrency: function (req, res) {
    var currency = req.body.currency;
    configurationViewModel.createCurrency(currency, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  removeCurrency: function (req, res) {
    var currency = JSON.parse(req.query.currency);
    configurationViewModel.removeCurrency(currency, function (err, doc) {
      if (err || !doc) {
        return res.json({
          res: doc,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  updateCurrency: function (req, res) {
    var currency = req.body.currency;
    configurationViewModel.updateCurrency(currency, function (err, success) {
      if (err || !success) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        return res.json({
          res: true
        });
      }
    });
  },
  listCurrencies: function (req, res) {
    configurationViewModel.listCurrencies(function (err, list) {
      if (err || !list) {
        res.json({
          res: false,
          error: err
        });
      } else {
        res.json({
          res: list,
          error: false
        });
      }
    });
  },
  currencyMenu: function (req, res) {
    var id = req.body.id;
    var action = req.body.action;
    configurationViewModel.currencyMenu(id, action, function (err, success) {
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
  },
  export: function (req, res) {
    configurationViewModel.export(function (err, success) {
      if (err) {
        return res.json({
          res: success,
          error: err
        });
      } else {
        var SkipperDisk = require("skipper-disk");
        var fileAdapter = SkipperDisk( /* optional opts */ );
        fileAdapter.read("./backup.js")
          .on("error", function (err) {
            return res.json({
              res: null,
              error: err
            });
          })
          .pipe(res);
      }

    });
  },
  import: function (req, res) {
    var file = req.files;
    configurationViewModel.import(file, function (err, success) {
      return res.json({
        res: success,
        error: err
      });
    });
  }

};
module.exports = configuration;