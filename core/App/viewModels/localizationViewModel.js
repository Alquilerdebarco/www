/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

var isoFieldView = require("./IsoFieldViewModel");
var _ = require("lodash");
var util = require("./../../middlewares/utils");
var languageViewModel = require("./languageViewModel");
var async = require("async");

function prepareLanguages(text, cb) {
  isoFieldView.reformatIsoField(text, function (text) {
    cb(text);
  });
}

var LocalizationsFunctions = {

  getLocalizationbySlug: function (lang, data, cb) {
    db.Localizations.find()
            .populate({
              path: "slug",
              select: "value",
              match: {
                language: lang
              }
            })
            .populate({
              path: "cities.slug",
              select: "value",
              match: {
                language: lang
              }

            })
            .populate({
              path: "cities.areas.slug",
              select: "value",
              match: {
                language: lang
              }

            })
            .populate({
              path: "cities.areas.ports.slug",
              select: "value",
              match: {
                language: lang
              }

            }).exec(function (err, object) {
              if (err || !object) {
                cb(err, false);
              } else {
                var aux = [];
                var stop = false;
                for (var i = 0; i < object.length && !stop; i++) {
                  if (object[i]._doc.slug[0]._doc.value == data.country) {
                    aux.push(object[i]._doc._id);
                    stop = true;
                    if (data.city) {
                      for (var j = 0; j < object[i]._doc.cities.length; j++) {
                        if (object[i]._doc.cities[j].slug[0]._doc.value == data.city)
                          aux.push(object[i]._doc.cities[j]._doc._id);
                      }
                    } else if (data.area) {
                      for (var j = 0; j < object[i]._doc.cities.length; j++) {
                        for (var k = 0; k < object[i]._doc.cities[j]._doc.areas.length; k++) {
                          if (object[i]._doc.cities[j]._doc.areas[k].slug[0]._doc.value == data.area)
                            aux.push(object[i]._doc.cities[j]._doc.areas[k]._doc._id);
                        }

                      }
                    } else if (data.port) {
                      for (var j = 0; j < object[i]._doc.cities.length; j++) {
                        for (var k = 0; k < object[i]._doc.cities[j]._doc.areas.length; k++) {
                          for (var l = 0; l < object[i]._doc.cities[j]._doc.areas[k]._doc.ports.length; l++) {
                            if (data.port == object[i]._doc.cities[j]._doc.areas[k]._doc.ports[l].slug[0]._doc.value)
                              aux.push(object[i]._doc.cities[j]._doc.areas[k]._doc.ports[l]._doc._id);
                          }

                        }

                      }
                    }

                  }

                }
                cb(false, aux);
              }
            });
  },
  getLocalization: function (data, cb) {
    db.Localizations.findOne({
      _id: data.country
    }).populate("name cities.name cities.areas.name cities.areas.ports.name").exec(function (err, object) {
      if (err || !object) {
        cb(err, object);
      } else {
        var country = {
          _id: object._doc._id,
          name: object._doc.name
        };
        var city, area, port;
        for (var i = 0; i < object._doc.cities.length; i++) {
          if (object._doc.cities[i]._doc._id.toString() == data.city.toString()) {
            var stop = false;
            city = {
              _id: object._doc.cities[i]._doc._id,
              name: object._doc.cities[i]._doc.name
            };
            for (var j = 0; j < object._doc.cities[i]._doc.areas.length; j++) {
              if (data.area) {
                if (object._doc.cities[i]._doc.areas[j]._doc._id.toString() == data.area) {
                  area = {
                    _id: object._doc.cities[i]._doc.areas[j]._doc._id,
                    name: object._doc.cities[i]._doc.areas[j]._doc.name
                  };
                  for (var k = 0; k < object._doc.cities[i]._doc.areas[j].ports.length; k++) {
                    if (object._doc.cities[i]._doc.areas[j].ports[k]._doc._id.toString() == data.port) {
                      port = {
                        _id: object._doc.cities[i]._doc.areas[j].ports[k]._doc._id,
                        name: object._doc.cities[i]._doc.areas[j].ports[k]._doc.name,
                        longitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.longitude),
                        latitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.latitude)
                      };
                      stop = true;
                      break;
                    }
                  }
                  if (stop) break;

                }
              }
              else{
                for (var k = 0; k < object._doc.cities[i]._doc.areas[j].ports.length; k++) {
                  if (object._doc.cities[i]._doc.areas[j].ports[k]._doc._id.toString() == data.port) {
                    port = {
                      _id: object._doc.cities[i]._doc.areas[j].ports[k]._doc._id,
                      name: object._doc.cities[i]._doc.areas[j].ports[k]._doc.name,
                      longitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.longitude),
                      latitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.latitude)
                    };
                    stop = true;
                    break;
                  }
                }
                if (stop) break;
              }

            }
            if (stop) break;
          }
        }

        var aux = {
          country: country,
          city: city,
          area: area,
          port: port
        };
        cb(null, aux);
      }
    });
  },
  getLocalizationFront: function (data, iso, cb) {
    languageViewModel.getLanguageByISO(iso, function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      } else {
        db.Localizations.findOne({
          _id: data.country
        }).populate({
          path: "name",
          select: "value",
          match: {
            language: lang._doc._id
          }
        }).populate({
          path: "cities.name",
          select: "value",
          match: {
            language: lang._doc._id
          }
        }).populate({
          path: "cities.areas.name",
          select: "value",
          match: {
            language: lang._doc._id
          }
        }).populate({
          path: "cities.areas.ports.name",
          select: "value",
          match: {
            language: lang._doc._id
          }
        }).exec(function (err, object) {
          if (err || !object) {
            cb(err, object);
          } else {
            var country = {
              _id: object._doc._id,
              name: object._doc.name
            };
            var city, area, port;
            for (var i = 0; i < object._doc.cities.length; i++) {
              if (object._doc.cities[i]._doc._id.toString() == data.city.toString()) {
                var stop = false;
                city = {
                  _id: object._doc.cities[i]._doc._id,
                  name: object._doc.cities[i]._doc.name
                };
                var existArea = false;
                for (var j = 0; j < object._doc.cities[i]._doc.areas.length; j++) {
                  if (object._doc.cities[i]._doc.areas[j]._doc._id.toString() == data.area) {
                    existArea=true;
                    area = {
                      _id: object._doc.cities[i]._doc.areas[j]._doc._id,
                      name: object._doc.cities[i]._doc.areas[j]._doc.name
                    };

                    for (var k = 0; k < object._doc.cities[i]._doc.areas[j].ports.length; k++) {
                      if (object._doc.cities[i]._doc.areas[j].ports[k]._doc._id.toString() == data.port) {
                        port = {
                          _id: object._doc.cities[i]._doc.areas[j].ports[k]._doc._id,
                          name: object._doc.cities[i]._doc.areas[j].ports[k]._doc.name,
                          longitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.longitude),
                          latitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.latitude)
                        };
                        stop = true;
                        break;
                      }
                    }
                  }
                }
                if (!existArea) {
                  for (var j = 0; j < object._doc.cities[i]._doc.areas.length; j++) {
                    for (var k = 0; k < object._doc.cities[i]._doc.areas[j].ports.length; k++) {
                      if (object._doc.cities[i]._doc.areas[j].ports[k]._doc._id.toString() == data.port) {
                        port = {
                          _id: object._doc.cities[i]._doc.areas[j].ports[k]._doc._id,
                          name: object._doc.cities[i]._doc.areas[j].ports[k]._doc.name,
                          longitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.longitude),
                          latitude: parseFloat(object._doc.cities[i]._doc.areas[j].ports[k]._doc.latitude)
                        };
                        stop = true;
                        break;
                      }
                    }
                  }
                }
                if (stop) break;
              }
            }

            var aux = {
              country: country,
              city: city,
              port: port
            };
            if(area)  aux.area=area;
            cb(null, aux);
          }
        });
      }
    });
  },
  listLocalization: function (cb) {
    db.Localizations.find().populate({
      path: "name cities.name cities.areas.name cities.areas.ports.name"
    }).exec(function (err, loc) {
      cb(err, loc);
    });
  },

    /*
     *  COUNTRIES
     */
  countryFrontList: function (culture, cb) {
    languageViewModel.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Localizations.find({
          remove: false
        })
                    .populate({
                      path: "name slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.name cities.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.areas.name cities.areas.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.areas.ports.name cities.areas.ports.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    }).exec(function (err, object) {
                      if (err || !object) {
                        cb(err, false);
                      } else {
                        cb(null, object);
                      }
                    });
      }
    });

  },
  getcountryFront: function (culture, id, cb) {
    languageViewModel.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Localizations.findOne({
          remove: false,
          _id: id
        })
                    .populate({
                      path: "name slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.name cities.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.areas.name cities.areas.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    })
                    .populate({
                      path: "cities.areas.ports.name cities.areas.ports.slug",
                      select: "value",
                      match: {
                        language: lang._doc._id
                      }

                    }).exec(function (err, object) {
                      if (err || !object) {
                        cb(err, false);
                      } else {
                        cb(null, object);
                      }
                    });
      }
    });

  },
  listCounties: function (limit, skip, cb) {
    async.parallel([
      function (callback) {
        db.Localizations.count({
          remove: false
        }).exec(function (err, count) {
          callback(err, count);
        });
      },
      function (callback) {
        db.Localizations.find({
          remove: false
        })
                    .populate("name")
                    .sort({
                      slug: 1
                    }).limit(limit).skip(skip).exec(function (err, data) {
                      if (err || !data) {
                        callback(err, data);
                      } else {
                        var array = [];
                        _.forEach(data, function (country) {
                          var cities = country.cities.length;
                          var areas = 0;
                          if (cities) {
                            _.forEach(country.cities, function (city) {
                              areas += city.areas.length;
                            });

                          }

                          var aux = {
                            _id: country._doc._id,
                            name: country.name,
                            iso: country.iso,
                            cities: cities,
                            ports: areas
                          };
                          array.push(aux);
                        });

                        callback(null, array);
                      }
                    });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        cb(null, results[1], results[0]);
      }
    });
  },
  createCountry: function (country, iso, cb) {
    isoFieldView.validateCreateIsoField(country.name, function (goOne) {
      if (goOne) {
        async.map(country.name, function (name, callback) {
          async.parallel([
            function (cbp) {
              isoFieldView.create(name._id, name.value, function (err, iso) {
                cbp(err, iso);
              });
            },
            function (cbp) {
              isoFieldView.create(name._id, util.getSlug(name.value), function (err, iso) {
                cbp(err, iso);
              });
            }
          ], function (err, results) {
            callback(err, results);
          });
        }, function (err, result) {
          if (err || !result) {
            cb(err, result);
          } else {
            var array = [];
            var arrays = [];

            for (var i = 0; i < result.length; i++) {
              array.push(result[i][0]._doc._id);
              arrays.push(result[i][1]._doc._id);
            }
            var countryDb;
            if (country._id) {
              countryDb = new db.Localizations({
                _id: country._id,
                slug: arrays,
                iso: iso,
                name: array,
                cities: country.cities
              });
            } else {
              countryDb = new db.Localizations({
                slug: arrays,
                name: array,
                iso: iso,
                cities: []
              });
            }
            countryDb.save(function (err, country) {
              cb(err, country);
            });
          }
        });
      } else {
        var error = {
          message: "Formulario Incorrecto"
        };
        cb(error, null);
      }
    });
  },
  updateCountry: function (country, iso, cb) {
    db.Localizations.findOne({
      _id: country._id
    })
            .exec(function (err, countryDoc) {
              if (err || !countryDoc) {
                cb(err, countryDoc);
              } else {
                async.parallel([
                  function (cbp) {
                    async.map(countryDoc.name, function (name, callback) {
                      isoFieldView.remove(name, function (err, success) {
                        callback(err, success);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  },
                  function (cbp) {
                    async.map(countryDoc.slug, function (slug, callback) {
                      isoFieldView.remove(slug, function (err, success) {
                        callback(err, success);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  }
                ], function (err, results) {
                  if (err || !results) {
                    cb(err, results);
                  } else {
                    db.Localizations.remove({
                      _id: countryDoc._doc._id
                    }).exec(function (err, success) {
                      if (err || !success) {
                        cb(err, success);
                      } else {
                        prepareLanguages(country.name, function (name) {
                          country.name = name;
                          country.cities = countryDoc.cities;
                          LocalizationsFunctions.createCountry(country, iso, function (err, success) {
                            cb(err, success);
                          });
                        });
                      }
                    });
                  }
                });
              }
            });
  },
  removeCountry: function (country, cb) {
    db.Localizations.findOne({
      _id: country._id
    }).populate("name cities.name cities.ports.name")
            .exec(function (err, countrySDoc) {
              if (err || !countrySDoc) {
                cb(err, countrySDoc);
              } else {
                var removeNameField = [];
                for (var i = 0; i < countrySDoc._doc.slug.length; i++) {
                  countrySDoc._doc.name.push(countrySDoc._doc.slug[i]);
                }
                removeNameField.push(countrySDoc._doc.name);
                for (var i = 0; i < countrySDoc._doc.cities.length; i++) {
                  removeNameField.push(countrySDoc._doc.cities[i]._doc.name);
                  for (var j = 0; j < countrySDoc._doc.cities[i].ports.length; j++) {
                    removeNameField.push(countrySDoc._doc.cities[i].ports[j]._doc.name);
                  }
                }

                async.map(removeNameField, function (item, callback) {
                  async.map(item, function (name, callback0) {
                    isoFieldView.remove(name._doc._id, function (err, iso) {
                      callback0(err, iso);
                    });
                  }, function (err, result) {
                    callback(err, result);
                  });
                }, function (err, result) {
                  if (err || !result) {
                    cb(err, result);
                  } else {
                    db.Localizations.remove({
                      _id: country._id
                    }, function (err, success) {
                      cb(err, success);
                    });
                  }
                });
              }
            });
  },

    /*
     *  CITIES
     */
  listCities: function (limit, skip, filter, cb) {
    var query;
    var country = filter.country_id;
    if (country !== null) {
      query = {
        _id: country,
        remove: false
      };
    } else {
      query = {
        remove: false
      };
    }

    db.Localizations.find(query)
            .populate("name cities.name").exec(function (err, data) {
              if (err || !data) {
                cb(err, data);
              } else {
                var cities = [];
                _.forEach(data, function (country) {
                  if (country._doc.cities.length) {
                    for (var i = 0; i < country._doc.cities.length; i++) {
                      var aux = {
                        country: {
                          _id: country._doc._id,
                          name: country._doc.name
                        },
                        _id: country._doc.cities[i]._doc._id,
                        name: country._doc.cities[i]._doc.name,
                        slug: country._doc.cities[i]._doc.slug,
                        areas: country._doc.cities[i]._doc.areas.length
                      };
                      cities.push(aux);
                    }
                  }
                });

                for (var i = 0; i < cities.length; i++) {
                  for (var j = i + 1; j < cities.length; j++) {
                    if (cities[i].slug > cities[j].slug) {
                      var aux = cities[i];
                      cities[i] = cities[j];
                      cities[j] = aux;
                    }
                  }
                }

                if (cities.length > limit) {
                  var array = [];
                  var length = skip + limit;
                  if ((cities.length) < length) {
                    length = cities.length;
                  }
                  for (var i = skip; i < length; i++) {
                    array.push(cities[i]);
                  }
                  cb(null, array, cities.length);
                } else {
                  cb(null, cities, cities.length);
                }

              }
            });
  },
  createCity: function (country_id, city, cb) {
    isoFieldView.validateCreateIsoField(city.name, function (goOne) {
      if (goOne) {
        async.map(city.name, function (name, callback) {
          async.parallel([
            function (cbp) {
              isoFieldView.create(name._id, name.value, function (err, iso) {
                cbp(err, iso);
              });
            },
            function (cbp) {
              isoFieldView.create(name._id, util.getSlug(name.value), function (err, iso) {
                cbp(err, iso);
              });
            }
          ], function (err, result) {
            callback(err, result);
          });
        }, function (err, results) {
          if (err || !results) {
            cb(err, results);
          } else {
            var array = [];
            var arrays = [];

            for (var i = 0; i < results.length; i++) {
              array.push(results[i][0]._doc._id);
              arrays.push(results[i][1]._doc._id);
            }
            var cityDb;
            if (city._id) {
              cityDb = {
                _id: city._id,
                slug: arrays,
                name: array,
                areas: city.areas
              };
            } else {
              cityDb = {
                name: array,
                slug: arrays,
                ports: []
              };
            }
            db.Localizations.update({
              _id: country_id
            }, {
              $push: {
                cities: cityDb
              }
            }).exec(function (err, success) {
              cb(err, success);
            });
          }
        });
      } else {
        var error = {
          message: "Formulario Incorrecto"
        };
        cb(error, null);
      }
    });
  },
  updateCity: function (city, cb) {
    db.Localizations.findOne({
      "cities._id": city._id
    }).exec(function (err, country) {
      if (err || !country) {
        cb(err, country);
      } else {
        var array = [];
        var tem;
        for (var i = 0; i < country._doc.cities.length; i++) {
          if (country._doc.cities[i]._id != city._id) {
            array.push(country._doc.cities[i]);
          } else {
            tem = country._doc.cities[i];
          }
        }
        async.parallel([
          function (cbp) {
            async.map(tem.name, function (name, callback) {
              isoFieldView.remove(name, function (err, success) {
                callback(err, success);
              });
            }, function (err, result) {
              if (err || !result) {
                cbp(err, result);
              } else {
                prepareLanguages(city.name, function (name) {
                  cbp(err, name);
                });
              }
            });
          },
          function (cbp) {
            async.map(tem.slug, function (slug, callback) {
              isoFieldView.remove(slug, function (err, success) {
                callback(err, success);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          }
        ], function (err, results) {
          if (err || !results) {
            cb(err, results);
          } else {
            db.Localizations.update({
              _id: country._doc._id
            }, {
              $set: {
                cities: array
              }
            })
                            .exec(function (err, success) {
                              if (err || !success) {
                                cb(err, success);
                              } else {
                                city.name = results[0];
                                city.areas = tem.areas;
                                LocalizationsFunctions.createCity(city.country._id, city, function (err, success) {
                                  cb(err, success);
                                });
                              }
                            });
          }
        });


      }
    });
  },
  removeCity: function (city, cb) {
    db.Localizations.findOne({
      _id: city.country._id
    })
            .populate("name cities.name cities.areas.name cities.areas.ports.name").exec(function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {
                var auxCities = [];
                var removeNameField = [];

                for (var i = 0; i < country.cities.length; i++) {
                  if (country.cities[i]._doc._id.toString() != city._id) {
                    auxCities.push(country.cities[i]._doc);
                  } else {


                    removeNameField.push(country.cities[i]._doc);
                    for (var j = 0; j < country.cities[i].areas.length; j++) {
                      removeNameField.push(country.cities[i].areas[j]._doc);
                      for (var k = 0; k < country.cities[i].areas[j].ports.length; k++) {
                        removeNameField.push(country.cities[i].areas[j].ports[k]._doc);
                      }
                    }
                  }
                }

                async.map(removeNameField, function (item, callback) {
                  async.parallel([
                    function (cbp) {
                      async.map(item.name, function (name, callback0) {
                        isoFieldView.remove(name._doc._id, function (err, iso) {
                          callback0(err, iso);
                        });
                      }, function (err, result) {
                        cbp(err, result);
                      });
                    },
                    function (cbp) {
                      async.map(item.slug, function (slug, callback0) {
                        isoFieldView.remove(slug, function (err, iso) {
                          callback0(err, iso);
                        });
                      }, function (err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function (err, result) {
                    callback(err, result);
                  });
                }, function (err, result) {
                  if (err || !result) {
                    cb(err, result);
                  } else {
                    db.Localizations.update({
                      _id: city.country._id
                    }, {
                      $set: {
                        cities: auxCities
                      }
                    }, function (err, success) {
                      cb(err, success);
                    });
                  }
                });
              }
            });
  },

    /*
     *  AREA
     */
  listAreas: function (limit, skip, filter, cb) {
    var country = filter.country_id;
    var cityId = filter.city_id;
    var query;
    if (country && cityId) {
      query = {
        _id: country,
        "cities._id": cityId,
        remove: false
      };
    } else if (country && cityId === null) {
      query = {
        _id: country,
        remove: false
      };
    } else if (cityId && country === null) {
      query = {
        "cities._id": cityId,
        remove: false
      };
    } else {
      query = {
        remove: false
      };
    }

    db.Localizations.find(query).populate("name cities.name cities.areas.name")
            .exec(function (err, data) {
              if (err || !data) {
                cb(err, data);
              } else {
                var areas = [];
                _.forEach(data, function (country) {
                  if (country._doc.cities.length) {
                    _.forEach(country._doc.cities, function (city) {

                      if (city._doc.areas.length) {
                        for (var i = 0; i < city._doc.areas.length; i++) {
                          var aux;
                          if (cityId) {
                            if (city._doc._id.toString() == cityId) {
                              aux = {
                                _id: city._doc.areas[i]._doc._id,
                                slug: city._doc.areas[i]._doc.slug,
                                country: {
                                  _id: country._doc._id,
                                  name: country._doc.name
                                },
                                city: {
                                  _id: city._doc._id,
                                  name: city._doc.name,
                                },
                                name: city._doc.areas[i]._doc.name
                              };
                              areas.push(aux);
                            }
                          } else {
                            aux = {
                              _id: city._doc.areas[i]._doc._id,
                              slug: city._doc.areas[i]._doc.slug,
                              country: {
                                _id: country._doc._id,
                                name: country._doc.name
                              },
                              city: {
                                _id: city._doc._id,
                                name: city._doc.name,
                              },
                              name: city._doc.areas[i]._doc.name
                            };
                            areas.push(aux);
                          }

                        }
                      }
                    });
                  }
                });

                for (var i = 0; i < areas.length; i++) {
                  for (var j = i + 1; j < areas.length; j++) {
                    if (areas[i].slug > areas[j].slug) {
                      var aux = areas[i];
                      areas[i] = areas[j];
                      areas[j] = aux;
                    }
                  }
                }
                if (areas.length > limit) {
                  var array = [];
                  var length = skip + limit;
                  if ((areas.length) < length) {
                    length = areas.length;
                  }
                  for (var i = skip; i < length; i++) {
                    array.push(areas[i]);
                  }
                  cb(null, array, areas.length);
                } else {
                  cb(null, areas, areas.length);
                }
              }
            });
  },
  createArea: function (country_id, city_id, area, cb) {
    isoFieldView.validateCreateIsoField(area.name, function (goOne) {
      if (goOne) {
        async.map(area.name, function (name, callback) {
          async.parallel([
            function (cbp) {
              isoFieldView.create(name._id, name.value, function (err, iso) {
                cbp(err, iso);
              });
            },
            function (cbp) {
              isoFieldView.create(name._id, util.getSlug(name.value), function (err, iso) {
                cbp(err, iso);
              });
            },
          ], function (err, result) {
            callback(err, result);
          });
        }, function (err, results) {
          if (err || !results) {
            cb(err, results);
          } else {

            var array = [];
            var arrays = [];
            var aux;
            for (var i = 0; i < results.length; i++) {
              array.push(results[i][0]._doc._id);
              arrays.push(results[i][1]._doc._id);
            }

            if (area._id) {
              aux = {
                _id: area._id,
                slug: arrays,
                name: array,
                ports: area.ports
              };
            } else {
              aux = {
                slug: arrays,
                name: array
              };
            }
            db.Localizations.findOne({
              _id: country_id
            }, "cities", function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {

                _.forEach(country.cities, function (city) {
                  if (city._doc._id.toString() == city_id) {
                    city._doc.areas.push(aux);
                  }
                });
                var auxCities = country.cities;

                db.Localizations.update({
                  _id: country_id
                }, {
                  $set: {
                    cities: auxCities
                  }
                }).exec(function (err, success) {
                  cb(err, success);
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
    });
  },
  updateArea: function (area, cb) {
    db.Localizations.findOne({
      _id: area.country._id
    }).exec(function (err, country) {
      if (err || !country) {
        cb(err, country);
      } else {
        var auxArea = null;
        for (var i = 0; i < country.cities.length; i++) {
          var areas = [];
          for (var j = 0; j < country.cities[i].areas.length; j++) {
            if (country.cities[i].areas[j]._doc._id.toString() == area._id) {
              auxArea = country.cities[i].areas[j];
            } else {
              areas.push(country.cities[i].areas[j]);
            }
          }
          country.cities[i].areas = areas;
        }

        async.parallel([
          function (cbp) {
            async.map(auxArea.name, function (name, callback) {
              isoFieldView.remove(name, function (err, success) {
                callback(err, success);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(auxArea.slug, function (slug, callback) {
              isoFieldView.remove(slug, function (err, success) {
                callback(err, success);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          }
        ], function (err, results) {
          if (err || !results) {
            cb(err, results);
          } else {
            db.Localizations.update({
              _id: area.country._id
            }, {
              $set: {
                cities: country.cities
              }
            }).exec(function (err, success) {
              if (err || !success) {
                cb(err, success);
              } else {
                prepareLanguages(area.name, function (name) {
                  area.name = name;
                  area.ports = auxArea.ports;
                  LocalizationsFunctions.createArea(area.country._id, area.city._id, area, function (err, success) {
                    cb(err, success);
                  });
                });
              }
            });
          }
        });


      }
    });
  },
  removeArea: function (area, cb) {
    db.Localizations.findOne({
      _id: area.country._id
    })
            .populate("name cities.name cities.areas.name cities.areas.ports.name").exec(function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {

                var auxAreas = [],
                  removeNameField = [];
                for (var i = 0; i < country.cities.length; i++) {
                  if (country.cities[i]._doc._id.toString() == area.city._id) {
                    for (var j = 0; j < country.cities[i].areas.length; j++) {
                      if (country.cities[i].areas[j]._doc._id.toString() != area._id) {
                        auxAreas.push(country.cities[i].areas[j]);
                      } else {
                        removeNameField.push(country.cities[i].areas[j]._doc);
                        for (var k = 0; k < country.cities[i].areas[j].ports.length; k++) {
                          removeNameField.push(country.cities[i].areas[j].ports[k]._doc);
                        }
                      }
                    }
                    country.cities[i].areas = auxAreas;
                  }
                }
                var auxCities = country.cities;

                async.map(removeNameField, function (item, callback) {
                  async.parallel([
                    function (cbp) {
                      async.map(item.name, function (name, callback0) {
                        isoFieldView.remove(name._doc._id, function (err, iso) {
                          callback0(err, iso);
                        });
                      }, function (err, result) {
                        cbp(err, result);
                      });
                    },
                    function (cbp) {
                      async.map(item.slug, function (slug, callback0) {
                        isoFieldView.remove(slug, function (err, iso) {
                          callback0(err, iso);
                        });
                      }, function (err, result) {
                        cbp(err, result);
                      });
                    }
                  ], function (err, results) {
                    callback(err, results);
                  });
                }, function (err, result) {
                  if (err || !result) {
                    cb(err, result);
                  } else {
                    db.Localizations.update({
                      _id: area.country._id
                    }, {
                      $set: {
                        cities: auxCities
                      }
                    }, function (err, success) {
                      cb(err, success);
                    });
                  }
                });
              }
            });
  },

    /*
     *  PORTS
     */
  listPorts: function (limit, skip, filter, cb) {
    var countryId = filter.country_id;
    var cityId = filter.city_id;
    var areaId = filter.area_id;
    var query;
    if (areaId) {
      query = {
        "cities.areas._id": areaId,
        remove: false
      };
    }
    if (cityId) {
      query = {
        "cities._id": cityId,
        remove: false
      };
    } else if (countryId) {
      query = {
        _id: countryId,
        remove: false
      };
    } else {
      query = {
        remove: false
      };
    }


    db.Localizations.find(query).populate("name cities.name cities.areas.name cities.areas.ports.name")
            .exec(function (err, data) {
              if (err || !data) {
                cb(err, data);
              } else {
                var ports = [];
                _.forEach(data, function (country) {
                  if (country._doc.cities.length) {
                    _.forEach(country._doc.cities, function (city) {
                      if (city._doc.areas.length) {
                        _.forEach(city._doc.areas, function (area) {
                          if (area._doc.ports.length) {

                            for (var i = 0; i < area._doc.ports.length; i++) {
                              var aux;
                              if (areaId) {
                                if (area._doc._id.toString() == areaId) {
                                  aux = {
                                    _id: area._doc.ports[i]._doc._id,
                                    slug: area._doc.ports[i]._doc.slug,
                                    country: {
                                      _id: country._doc._id,
                                      name: country._doc.name
                                    },
                                    city: {
                                      _id: city._doc._id,
                                      name: city._doc.name
                                    },
                                    area: {
                                      _id: area._doc._id,
                                      name: area._doc.name
                                    },
                                    name: area._doc.ports[i]._doc.name,
                                    latitude: area._doc.ports[i].latitude,
                                    longitude: area._doc.ports[i].longitude
                                  };
                                  ports.push(aux);
                                }
                              } else if (cityId) {
                                if (city._doc._id.toString() == cityId) {
                                  aux = {
                                    _id: area._doc.ports[i]._doc._id,
                                    slug: area._doc.ports[i]._doc.slug,
                                    country: {
                                      _id: country._doc._id,
                                      name: country._doc.name
                                    },
                                    city: {
                                      _id: city._doc._id,
                                      name: city._doc.name
                                    },
                                    area: {
                                      _id: area._doc._id,
                                      name: area._doc.name
                                    },
                                    name: area._doc.ports[i]._doc.name,
                                    latitude: area._doc.ports[i].latitude,
                                    longitude: area._doc.ports[i].longitude
                                  };
                                  ports.push(aux);
                                }
                              } else {
                                aux = {
                                  _id: area._doc.ports[i]._doc._id,
                                  slug: area._doc.ports[i]._doc.slug,
                                  country: {
                                    _id: country._doc._id,
                                    name: country._doc.name
                                  },
                                  city: {
                                    _id: city._doc._id,
                                    name: city._doc.name
                                  },
                                  area: {
                                    _id: area._doc._id,
                                    name: area._doc.name
                                  },
                                  name: area._doc.ports[i]._doc.name,
                                  latitude: area._doc.ports[i].latitude,
                                  longitude: area._doc.ports[i].longitude
                                };
                                ports.push(aux);
                              }

                            }

                          }
                        });
                      }
                    });
                  }
                });


                for (var i = 0; i < ports.length; i++) {
                  for (var j = i + 1; j < ports.length; j++) {
                    if (ports[i].slug > ports[j].slug) {
                      var aux = ports[i];
                      ports[i] = ports[j];
                      ports[j] = aux;
                    }
                  }
                }
                if (ports.length > limit) {
                  var array = [];
                  var length = skip + limit;
                  if ((ports.length) < length) {
                    length = ports.length;
                  }
                  for (var i = skip; i < length; i++) {
                    array.push(ports[i]);
                  }
                  cb(null, array, ports.length);
                } else {
                  cb(null, ports, ports.length);
                }

              }
            });
  },
  createPort: function (country_id, city_id, area_id, port, cb) {
    isoFieldView.validateCreateIsoField(port.name, function (goOne) {
      if (goOne) {
        async.map(port.name, function (name, callback) {
          async.parallel([
            function (cbp) {
              isoFieldView.create(name._id, name.value, function (err, iso) {
                cbp(err, iso);
              });
            },
            function (cbp) {
              isoFieldView.create(name._id, util.getSlug(name.value), function (err, iso) {
                cbp(err, iso);
              });
            },
          ], function (err, result) {
            callback(err, result);
          });
        }, function (err, results) {
          if (err || !results) {
            cb(err, results);
          } else {
            var array = [];
            var arrays = [];
            var aux;
            for (var i = 0; i < results.length; i++) {
              array.push(results[i][0]._doc._id);
              arrays.push(results[i][1]._doc._id);
            }

            if (port._id) {
              aux = {
                _id: port._id,
                slug: arrays,
                name: array,
                latitude: port.latitude,
                longitude: port.longitude
              };
            } else {
              aux = {
                slug: arrays,
                name: array,
                latitude: port.latitude,
                longitude: port.longitude
              };
            }
            db.Localizations.findOne({
              _id: country_id
            }, "cities", function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {

                _.forEach(country.cities, function (city) {
                  if (city._doc._id.toString() == city_id) {
                    _.forEach(city.areas, function (area) {
                      if (area._doc._id.toString() == area_id) {
                        area._doc.ports.push(aux);
                      }
                    });
                  }
                });

                var auxCities = country.cities;

                db.Localizations.update({
                  _id: country_id
                }, {
                  $set: {
                    cities: auxCities
                  }
                }).exec(function (err, success) {
                  cb(err, success);
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
    });
  },
  updatePort: function (port, cb) {
    db.Localizations.findOne({
      _id: port.country._id
    }).exec(function (err, country) {
      if (err || !country) {
        cb(err, country);
      } else {
        LocalizationsFunctions.removePort(port, function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            prepareLanguages(port.name, function (name) {
              port.name = name;
              LocalizationsFunctions.createPort(port.country._id, port.city._id, port.area._id, port, function (err, success) {
                cb(err, success);
              });
            });
          }
        });
      }
    });
  },
  removePort: function (port, cb) {
    db.Localizations.findOne({
      _id: port.country._id
    })
            .populate("name cities.name cities.areas.name cities.areas.ports.name").exec(function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {

                var auxPort = null;
                for (var i = 0; i < country.cities.length; i++) {
                  if (country.cities[i]._doc._id.toString() == port.city._id) {
                    for (var j = 0; j < country.cities[i].areas.length; j++) {
                      var auxPorts = [];

                      for (var k = 0; k < country.cities[i].areas[j].ports.length; k++) {
                        if (country.cities[i].areas[j].ports[k]._doc._id.toString() != port._id) {
                          auxPorts.push(country.cities[i].areas[j].ports[k]);
                        } else {
                          auxPort = country.cities[i].areas[j].ports[k]._doc;
                        }
                      }
                      country.cities[i].areas[j].ports = auxPorts;
                    }
                  }
                }

                var auxCities = country.cities;

                async.parallel([
                  function (cbp) {
                    async.map(auxPort.name, function (name, callback) {
                      isoFieldView.remove(name._doc._id, function (err, iso) {
                        callback(err, iso);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  },
                  function (cbp) {
                    async.map(auxPort.slug, function (slug, callback) {
                      isoFieldView.remove(slug, function (err, iso) {
                        callback(err, iso);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });

                  }
                ], function (err, results) {
                  if (err || !results) {
                    cb(err, results);
                  } else {
                    db.Localizations.update({
                      _id: port.country._id
                    }, {
                      $set: {
                        cities: auxCities
                      }
                    }, function (err, success) {
                      cb(err, success);
                    });
                  }
                });


              }
            });
  },
  getPort: function (id, cb) {
    db.Localizations.findOne({
      "cities.areas.ports._id": id
    })
            .populate("cities.areas.ports.name")
            .exec(function (err, country) {
              if (err || !country) {
                cb(err, country);
              } else {
                var port = null;

                var flag = false;
                for (var i = 0; i < country.cities.length; i++) {
                  for (var j = 0; j < country.cities[i].areas.length; j++) {
                    for (var k = 0; k < country.cities[i].areas[j].ports.length; k++) {
                      if (country.cities[i].areas[j].ports[k]._doc._id.toString() == id.toString()) {
                        port = country.cities[i].areas[j].ports[k];
                        flag = true;
                        break;
                      }
                    }
                    if (flag) break;
                  }
                  if (flag) break;
                }

                cb(null, port);
              }
            });
  },

};

module.exports = LocalizationsFunctions;