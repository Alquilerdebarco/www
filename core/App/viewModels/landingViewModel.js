/**
 * Created by ernestomr87@gmail.com on22/07/2015.
 */

var async = require("async");
var _ = require("lodash");
var isoFieldView = require("./IsoFieldViewModel");
var languageView = require("./languageViewModel");
var configurationViewModel = require("./configurationViewModel");
var utils = require("../../middlewares/utils");

function prepareLanguagesTabs(cb) {
  languageView.listFront(function (err, langs) {
    if (err || !langs) {
      cb(err, langs);
    } else {
      var array = [];
      for (var i = 0; i < langs.length; i++) {
        var aux = {
          _id: langs[i]._doc._id,
          iso: langs[i]._doc.iso,
          status: langs[i]._doc.status,
          name: langs[i]._doc.name,
          value: ""
        };
        array.push(aux);
      }
      cb(null, array);
    }
  });

}

function formatLandings(list, cb) {
  async.map(list, function (object, callback) {
    async.waterfall([
      function (cbw) {
        if (object._doc.country != "0") {
          db.Localizations.findOne({
            _id: object._doc.country
          })
            .populate("name cities.name cities.areas.name cities.areas.ports.name")
            .exec(function (err, loc) {
              if (err || !loc) {
                callback(err, loc);
              } else {
                var auxCountry = {
                  _id: loc._doc._id,
                  name: loc._doc.name
                };
                object._doc.country = auxCountry;

                if (object._doc.city != "0") {
                  for (var i = 0; i < loc._doc.cities.length; i++) {
                    if (object._doc.city == loc._doc.cities[i]._doc._id.toString()) {
                      var auxCity = {
                        _id: loc._doc.cities[i]._doc._id,
                        name: loc._doc.cities[i]._doc.name
                      };
                      object._doc.city = auxCity;
                      if (object._doc.area != "0") {
                        for (var j = 0; j < loc._doc.cities[i]._doc.areas.length; j++) {
                          if (loc._doc.cities[i]._doc.areas[j]._doc._id.toString() == object._doc.area) {
                            var auxArea = {
                              _id: loc._doc.cities[i]._doc.areas[j]._doc._id,
                              name: loc._doc.cities[i]._doc.areas[j]._doc.name
                            };
                            object._doc.area = auxArea;
                            if (object._doc.port != "0") {
                              for (var k = 0; k < loc._doc.cities[i]._doc.areas[j]._doc.ports.length; k++) {
                                if (loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id.toString() == object._doc.port) {
                                  var auxPort = {
                                    _id: loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id,
                                    name: loc._doc.cities[i]._doc.areas[j]._doc.ports[k].name
                                  };
                                  object._doc.port = auxPort;
                                }
                              }
                            } else {
                              break;
                            }
                          }
                        }
                      } else {
                        break;
                      }

                    }
                  }
                }

                cbw(err, object);
              }
            });
        } else {
          cbw(null, object);
        }

      },
      function (object, cbw) {
        if (object._doc.shipType) {
          db.shipTypes.findOne({
            _id: object._doc.shipType
          }).populate("name").exec(function (err, type) {
            if (err || !type) {
              cbw(err, type);
            } else {
              object._doc.shipType = type;
              cbw(null, object);
            }
          });
        } else {
          cbw(null, object);
        }
      }
    ], function (err, result) {
      callback(err, result);
    });
  }, function (err, results) {
    cb(err, results);
  });
}

function formatLandingsFront(list, lang, cb) {
  async.map(list, function (object, callback) {
    if (object._doc.country != "0") {
      db.Localizations.findOne({
        _id: object._doc.country
      })
        .populate({
          path: "slug",
          select: "value",
          match: {
            language: lang._doc._id
          }
        })
        .populate({
          path: "cities.slug",
          select: "value",
          match: {
            language: lang._doc._id
          }
        })
        .populate({
          path: "cities.areas.slug",
          select: "value",
          match: {
            language: lang._doc._id
          }
        })
        .populate({
          path: "cities.areas.ports.slug",
          select: "value",
          match: {
            language: lang._doc._id
          }
        })
        .exec(function (err, loc) {
          if (err || !loc) {
            callback(err, loc);
          } else {
            var auxCountry = {
              _id: loc._doc._id,
              slug: loc._doc.slug
            };
            object._doc.country = auxCountry;

            if (object._doc.city != "0") {
              for (var i = 0; i < loc._doc.cities.length; i++) {
                if (object._doc.city == loc._doc.cities[i]._doc._id.toString()) {
                  var auxCity = {
                    _id: loc._doc.cities[i]._doc._id,
                    slug: loc._doc.cities[i]._doc.slug
                  };
                  object._doc.city = auxCity;
                  if (object._doc.area != "0") {
                    for (var j = 0; j < loc._doc.cities[i]._doc.areas.length; j++) {
                      if (loc._doc.cities[i]._doc.areas[j]._doc._id.toString() == object._doc.area) {
                        var auxArea = {
                          _id: loc._doc.cities[i]._doc.areas[j]._doc._id,
                          slug: loc._doc.cities[i]._doc.areas[j]._doc.slug
                        };
                        object._doc.area = auxArea;
                        if (object._doc.port != "0") {
                          for (var k = 0; k < loc._doc.cities[i]._doc.areas[j]._doc.ports.length; k++) {
                            if (loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id.toString() == object._doc.port) {
                              var auxPort = {
                                _id: loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id,
                                slug: loc._doc.cities[i]._doc.areas[j]._doc.ports[k].slug
                              };
                              object._doc.port = auxPort;
                            }
                          }
                        } else {
                          break;
                        }
                      }
                    }
                  } else {
                    if (object._doc.port != "0") {
                      for (var j = 0; j < loc._doc.cities[i]._doc.areas.length; j++) {
                        if (object._doc.port != "0") {
                          for (var k = 0; k < loc._doc.cities[i]._doc.areas[j]._doc.ports.length; k++) {
                            if (loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id.toString() == object._doc.port) {
                              var auxPort = {
                                _id: loc._doc.cities[i]._doc.areas[j]._doc.ports[k]._id,
                                slug: loc._doc.cities[i]._doc.areas[j]._doc.ports[k].slug
                              };
                              object._doc.port = auxPort;
                              break;
                            }
                          }
                        } else {
                          break;
                        }
                      }
                    } else {
                      break;
                    }
                  }

                }
              }
            }
            if (object._doc.shipType) {
              db.shipTypes.find({
                remove: false,
                _id: object._doc.shipType.toString()
              })
                .populate({
                  path: "slug",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .exec(function (err, data) {
                  if (err || !data) {
                    callback(err, false);
                  } else {
                    if (data.length) {
                      object._doc.shipType = {
                        slug: data[0]._doc.slug[0]._doc.value,
                        _id: data[0]._doc._id
                      };
                      if (object._doc.experience) {
                        configurationViewModel.getXpList(object._doc.experience, lang, function (err, xp) {
                          if (err || !xp) {
                            cb(err, false);
                          } else {
                            object._doc.experience = {
                              _id: xp.id,
                              slug: xp.slug
                            };
                            callback(err, object);
                          }
                        });
                      } else {
                        callback(err, object);
                      }
                    } else {
                      callback(err, object);
                    }
                  }
                });
            } else {
              if (object._doc.experience) {
                configurationViewModel.getXpList(object._doc.experience.toString(), lang, function (err, xp) {
                  if (err || !xp) {
                    callback(err, false);
                  } else {
                    object._doc.experience = {
                      _id: xp.id,
                      slug: xp.slug
                    };
                    callback(err, object);
                  }
                });
              } else {
                callback(err, object);
              }
            }

          }
        });
    }
    else if (object._doc.shipType) {
      db.shipTypes.find({
        remove: false,
        _id: object._doc.shipType.toString()
      })
        .populate({
          path: "slug",
          select: "value",
          match: {
            language: lang._doc._id
          }

        })
        .exec(function (err, data) {
          if (err || !data) {
            callback(err, false);
          } else {
            if (data.length) {
              object._doc.shipType = {
                slug: data[0]._doc.slug[0]._doc.value,
                _id: data[0]._doc._id
              };
              if (object._doc.experience) {
                configurationViewModel.getXpList(object._doc.experience, lang, function (err, xp) {
                  if (err || !xp) {
                    cb(err, false);
                  } else {
                    object._doc.experience = {
                      _id: xp.id,
                      slug: xp.slug
                    };
                    callback(err, object);
                  }
                });
              } else {
                callback(err, object);
              }
            } else {
              callback(err, object);
            }

          }
        });
    }
    else {
      if (object._doc.experience) {
        configurationViewModel.getXpList(object._doc.experience.toString(), lang, function (err, xp) {
          if (err || !xp) {
            callback(err, false);
          } else {
            object._doc.experience = {
              _id: xp.id,
              slug: xp.slug
            };
            callback(err, object);
          }
        });
      } else {
        callback(false, object);
      }
    }
  }, function (err, results) {
    cb(err, results);
  });
}

function ReplaceAll(str, find, replace) {
  var repeat = true;
  while (repeat) {
    var newStr = str.replace(find, replace);
    if (str == newStr) {
      repeat = false;
    } else {
      str = newStr;
    }
  }
  return str;
}
var landingFunctions = {
  getbyParams: function (culture, landing, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        if (!_.isEmpty(landing)) {
          if (landing.shipType != "0" && landing.experience != "0") {
            db.Landings.findOne({
              "country": landing.country,
              "city": landing.city,
              "area": landing.area,
              "port": landing.port,
              "shipType": landing.shipType,
              "experience": landing.experience
            })
              .populate({
                path: "name",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
              .populate({
                path: "slug",
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
              .exec(function (err, result) {
                if (err || !result) {
                  cb(err, false);
                } else {
                  cb(false, result);
                }
              });
          } else {
            if (landing.experience != "0") {
              db.Landings.findOne({
                "country": landing.country,
                "city": landing.city,
                "area": landing.area,
                "port": landing.port,
                "experience": landing.experience,
                "shipType": null
              })
                .populate({
                  path: "text1",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .populate({
                  path: "slug",
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
                  path: "text2",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .exec(function (err, result) {
                  if (err || !result) {
                    cb(err, false);
                  } else {
                    cb(false, result);
                  }
                });
            } else if (landing.shipType != "0") {
              db.Landings.findOne({
                "country": landing.country,
                "city": landing.city,
                "area": landing.area,
                "port": landing.port,
                "shipType": landing.shipType,
                "experience": null
              })
                .populate({
                  path: "name",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .populate({
                  path: "slug",
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
                  path: "text2",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })

                .exec(function (err, result) {
                  if (err || !result) {
                    cb(err, false);
                  } else {
                    cb(false, result);
                  }
                });
            } else {
              db.Landings.findOne({
                "country": landing.country,
                "city": landing.city,
                "area": landing.area,
                "port": landing.port,
                "shipType": null,
                "experience": null
              })
                .populate({
                  path: "text1",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .populate({
                  path: "slug",
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
                  path: "text2",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  }
                })
                .exec(function (err, result) {
                  if (err || !result) {
                    cb(err, false);
                  } else {
                    cb(false, result);
                  }
                });

            }

          }
        } else if (landing.shipType != "0") {
          db.Landings.findOne({
            "shipType": landing.shipType
          })
            .populate({
              path: "text1",
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
              path: "text2",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            .exec(function (err, result) {
              if (err || !result) {
                cb(err, false);
              } else {
                cb(false, result);
              }
            });
        } else {
          cb(true, false);
        }
      } else {
        cb(true, false);
      }
    });

  },
  create: function (filter, cb) {
    async.parallel([
      function (cbp) {
        isoFieldView.validateCreateIsoField(filter.name, function (data) {
          if (data) {
            async.map(filter.name, function (n, callback) {
              isoFieldView.create(n._id, n.value, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          } else {
            cbp(true, null);
          }
        });
      },
      function (cbp) {
        isoFieldView.validateCreateIsoField(filter.title, function (data) {
          if (data) {
            async.map(filter.title, function (n, callback) {
              isoFieldView.create(n._id, n.value, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          } else {
            cbp(true, null);
          }
        });

      },
      function (cbp) {
        isoFieldView.validateCreateIsoField(filter.description, function (data) {
          if (data) {
            async.map(filter.description, function (n, callback) {
              isoFieldView.create(n._id, n.value, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          } else {
            cbp(true, null);
          }
        });
      },
      function (cbp) {
        if (filter.text2) {
          isoFieldView.validateCreateIsoField(filter.text2, function (data) {
            if (data) {
              async.map(filter.text2, function (n, callback) {
                isoFieldView.create(n._id, n.value, function (err, iso) {
                  callback(err, iso);
                });
              }, function (err, result) {
                cbp(err, result);
              });
            } else {
              cbp(true, null);
            }
          });
        } else {
          cbp(false, null);
        }

      },
      function (cbp) {
        if (filter.text2) {
          isoFieldView.validateCreateIsoField(filter.text1, function (data) {
            if (data) {
              async.map(filter.text1, function (n, callback) {
                isoFieldView.create(n._id, n.value, function (err, iso) {
                  callback(err, iso);
                });
              }, function (err, result) {
                cbp(err, result);
              });
            } else {
              cbp(true, null);
            }
          });
        } else {
          cbp(false, null);
        }
      },
      function (cbp) {
        isoFieldView.validateCreateIsoField(filter.name, function (data) {
          if (data) {
            async.map(filter.name, function (n, callback) {
              isoFieldView.create(n._id, utils.getSlug(n.value), function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          } else {
            cbp(true, null);
          }
        });
      }
    ], function (err, result) {
      if (err || !result) {
        var error = {
          message: "Formulario Incorrecto."
        };
        cb(error, null);
      } else {
        var arrayName = [];
        var arrayText1 = [];
        var arrayText2 = [];
        for (var i = 0; i < result[0].length; i++) {
          arrayName.push(result[0][i]._doc._id);
        }
        var arrayTitle = [];
        for (var i = 0; i < result[1].length; i++) {
          arrayTitle.push(result[1][i]._doc._id);
        }
        var arrayDescription = [];
        for (var i = 0; i < result[2].length; i++) {
          arrayDescription.push(result[2][i]._doc._id);
        }

        if (result[3]) {
          for (var i = 0; i < result[3].length; i++) {
            arrayText1.push(result[3][i]._doc._id);
          }
        }

        if (result[4]) {
          for (var i = 0; i < result[4].length; i++) {
            arrayText2.push(result[4][i]._doc._id);
          }
        }
        var arraySlug = [];
        for (var i = 0; i < result[5].length; i++) {
          arraySlug.push(result[5][i]._doc._id);
        }

        var land = new db.Landings({
          name: arrayName,
          slug: arraySlug,
          title: arrayTitle,
          description: arrayDescription,
          country: filter.country || 0,
          city: filter.city || 0,
          area: filter.area || 0,
          port: filter.port || 0,
        });

        if (arrayText1 && arrayText2) {
          land.text1 = arrayText2;
          land.text2 = arrayText1;
        }
        if (filter.experience != "0" && filter.experience !== undefined) {
          land.experience = filter.experience;
        }
        if (filter.shipType) {
          land.shipType = filter.shipType;
        }
        if (filter.shipType != "0") {
          land.shipType = filter.shipType;
        }

        if (filter._id) {
          land._id = filter._id;
          land.publish = filter.publish;
          land.last = filter.last;
          land.pos = filter.pos;
          land.nofollow = filter.nofollow;
          land.noindex = filter.noindex;
          land.cont = filter.cont;

        }

        land.save(function (err, landing) {
          cb(err, landing);
        });
      }
    });
  },
  update: function (filter, cb) {
    try {
      this.remove(filter._id, function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          landingFunctions.create(filter, function (err, p) {
            cb(err, p);
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  listFront: function (culture, limit, skip, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        async.parallel([
          function (callback) {
            db.Landings.count({
              publish: true
            }).exec(function (err, count) {
              callback(err, count);
            });

          },
          function (callback) {
            db.Landings.find({
              publish: true,
              shipowner: user._id
            })
              .populate({
                path: "name",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
              .populate({
                path: "slug",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
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
                path: "text1",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })
              .populate({
                path: "text2",
                select: "value",
                match: {
                  language: lang._doc._id
                }
              })

              .limit(limit).skip(skip).exec(function (err, data) {
              if (err || !data) {
                callback(err, data);
              } else {
                formatLandingsFront(data, lang, function (err, list) {
                  callback(err, list);
                });
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
      } else {
        cb(err, false);
      }
    });
  },
  getFront: function (culture, id, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        db.Landings.find({
          _id: id
        })
          .populate({
            path: "name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "slug",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
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
          //.populate({
          //    path: 'text1',
          //    select: 'value',
          //    match: {language: lang._doc._id}
          //})
          //.populate({
          //    path: 'text2',
          //    select: 'value',
          //    match: {language: lang._doc._id}
          //})

          .exec(function (err, data) {
            if (err || !data) {
              cb(err, data);
            } else {
              formatLandingsFront(data, lang, function (err, list) {
                cb(err, list);
              });
            }
          });

      } else {
        cb(err, false);
      }
    });
  },
  getAll: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        db.Landings.find()
          .populate({
            path: "name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "slug",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
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
            path: 'text1',
            select: 'value',
            match: {language: lang._doc._id}
          })
          .populate({
            path: 'text2',
            select: 'value',
            match: {language: lang._doc._id}
          })

          .exec(function (err, data) {
            if (err || !data) {
              cb(err, data);
            } else {
              formatLandingsFront(data, lang, function (err, list) {
                cb(err, list);
              });
            }
          });

      } else {
        cb(err, false);
      }
    });
  },
  list: function (limit, skip, menu, cb) {
    var query = {
      _id: {
        $ne: "573f5a05ca760b50086b743b"
      }
    }
    if (menu && eval(menu)) {
      query.pos = {
        $ne: null
      }
    }
    async.parallel([
      function (callback) {
        db.Landings.count(query).exec(function (err, count) {
          callback(err, count);
        });
      },
      function (callback) {
        db.Landings.find(query)
          .populate("name slug title description text1 text2")
          .populate("shipType")
          .sort({
            pos: "asc"
          })
          .exec(function (err, data) {
            if (err || !data) {
              callback(err, data);
            } else {
              formatLandings(data, function (err, list) {
                callback(err, list);
              });
            }
          });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        var landings = JSON.parse(JSON.stringify(results[1]));
        if (menu && eval(menu)) {
          for (var i = 0; i < landings.length - 1; i++) {
            for (var j = i + 1; j < landings.length; j++) {
              if (landings[i].pos > landings[j].pos) {
                var aux = landings[j];
                landings[j] = landings[i];
                landings[i] = aux;
              }
            }
          }
        }
        else {
          for (var i = 0; i < landings.length - 1; i++) {
            for (var j = i + 1; j < landings.length; j++) {
              var a = ReplaceAll(landings[i].name[0].value.toLowerCase(), " ", "");
              var b = ReplaceAll(landings[j].name[0].value.toLowerCase(), " ", "");
              if (a > b) {
                var aux = landings[j];
                landings[j] = landings[i];
                landings[i] = aux;
              }
            }
          }
        }


        var array = [];
        var cont = 0;
        for (var i = skip; i < landings.length; i++) {
          array.push(landings[i]);
          cont++;
          if (cont >= limit)break;
        }
        cb(null, array, results[0]);
      }
    });
  },
  listMenu: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        db.Landings.find({
          pos: {
            $ne: null
          }
        })
          .populate({
            path: "name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "slug",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
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
            path: "text1",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "text2",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .sort({
            pos: "asc"
          }).exec(function (err, landings) {
          landings = JSON.parse(JSON.stringify(landings));
          for (var i = 0; i < landings.length - 1; i++) {
            for (var j = i + 1; j < landings.length; j++) {
              if (landings[i].pos === null && landings[i].pos < 0) {
                if (landings[i].name[0].value.toLocaleString() > landings[j].name[0].value.toLocaleString()) {
                  var aux = landings[j];
                  landings[j] = landings[i];
                  landings[i] = aux;
                }
              }
            }
          }
          cb(err, landings);
        });
      } else {
        cb(err, false);
      }
    });
  },
  remove: function (id, cb) {
    db.Landings.findOne({
      _id: id
    }).exec(function (err, lan) {
      if (err || !lan) {
        cb(err, lan);
      } else {
        async.parallel([
          function (cbp) {
            async.map(lan.name, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(lan.slug, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(lan.title, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(lan.description, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(lan._doc.text1, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          },
          function (cbp) {
            async.map(lan._doc.text2, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          }
        ], function (err, result) {
          if (err || !result) {
            cb(err, result);
          } else {
            db.Landings.remove({
              _id: id
            }).exec(function (err, success) {
              cb(err, success);
            });
          }
        });
      }
    });
  },
  publish: function (id, cb) {
    db.Landings.findOne({
      _id: id
    }).exec(function (err, land) {
      if (err || !land) {
        cb(err, land);
      } else {
        db.Landings.update({
          _id: id
        }, {
          $set: {
            publish: !land._doc.publish
          }
        }).exec(function (err, success) {
          cb(err, success);
        });
      }
    });
  },
  noindex: function (id, cb) {
    db.Landings.findOne({
      _id: id
    }).exec(function (err, land) {
      if (err || !land) {
        cb(err, land);
      } else {
        db.Landings.update({
          _id: id
        }, {
          $set: {
            noindex: !land._doc.noindex
          }
        }).exec(function (err, success) {
          cb(err, success);
        });
      }
    });
  },
  nofollow: function (id, cb) {
    db.Landings.findOne({
      _id: id
    }).exec(function (err, land) {
      if (err || !land) {
        cb(err, land);
      } else {
        db.Landings.update({
          _id: id
        }, {
          $set: {
            nofollow: !land._doc.nofollow
          }
        }).exec(function (err, success) {
          cb(err, success);
        });
      }
    });
  },
  menu: function (id, action, cb) {
    db.Landings.findOne({
      _id: id
    }).exec(function (err, land) {
      if (err || !land) {
        cb(err, land);
      } else {
        if (action == "ban") {
          db.Landings.update({
            _id: id
          }, {
            $set: {
              pos: null,
              last: false
            }
          }).exec(function (err, success) {
            if (err || !success) {
              cb(err, success);
            } else {
              db.Landings.find({
                pos: {
                  $ne: null
                }
              }).sort({
                pos: "asc"
              }).exec(function (err, landings) {
                var cont = 0;
                async.mapSeries(landings, function (landing, cbm) {
                  var last = false;
                  if (cont == (landings.length - 1)) {
                    last = true;
                  }
                  db.Landings.update({
                    _id: landing._doc._id.toString()
                  }, {
                    $set: {
                      pos: cont,
                      last: last
                    }
                  }).exec(function (err, success) {
                    cont++;
                    cbm(err, success);
                  });
                }, function (err, result) {
                  cb(err, result);
                });

              });
            }
          });
        } else if (action == "up") {
          async.waterfall([
            function (cbp) {
              var last = land.last;
              db.Landings.update({
                _id: id
              }, {
                $set: {
                  pos: (land.pos - 1),
                  last: false
                }
              }).exec(function (err) {
                cbp(err, last);
              });
            },
            function (last, cbp) {
              db.Landings.update({
                _id: {
                  $ne: id
                },
                pos: (land.pos - 1)
              }, {
                $set: {
                  pos: land.pos,
                  last: last
                }
              }).exec(function (err, success) {
                cbp(err, success);
              });
            }
          ], function (err, result) {
            cb(err, result);
          });
        } else if (action == "down") {
          async.waterfall([
            function (cbp) {
              db.Landings.findOne({
                _id: {
                  $ne: id
                },
                pos: (land.pos + 1)
              }).exec(function (err, obj) {
                if (err) {
                  cbp(err, null);
                } else {
                  var last = obj.last;
                  db.Landings.update({
                    _id: {
                      $ne: id
                    },
                    pos: (land.pos + 1),
                  }, {
                    $set: {
                      pos: land.pos,
                      last: false
                    }
                  }).exec(function (err, success) {
                    cbp(err, last);
                  });
                }

              });
            },
            function (last, cbp) {
              db.Landings.update({
                _id: id
              }, {
                $set: {
                  pos: (land.pos + 1),
                  last: last
                }
              }).exec(function (err, success) {
                cbp(err, success);
              });
            }
          ], function (err, result) {
            cb(err, result);
          });
        } else {
          db.Landings.find({
            pos: {
              $ne: null
            }
          }).sort({
            pos: "asc"
          }).exec(function (err, landings) {
            if (!landings.length) {
              db.Landings.update({
                _id: id
              }, {
                $set: {
                  pos: 0,
                  last: true
                }
              }).exec(function (err, success) {
                cb(err, success);
              });
            } else {
              var cont = 0;
              async.mapSeries(landings, function (landing, cbm) {
                db.Landings.update({
                  _id: landing._doc._id.toString()
                }, {
                  $set: {
                    pos: cont,
                    last: false
                  }
                }).exec(function (err, success) {
                  cont++;
                  cbm(err, success);
                });
              }, function (err, result) {
                if (err || !result) {
                  cb(err, null);
                } else {
                  db.Landings.update({
                    _id: id
                  }, {
                    $set: {
                      pos: cont,
                      last: true
                    }
                  }).exec(function (err, success) {
                    cb(err, success);
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  createLanding: function (filter, lang, cb) {
    landingFunctions.getbyParams(lang, filter, function (err, landing) {
      if (err) {
        cb(err, false);
      } else if (!landing) {
        prepareLanguagesTabs(function (err, array) {
          if (err || !array) {
            cb(err, false);
          } else {
            async.parallel([
              function (cbp) {
                if (filter.experience != "0") {
                  configurationViewModel.getExperience(filter.experience, function (err, xp) {
                    if (err || !xp) {
                      cbp(err, xp);
                    } else {
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < xp._doc.name.length; j++) {
                          if (array[i]._id == xp._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = xp._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);
                    }
                  });
                } else {
                  var stArray = {};
                  for (var i = 0; i < array.length; i++) {
                    stArray[array[i].iso] = "";
                  }
                  cbp(null, stArray);
                }
              },
              function (cbp) {
                if (filter.shipType != "0") {
                  db.shipTypes.findOne({
                    _id: filter.shipType
                  }).populate("name description slug").exec(function (err, st) {
                    if (err || !st) {
                      cbp(err, st);
                    } else {
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < st._doc.name.length; j++) {
                          if (array[i]._id == st._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = st._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);
                    }

                  });
                } else {
                  var stArray = {};
                  for (var i = 0; i < array.length; i++) {
                    stArray[array[i].iso] = "";
                  }
                  cbp(null, stArray);
                }
              },
              function (cbp) {
                if (filter.port !== 0) {
                  db.Localizations.findOne({
                    "cities.areas.ports._id": filter.port
                  })
                    .populate("cities.areas.ports.name")
                    .exec(function (err, loc) {
                      var flag = false;
                      var select = null;
                      for (var i = 0; i < loc.cities.length; i++) {
                        for (var j = 0; j < loc.cities[i]._doc.areas.length; j++) {
                          for (var k = 0; k < loc.cities[i]._doc.areas[j]._doc.ports.length; k++) {
                            if (loc.cities[i]._doc.areas[j]._doc.ports[k]._doc._id == filter.port) {
                              select = loc.cities[i]._doc.areas[j]._doc.ports[k];
                              flag = true;
                              break;
                            }
                          }
                          if (flag) break;
                        }
                        if (flag) break;
                      }
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < select._doc.name.length; j++) {
                          if (array[i]._id == select._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = select._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);

                    });
                } else if (filter.area !== 0) {
                  db.Localizations.findOne({
                    "cities.areas._id": filter.area
                  })
                    .populate("cities.areas.name")
                    .exec(function (err, loc) {
                      var flag = false;
                      var select = null;
                      for (var i = 0; i < loc.cities.length; i++) {
                        for (var j = 0; j < loc.cities[i]._doc.areas.length; j++) {
                          if (loc.cities[i]._doc.areas[j]._doc._id == filter.area) {
                            select = loc.cities[i]._doc.areas[j];
                            flag = true;
                            break;
                          }
                        }
                        if (flag) break;
                      }
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < select._doc.name.length; j++) {
                          if (array[i]._id == select._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = select._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);

                    });
                } else if (filter.city !== 0) {
                  db.Localizations.findOne({
                    "cities._id": filter.city
                  })
                    .populate("cities.name")
                    .exec(function (err, loc) {
                      var select = null;
                      for (var i = 0; i < loc.cities.length; i++) {
                        if (loc.cities[i]._doc._id == filter.city) {
                          select = loc.cities[i];
                          break;
                        }
                      }
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < select._doc.name.length; j++) {
                          if (array[i]._id == select._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = select._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);

                    });
                } else if (filter.country !== 0) {
                  db.Localizations.findOne({
                    "_id": filter.country
                  })
                    .populate("name")
                    .exec(function (err, loc) {
                      var object = {};
                      for (var i = 0; i < array.length; i++) {
                        for (var j = 0; j < loc._doc.name.length; j++) {
                          if (array[i]._id == loc._doc.name[j]._doc.language.toString()) {
                            object[array[i].iso] = loc._doc.name[j].value;
                            break;
                          }
                        }
                      }
                      cbp(null, object);

                    });
                } else {
                  var stArray = {};
                  for (var i = 0; i < array.length; i++) {
                    stArray[array[i].iso] = "";
                  }
                  cbp(null, stArray);
                }
              }
            ], function (err, results) {
              if (err || !results) {
                cb(err, results);
              } else {
                var name = JSON.parse(JSON.stringify(array));
                var title = JSON.parse(JSON.stringify(array));
                var description = JSON.parse(JSON.stringify(array));
                // var text1 = JSON.parse(JSON.stringify(array));
                // var text2 = JSON.parse(JSON.stringify(array));


                for (var i = 0; i < array.length; i++) {
                  name[i].value = results[0][array[i].iso] + " " + results[1][array[i].iso] + " " + results[2][array[i].iso];
                  title[i].value = results[0][array[i].iso] + " " + results[1][array[i].iso] + " " + results[2][array[i].iso];
                  description[i].value = results[0][array[i].iso] + " " + results[1][array[i].iso] + " " + results[2][array[i].iso];
                  //text1[i].value = results[0][array[i].iso] + ' ' + results[1][array[i].iso] + ' ' + results[2][array[i].iso];
                  //text2[i].value = results[0][array[i].iso] + ' ' + results[1][array[i].iso] + ' ' + results[2][array[i].iso];
                }
                var filter_new = {
                  name: name,
                  title: title,
                  description: description,
                  //text1: text1,
                  //text2: text2,
                  country: filter.country,
                  city: filter.city,
                  area: filter.area,
                  port: filter.port,
                  shipType: filter.shipType === 0 ? null : filter.shipType,
                  experience: filter.experience
                };

                landingFunctions.create(filter_new, function (err, success) {
                  if (err || !success) {
                    cb(err, false);
                  } else {
                    landingFunctions.getFront(lang, success._doc._id, function (err, resp) {
                      if (err || !resp) {
                        cb(err, false);
                      } else {
                        cb(false, resp[0]._doc.slug[0]._doc.value);
                      }
                    });
                  }

                });

              }
            });
          }
        });
      } else {
        cb(false, landing._doc.slug[0]._doc.value);
      }
    });

  },
  getEmptyLanding: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        db.Landings.findOne({
          "country": "0",
          "city": "0",
          "area": "0",
          "port": "0",
          "shipType": null,
          "experience": null
        })
          .populate({
            path: "name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "slug",
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
          .exec(function (err, result) {
            if (err) {
              cb(err, false);
            } else {
              cb(false, result);
            }
          });
      }
    });
  }
};

module.exports = landingFunctions;