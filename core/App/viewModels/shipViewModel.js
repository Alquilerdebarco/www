/**
 * Created by ernestomr87@gmail.com on 12/16/2015.
 */


/*Libs*/
var _ = require("lodash");
var async = require("async");
var fs = require("fs-extra");
var htmlToText = require("html-to-text");
var currencyFormatter = require("currency-formatter");
var format = {
  symbol: "",
  decimal: ",",
  thousand: ".",
  precision: 2,
  format: "%v %s" // %s is the symbol and %v is the value
};
var functions = require("./../utils/functions");
/*ViewControllers*/
var mediaViewModel = require("./mediaViewModel");
var localizationViewModel = require("./localizationViewModel");
var languageView = require("./languageViewModel");
var isoFieldView = require("./IsoFieldViewModel");
var configurationViewModel = require("./configurationViewModel");
var textsView = require("./textViewModel");


/*Others*/
var utils = require("./../../middlewares/utils");
var util = require("../utils/functions");

var notificationViewModel = require("./notificationViewModel");
var entity = "ship";

function formatDate(date) {
  var y = new Date(date).getFullYear(),
    m = new Date(date).getMonth(),
    d = new Date(date).getDate();
  return new Date(y, m, d);
}

function utilReturnList(list, iso, lang, coin, cb) {
  async.map(list, function (object, callback) {
    if (iso) {
      utilReturnFront(object, iso, lang, coin, function (err, obj) {
        callback(err, obj);
      });
    } else {
      utilReturn(object, function (err, obj) {
        callback(err, obj);
      });
    }
  }, function (err, result) {
    cb(err, result);
  });
}

function utilReturn(object, cb) {
  var user = object._doc.user;
  object._doc.user = {
    _id: user._doc._id.toString(),
    name: user._doc.name,
    surname: user._doc.surname,
    slug: user._doc.slug,
    email: user._doc.email,
    mobile: user._doc.mobile,
    registerDate: user._doc.registerDate,
    permissions: user._doc.permissions,
    address: user._doc.address,
    status: user._doc.status,
    avatar: user._doc.avatar
  };
  var disables = [];
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (var i = 0; i < object._doc.locks.length; i++) {
    if (object._doc.locks[i].start >= today) {
      var start = new Date(object._doc.locks[i].start).getTime();
      var end = new Date(object._doc.locks[i].end).getTime();
      for (var j = start; j < end; j = j + 86400000) {
        disables.push(j);
      }
    }
  }
  object._doc.disables = disables;
  var localization = object._doc.localization;

  db.shipTypes.findOne({_id: object._doc.shipType})
    .populate("name")
    .exec(function (err, st) {
      object._doc.st = st;
      async.map(object._doc.discounts, function (discount, callback) {

        discount._doc.start = new Date(discount.start).getTime();
        discount._doc.end = new Date(discount.end).getTime();

        discount = JSON.parse(JSON.stringify(discount));
        callback(null, discount);
      }, function (err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          object._doc.discounts = result;
          for (var i = 0; i < object._doc.seasons.length; i++) {
            object._doc.seasons[i]._doc.start = new Date(object._doc.seasons[i]._doc.start).getTime();
            object._doc.seasons[i]._doc.end = new Date(object._doc.seasons[i]._doc.end).getTime();
          }
          for (var i = 0; i < object._doc.locks.length; i++) {
            object._doc.locks[i]._doc.start = new Date(object._doc.locks[i]._doc.start).getTime();
            object._doc.locks[i]._doc.end = new Date(object._doc.locks[i]._doc.end).getTime();
          }
          if (!_.isEmpty(localization)) {
            var data = {
              country: localization.country,
              city: localization.city,
              area: localization.area,
              port: localization.port
            };
            localizationViewModel.getLocalization(data, function (err, loc) {
              if (err || !loc) {
                object._doc.localization = [];
              } else {
                object._doc.localization = loc;
              }
              cb(null, object);
            });
          } else {
            object._doc.localization = null;
            cb(null, object);
          }
        }
      });
    })
}

function utilReturnFront(object, iso, lang, coin, cb) {

  var user = object.user;
  object.user = {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    avatar: user.avatar,
    email: user.email
  };
  var disables = [];
  var today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (var i = 0; i < object.length; i++) {
    if (object.locks[i].start > today) {
      var start = new Date(object.locks[i].start).getTime();
      var end = new Date(object.locks[i].end).getTime();
      for (var j = start; j < end; j = j + 86400000) {
        disables.push(j);
      }
    }
  }
  object.disables = disables;

  configurationViewModel.listDurationsAndExperiences(lang, function (err, xp) {
    if (err || !xp) {
      cb(err, false);
    } else {
      var totalDisc = 0;
      var now = new Date();
      for (var i = 0; i < object.discounts.length; i++) {
        if (new Date(object.discounts[i].start) < now && new Date(object.discounts[i].end) > now && object.discounts[i].type == "0") {
          totalDisc += object.discounts[i].discount;
        }
      }
      for (var i = 0; i < object.seasons.length; i++) {
        for (var p = 0; p < object.seasons[i].experiences.length; p++) {
          for (var j = 0; j < xp.experiences.length; j++) {
            if (object.seasons[i].experiences[p].experience.toString() == xp.experiences[j]._doc._id.toString()) {
              object.seasons[i].experiences[p].experience = {
                name: xp.experiences[j]._doc.name[0]._doc.value,
                slug: xp.experiences[j]._doc.slug[0]._doc.value,
                id: xp.experiences[j]._doc._id.toString()
              };
            }

          }

          for (var z = 0; z < object.seasons[i].experiences[p].durations.length; z++) {
            object.seasons[i].experiences[p].durations[z].price = object.seasons[i].experiences[p].durations[z].price.toString().replace(".", "").replace(",", ".");
            for (var j = 0; j < object.conditions.patron.length; j++) {
              if (object.conditions.patron[j].duration == object.seasons[i].experiences[p].durations[z].duration && object.rentType == "1") {
                object.seasons[i].experiences[p].durations[z].price =
                  (parseFloat(object.seasons[i].experiences[p].durations[z].price) + parseFloat(object.conditions.patron[j].price.toString().replace(".", "").replace(",", "."))).toString();
              }
            }

          }
          for (var z = 0; z < object.seasons[i].experiences[p].durations.length; z++) {
            var found = false;
            object.seasons[i].experiences[p].durations[z].price = parseFloat(object.seasons[i].experiences[p].durations[z].price) * coin.price;
            if (totalDisc > 0) {
              object.seasons[i].experiences[p].durations[z].discount = object.seasons[i].experiences[p].durations[z].price - (object.seasons[i].experiences[p].durations[z].price * totalDisc / 100);
            } else {
              object.seasons[i].experiences[p].durations[z].discount = 0;
            }
            object.seasons[i].experiences[p].durations[z].discount = currencyFormatter.format(object.seasons[i].experiences[p].durations[z].discount, format).trim();
            object.seasons[i].experiences[p].durations[z].price = currencyFormatter.format(object.seasons[i].experiences[p].durations[z].price, format).trim();

            object.seasons[i].experiences[p].durations[z].symbol = coin.symbol;
            for (var f = 0; f < xp.durations.length && !found; f++) {
              if (object.seasons[i].experiences[p].durations[z].duration.toString() == xp.durations[f]._doc._id.toString()) {
                // object._doc.seasons[0]._doc.experiences[0]._doc.durations[j]._doc.expecifications = {};
                object.seasons[i].experiences[p].durations[z].duration = {
                  unity: xp.durations[f]._doc.unity,
                  quantity: xp.durations[f]._doc.quantity,
                  id: xp.durations[f]._doc._id.toString()
                };
                found = true;
              }

            }
          }
        }


      }


      async.waterfall([
        function (cbs) {
          db.shipTypes.findOne({
            _id: object.shipType
          })
            .populate({
              path: "name",
              select: "value",
              match: {
                language: lang
              }
            }).exec(function (err, shipt) {
            if (err || !shipt) {
              cbs(err, false);
            } else {
              object.shipType = {
                name: shipt._doc.name[0]._doc.value,
                _id: shipt._doc._id
              };
              var localization = object.localization;
              if (!_.isEmpty(localization)) {
                var data = {
                  country: localization.country,
                  city: localization.city,
                  port: localization.port,
                  area: localization.area
                };
                localizationViewModel.getLocalizationFront(data, iso, function (err, loc) {
                  if (err || !loc) {
                    object.localization = [];
                  } else {
                    object.localization = loc;
                  }
                  cbs(null, object);
                });
              } else {
                object.localization = null;
                cbs(null, object);
              }
            }
          });
        },
        function (object, cbs) {
          //lang
          db.Equipments.find()
            .populate({
              path: "name",
              select: "value",
              match: {
                language: lang
              },
            })
            .populate({
              path: "items.name",
              select: "value",
              match: {
                language: lang
              },
            })
            .sort({
              _id: 1
            }).exec(function (err, data) {
            if (err || !data) {
              cbs(err, data);
            } else {
              for (var i = 0; i < object.equipments.length; i++) {
                for (var j = 0; j < data.length; j++) {
                  if (object.equipments[i].equipment == data[j]._id) {
                    object.equipments[i].name = JSON.parse(JSON.stringify(data[j].name));
                    for (var k = 0; k < object.equipments[i].items.length; k++) {
                      for (var l = 0; l < data[j].items.length; l++) {
                        if (object.equipments[i].items[k].toString() == data[j].items[l]._id.toString()) {
                          object.equipments[i].items[k] = JSON.parse(JSON.stringify(data[j].items[l]));
                        }
                      }
                    }
                  }
                }

                var arrayL = [];
                for (var m = 0; m < object.equipments[i].text.length; m++) {
                  if (object.equipments[i].text[m].iso == iso) {
                    var aux = object.equipments[i].text[m].value.split("\n");
                    object.equipments[i].text[m].value = aux;
                    arrayL.push(object.equipments[i].text[m]);
                  }
                }
                object.equipments[i].text = JSON.parse(JSON.stringify(arrayL));
              }

              cbs(null, object);
            }
          });
        }
      ], function (err, result) {
        cb(err, result);
      });
    }
  });
}

function prepareLanguages(text, cb) {
  isoFieldView.reformatIsoField(text, function (text) {
    cb(text);
  });
}

function validateDiscount(discount, cb) {
  var percentageOfDiscount = parseInt(discount.discount);
  if (percentageOfDiscount >= 0 && percentageOfDiscount <= 100) {
    var start = discount.start;
    var end = discount.end;
    if (start < end) {
      cb(true);
    } else {
      cb(false);
    }
  } else {
    cb(false);
  }
}

function validateSeason(season) {

  if (!season.title.length) {
    return false;
  }
  if (!season.color.length) {
    return false;
  }

  for (var i = 0; i < season.experiences.length; i++) {
    for (var j = 0; j < season.experiences[i].durations.length; j++) {
      if (!season.experiences[i].durations[j].disable && parseFloat(season.experiences[i].durations[j].price) < 1) {
        return false;
      }
    }
  }
  return true;
}

function formatValidateShip(day, ships, cb) {

  var event = {
    start: new Date(day),
    end: new Date(day.getTime() + 86400000)
  };

  async.map(ships, function (ship, callback) {
    var locks = ship._doc.locks;
    if (existEvent(locks, event)) {
      var season = getSeason(ship, day);
      ship._doc.season = season;
      callback(null, ship);
    } else {
      callback(null, false);
    }

  }, function (err, result) {
    if (err || !result) {
      cb(err, result);
    } else {
      var array = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i]) {
          array.push(result[i]);
        }
      }
      cb(null, array);
    }
  });
}

function matchCalendarBlock(a, b, c, d) {
  if (c < a && a < d) {
    return true;
  }
  if (c < b && b < d) {
    return true;
  }
  if (a < c && c < b) {
    return true;
  }
  if (a < d && d < b) {
    return true;
  }
  if (a.getTime() == c.getTime() && b.getTime() == d.getTime()) {
    return true;
  }
  return false;
}

function existEvent(array, event) {
  if (array.length) {
    for (var i = 0; i < array.length; i++) {
      var start = array[i].start;
      var end = array[i].end;
      var eventEnd = event.end;

      if (matchCalendarBlock(start, end, event.start, eventEnd)) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }


}

function getSeason(ship, day) {
  var seasons = ship._doc.seasons;
  var season = null;
  for (var i = 0; i < seasons.length; i++) {
    var start = functions.formatDate(seasons[i].start);
    var end = seasons[i].end ? seasons[i].end : seasons[i].start;
    end = functions.formatDate(end);
    if (start <= day && day <= end) {
      seasons[i].start = start;
      seasons[i].end = end;
      season = seasons[i];
      break;
    }
  }
  return season;
}

function prepareQuery(filter) {
  // Filtro [Pais,Ciudad,Zona,Puerto,Experiencia,Duración,Día,tipo de  Embarcación,eslora, #pasajeros, patron?]

  var query = {
    remove: false,
    status: true,
    publish: true
  };
  if (filter[0]) {
    query["localization.country"] = filter[0];
  }
  if (filter[1]) {
    query["localization.city"] = filter[1];
  }
  if (filter[2]) {
    query["localization.area"] = filter[2];
  }
  if (filter[3]) {
    query["localization.port"] = filter[3];
  }


  if (filter[4]) {
    query["seasons.experiences.experience"] = filter[4];
  }
  if (filter[5]) {
    query["seasons.experiences.durations.duration"] = filter[5];
  }
  if (filter[7]) {
    query.shipType = filter[7];
  }
  if (filter[9]) {
    if (filter[9] == "1" || filter[9] == "2" || filter[9] == "3" || filter[9] == "4" || filter[9] == "5" || filter[9] == "6" || filter[9] == "7" || filter[9] == "8" || filter[9] == "9" || filter[9] == "10" || filter[9] == "11" || filter[9] == "12") {
      query["$or"] = [
        {
          "technicalDetails.habitability.persons.day": {
            $gte: filter[9]
          }
        }, {
          "technicalDetails.habitability.persons.night": {
            $gte: filter[9]
          }
        }
      ]; // query['technicalDetails.habitability.persons.day'] = { $lte: filter[9] };
      // query['technicalDetails.habitability.persons.night'] = { $lte: filter[9] }
    } else {
      if (filter[9] == "12*") {
        query["technicalDetails.habitability.persons.day"] = {
          $gt: filter[9].slice(filter[9][-1], -1)
        };
        query["technicalDetails.habitability.persons.night"] = {
          $gt: filter[9].slice(filter[9][-1], -1)
        };
      }
    }

  }
  if (filter[10] !== null) {
    query.rentType = filter[10];
  }
  return query;
}

function validateIfExistShip(ships, ship) {
  var exist = false;
  for (var i = 0; i < ships.length; i++) {
    if (ships[i]._id == ship._id) {
      if (ships[i].seasons[0].experiences[0].experience == ship.seasons[0].experiences[0].experience) {
        exist = true;
        break;
      }
    }
  }
  return exist;
}
var shipFunctions = {

  //FRONT FUNCTIONS
  listFront: function (culture, limit, skip, filter, coin, cb) {
    var date = filter[6] ? new Date(filter[6]) : new Date();
    date = functions.formatDate(date);
    var query = prepareQuery(filter);
    if (!query.rentType) delete query.rentType;
    if (!coin)
      coin = {
        price: 1,
        symbol: "€"
      };
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        if (!err) {
          db.Ships.find(query)
            .populate("user locks")
            .populate({
              path: "title",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "description",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "equipments.name",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "equipments.items.name",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "tariff.title",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "shipType.name",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "shipType.slug",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .populate({
              path: "shipType.description",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .sort({
              createDate: 1
            }).exec(function (err, data) {
            if (err || !data) {
              cb(err, data);
            } else {
              if (data.length) {
                var ships = [];
                for (var i = 0; i < data.length; i++) {
                  if (filter) {
                    var exist = true;
                    if (filter[8]) {
                      exist = false;
                      var slora = parseInt(data[i]._doc.technicalDetails.measurements.dimension);
                      if (filter[8] == "6,12" || filter[8] == "12,15") {
                        var array = filter[8].split(",");
                        if (slora >= parseInt(array[0]) && slora <= parseInt(array[1])) {
                          exist = true;
                        }
                      } else if (filter[8] == "6") {
                        if (slora < parseInt(filter[8])) {
                          exist = true;
                        }
                      } else {
                        if (filter[8] == "15") {
                          if (slora > parseInt(filter[8])) {
                            exist = true;
                          }
                        }
                      }
                    }
                    if (!exist) {
                      break;
                    }
                  }
                  var season;
                  var xp;
                  var auxSeason;
                  var auxShip;
                  if (date) {
                    season = getSeason(data[i], date);
                    if (season) {
                      for (var j = 0; j < season._doc.experiences.length; j++) {
                        if (filter[4]) {
                          if (filter[4] == season._doc.experiences[j].experience.toString()) {
                            xp = JSON.parse(JSON.stringify(season._doc.experiences[j]));
                            auxSeason = JSON.parse(JSON.stringify(season));
                            auxSeason.experiences = [xp];
                            auxShip = JSON.parse(JSON.stringify(data[i]));
                            auxShip.seasons = [auxSeason];
                            if (!validateIfExistShip(ships, auxShip)) {
                              ships.push(auxShip);
                            }
                          }
                        } else {
                          xp = JSON.parse(JSON.stringify(season._doc.experiences[j]));
                          auxSeason = JSON.parse(JSON.stringify(season));
                          auxSeason.experiences = [xp];
                          auxShip = JSON.parse(JSON.stringify(data[i]));
                          auxShip.seasons = [auxSeason];
                          if (!validateIfExistShip(ships, auxShip)) {
                            ships.push(auxShip);
                          }
                        }
                      }
                    }
                  } else {
                    for (var k = 0; k < data[i]._doc.seasons.length; k++) {
                      season = data[i]._doc.seasons[k];
                      for (var j = 0; j < season._doc.experiences.length; j++) {
                        if (filter[4]) {
                          if (filter[4] == season._doc.experiences[j].experience.toString()) {
                            xp = JSON.parse(JSON.stringify(season._doc.experiences[j]));
                            auxSeason = JSON.parse(JSON.stringify(season));
                            auxSeason.experiences = [xp];
                            auxShip = JSON.parse(JSON.stringify(data[i]));
                            auxShip.seasons = [auxSeason];
                            if (!validateIfExistShip(ships, auxShip)) {
                              ships.push(auxShip);
                            }
                          }
                        } else {
                          xp = JSON.parse(JSON.stringify(season._doc.experiences[j]));
                          auxSeason = JSON.parse(JSON.stringify(season));
                          auxSeason.experiences = [xp];
                          auxShip = JSON.parse(JSON.stringify(data[i]));
                          auxShip.seasons = [auxSeason];
                          if (!validateIfExistShip(ships, auxShip)) {
                            ships.push(auxShip);
                          }
                        }
                      }
                    }
                  }
                }
                db.Configurations.findOne().select("general").exec(function (err, conf) {
                  if (err || !conf) {
                    cb(err, conf);
                  } else {
                    if (conf._doc.general.sort) {
                      async.map(ships, function (sh, callback) {
                        db.Offers.count({
                          ship: sh._id,
                          status: "accept"
                        }).exec(function (err, count) {
                          if (err) {
                            callback(err, false);
                          } else {
                            sh.count = count;
                            callback(false, sh);
                          }
                        });
                      }, function (err, result) {
                        if (err || !result) {
                          cb(err, result);
                        } else {
                          for (var i = 0; i < result.length - 1; i++) {
                            for (var j = i + 1; j < result.length; j++) {
                              if (result[i].count < result[j].count) {
                                var aux = result[i];
                                result[i] = result[j];
                                result[j] = aux;
                              }
                            }
                          }
                          var auxShips = [];
                          var max = 0;
                          if (result.length > (skip + limit)) {
                            max = skip + limit;
                          } else {
                            max = result.length;
                          }

                          for (var i = skip; i < max; i++) {
                            auxShips.push(result[i]);
                          }

                          utilReturnList(auxShips, culture, lang._doc._id, coin, function (err, list) {
                            if (err || !list) {
                              cb(err, list);
                            } else {
                              cb(null, list, ships.length);
                            }
                          });
                        }
                      });
                    } else {
                      var auxShips = [];
                      var max = 0;
                      if (ships.length > (skip + limit)) {
                        max = skip + limit;
                      } else {
                        max = ships.length;
                      }
                      for (var i = skip; i < max; i++) {
                        auxShips.push(ships[i]);
                      }
                      utilReturnList(auxShips, culture, lang._doc._id, coin, function (err, list) {
                        if (err || !list) {
                          cb(err, list);
                        } else {
                          cb(null, list, ships.length);
                        }
                      });
                    }
                  }
                });
              }
              else {
                cb(null, [], 0);
              }
            }
          });
        } else {
          cb(err, lang);
        }
      } catch (e) {
        cb(e, null);
      }


    });
  },
  getBySlug: function (culture, slug, coin, xp_select, cb) {
    if (!coin)
      coin = {
        price: 1,
        symbol: "€"
      };
    var today = functions.formatDate(new Date());
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Ships.findOne({
          remove: false,
          status: true,
          publish: true,
          slug: slug
        })
          .populate("user locks")
          .populate({
            path: "title",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "description",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "experiences.experience",
            select: "name",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "conditions.text",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .exec(function (err, ship) {
            if (err || !ship) {
              cb(err, ship);
            } else {
              var validate = false;
              configurationViewModel.listDurationsAndExperiences(lang._doc._id, function (err, xp) {
                if (err || !xp) {
                  cb(err, false, null);
                } else {
                  var xpSelecId = null;
                  var newXp = null;
                  for (var i = 0; i < ship.seasons.length; i++) {
                    var start = functions.formatDate(ship._doc.seasons[i].start);
                    var end = functions.formatDate(ship._doc.seasons[i].end);

                    if (start <= today && end >= today) {
                      for (var j = 0; j < xp.experiences.length; j++) {
                        for (var k = 0; k < ship.seasons[i].experiences.length; k++) {
                          newXp = newXp || ship.seasons[i].experiences[k].experience.toString();
                          if (xp.experiences[j]._doc._id.toString() == ship.seasons[i].experiences[k].experience.toString() && xp.experiences[j]._doc.slug[0]._doc.value == xp_select) {
                            xpSelecId = xp.experiences[j]._doc._id.toString();
                            validate = true;
                            break;
                          }

                        }
                      }

                    }
                  }
                  if (validate || newXp) {
                    async.parallel([
                      function (cbp) {
                        var aux = JSON.parse(JSON.stringify(ship));
                        utilReturnFront(aux, culture, lang._doc._id, coin, function (err, obj) {
                          cbp(err, obj);
                        });
                      },
                      function (cbp) {
                        var filter = [
                          ship._doc.localization.country,
                          ship._doc.localization.city,
                          ship._doc.localization.area,
                          ship._doc.localization.port,
                          ship.shipType,
                          xpSelecId
                        ];
                        shipFunctions.recommendation(culture, ship, filter, function (err, shipRec) {
                          var aux = JSON.parse(JSON.stringify(shipRec));
                          utilReturnList(aux, culture, lang._doc._id, coin, function (err, obj) {
                            cbp(err, obj);
                          });
                        });
                      }
                    ], function (err, result) {
                      var recom = result[1];
                      var aux = [];
                      for (var i = 0; i < recom.length; i++) {
                        if (recom[i]._id != result[0]._id) {
                          aux.push(recom[i]);
                          if (aux.length == 2)
                            break;
                        }

                      }
                      cb(err, result[0], aux);
                    });
                  } else {
                    cb(false, null, null);
                  }
                }

              });


            }
          });
      } else {
        cb(err, false);
      }
    });
  },
  updateCoin: function (currency, cb) {
    util.currencyService(function (err, coins) {
      cb(coins[currency]);
    });
  },
  recommendation: function (culture, ship, filter, cb) {

    var query = {
      remove: false,
      status: true,
      publish: true
    };

    if (filter[0]) {
      query["localization.country"] = filter[0];
    }
    if (filter[1]) {
      query["localization.city"] = filter[1];
    }
    if (filter[2]) {
      query["localization.area"] = filter[2];
    }
    if (filter[3]) {
      query["localization.port"] = filter[3];
    }
    if (filter[4]) {
      query.shipType = filter[4];
    }
    if (filter[5]) {
      query["seasons.experiences.experience"] = filter[5];
    }

    languageView.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Ships.find(query)
          .populate("user locks")
          .populate({
            path: "title",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "description",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "equipments.name",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "equipments.items.name",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "experiences.experience",
            select: "name",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "tariff.title",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "shipType.name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "shipType.slug",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "shipType.description",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .exec(function (err, ships) {
            if (err) {
              cb(err, ships);
            } else {
              if (ships.length) {
                var auxS = [];
                for (var i = 0; i < ships.length; i++) {
                  if (ships[i]._doc.seasons.length) {
                    auxS.push(ships[i]);
                  }
                }
                cb(err, auxS);
              } else {
                filter.pop();
                shipFunctions.recommendation(culture, ship, filter, function (err, success) {
                  cb(err, success);
                });
              }
            }
          });
      } else {
        cb(err, lang);
      }
    });

  },
  allships: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        if (!err) {
          localizationViewModel.countryFrontList(culture, function (err, country) {
            if (err || !country) {
              cb(err, false);
            } else {
              configurationViewModel.listFrontShipType(culture, function (err, shiptypes) {
                if (err || !shiptypes) {
                  cb(err, false);
                } else {
                  textsView.getByGroupArray(culture, ["slugs", "our-ships"], function (err, text) {
                    if (err || !text) {
                      cb(err, false);
                    } else {
                      async.map(country, function (c, callback) {
                        async.map(c._doc.cities, function (city, callback1) {
                          async.map(shiptypes, function (st, callback2) {
                            db.Ships.find({
                              remove: false,
                              "localization.country": c._doc._id.toString(),
                              "localization.city": city._doc._id.toString(),
                              "shipType": st._doc._id.toString()
                            })
                              .exec(function (err, ships) {
                                if (err) {
                                  cb(err, false);
                                } else {
                                  async.map(ships, function (object, callback3) {
                                    configurationViewModel.listDurationsAndExperiences(lang._doc._id, function (err, xp) {
                                      if (err || !xp) {
                                        cb(err, false);
                                      } else {
                                        for (var i = 0; i < object.seasons.length; i++) {
                                          for (var p = 0; p < object.seasons[i]._doc.experiences.length; p++) {
                                            for (var j = 0; j < xp.experiences.length; j++) {
                                              if (object.seasons[i]._doc.experiences[p]._doc.experience.toString() == xp.experiences[j]._doc._id.toString()) {
                                                object.seasons[i]._doc.experiences[p]._doc.experience = {
                                                  name: xp.experiences[j]._doc.name[0]._doc.value,
                                                  slug: xp.experiences[j]._doc.slug[0]._doc.value,
                                                  id: xp.experiences[j]._doc._id.toString()
                                                };
                                              }

                                            }
                                          }
                                        }
                                        callback3(false, object);
                                      }
                                    });
                                  }, function (err, resul) {
                                    if (err) {
                                      cb(err, false);
                                    } else {
                                      ships = resul;
                                      var obj = [];
                                      for (var i = 0; i < ships.length; i++) {
                                        obj.push({
                                          url: "/" + culture + "/" + text.slug_ship + "/" + ships[i].slug + "/" + ships[i].seasons[0]._doc.experiences[0]._doc.experience.slug,
                                          name: ships[i].name,
                                          shipt: st.name[0].value,
                                          shipt_slug: st.slug[0].value,
                                          shipt_id: st._doc._id
                                        });
                                      }
                                      callback2(false, obj);
                                    }
                                  });
                                }
                              });
                          }, function (err, result) {
                            if (err) {
                              callback1(err, false);
                            } else {
                              var cit = [];
                              for (var i = 0; i < result.length; i++) {
                                if (result[i].length) {
                                  cit.push({
                                    name: text.our_rent + " " + result[i][0].shipt + " " + city.name[0].value,
                                    ships: result[i],
                                    location: {
                                      country: c._id,
                                      city: city._id,
                                      shipType: result[i][0].shipt_id
                                    },
                                    //url: '/' + culture + '/' + c.slug[0].value + '/' + city.slug[0].value + '/0/0/0/0/0/' + result[i][0].shipt_slug + '/0/0/0'
                                  });
                                }

                              }
                              callback1(false, cit);
                            }
                          });
                        }, function (err, resultt) {
                          if (err) {
                            callback(err, false);
                          } else {
                            var count = [];
                            count.push({
                              name: c.name[0].value,
                              location: {
                                country: c._id,
                                city: null,
                                shipType: null
                              },
                              ships: resultt
                            });
                            callback(false, count);
                          }
                        });
                      }, function (err, final) {
                        if (err) {
                          cb(err, false);
                        } else {
                          cb(false, final);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          cb(err, false);
        }
      } catch (e) {
        cb(e, false);
      }
    });
  },
  //BACKEND

  /*General*/
  get: function (culture, id, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Ships.findOne({
          _id: id,
          remove: false
        })
          .populate("user locks")
          .populate({
            path: "title",
            select: "value",
            match: {
              language: lang._doc._id
            },
          })
          .populate({
            path: "description",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "equipments.name",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "equipments.items.name",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "tariff.title",
            select: "value",
            match: {
              language: lang._doc._id
            }

          })
          .populate({
            path: "shipType.name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .exec(function (err, ship) {
            if (err || !ship) {
              cb(err, ship);
            } else {
              utilReturn(ship, function (err, object) {
                cb(err, object);
              });
            }
          });
      } else {
        cb(err, lang);
      }
    });
  },
  create: function (user, name, title, description, manufacturer, model, year, lastRedecorate, shipType, rentType, tags, noindex, nofollow, cb) {
    try {
      async.parallel([
        function (callback) {
          isoFieldView.validateCreateIsoField(title, function (data) {
            callback(null, data);
          });
        },
        function (callback) {
          isoFieldView.validateCreateIsoField(description, function (data) {
            callback(null, data);
          });
        }
      ], function (err, result) {
        if (err || !result) {
          cb(err, result);
        } else {
          if (result[0] && result[1]) {
            async.parallel([
              function (cbp) {
                async.map(title, function (n, callback) {
                  isoFieldView.create(n._id, n.value, function (err, iso) {
                    callback(err, iso);
                  });
                }, function (err, result) {
                  cbp(err, result);
                });
              },
              function (cbp) {
                async.map(description, function (d, callback) {
                  async.parallel([
                    function (cbp) {
                      isoFieldView.create(d._id, d.value, function (err, iso) {
                        cbp(err, iso);
                      });
                    },
                    function (cbp) {
                      var text = htmlToText.fromString(d.value);
                      isoFieldView.create(d._id, text, function (err, iso) {
                        cbp(err, iso);
                      });
                    }
                  ], function (err, result) {
                    callback(err, result);
                  });


                }, function (err, result) {
                  cbp(err, result);
                });
              }
            ], function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {
                var arrayTitle = [];
                for (var i = 0; i < result[0].length; i++) {
                  arrayTitle.push(result[0][i]._doc._id);
                }
                var arrayDescription = [];
                for (var i = 0; i < result[1].length; i++) {
                  arrayDescription.push(result[1][i][0]._doc._id);
                }
                var arrayDescription1 = [];
                for (var i = 0; i < result[1].length; i++) {
                  arrayDescription1.push(result[1][i][1]._doc._id);
                }


                var slugAux = utils.getSlug(name);
                var word = new RegExp(slugAux, "i");
                db.Ships.count({
                  slug: word
                }).exec(function (err, count) {
                  if (err) {
                    cb(err, count);
                  } else {
                    if (count) {
                      slugAux = slugAux + count;
                    }

                    var query = {
                      user: user,
                      name: name,
                      slug: slugAux,
                      title: arrayTitle,
                      description: arrayDescription,
                      finder: arrayDescription1,
                      manufacturer: manufacturer,
                      model: model,
                      year: year,
                      shipType: shipType,
                      rentType: rentType,
                      tags: tags,
                      noindex: noindex,
                      nofollow: nofollow
                    };
                    if (lastRedecorate) {
                      query.lastRedecorate = lastRedecorate;
                    }
                    var shipDb = db.Ships(query);

                    shipDb.save(function (err, ship) {
                      if (err || !ship) {
                        cb(err, null);
                      } else {
                        cb(null, ship);
                      }
                    });
                  }
                });
              }
            });
          } else {
            var error = {
              message: "Formulario Incorrecto."
            };
            cb(error, null);
          }
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  update: function (id, user, name, title, description, manufacturer, model, year, lastRedecorate, shipType, rentType, finder, tags, noindex, nofollow, cb) {
    try {
      db.Ships.findOne({
        _id: id
      }).exec(function (err, ship) {
        if (err || !ship) {
          cb(err, ship);
        } else {
          async.parallel([
            function (cbp) {
              prepareLanguages(title, function (new_title) {
                cbp(null, new_title);
              });
            },
            function (cbp) {
              prepareLanguages(description, function (new_description) {
                cbp(null, new_description);
              });
            }
          ], function (err, result) {
            if (err || !result) {
              cb(err, result);
            } else {
              title = result[0];
              description = result[1];
              async.parallel([
                function (callback) {
                  isoFieldView.validateUpdateIsoField(title, function (data) {
                    callback(null, data);
                  });
                },
                function (callback) {
                  isoFieldView.validateUpdateIsoField(description, function (data) {
                    callback(null, data);
                  });
                }
              ], function (err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  if (result[0] && result[1]) {
                    async.parallel([
                      function (cbp) {
                        async.waterfall([
                          function (cbw) {
                            async.map(title, function (n, callback) {
                              isoFieldView.remove(n._id, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          },
                          function (go, cbw) {
                            async.map(title, function (n, callback) {
                              isoFieldView.create(n._id, n.value, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          }
                        ], function (err, result) {
                          cbp(err, result);
                        });
                      },
                      function (cbp) {
                        async.waterfall([
                          function (cbw) {
                            async.map(description, function (n, callback) {
                              isoFieldView.remove(n._id, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          },
                          function (go, cbw) {
                            async.map(description, function (n, callback) {
                              isoFieldView.create(n._id, n.value, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          }
                        ], function (err, result) {
                          cbp(err, result);
                        });
                      },
                      function (cbp) {
                        async.waterfall([
                          function (cbw) {
                            async.map(ship._doc.finder, function (n, callback) {
                              isoFieldView.remove(n, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          },
                          function (go, cbw) {
                            async.map(description, function (n, callback) {
                              var text = htmlToText.fromString(n.value);
                              isoFieldView.create(n._id, text, function (err, iso) {
                                callback(err, iso);
                              });
                            }, function (err, result) {
                              cbw(err, result);
                            });
                          }
                        ], function (err, result) {
                          cbp(err, result);
                        });
                      }
                    ], function (err, result) {
                      if (err || !result) {
                        cb(err, result);
                      } else {
                        var arrayTitle = [];
                        for (var i = 0; i < result[0].length; i++) {
                          arrayTitle.push(result[0][i]._doc._id);
                        }

                        var arrayDescription = [];
                        for (var i = 0; i < result[1].length; i++) {
                          arrayDescription.push(result[1][i]._doc._id);
                        }

                        var arrayDescription1 = [];
                        for (var i = 0; i < result[1].length; i++) {
                          arrayDescription1.push(result[2][i]._doc._id);
                        }

                        var slugAux = utils.getSlug(name);
                        var word = new RegExp(slugAux, "i");


                        db.Ships.count({
                          slug: word
                        }).exec(function (err, count) {
                          if (err) {
                            cb(err, count);
                          } else {
                            if (count) {
                              slugAux = slugAux + count;
                            }
                            var query = {
                              name: name,
                              slug: slugAux,
                              title: arrayTitle,
                              description: arrayDescription,
                              finder: arrayDescription1,
                              manufacturer: manufacturer,
                              model: model,
                              year: year,
                              lastRedecorate: lastRedecorate,
                              shipType: shipType,
                              rentType: rentType,
                              tags: tags,
                              noindex: noindex,
                              nofollow: nofollow
                            };
                            if (lastRedecorate) {
                              query.lastRedecorate = lastRedecorate;
                            }

                            db.Ships.findByIdAndUpdate({
                              remove: false,
                              _id: id
                            }, {
                              $set: query
                            }, {
                              new: true
                            })
                              .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                              .exec(function (err, ship) {
                                if (err || !ship) {
                                  cb(err, null);
                                } else {
                                  utilReturn(ship, function (err, object) {
                                    if (err || !object) {
                                      cb(err, null);
                                    } else {
                                      cb(null, object);
                                    }
                                  });
                                }
                              });
                          }
                        });
                      }
                    });
                  } else {
                    var error = {
                      message: "Formulario Incorrecto."
                    };
                    cb(error, null);
                  }
                }
              });
            }
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  list: function (limit, skip, string, status, user, userid, countryid, cityid, areaid, portid, cb) {
    var query = {
      remove: false,
    };

    if (countryid) {
      query["localization.country"] = countryid;
    }
    if (cityid) {
      query["localization.city"] = cityid;
    }
    if (areaid) {
      query["localization.area"] = areaid;
    }
    if (portid) {
      query["localization.port"] = portid;
    }


    if (string.length) {
      var word = new RegExp(string, "i");
      query = {
        remove: false,
        status: true,
        $or: [
          {
            name: word
          }, {
            manufacturer: word
          }, {
            model: word
          }
        ]
      };
    }

    if (user.permissions.isAdmin) {
      if (status !== null) query.publish = status;
      if (userid !== null) query.user = userid;
    }
    if (!user.permissions.isAdmin && user.permissions.isShipOwner) {
      query.user = user._id;
      if (status !== null) query.status = status;
    }

    async.parallel([
      function (cb) {
        db.Ships.count(query).exec(function (err, count) {
          cb(err, count);
        });
      },
      function (cb) {
        db.Ships.find(query)
          .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name locks.offer")
          .sort({
            createDate: -1
          }).limit(limit).skip(skip).exec(function (err, data) {
          if (err || !data) {
            cb(err, data);
          } else {
            utilReturnList(data, null, null, null, function (err, list) {
              cb(null, list);
            });
          }
        });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        for (var i = 0; i < results[1].length; i++) {
          for (var j = 0; j < results[1][i]._doc.locks.length; j++) {
            results[1][i]._doc.locks[j]._doc.end = {
              year: new Date(results[1][i]._doc.locks[j]._doc.end).getFullYear(),
              month: new Date(results[1][i]._doc.locks[j]._doc.end).getMonth(),
              day: new Date(results[1][i]._doc.locks[j]._doc.end).getDate()
            };
            results[1][i]._doc.locks[j]._doc.start = {
              year: new Date(results[1][i]._doc.locks[j]._doc.start).getFullYear(),
              month: new Date(results[1][i]._doc.locks[j]._doc.start).getMonth(),
              day: new Date(results[1][i]._doc.locks[j]._doc.start).getDate()
            };
          }
          for (var j = 0; j < results[1][i]._doc.seasons.length; j++) {
            results[1][i]._doc.seasons[j]._doc.end = {
              year: new Date(results[1][i]._doc.seasons[j]._doc.end).getFullYear(),
              month: new Date(results[1][i]._doc.seasons[j]._doc.end).getMonth(),
              day: new Date(results[1][i]._doc.seasons[j]._doc.end).getDate()
            };
            results[1][i]._doc.seasons[j]._doc.start = {
              year: new Date(results[1][i]._doc.seasons[j]._doc.start).getFullYear(),
              month: new Date(results[1][i]._doc.seasons[j]._doc.start).getMonth(),
              day: new Date(results[1][i]._doc.seasons[j]._doc.start).getDate()
            };
          }
        }

        cb(null, results[1], results[0]);
      }
    });
  },
  status: function (id, cb) {
    try {
      db.Ships.findById(id).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          if (!doc._doc.status) {
            shipFunctions.validateStatus(id, function (err, success) {
              if (err || !success) {
                var error = {
                  message: "Necesita más datos para activar el barco."
                };
                cb(error, null);
              } else {
                db.Ships.findByIdAndUpdate({
                  remove: false,
                  _id: id
                }, {
                  $set: {
                    status: !doc._doc.status
                  }
                }, {
                  new: true
                })
                  .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                  .exec(function (err, ship) {
                    if (err || !ship) {
                      cb(err, ship);
                    } else {
                      utilReturn(ship, function (err, object) {
                        cb(err, object);
                      });
                    }
                  });
              }
            });
          } else {
            db.Ships.findByIdAndUpdate({
              remove: false,
              _id: id
            }, {
              $set: {
                status: !doc._doc.status
              }
            }, {
              new: true
            })
              .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
              .exec(function (err, ship) {
                if (err || !ship) {
                  cb(err, ship);
                } else {
                  utilReturn(ship, function (err, object) {
                    cb(err, object);
                  });
                }
              });
          }
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  publish: function (id, cb) {
    try {
      db.Ships.findById(id).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          if (!doc._doc.publish) {
            shipFunctions.validateStatus(id, function (err, success) {
              if (err || !success) {
                var error = {
                  message: "Necesita más datos para activar el barco."
                };
                cb(error, null);
              } else {
                db.Ships.findByIdAndUpdate({
                  remove: false,
                  _id: id
                }, {
                  $set: {
                    publish: !doc._doc.publish,
                    status: true
                  }
                }, {
                  new: true
                })
                  .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                  .exec(function (err, ship) {
                    if (err || !ship) {
                      cb(err, ship);
                    } else {
                      if (ship._doc.publish) {
                        notificationViewModel.sendMailPublicationBoat(ship._doc.user.language, ship._doc.user, ship._doc.name, function (err, success) {
                          console.log(err, success);
                        });
                      }
                      utilReturn(ship, function (err, object) {
                        cb(err, object);
                      });
                    }
                  });
              }
            });
          } else {
            db.Ships.findByIdAndUpdate({
              remove: false,
              _id: id
            }, {
              $set: {
                publish: !doc._doc.publish,
                status: true
              }
            }, {
              new: true
            })
              .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
              .exec(function (err, ship) {
                if (err || !ship) {
                  cb(err, ship);
                } else {
                  if (ship._doc.publish) {
                    notificationViewModel.sendMailPublicationBoat(ship._doc.user.language, ship._doc.user, ship._doc.name, function (err, success) {
                      console.log(err, success);
                    });
                  }
                  utilReturn(ship, function (err, object) {
                    cb(err, object);
                  });
                }
              });
          }
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  remove: function (id, user, cb) {
    db.Ships.update({
      _id: id
    }, {
      $set: {
        remove: true
      }
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  /*More*/
  technicalDetails: function (id, habitability, measurements, engine, deposits, cb) {
    try {
      //*Habitability*//
      habitability.persons.day = parseInt(habitability.persons.day);
      habitability.persons.night = parseInt(habitability.persons.night);
      habitability.cabins = parseInt(habitability.cabins);
      habitability.baths = parseInt(habitability.baths);


      // /*Measurements*/
      measurements.dimension = measurements.dimension.replace(",", ".");
      measurements.dimension = currencyFormatter.format(measurements.dimension, format).trim();

      measurements.draught = measurements.draught.replace(",", ".");
      measurements.draught = currencyFormatter.format(measurements.draught, format).trim();

      measurements.sleeve = measurements.sleeve.replace(",", ".");
      measurements.sleeve = currencyFormatter.format(measurements.sleeve, format).trim();

      /*Engine*/
      engine.power = engine.power.replace(",", ".");
      engine.power = currencyFormatter.format(engine.power, format).trim();

      engine.consume = engine.consume.replace(",", ".");
      engine.consume = currencyFormatter.format(engine.consume, format).trim();

      engine.speed.max = engine.speed.max.replace(",", ".");
      engine.speed.max = currencyFormatter.format(engine.speed.max, format).trim();

      engine.speed.cruising = engine.speed.cruising.replace(",", ".");
      engine.speed.cruising = currencyFormatter.format(engine.speed.cruising, format).trim();

      /*Deposits*/
      deposits.combustible = deposits.combustible.replace(",", ".");
      deposits.combustible = currencyFormatter.format(deposits.combustible, format).trim();

      deposits.freshwater = deposits.freshwater.replace(",", ".");
      deposits.freshwater = currencyFormatter.format(deposits.freshwater, format).trim();

      db.Ships.findOne({
        remove: false,
        _id: id
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {

          var step = success._doc.step == 8 ? 8 : 2;


          db.Ships.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              "technicalDetails.habitability": habitability,
              "technicalDetails.measurements": measurements,
              "technicalDetails.engine": engine,
              "technicalDetails.deposits": deposits,
              step: step
            }
          }, {
            new: true
          })
            .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
            .exec(function (err, ship) {
              if (err || !ship) {
                cb(err, null);
              } else {
                utilReturn(ship, function (err, object) {
                  cb(err, object);
                });
              }
            });

        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  /*Equipments*/
  updateEquipments: function (id, equipments, cb) {
    try {
      async.map(equipments, function (equipment, cbm) {
        db.Equipments.findOne({
          _id: equipment.equipment
        }).exec(function (err, doc) {
          if (err || !doc) {
            cbm(err, doc);
          } else {
            var array = [];
            for (var i = 0; i < equipment.items.length; i++) {
              for (var j = 0; j < doc.items.length; j++) {
                if (equipment.items[i] == doc.items[j]._id.toString()) {
                  array.push(equipment.items[i]);
                  break;
                }
              }
            }
            equipment.items = JSON.parse(JSON.stringify(array));
            cbm(null, equipment);
          }
        });
      }, function (err, results) {
        if (err || !results) {
          cb(err, results);
        } else {
          db.Ships.findOne({
            remove: false,
            _id: id
          }).exec(function (err, success) {
            if (err || !success) {
              cb(err, success);
            } else {

              var step = success._doc.step == 8 ? 8 : 3;
              db.Ships.findOneAndUpdate({
                _id: id
              }, {
                $set: {
                  equipments: results,
                  step: step
                }
              }, {
                new: true
              }).populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                .exec(function (err, success) {
                cb(err, success);
              });
            }
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  /*Localization*/
  updateLocalization: function (id, localization, cb) {
    var query = {
      _id: localization.country._id,
      "cities._id": localization.city._id,
      "cities.areas.ports._id": localization.port._id
    };
    if (localization.area._id) {
      query = {
        _id: localization.country._id,
        "cities._id": localization.city._id,
        "cities.areas._id": localization.area._id,
        "cities.areas.ports._id": localization.port._id
      };
    }
    db.Localizations.findOne(query).exec(function (err, loc) {
      if (err || !loc) {
        cb(err, loc);
      } else {
        db.Ships.findOne({
          remove: false,
          _id: id
        }).exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {

            var step = success._doc.step == 8 ? 8 : 4;
            db.Ships.findOneAndUpdate({
              _id: id
            }, {
              $set: {
                "localization.country": localization.country._id,
                "localization.city": localization.city._id,
                "localization.area": localization.area ? localization.area._id : null,
                "localization.port": localization.port._id,
                step: step
              }
            }, {
              new: true
            })
              .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
              .exec(function (err, ship) {
                if (err || !ship) {
                  cb(err, null);
                } else {
                  utilReturn(ship, function (err, object) {
                    cb(err, object);
                  });
                }
              });

          }
        });
      }
    });
  },
  /*Calendars*/
  createEvent: function (id, event, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, ship) {
      if (err || !ship) {
        cb(err, ship);
      } else {
        var end = event.end ? event.end : event.start;

        end = formatDate(end);
        var start = formatDate(event.start);

        if (event.offer) {
          var aux = {
            title: event.title,
            type: event.type,
            start: start,//functions.dateToUtc(start),
            end: end,//functions.dateToUtc(end),
            offer: event.offer
          };
        } else {
          var aux = {
            title: event.title,
            type: event.type,
            start: start,//functions.dateToUtc(start),
            end: end//functions.dateToUtc(end),
          };
        }


        db.Ships.findByIdAndUpdate({
          remove: false,
          _id: id
        }, {
          $push: {
            locks: aux
          }
        }, {
          new: true
        })
          .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
          .exec(function (err, ship) {
            if (err || !ship) {
              cb(err, null);
            } else {
              utilReturn(ship, function (err, object) {
                cb(err, object);
              });
            }
          });

      }
    });
  },
  updateEvent: function (id, event, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, ship) {
      if (err) {
        cb(err, null);
      } else {

        if (ship) {
          var end = event.end ? event.end : event.start;
          end = formatDate(end);

          var start = event.start;
          start = formatDate(start);

          var aux = {
            id: event.id,
            title: event.title,
            start: start,//functions.dateToUtc(start),
            end: end//functions.dateToUtc(end),
          };

          var events = JSON.parse(JSON.stringify(ship.locks));
          for (var i = 0; i < events.length; i++) {
            if (events[i]._id == event.id) {
              events[i]._id = aux.id;
              events[i].title = aux.title;
              events[i].start = aux.start;
              events[i].end = aux.end;
            }
          }


          db.Ships.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              locks: events
            }
          }, {
            new: true
          })
            .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
            .exec(function (err, ship) {
              if (err || !ship) {
                cb(err, null);
              } else {
                utilReturn(ship, function (err, object) {
                  cb(err, object, aux);
                });
              }
            });
        } else {
          cb(new Error("Ship no found"), null);
        }


      }
    });
  },
  removeEvent: function (id, event, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, ship) {
      if (err || !ship) {
        cb(err, null);
      } else {
        var aux = [];
        var tmpEvent = null;
        var exist = false;
        for (var i = 0; i < ship._doc.locks.length; i++) {
          if (ship._doc.locks[i]._doc._id.toString() != event._id) {
            aux.push(ship._doc.locks[i]);
          } else {
            tmpEvent = ship._doc.locks[i];
            exist = true;
          }
        }

        if (exist) {
          async.parallel([
            function (cbp) {
              db.Ships.findByIdAndUpdate({
                remove: false,
                _id: id
              }, {
                $set: {
                  locks: aux
                }
              }, {
                new: true
              })
                .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                .exec(function (err, ship) {
                  if (err || !ship) {
                    cbp(err, null);
                  } else {
                    utilReturn(ship, function (err, object) {
                      cbp(err, object);
                    });
                  }
                });
            },
            function (cbp) {
              if (tmpEvent.offer) {
                var today = new Date();
                today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                db.Offers.findOneAndUpdate({
                  _id: tmpEvent.offer.toString()
                }, {
                  $set: {
                    status: "cancel",
                    cancelDate: today,
                    "cancelation.motive": event.motive,
                    "cancelation.date": new Date()
                  }
                }, {
                  new: true
                })
                  .populate("ship shipowner request")
                  .exec(function (err, offer) {
                    if (err || !offer) {
                      cbp(err, offer);
                    }
                    else {
                      async.parallel([
                        function (cbpp) {
                          notificationViewModel.sendMailUserRefund(offer.language, offer, function () {
                            cbpp(null, true);
                          });
                        },
                        function (cbpp) {
                          notificationViewModel.sendMailOwnerRefund(offer.language, offer, function () {
                            cbpp(null, true);
                          });
                        }
                      ], function (err, results) {
                        cbp(err, results);
                      });
                    }
                  });
              }
              else {
                cbp(null, true);
              }

            }
          ], function (err, result) {
            if (err || !result) {
              cb(err, result);
            } else {
              cb(null, result[0]);
            }
          });
        } else {
          var error = new Error("El Evento seleccionado no existe");
          cb(error, null);
        }
      }
    });
  },
  createSeason: function (id, season, cb) {
    var experiences = [];
    for (var i = 0; i < season.experiences.length; i++) {
      var durations = [];
      for (var j = 0; j < season.experiences[i].durations.length; j++) {
        if (!season.experiences[i].durations[j].disable) {
          season.experiences[i].durations[j].price = season.experiences[i].durations[j].price.replace(",", ".");
          var dur = {
            duration: season.experiences[i].durations[j].duration,
            price: currencyFormatter.format(season.experiences[i].durations[j].price, format).trim()
          };
          durations.push(dur);
        }
      }
      var xp = {
        experience: season.experiences[i]._id,
        durations: durations
      };
      experiences.push(xp);
    }
    var end = new Date(season.end.year, season.end.month, season.end.day);
    var start = new Date(season.start.year, season.start.month, season.start.day);
    var sea = {
      title: season.title,
      color: season.color,
      start: start,//functions.dateToUtc(start),
      end: end,//functions.dateToUtc(end),
      experiences: experiences
    };
    if (validateSeason(season)) {
      db.Ships.findOne({
        remove: false,
        _id: id
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {

          var step = success._doc.step == 8 ? 8 : 5;
          db.Ships.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $push: {
              seasons: sea
            },
            $set: {
              step: step
            }
          }, {
            new: true
          })
            .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
            .exec(function (err, ship) {
              if (err || !ship) {
                cb(err, null);
              } else {
                utilReturn(ship, function (err, object) {
                  cb(err, object);
                });
              }
            });

        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto"
      };
      cb(error, null);
    }
  },
  updateSeason: function (id, season, cb) {
    var experiences = [];
    for (var i = 0; i < season.experiences.length; i++) {
      var durations = [];
      for (var j = 0; j < season.experiences[i].durations.length; j++) {
        if (!season.experiences[i].durations[j].disable) {
          season.experiences[i].durations[j].price = season.experiences[i].durations[j].price.replace(",", ".");
          var dur = {
            duration: season.experiences[i].durations[j].duration,
            price: currencyFormatter.format(season.experiences[i].durations[j].price, format).trim()
          };
          durations.push(dur);
        }
      }
      var xp = {
        experience: season.experiences[i]._id,
        durations: durations
      };
      experiences.push(xp);
    }
    var end = formatDate(season.end);
    var start = formatDate(season.start);
    var sea = {
      _id: season._id,
      title: season.title,
      color: season.color,
      start: start,//functions.dateToUtc(start),
      end: end,//functions.dateToUtc(end),
      experiences: experiences
    };
    if (validateSeason(season)) {
      db.Ships.findOne({
        remove: false,
        _id: id
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {

          var step = success._doc.step == 8 ? 8 : 5;
          var seasons = JSON.parse(JSON.stringify(success._doc.seasons));
          for (var k = 0; k < seasons.length; k++) {
            if (seasons[k]._id.toString() == sea._id) {
              seasons[k].title = sea.title;
              seasons[k].color = sea.color;
              seasons[k].start = sea.start;
              seasons[k].end = sea.end;
              seasons[k].experiences = sea.experiences;
              break;
            }
          }

          db.Ships.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              seasons: seasons,
              step: step
            }
          }, {
            new: true
          })
            .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
            .exec(function (err, ship) {
              if (err || !ship) {
                cb(err, null);
              } else {
                utilReturn(ship, function (err, object) {
                  cb(err, object);
                });
              }
            });

        }
      });
    } else {
      var error = {
        message: "Formulario Incorrecto"
      };
      cb(error, null);
    }
  },
  removeSeason: function (id, season, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, ship) {
      if (err || !ship) {
        cb(err, ship);
      } else {
        var aux = [];
        for (var i = 0; i < ship._doc.seasons.length; i++) {
          if (ship._doc.seasons[i]._doc._id.toString() != season._id) {
            aux.push(ship._doc.seasons[i]);
          }
        }

        if (ship._doc.seasons.length - 1) {
          db.Ships.findByIdAndUpdate({
            remove: false,
            _id: id
          }, {
            $set: {
              seasons: aux
            }
          }, {
            new: true
          })
            .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name").exec(function (err, ship) {
            if (err || !ship) {
              cb(err, null);
            } else {
              utilReturn(ship, function (err, object) {
                cb(err, object);
              });
            }
          });
        } else {
          async.waterfall([
            function (cbw) {
              db.Ships.findByIdAndUpdate({
                remove: false,
                _id: id
              }, {
                $set: {
                  seasons: aux
                }
              }, {
                new: true
              })
                .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name").exec(function (err, ship) {
                if (err || !ship) {
                  cbw(err, null);
                } else {
                  utilReturn(ship, function (err, object) {
                    cbw(err, object);
                  });
                }
              });
            },
            function (object, cbw) {
              db.Ships.update({
                _id: object._doc._id
              }, {
                $set: {
                  status: false,
                  publish: false
                }
              }).exec(function (err, success) {
                if (err) {
                  cbw(err, success);
                } else {
                  cbw(err, object);
                }
              });
            }
          ], function (err, results) {
            cb(err, results);
          });
        }
      }
    });
  },
  saveConditions: function (id, conditions, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, ship) {
      if (err || !ship) {
        cb(err, ship);
      } else {
        prepareLanguages(conditions.text, function (text) {
          conditions.text = text;
          isoFieldView.validateUpdateIsoField(conditions.text, function (data) {
            if (!data) {
              var error = {
                message: "Formulario Incorrecto"
              };
              cb(error, null);
            } else {
              async.map(ship._doc.conditions.text, function (text, callback0) {
                isoFieldView.remove(text, function (err, iso) {
                  callback0(err, iso);
                });
              }, function (err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  async.map(conditions.text, function (text, callback) {
                    var item = text._id;
                    if (ship.conditions.text.length) {
                      if (text.language) {
                        item = text.language;
                      }
                    }
                    isoFieldView.create(item, text.value, function (err, iso) {
                      callback(err, iso);
                    });
                  }, function (err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {
                      var arrayTitle = [];
                      for (var i = 0; i < result.length; i++) {
                        arrayTitle.push(result[i]._doc._id);
                      }

                      for (var i = 0; i < conditions.extras.length; i++) {
                        if (conditions.extras[i].import) {
                          conditions.extras[i].import = JSON.parse(JSON.stringify(currencyFormatter.format(parseFloat(conditions.extras[i].import.toString().replace(".", "").replace(",", ".")), format).trim()));
                        }

                      }


                      var cond = {
                        bail: parseFloat(conditions.bail.toString().replace(".", "").replace(",", ".")),
                        bailOptions: conditions.bailOptions,
                        patron: conditions.patron,
                        secondPayment: conditions.secondPayment,
                        refund: conditions.refund,
                        basePort: conditions.basePort,
                        sleepBasePort: conditions.sleepBasePort,
                        extras: conditions.extras,
                        weekRentals: {
                          checkIn: {
                            day: conditions.weekRentals.checkIn.day,
                            hour: conditions.weekRentals.checkIn.hour,
                          },
                          checkOut: {
                            day: conditions.weekRentals.checkOut.day,
                            hour: conditions.weekRentals.checkOut.hour,
                          }
                        },
                        dayRentals: {
                          checkIn: {
                            hour: conditions.dayRentals.checkIn.hour,
                          },
                          checkOut: {
                            hour: conditions.dayRentals.checkOut.hour,
                          }
                        },
                        text: arrayTitle
                      };

                      var step = ship._doc.step == 8 ? 8 : 6;
                      db.Ships.findByIdAndUpdate({
                        remove: false,
                        _id: id
                      }, {
                        $set: {
                          conditions: cond,
                          step: step
                        }
                      }, {
                        new: true
                      })
                        .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                        .exec(function (err, ship) {
                          if (err || !ship) {
                            cb(err, null);
                          } else {
                            utilReturn(ship, function (err, object) {
                              cb(err, object);
                            });
                          }
                        });

                    }
                  });
                }
              });
            }
          });
        });

      }
    });
  },
  saveDiscounts: function (id, discounts, cb) {
    async.map(discounts, function (discount, cbm) {
      discount.start = new Date(discount.start.year, discount.start.month, discount.start.day);
      discount.end = new Date(discount.end.year, discount.end.month, discount.end.day);
      validateDiscount(discount, function (data) {
        if (data) {
          cbm(null, true);
        } else {
          cbm(true, false);
        }
      });
    }, function (err, results) {
      if (err || !results) {
        var error = {
          message: "Formulario Incorrecto."
        };
        cb(error, null);
      } else {
        db.Ships.findOne({
          remove: false,
          _id: id
        }).exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {

            var step = 8;
            for (var i = 0; i < discounts.length; i++) {
              discounts[i].discount = JSON.parse(JSON.stringify(parseInt(discounts[i].discount)));
            }
            db.Ships.findOneAndUpdate({
              _id: id
            }, {
              $set: {
                discounts: discounts,
                step: step
              }
            }, {
              new: true
            }).exec(function (err, success) {
              cb(err, success);
            });

          }
        });
      }
    });
  },
  addPhotos: function (id, files, cb) {
    var file = files.file;
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, success) {
      if (err || !success) {
        cb(err, success);
      } else {
        if (success.photos.length < 20) {

          fs.readFile(file.path, function (err, data) {
            var faux = {
              contentType: file.type,
              fieldName: file.name,
              data: data,
              name: file.originalFilename
            };
            fs.unlink(file.path, function (err) {
              if (err)
                console.log(err);
            });
            mediaViewModel.create(faux, function (err, medias) {
              if (err) {
                cb(err, medias);
              } else {
                try {
                  var aux = {
                    media: medias._doc._id
                  };
                  if (!success.photos.length) {
                    var aux = {
                      media: medias._doc._id,
                      default: true
                    };

                  }

                  var step = success._doc.step;
                  if (success._doc.photos.length > 2)
                    step = success._doc.step == 8 ? 8 : 7;

                  db.Ships.findByIdAndUpdate({
                    remove: false,
                    _id: id
                  }, {
                    $push: {
                      photos: aux
                    },
                    $set: {
                      step: step
                    }
                  }, {
                    new: true
                  })
                    .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                    .exec(function (err, success) {
                      if (err || !success) {
                        cb(err, success);
                      } else {
                        utilReturn(success, function (err, object) {
                          cb(err, object);
                        });
                      }
                    });
                } catch (error) {
                  cb(error, false);
                }
              }
            });
          });


        } else {
          var error = {
            message: "Máximo Requerido (20 Fotos)"
          };
          cb(error, null);
        }

      }
    });
  },
  delPhotos: function (id, photo, cb) {
    if (id && photo) {
      db.Ships.findOne({
        _id: id,
        remove: false
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          var flag = false;
          for (var i = 0; i < success._doc.photos.length; i++) {
            if (success._doc.photos[i]._doc._id.toString() == photo._id) {
              if (success._doc.photos[i]._doc.default) {
                flag = true;
                break;
              }
            }
          }
          if (!flag) {
            mediaViewModel.remove(photo.media, function (err, medias) {
              if (err) {
                cb(err, medias);
              } else {
                try {
                  var newArray = [];
                  for (var i = 0; i < success._doc.photos.length; i++) {
                    if (success._doc.photos[i]._doc._id.toString() != photo._id) {
                      newArray.push(success._doc.photos[i]);
                    }
                  }

                  if (success._doc.photos.length - 1) {
                    db.Ships.findByIdAndUpdate({
                      remove: false,
                      _id: id
                    }, {
                      $set: {
                        photos: newArray
                      }
                    }, {
                      new: true
                    })
                      .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                      .exec(function (err, success) {
                        if (err || !success) {
                          cb(err, success);
                        } else {
                          utilReturn(success, function (err, object) {
                            cb(err, object);
                          });
                        }
                      });
                  } else {
                    async.waterfall([
                      function (cbw) {
                        db.Ships.findByIdAndUpdate({
                          remove: false,
                          _id: id
                        }, {
                          $set: {
                            photos: newArray
                          }
                        }, {
                          new: true
                        })
                          .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
                          .exec(function (err, success) {
                            if (err || !success) {
                              cbw(err, success);
                            } else {
                              utilReturn(success, function (err, object) {
                                cbw(err, object);
                              });
                            }
                          });
                      },
                      function (object, cbw) {
                        db.Ships.update({
                          _id: object._doc._id
                        }, {
                          $set: {
                            status: false,
                            publish: false
                          }
                        }).exec(function (err, success) {
                          if (err) {
                            cbw(err, success);
                          } else {
                            cbw(err, object);
                          }
                        });
                      }
                    ], function (err, results) {
                      cb(err, results);
                    });
                  }


                } catch (error) {
                  cb(error, false);
                }
              }

            });
          } else {
            var error = {
              message: "No puede eliminar la imagen principal"
            };
            cb(error, null);
          }


        }
      });
    } else {
      var error = {
        message: "Datos Incorrecto"
      };
      cb(error, null);
    }

  },
  setAsDefaultPhoto: function (id, photo, cb) {
    db.Ships.findOne({
      _id: id,
      remove: false
    }).exec(function (err, success) {
      if (err || !success) {
        cb(err, success);
      } else {
        for (var i = 0; i < success._doc.photos.length; i++) {
          if (success._doc.photos[i]._doc._id.toString() == photo) {
            success._doc.photos[i]._doc.default = true;
          } else {
            success._doc.photos[i]._doc.default = false;
          }
        }

        db.Ships.findByIdAndUpdate({
          remove: false,
          _id: id
        }, {
          $set: {
            photos: success._doc.photos
          }
        }, {
          new: true
        })
          .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
          .exec(function (err, success) {
            if (err || !success) {
              cb(err, success);
            } else {
              utilReturn(success, function (err, object) {
                cb(err, object);
              });
            }
          });
      }
    });
  },
  available: function (day, user, cb) {
    day = new Date(day.year, day.month, day.day);
    var query = {
      remove: false,
      status: true
    };
    if (user.permissions.isShipOwner) query.user = user._id;

    db.Ships.find(query)
      .populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name")
      .exec(function (err, ships) {
        if (err || !ships) {
          cb(err, ships);
        } else {

          formatValidateShip(day, ships, function (err, success) {
            if (err || !success) {
              cb(err, success);
            } else {
              var auxS = [];
              for (var i = 0; i < success.length; i++) {
                if (success[i]._doc.seasons.length && success[i]._doc.season !== null)
                  auxS.push(success[i]);
              }
              utilReturnList(auxS, false, null, null, function (err, object) {
                cb(err, object);
              });
            }
          });
        }
      });
  },
  validateStatus: function (id, cb) {
    db.Ships.findOne({
      _id: id
    }).exec(function (err, ship) {
      if (err || !ship) {
        cb(err, ship);
      } else {
        async.parallel([
          function (cbp) {
            if (ship.photos.length) {
              var flag = false;
              for (var i = 0; i < ship.photos.length; i++) {
                if (ship.photos[i].default) {
                  flag = true;
                  break;
                }
              }
              if (flag) {
                cbp(null, true);
              } else {
                cbp(true, false);
              }
            } else {
              cbp(true, false);
            }
          },
          function (cbp) {
            if (!ship.localization.country) {
              cbp(true, false);
            } else if (!ship.localization.city) {
              cbp(true, false);
            } else if (!ship.localization.port) {
              cbp(true, false);
            } else {
              cbp(null, true);
            }
          },
          function (cbp) {
            if (!ship.seasons.length) {
              cbp(true, false);
            } else {
              if (!ship.seasons[0].experiences.length) {
                cbp(true, false);
              } else {
                cbp(null, true);
              }
            }
          }
        ], function (err, results) {
          cb(err, results);
        });
      }
    });
  }

};

module.exports = shipFunctions;