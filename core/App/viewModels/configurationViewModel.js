/**
 * Created by ernestomr87@gmail.com on 1/25/2016.
 */


/*Libs*/
var async = require("async");
var validator = require("validator");
var fs = require("fs-extra");
var mediaViewModel = require("./mediaViewModel");
var isoFieldView = require("./IsoFieldViewModel");
var languageView = require("./languageViewModel");
/*Others*/
var utils = require("./../../middlewares/utils");
var validateMailSettings = function (mailSettings) {
  if (!validator.isLength(mailSettings.mailServer, 1)) {
    return false;
  }
  if (!validator.isInt(mailSettings.mailPort) || (mailSettings.mailPort < 0)) {
    return false;
  }
  if (!validator.isLength(mailSettings.user, 1)) {
    return false;
  }
  if (!validator.isEmail(mailSettings.email)) {
    return false;
  }
  if (!validator.isLength(mailSettings.name, 1)) {
    return false;
  }
  return true;
};

function prepareLanguages(text, cb) {
  isoFieldView.reformatIsoField(text, function (text) {
    cb(text);
  });
}

function validateAddDuration(duration) {

  if (parseInt(duration.unity) == 0 || parseInt(duration.unity) == 1 || parseInt(duration.unity) == 7) {
    if (parseInt(duration.unity) == 0) {
      if (parseInt(duration.quantity) >= 2 && parseInt(duration.quantity) <= 12) {
        return true;
      } else {
        return false;
      }
    } else if (parseInt(duration.unity) == 1) {
      if (parseInt(duration.quantity) >= 1 && parseInt(duration.quantity) <= 13 && parseInt(duration.quantity) != 7) {
        return true;
      } else {
        return false;
      }
    } else {
      if (parseInt(duration.quantity) >= 1 && parseInt(duration.quantity) <= 52) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

function validateAddExperience(experience) {
  for (var i = 0; i < experience.name.length; i++) {
    if (!experience.name[i].value.length) {
      return false;
    }
  }

  // for (var i = 0; i < experience.description.length; i++) {
  //   if (!experience.description[i].value.length) {
  //     return false;
  //   }
  // }

  return true;
}

function existDuration(duration, cb) {
  db.Configurations.findOne().exec(function (err, conf) {
    if (err || !conf) {
      cb(err, conf);
    } else {
      var flag = false;
      for (var j = 0; j < conf.shipSettings.durations.length; j++) {
        if (conf.shipSettings.durations[j].unity == duration.unity &&
          conf.shipSettings.durations[j].quantity == duration.quantity) {
          flag = true;
          break;
        }
      }
      if (flag) {
        cb(err, true);
      } else {
        cb(err, false);
      }
    }
  });
}

function existExperience(experience, cb) {

  db.Configurations.findOne().populate("shipSettings.experiences.name").exec(function (err, conf) {
    if (err || !conf) {
      cb(err, conf);
    } else {
      var flag = false;
      for (var j = 0; j < conf.shipSettings.experiences.length; j++) {
        for (var i = 0; i < conf.shipSettings.experiences[j].name.length; i++) {
          if (conf.shipSettings.experiences[j].name[i].value == experience.name[i].value) {
            if (conf.shipSettings.experiences[j]._id.toString() != experience._id) {
              flag = true;
              break;
            }
          }
        }
      }
      if (flag) {
        cb(err, true);
      } else {
        cb(err, false);
      }
    }
  });
}


var configurationFunctions = {
  get: function (cb) {
    db.Configurations.count().exec(function (err, count) {
      if (err || !count) {
        var conf = db.Configurations({
          general: {
            siteName: "Alquiler de Barco",
            siteOffline: false,
            offlineMessage: "Este sitio está cerrado por tareas de mantenimiento.<br />Por favor, inténtelo nuevamente más tarde.",
            domain: "yourdomain.com",
            timeZone: "+01:00"
          },
          metaData: {
            siteMetaDescription: [],
            siteMetaKeywords: [],
          },
          mailSettings: {
            mailServer: "127.0.0.1",
            mailPort: 110,
            name: "Isofact",
            email: "admin@isofact.com",
            password: "admin",
          },
          shipSettings: {
            experiences: [],
            durations: []
          },
          photos: []
        });

        conf.save(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            success._doc.mailSettings.password = "";
            cb(err, success);
          }
        });
      } else {
        db.Configurations.findOne()
          .populate("metaData.siteMetaDescription metaData.siteMetaKeywords shipSettings.experiences.name shipSettings.durations.name shipSettings.experiences.description contract.particular contract.enterprise")
          .exec(function (err, conf) {
            if (err || !conf) {
              cb(err, conf);
            } else {
              conf._doc.mailSettings.password = "";
              cb(err, conf);
            }
          });
      }

    });
  },
  saveGeneral: function (general, cb) {
    var error;
    if (!general.siteName.length) {
      error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    } else if (!general.offlineMessage.length) {
      error = {
        message: "Formulario Incorrecto."
      };
      cb(error, null);
    } else {
      db.Configurations.findOneAndUpdate({
        $set: {
          "general.siteName": general.siteName,
          "general.siteOffline": general.siteOffline,
          "general.sort": general.sort,
          "general.offlineMessage": general.offlineMessage,
          "general.domain": general.domain,
          "general.timeZone": general.timeZone
        }
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          db.Configurations.findOne().exec(function (err, confDoc) {
            if (err) {
              cb(err, null);
            } else {
              if (confDoc.general.timeZone) {
                var tz = confDoc.general.timeZone;
                tz = tz.split(")");
                global.config.timezone = tz[0].replace("(UTC", "");
              }
              cb(null, confDoc);
            }

          });
        }
      });
    }
  },
  saveMetaData: function (meta, cb) {
    for (var i = 0; i < meta.siteMetaDescription.length; i++) {
      if (!meta.siteMetaDescription[i].value.length) {
        var error = {
          message: "Formulario Incorrecto."
        };
        cb(error, null);
        return;
      }
    }
    for (var i = 0; i < meta.siteMetaKeywords.length; i++) {
      if (!meta.siteMetaKeywords[i].value.length) {
        var error = {
          message: "Formulario Incorrecto."
        };
        cb(error, null);
        return;
      }
    }

    db.Configurations.findOne().exec(function (err, confDoc) {
      if (err || !confDoc) {
        cb(err, confDoc);
      } else {
        async.parallel([
          function (cbp) {
            isoFieldView.validateCreateIsoField(meta.siteMetaDescription, function (data) {
              if (data) {
                cbp(null, data);
              } else {
                cbp(true, null);
              }
            });
          },
          function (cbp) {
            isoFieldView.validateCreateIsoField(meta.siteMetaKeywords, function (data) {
              if (data) {
                cbp(null, data);
              } else {
                cbp(true, null);
              }
            });
          }
        ], function (err, result) {
          if (err || !result) {
            cb(err, result);
          } else {
            async.parallel([
              function (cbp) {
                async.map(confDoc._doc.metaData.siteMetaDescription, function (text, callback) {
                  isoFieldView.remove(text, function (err, iso) {
                    callback(err, iso);
                  });
                }, function (err, result) {
                  cbp(err, result);
                });
              },
              function (cbp) {
                async.map(confDoc._doc.metaData.siteMetaKeywords, function (text, callback) {
                  isoFieldView.remove(text, function (err, iso) {
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
                async.parallel([
                  function (cbp) {
                    async.map(meta.siteMetaDescription, function (t, callback) {
                      isoFieldView.create(t._id, t.value, function (err, iso) {
                        callback(err, iso);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  },
                  function (cbp) {
                    async.map(meta.siteMetaKeywords, function (t, callback) {
                      isoFieldView.create(t._id, t.value, function (err, iso) {
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
                    var smd = [];
                    for (var i = 0; i < result[0].length; i++) {
                      smd.push(result[0][i]._doc._id);
                    }
                    var smk = [];
                    for (var i = 0; i < result[1].length; i++) {
                      smk.push(result[1][i]._doc._id);
                    }

                    db.Configurations.findOneAndUpdate({
                      $set: {
                        "metaData.siteMetaDescription": smd,
                        "metaData.siteMetaKeywords": smk
                      }
                    }).exec(function (err, success) {
                      if (err || !success) {
                        cb(err, success);
                      } else {
                        db.Configurations.findOne().exec(function (err, confDoc) {
                          cb(err, confDoc);
                        });
                      }
                    });

                  }
                });
              }
            });


          }
        });
      }
    });

  },
  saveMailSettings: function (mailSettings, cb) {
    if (validateMailSettings(mailSettings)) {
      if (mailSettings.password.length) {
        db.Configurations.findOneAndUpdate({
          $set: {
            "mailSettings.mailServer": mailSettings.mailServer,
            "mailSettings.mailPort": mailSettings.mailPort,
            "mailSettings.secureConnection": mailSettings.secureConnection,
            "mailSettings.user": mailSettings.user,
            "mailSettings.password": mailSettings.password,
            "mailSettings.email": mailSettings.email,
            "mailSettings.name": mailSettings.name,
          }
        }).exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            db.Configurations.findOne().exec(function (err, confDoc) {
              cb(err, confDoc);
            });
          }
        });
      } else {
        db.Configurations.findOneAndUpdate({
          $set: {
            "mailSettings.mailServer": mailSettings.mailServer,
            "mailSettings.mailPort": mailSettings.mailPort,
            "mailSettings.secureConnection": mailSettings.secureConnection,
            "mailSettings.user": mailSettings.user,
            "mailSettings.email": mailSettings.email,
            "mailSettings.name": mailSettings.name,
          }
        }).exec(function (err, success) {
          if (err || !success) {
            cb(err, success);
          } else {
            db.Configurations.findOne().exec(function (err, confDoc) {
              cb(err, confDoc);
            });
          }
        });
      }
    } else {
      var error = {
        message: "Formulario Incorrecto"
      };
      cb(error, null);
    }

  },
  addPhotos: function (files, cb) {
    var file = files.file;
    db.Configurations.findOne().exec(function (err, success) {
      if (err || !success) {
        cb(err, success);
      } else {
        if (success._doc.photos.length < 20) {
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
                  db.Configurations.findOneAndUpdate({
                    $push: {
                      photos: medias._doc._id
                    }
                  }).exec(function (err, success) {
                    if (err || !success) {
                      cb(err, success);
                    } else {
                      db.Configurations.findOne()
                        .populate("metaData.siteMetaDescription metaData.siteMetaKeywords")
                        .exec(function (err, conf) {
                          cb(err, conf);
                        });
                    }
                  });
                } catch (err) {
                  cb(err, false);
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
  delPhotos: function (photo, cb) {
    if (photo) {
      db.Configurations.findOne().exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          mediaViewModel.remove(photo, function (err, medias) {
            if (err) {
              cb(err, medias);
            } else {
              try {
                var newArray = [];
                for (var i = 0; i < success._doc.photos.length; i++) {
                  if (success._doc.photos[i].toString() != photo) {
                    newArray.push(success._doc.photos[i]);
                  }
                }

                db.Configurations.findOneAndUpdate({
                  $set: {
                    photos: newArray
                  }
                }).exec(function (err, success) {
                  if (err || !success) {
                    cb(err, success);
                  } else {
                    db.Configurations.findOne()
                      .populate("metaData.siteMetaDescription metaData.siteMetaKeywords")
                      .exec(function (err, conf) {
                        cb(err, conf);
                      });
                  }
                });
              } catch (err) {
                cb(err, false);
              }
            }
          });
        }
      });
    } else {
      var error = {
        message: "Datos Incorrecto"
      };
      cb(error, null);
    }
  },
  getPhotos: function (cb) {
    db.Configurations.findOne().exec(function (err, success) {
      try {
        if (!err) {
          var photos = success._doc.photos;
          cb(err, photos);
        } else {
          cb(err, false);
        }
      } catch (e) {
        cb(e, null);
      }
    });
  },
  addDuration: function (duration, cb) {
    if (validateAddDuration(duration)) {
      var aux = {
        unity: parseInt(duration.unity),
        quantity: parseInt(duration.quantity),
        name: duration.name
      };
      existDuration(aux, function (err, data) {
        if (err) {
          cb(err, false);
        } else {
          if (data) {
            var error = {
              message: "La Duración ya Existe. "
            };
            cb(error, null);
          } else {
            db.Configurations.findOne().exec(function (err, conf) {
              if (err || !conf) {
                cb(err, conf);
              } else {
                async.waterfall([
                  function (cbw) {
                    isoFieldView.validateCreateIsoField(aux.name, function (data) {
                      if (data) {
                        cbw(null, data);
                      } else {
                        cbw(true, null);
                      }
                    });
                  },
                  function (res, cbw) {
                    if (res) {
                      async.map(aux.name, function (t, callback) {
                        isoFieldView.create(t._id, t.value, function (err, iso) {
                          callback(err, iso);
                        });
                      }, function (err, result) {
                        cbw(err, result);
                      });
                    } else {
                      cbp(true, null);
                    }
                  }
                ], function (err, results) {
                  if (err) {
                    cb(err, results);
                  } else {
                    var name = [];
                    for (var i = 0; i < results.length; i++) {
                      name.push(results[i]._doc._id);
                    }
                    aux.name = name;

                    db.Configurations.findOneAndUpdate({
                      _id: conf._doc._id
                    }, {
                      $push: {
                        "shipSettings.durations": aux
                      }
                    }, {
                      new: true
                    }).exec(function (err, conf) {
                      cb(err, conf);
                    });
                  }
                });
              }
            });
          }

        }
      });
    } else {
      var error = {
        message: "Error en los datos"
      };
      cb(error, false);
    }
  },
  delDuration: function (duration, cb) {
    if (validateAddDuration(duration)) {
      var aux = {
        _id: duration._id,
        unity: parseInt(duration.unity),
        quantity: parseInt(duration.quantity)
      };

      db.Configurations.findOne().exec(function (err, conf) {
        if (err || !conf) {
          cb(err, conf);
        } else {
          var auxArray = [];
          for (var i = 0; i < conf.shipSettings.durations.length; i++) {
            if (conf.shipSettings.durations[i]._id.toString() == aux._id) {
              conf.shipSettings.durations[i].remove = true;
            }
            auxArray.push(conf.shipSettings.durations[i]);
          }

          db.Configurations.findOneAndUpdate({
            _id: conf._doc._id
          }, {
            $set: {
              "shipSettings.durations": auxArray
            }
          }, {
            new: true
          }).exec(function (err, conf) {
            cb(err, conf);
          });
        }
      });
    }
  },
  getDuration: function (id, cb) {
    db.Configurations.findOne().exec(function (err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        var duration = null;
        for (var i = 0; i < conf._doc.shipSettings.durations.length; i++) {
          if (id.quantity) {
            if (conf._doc.shipSettings.durations[i]._doc.quantity == id.quantity && conf._doc.shipSettings.durations[i]._doc.unity == id.unity) {
              duration = conf._doc.shipSettings.durations[i];
              break;
            }
          } else {
            if (conf._doc.shipSettings.durations[i]._doc._id.toString() == id) {
              duration = conf._doc.shipSettings.durations[i];
              break;
            }
          }
        }
        cb(null, duration);
      }
    });
  },
  addExperience: function (experience, cb) {
    if (validateAddExperience(experience)) {
      var aux = {
        name: experience.name
      };
      existExperience(aux, function (err, data) {
        if (err) {
          cb(err, false);
        } else {
          if (data) {
            var error = {
              message: "La Experiencia ya Existe. "
            };
            cb(error, null);
          } else {
            async.parallel([
              function (cbp) {
                isoFieldView.validateCreateIsoField(experience.name, function (data) {
                  if (!data) {
                    var error = {
                      message: "Formulario Incorrecto."
                    };
                    cbp(error, null);
                  } else {
                    async.map(experience.name, function (t, callback) {
                      async.parallel([
                        function (cbpp) {
                          isoFieldView.create(t._id, t.value, function (err, iso) {
                            cbpp(err, iso);
                          });
                        },
                        function (cbpp) {
                          isoFieldView.create(t._id, utils.getSlug(t.value), function (err, iso) {
                            cbpp(err, iso);
                          });
                        }
                      ], function (err, results) {
                        callback(err, results);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  }
                });
              }
              // ,
              // function (cbp) {
              //   isoFieldView.validateCreateIsoField(experience.description, function (data) {
              //     if (!data) {
              //       var error = {
              //         message: "Formulario Incorrecto."
              //       };
              //       cbp(error, null);
              //     } else {
              //       async.map(experience.description, function (t, callback) {
              //         isoFieldView.create(t._id, t.value, function (err, iso) {
              //           callback(err, iso);
              //         });
              //       }, function (err, result) {
              //         cbp(err, result);
              //       });
              //     }
              //   });
              // }
            ], function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {

                var array = new Array();
                var arrays = new Array();

                for (var i = 0; i < result[0].length; i++) {
                  array.push(result[0][i][0]._doc._id);
                  arrays.push(result[0][i][1]._doc._id);
                }


                // var expDescription = [];
                //
                // for (var i = 0; i < result.length; i++) {
                //   expDescription.push(result[1][i]._doc._id);
                // }

                if (experience._id) {
                  var aux = {
                    _id: experience._id,
                    slug: arrays,
                    name: array,
                    // description: expDescription
                  };
                } else {
                  var aux = {
                    slug: arrays,
                    name: array,
                    // description: expDescription
                  };
                }
                db.Configurations.findOne().exec(function (err, conf) {
                  if (err || !conf) {
                    cb(err, conf);
                  } else {
                    db.Configurations.findOneAndUpdate({
                        _id: conf._doc._id
                      }, {
                        $push: {
                          "shipSettings.experiences": aux
                        }
                      }, {
                        new: true
                      })
                      .populate("shipSettings.experiences.name shipSettings.experiences.description")
                      .exec(function (err, conf) {
                        cb(err, conf);
                      });
                  }
                });

              }
            });
          }
        }
      });
    }
  },
  delExperience: function (experience, cb) {
    if (validateAddExperience(experience)) {
      db.Configurations.findOne().exec(function (err, conf) {
        if (err || !conf) {
          cb(err, conf);
        } else {
          var auxArray = [];
          for (var i = 0; i < conf.shipSettings.experiences.length; i++) {
            if (conf.shipSettings.experiences[i]._id.toString() == experience._id) {
              conf.shipSettings.experiences[i].remove = true;
            }
            auxArray.push(conf.shipSettings.experiences[i]);
          }

          db.Configurations.findOneAndUpdate({
            _id: conf._doc._id
          }, {
            $set: {
              "shipSettings.experiences": auxArray
            }
          }, {
            new: true
          }).exec(function (err, conf) {
            cb(err, conf);
          });
        }
      });
    }
  },
  saveExperience: function (experience, cb) {
    try {
      if (validateAddExperience(experience)) {
        db.Configurations.findOne().exec(function (err, conf) {
          if (err || !conf) {
            cb(err, conf);
          } else {
            var auxName, auxDescription, auxSlug;
            for (var i = 0; i < conf.shipSettings.experiences.length; i++) {
              if (experience._id == conf.shipSettings.experiences[i]._doc._id.toString()) {
                auxName = conf.shipSettings.experiences[i]._doc.name;
                auxSlug = conf.shipSettings.experiences[i]._doc.slug;
                auxDescription = conf.shipSettings.experiences[i]._doc.description;
                break;
              }
            }
            try {
              async.parallel([
                function (cbp) {
                  async.map(auxName, function (text, callback) {
                    isoFieldView.remove(text, function (err, iso) {
                      callback(err, iso);
                    });
                  }, function (err, result) {
                    cbp(err, result);
                  });
                },
                function (cbp) {
                  async.map(auxDescription, function (text, callback) {
                    isoFieldView.remove(text, function (err, iso) {
                      callback(err, iso);
                    });
                  }, function (err, result) {
                    cbp(err, result);
                  });
                },
                function (cbp) {
                  async.map(auxSlug, function (slug, callback) {
                    isoFieldView.remove(slug, function (err, iso) {
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
                  db.Configurations.findOneAndUpdate({
                    _id: conf._doc._id
                  }, {
                    $pull: {
                      "shipSettings.experiences": {
                        _id: experience._id
                      }
                    }
                  }, {
                    new: true
                  }).exec(function (err, conf) {
                    if (err || !conf) {
                      cb(err, conf);
                    } else {
                      configurationFunctions.addExperience(experience, function (err, success) {
                        cb(err, success);
                      });
                    }
                  });
                }
              });
            } catch (err) {
              cb(err, null);
            }

          }
        });
      } else {
        var error = {
          message: "La Experiencia ya Existe. "
        };
        cb(error, null);
      }
    } catch (err) {
      cb(err, null);
    }
  },
  getExperience: function (id, cb) {
    db.Configurations.findOne()
      .populate("shipSettings.experiences.name shipSettings.experiences.slug")
      .exec(function (err, conf) {
        if (err || !conf) {
          cb(err, conf);
        } else {
          var experience = null;
          for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
            if (conf._doc.shipSettings.experiences[i]._doc._id.toString() == id) {
              experience = conf._doc.shipSettings.experiences[i];
              break;
            }
          }
          cb(null, experience);
        }
      });
  },
  getXpList: function (id, lang, cb) {
    db.Configurations.findOne()
      .populate({
        path: "shipSettings.experiences.name",
        select: "value",
        match: {
          language: lang._doc._id
        }
      })
      .populate({
        path: "shipSettings.experiences.slug",
        select: "value",
        match: {
          language: lang._doc._id
        }
      })
      .exec(function (err, conf) {
        if (err || !conf) {
          cb(err, conf);
        } else {
          var name = "";
          for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
            if (conf._doc.shipSettings.experiences[i]._doc._id.toString() == id) {
              name = {
                //name: conf._doc.shipSettings.experiences[i]._doc.name[0].value,
                slug: conf._doc.shipSettings.experiences[i]._doc.slug[0]._doc.value,
                id: conf._doc.shipSettings.experiences[i]._doc._id
              };
            }

          }
          cb(err, name);
        }
      });

  },
  listExperience: function (cb) {
    db.Configurations.findOne()
      .populate("shipSettings.experiences.name")
      .populate("shipSettings.experiences.slug")
      .exec(function (err, conf) {
        cb(err, conf);
      });

  },
  defaultExperience: function (id, cb) {
    db.Configurations.findOne().exec(function (err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        var experience = null;
        for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
          if (conf._doc.shipSettings.experiences[i]._doc._id.toString() == id) {
            conf._doc.shipSettings.experiences[i]._doc.default = true;
          } else {
            conf._doc.shipSettings.experiences[i]._doc.default = false;
          }
        }

        db.Configurations.findOneAndUpdate({
            $set: {
              "shipSettings.experiences": conf._doc.shipSettings.experiences
            }
          })
          .exec(function (err, success) {
            cb(err, success);
          });

      }
    });
  },
  unCheck: function (id, cb) {
    db.Configurations.findOne().exec(function (err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        var experience = null;
        for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
          if (conf._doc.shipSettings.experiences[i]._doc._id.toString() == id) {
            conf._doc.shipSettings.experiences[i]._doc.default = false;
          } else {
            conf._doc.shipSettings.experiences[i]._doc.default = false;
          }
        }

        db.Configurations.findOneAndUpdate({
            $set: {
              "shipSettings.experiences": conf._doc.shipSettings.experiences
            }
          })
          .exec(function (err, success) {
            cb(err, success);
          });

      }
    });
  },
  validateExistDuration: function (duration_id, cb) {
    db.Configurations.findOne({
      "shipSettings.durations._id": duration_id
    }).exec(function (err, success) {
      if (err || !success) {
        cb(err, success);
      } else {
        var aux;
        for (var i = 0; i < success._doc.shipSettings.durations.length; i++) {
          if (success._doc.shipSettings.durations[i]._doc._id.toString() == duration_id.toString()) {
            aux = success._doc.shipSettings.durations[i];
            break;
          }
        }
        cb(err, aux);
      }
    });
  },
  listDurationsAndExperiences: function (language, cb) {
    db.Configurations.findOne()
      .populate({
        path: "shipSettings.experiences.name",
        select: "value",
        match: {
          language: language
        }
      })
      .populate({
        path: "shipSettings.experiences.description",
        select: "value",
        match: {
          language: language
        }
      })
      .populate({
        path: "shipSettings.experiences.slug",
        select: "value",
        match: {
          language: language
        }
      })
      .populate({
        path: "shipSettings.durations.name",
        select: "value",
        match: {
          language: language
        }
      })
      .exec(function (err, conf) {
        if (err || !conf) {
          cb(err, conf);
        } else {
          var auxD = [];
          for (var i = 0; i < conf._doc.shipSettings.durations.length; i++) {
            if (!conf._doc.shipSettings.durations[i].remove) {
              auxD.push(conf._doc.shipSettings.durations[i]);
            }

          }

          var auxE = [];
          for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
            if (!conf._doc.shipSettings.experiences[i].remove) {
              auxE.push(conf._doc.shipSettings.experiences[i]);
            }

          }

          var durations = auxD;
          var experiences = auxE;
          cb(null, {
            durations: durations,
            experiences: experiences
          });
        }
      });
  },
  getMetabyLang: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        db.Configurations.findOne()
          .populate({
            path: "metaData.siteMetaDescription metaData.siteMetaKeywords",
            select: "value",
            match: {
              language: lang._doc._id
            },
          })
          .exec(function (err, conf) {
            if (err || !conf) {
              cb(err, conf);
            } else {
              if (conf._doc.metaData.siteMetaDescription[0]) {
                var meta = {
                  desc: conf._doc.metaData.siteMetaDescription[0]._doc.value
                };
              } else {
                var meta = {
                  desc: ""
                };
              }

              cb(err, meta);
            }
          });
      } catch (e) {
        cb(e, null);
      }


    });

  },
  listDurationAndXpFront: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      configurationFunctions.listDurationsAndExperiences(lang._doc._id, function (err, xp) {
        if (err || !xp) {
          cb(err, false);
        } else {
          cb(false, xp);
        }
      });
    });
  },
  getXpbySlug: function (slug, culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (!err) {
        db.Configurations.findOne()
          .populate({
            path: "shipSettings.experiences.name",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .populate({
            path: "shipSettings.experiences.slug",
            select: "value",
            match: {
              language: lang._doc._id
            }
          })
          .exec(function (err, conf) {
            if (err || !conf) {
              cb(err, false);
            } else {
              var name = "";
              for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                if (conf._doc.shipSettings.experiences[i]._doc.slug[0].value == slug) {
                  name = {
                    name: conf._doc.shipSettings.experiences[i]._doc.name[0].value,
                    id: conf._doc.shipSettings.experiences[i]._doc._id,
                    slug: conf._doc.shipSettings.experiences[i]._doc.slug[0].value
                  };
                }

              }
              cb(err, name);
            }
          });
      } else {
        cb(err, "Invalid language");
      }

    });

  },

  getDurationanbyQandU: function (unity, quantity, cb) {
    try {
      var dur = 0,
        stop = false;
      db.Configurations.findOne().exec(function (err, conf) {
        if (!err) {
          for (var i = 0; i < conf._doc.shipSettings.durations.length && !stop; i++) {
            if (conf._doc.shipSettings.durations[i]._doc.unity == unity && conf._doc.shipSettings.durations[i]._doc.quantity == quantity) {
              dur = conf._doc.shipSettings.durations[i]._doc._id;
            }

          }
          cb(false, dur);
        } else {
          cb(err, false);
        }

      });
    } catch (e) {
      cb(e, false);
    }


  },
  v2GetDurationanbyQandU: function (unity, quantity, cb) {
    try {
      var dur = 0,
        stop = false;
      db.Configurations.findOne().exec(function (err, conf) {
        if (!err) {
          for (var i = 0; i < conf._doc.shipSettings.durations.length && !stop; i++) {
            if (conf._doc.shipSettings.durations[i]._doc.unity == unity && quantity > 0) {
              dur = conf._doc.shipSettings.durations[i]._doc._id;
            }

          }
          cb(false, dur);
        } else {
          cb(err, false);
        }

      });
    } catch (e) {
      cb(e, false);
    }


  },
  saveShipType: function (type, cb) {
    try {
      db.shipTypes.findOne({
        _id: type._id
      }).exec(function (err, obj) {
        if (err || !obj) {
          cb(err, obj);
        } else {
          var auxDescription = obj.description;
          var auxSlug = obj.slug;
          var auxName = obj.name;

          async.parallel([
            // function (cbp) {
            //   async.map(auxDescription, function (text, callback) {
            //     isoFieldView.remove(text, function (err, iso) {
            //       callback(err, iso);
            //     });
            //   }, function (err, resultM) {
            //     cbp(err, resultM);
            //   });
            // },
            function (cbp) {
              async.map(auxSlug, function (text, callback) {
                isoFieldView.remove(text, function (err, iso) {
                  callback(err, iso);
                });
              }, function (err, resultM) {
                cbp(err, resultM);
              });
            },
            function (cbp) {
              async.map(auxName, function (text, callback) {
                isoFieldView.remove(text, function (err, iso) {
                  callback(err, iso);
                });
              }, function (err, resultM) {
                cbp(err, resultM);
              });
            }
          ], function (err) {
            if (err) {
              cb(err, null);
            } else {
              configurationFunctions.addShipType(type, function (err, success) {
                cb(err, success);
              });
            }
          });
        }
      });
    } catch (err) {
      cb(err, null);
    }
  },
  addShipType: function (type, cb) {
    async.parallel([
      function (cbp) {
        isoFieldView.validateUpdateIsoField(type.name, function (data) {
          if (!data) {
            var error = {
              message: "Formulario Incorrecto."
            };
            cbp(error, null);
          } else {
            async.map(type.name, function (t, callback) {
              async.parallel([
                function (cbP) {
                  var lang = t.language || t._id;
                  isoFieldView.create(lang, t.value, function (err, iso) {
                    cbP(err, iso);
                  });
                },
                function (cbP) {
                  var lang = t.language || t._id;
                  isoFieldView.create(lang, utils.getSlug(t.value), function (err, iso) {
                    cbP(err, iso);
                  });
                }
              ], function (err, results) {
                callback(err, results);
              });
            }, function (err, result) {
              cbp(err, result);
            });
          }
        });
      }
      // ,
      // function (cbp) {
      //   isoFieldView.validateUpdateIsoField(type.description, function (data) {
      //     if (!data) {
      //       var error = {
      //         message: "Formulario Incorrecto."
      //       };
      //       cbp(error, null);
      //     } else {
      //       async.map(type.description, function (t, callback) {
      //         var lang = t.language || t._id;
      //         isoFieldView.create(lang, t.value, function (err, iso) {
      //           callback(err, iso);
      //         });
      //       }, function (err, result) {
      //         cbp(err, result);
      //       });
      //     }
      //   });
      // }
    ], function (err, result) {
      if (err || !result) {
        cb(err, result);
      } else {

        var array = new Array();
        var arrays = new Array();

        for (var i = 0; i < result[0].length; i++) {
          array.push(result[0][i][0]._doc._id);
          arrays.push(result[0][i][1]._doc._id);
        }


        // var dataDescription = [];
        //
        // for (var i = 0; i < result.length; i++) {
        //   dataDescription.push(result[1][i]._doc._id);
        // }
        var aux;
        if (type._id) {
          db.shipTypes.findOneAndUpdate({
            _id: type._id
          }, {
            $set: {
              slug: arrays,
              name: array,
              // description: dataDescription
            }
          }).exec(function (err, success) {
            cb(err, success);
          });

        } else {
          aux = new db.shipTypes({
            slug: arrays,
            name: array,
            // description: dataDescription
          });
          aux.save(function (err, type) {
            cb(err, type);
          });
        }


      }
    });
  },
  removeShipType: function (id, cb) {
    db.shipTypes.update({
      _id: id
    }, {
      $set: {
        remove: true
      }
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  listShipType: function (cb) {
    db.shipTypes.find({
        remove: false
      })
      .populate("name slug description")
      .exec(function (err, types) {
        cb(err, types);
      });
  },
  listFrontShipType: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        if (!err) {

          db.shipTypes.find({
              remove: false
            })
            .populate({
              path: "name",
              select: "value",
              match: {
                language: lang._doc._id
              }
            })
            //.populate({
            //    path: 'description',
            //    select: 'value',
            //    match: {language: lang._doc._id}
            //
            //})
            .populate({
              path: "slug",
              select: "value",
              match: {
                language: lang._doc._id
              }

            })
            .exec(function (err, data) {
              cb(err, data);
            });
        } else {
          cb(err, lang);
        }
      } catch (e) {
        cb(e, null);
      }


    });
  },
  getShipbySlug: function (slug, culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        if (!err) {
          db.shipTypes.find({
              remove: false
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
                cb(err, false);
              } else {
                var shipT = 0;
                for (var i = 0; i < data.length; i++) {
                  if (data[i]._doc.slug[0]._doc.value == slug) {
                    shipT = data[i]._id.toString();
                  }

                }
                cb(false, shipT);
              }
            });
        }
      } catch (err) {
        cb(err, false);
      }
    });
  },
  getShipbyId: function (id, culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      try {
        if (!err) {
          db.shipTypes.findOne({
              remove: false,
              _id: id
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
                cb(err, false);
              } else {
                cb(false, data);
              }
            });
        }
      } catch (err) {
        cb(err, false);
      }
    });
  },
  listTags: function (cb) {
    db.Tags.find({
        remove: false
      })
      .populate("name")
      .populate("title")
      .populate("description")
      .exec(function (err, tags) {
        cb(err, tags);
      });
  },
  addTag: function (tag, cb) {
    async.parallel([
      function (cbp) {
        isoFieldView.validateCreateIsoField(tag.name, function (data) {
          if (data) {
            async.map(tag.name, function (n, callback) {
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
        isoFieldView.validateCreateIsoField(tag.name, function (data) {
          if (data) {
            async.map(tag.name, function (n, callback) {
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
      },
      function (cbp) {
        isoFieldView.validateCreateIsoField(tag.title, function (data) {
          if (data) {
            async.map(tag.title, function (n, callback) {
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
        isoFieldView.validateCreateIsoField(tag.description, function (data) {
          if (data) {
            async.map(tag.description, function (n, callback) {
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
        cb(err, result);
      } else {


        var arrayName = [];
        for (var i = 0; i < result[0].length; i++) {
          arrayName.push(result[0][i]._doc._id);
        }
        var arraySlug = [];
        for (var i = 0; i < result[1].length; i++) {
          arraySlug.push(result[1][i]._doc._id);
        }

        var arrayTitle = [];
        for (var i = 0; i < result[2].length; i++) {
          arrayTitle.push(result[2][i]._doc._id);
        }
        var arrayDescription = [];
        for (var i = 0; i < result[3].length; i++) {
          arrayDescription.push(result[3][i]._doc._id);
        }

        if (tag._id) {
          db.Tags.update({
            _id: tag._id
          }, {
            $set: {
              name: arrayName,
              slug: arraySlug,
              title: arrayTitle,
              description: arrayDescription
            }
          }).exec(function (err, success) {
            cb(err, success);
          });
        } else {
          var newTag = db.Tags({
            name: arrayName,
            slug: arraySlug,
            title: arrayTitle,
            description: arrayDescription
          });
          newTag.save(function (err, tag) {
            cb(err, tag);
          });
        }


      }

    });
  },
  removeTag: function (id, cb) {
    db.Tags.findOne({
      _id: id,
      remove: false
    }).exec(function (err, tag) {
      if (err || !tag) {
        cb(err, tag);
      } else {
        db.Tags.update({
          _id: id,
          remove: false
        }, {
          $set: {
            remove: true
          }
        }).exec(function (err, success) {
          cb(err, success);
        });
      }
    });
  },
  saveTag: function (tag, cb) {
    db.Tags.findOne({
      _id: tag._id,
      remove: false
    }).exec(function (err, tagDoc) {
      if (err || !tagDoc) {
        cb(err, false);
      } else {
        async.parallel([
          function (cbp) {
            isoFieldView.validateCreateIsoField(tag.name, function (data) {
              if (data) {
                async.map(tagDoc._doc.name, function (n, callback) {
                  isoFieldView.remove(n, function (err, iso) {
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
            isoFieldView.validateCreateIsoField(tag.name, function (data) {
              if (data) {
                async.map(tagDoc._doc.slug, function (n, callback) {
                  isoFieldView.remove(n, function (err, iso) {
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
            isoFieldView.validateCreateIsoField(tag.title, function (data) {
              if (data) {
                async.map(tagDoc._doc.title, function (n, callback) {
                  isoFieldView.remove(n, function (err, iso) {
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
            isoFieldView.validateCreateIsoField(tag.description, function (data) {
              if (data) {
                async.map(tagDoc._doc.description, function (n, callback) {
                  isoFieldView.remove(n, function (err, iso) {
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
            cb(err, result);
          } else {
            configurationFunctions.addTag(tag, function (err, success) {
              cb(err, success);
            });
          }
        });
      }
    });
  },
  /*Equipments*/
  listEquipments: function (cb) {
    db.Equipments.find().populate("name items.name").sort({
      _id: 1
    }).exec(function (err, data) {
      cb(err, data);
    });
  },
  createEquipments: function (equipment, cb) {
    try {
      prepareLanguages(equipment.name, function (name) {
        equipment.name = name;
        isoFieldView.validateCreateIsoField(equipment.name, function (goOne) {
          if (goOne) {
            async.map(equipment.name, function (n, callback) {
              isoFieldView.create(n._id, n.value, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                  array.push(result[i]._doc._id);
                }


                var equip = db.Equipments({
                  name: array,
                  items: []
                });

                equip.save(function (err, doc) {
                  cb(err, doc);
                });
              }
            });
          } else {
            var error = {
              message: "Formulario Incorrecto."
            };
            cb(error, null);
          }
        });
      });
    } catch (err) {
      cb(err, false);
    }
  },
  updateEquipments: function (equipment, cb) {
    prepareLanguages(equipment.name, function (name) {
      equipment.name = name;
      isoFieldView.validateCreateIsoField(equipment.name, function (goOne) {
        if (goOne) {
          async.map(equipment.name, function (n, callback) {
            isoFieldView.create(n._id, n.value, function (err, iso) {
              callback(err, iso);
            });
          }, function (err, result) {
            if (err || !result) {
              cb(err, result);
            } else {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i]._doc._id);
              }

              db.Equipments.findOne({
                _id: equipment._id
              }).exec(function (err, doc) {
                if (err || !doc) {
                  cb(err, doc);
                } else {
                  async.map(array, function (arr, callback) {
                    async.map(arr, function (n, callback0) {
                      isoFieldView.remove(n._id, function (err, iso) {
                        callback0(err, iso);
                      });
                    }, function (err, result) {
                      callback(err, result);
                    });
                  }, function (err, result) {
                    if (err || !result) {
                      cb(err, result);
                    } else {

                      db.Equipments.update({
                        _id: equipment._id
                      }, {
                        $set: {
                          name: array
                        }
                      }).exec(function (err, equip) {
                        cb(err, equip);
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
      });
    });
  },
  removeEquipment: function (equipment, cb) {
    try {
      db.Equipments.findOne({
        _id: equipment._id
      }).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          var array = [];
          array.push(doc.name);
          for (var j = 0; j < doc.items.length; j++) {
            array.push(doc.items[j].name);
          }
          async.map(array, function (arr, callback) {
            async.map(arr, function (n, callback0) {
              isoFieldView.remove(n, function (err, iso) {
                callback0(err, iso);
              });
            }, function (err, result) {
              callback(err, result);
            });
          }, function (err, result) {
            if (err || !result) {
              cb(err, result);
            } else {
              db.Equipments.remove({
                _id: equipment._id
              }).exec(function (err, success) {
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
  /*Equips*/
  createEquip: function (equipment_id, equip, cb) {
    try {

      prepareLanguages(equip.name, function (name) {
        equip.name = name;
        isoFieldView.validateCreateIsoField(equip.name, function (goOne) {
          if (goOne) {
            async.map(equip.name, function (n, callback) {
              isoFieldView.create(n._id, n.value, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                  array.push(result[i]._doc._id);
                }
                if (equip._id) {
                  var aux = {
                    _id: equip._id,
                    status: equip.status,
                    name: array
                  };
                } else {
                  var aux = {
                    name: array,
                    status: false
                  };
                }

                db.Equipments.update({
                  _id: equipment_id
                }, {
                  $push: {
                    items: aux
                  }
                }).exec(function (err, succes) {
                  cb(err, succes);
                });
              }
            });
          } else {
            var error = {
              message: "Formulario Incorrecto."
            };
            cb(error, null);
          }
        });
      });


    } catch (err) {
      cb(err, false);
    }
  },
  statusEquip: function (id, equipment, equip, cb) {
    try {
      db.Ships.findOne({
        _id: id,
        remove: false
      }).exec(function (err, ship) {
        if (err || !ship) {
          cb(err, ship);
        } else {
          for (var i = 0; i < ship._doc.equipments.length; i++) {
            var finish = false;
            if (ship._doc.equipments[i]._doc._id.toString() == equipment._id) {
              for (var j = 0; j < ship._doc.equipments[i].items.length; j++) {
                if (ship._doc.equipments[i].items[j]._doc._id.toString() == equip._id) {
                  ship._doc.equipments[i].items[j]._doc.status = !ship._doc.equipments[i].items[j]._doc.status;
                  finish = true;
                  break;
                }
              }
            }
            if (finish) break;
          }
        }
        var equipments = ship._doc.equipments;
        db.Ships.findByIdAndUpdate({
          _id: ship._doc._id
        }, {
          $set: {
            equipments: equipments
          }
        }, {
          new: true
        }).populate("user title description equipments.name equipments.items.name seasons.tariff.title conditions.text discounts.name").exec(function (err, ship) {
          if (err || !ship) {
            cb(err, null);
          } else {
            utilReturn(ship, function (err, object) {
              cb(err, object);
            });
          }
        });
      });
    } catch (err) {
      cb(err, false);
    }
  },
  removeEquip: function (equipment, equip, cb) {
    try {
      db.Equipments.findOne({
        _id: equipment._id
      }).exec(function (err, doc) {
        if (err || !doc) {
          cb(err, doc);
        } else {
          var item = null;
          for (var j = 0; j < doc.items.length; j++) {
            if (doc.items[j]._doc._id.toString() == equip._id) {
              item = doc.items[j];
              break;
            }
          }
          if (item) {
            async.map(item.name, function (n, callback) {
              isoFieldView.remove(n, function (err, iso) {
                callback(err, iso);
              });
            }, function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {

                db.Equipments.update({
                  _id: equipment
                }, {
                  $pull: {
                    items: item
                  }
                }).exec(function (err, succes) {
                  cb(err, succes);
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
  updateEquip: function (equipment, equip, cb) {
    try {
      configurationFunctions.removeEquip(equipment, equip, function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          configurationFunctions.createEquip(equipment._id, equip, function (err, success) {
            cb(err, success);
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },

  updatePaypal: function (data, cb) {
    db.Configurations.findOneAndUpdate({
      paypal: data
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  updateRedsys: function (data, cb) {
    db.Configurations.findOneAndUpdate({
      redsys: data
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  updateIva: function (iva, cb) {
    db.Configurations.findOneAndUpdate({
      iva: iva
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  saveContract: function (contract, cb) {
    var error = null;
    for (var i = 0; i < contract.particular.length; i++) {
      if (!contract.particular[i].value.length) {
        error = {
          message: "Formulario Incorrecto."
        };
        break;
      }
    }
    if (!error) {
      for (var i = 0; i < contract.enterprise.length; i++) {
        if (!contract.enterprise[i].value.length) {
          error = {
            message: "Formulario Incorrecto."
          };
          break;
        }
      }
      if (!error) {
        db.Configurations.findOne().exec(function (err, confDoc) {
          if (err || !confDoc) {
            cb(err, confDoc);
          } else {
            async.parallel([
              function (cbp) {
                isoFieldView.validateCreateIsoField(contract.particular, function (data) {
                  if (data) {
                    cbp(null, data);
                  } else {
                    cbp(true, null);
                  }
                });
              },
              function (cbp) {
                isoFieldView.validateCreateIsoField(contract.enterprise, function (data) {
                  if (data) {
                    cbp(null, data);
                  } else {
                    cbp(true, null);
                  }
                });
              }
            ], function (err, result) {
              if (err || !result) {
                cb(err, result);
              } else {
                async.parallel([
                  function (cbp) {
                    async.map(confDoc._doc.contract.particular, function (text, callback) {
                      isoFieldView.remove(text, function (err, iso) {
                        callback(err, iso);
                      });
                    }, function (err, result) {
                      cbp(err, result);
                    });
                  },
                  function (cbp) {
                    async.map(confDoc._doc.contract.enterprise, function (text, callback) {
                      isoFieldView.remove(text, function (err, iso) {
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
                    async.parallel([
                      function (cbp) {
                        async.map(contract.particular, function (t, callback) {
                          isoFieldView.create(t._id, t.value, function (err, iso) {
                            callback(err, iso);
                          });
                        }, function (err, result) {
                          cbp(err, result);
                        });
                      },
                      function (cbp) {
                        async.map(contract.enterprise, function (t, callback) {
                          isoFieldView.create(t._id, t.value, function (err, iso) {
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
                        var smd = [];
                        for (var i = 0; i < result[0].length; i++) {
                          smd.push(result[0][i]._doc._id);
                        }
                        var smk = [];
                        for (var i = 0; i < result[1].length; i++) {
                          smk.push(result[1][i]._doc._id);
                        }

                        db.Configurations.findOneAndUpdate({
                          $set: {
                            "contract.particular": smd,
                            "contract.enterprise": smk
                          }
                        }).exec(function (err, success) {
                          if (err || !success) {
                            cb(err, success);
                          } else {
                            db.Configurations.findOne().exec(function (err, confDoc) {
                              cb(err, confDoc);
                            });
                          }
                        });

                      }
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        cb(error, null);
      }

    } else {
      cb(error, null);
    }
  },
  getSEO: function (cb) {
    db.Configurations.findOne({}, {
      seo: 1
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  updateSEO: function (seo, cb) {
    db.Configurations.findOneAndUpdate({
      seo: seo
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  createCurrency: function (currency, cb) {
    var obj = new db.Currencies({
      text: currency.text,
      symbol: currency.symbol
    });
    obj.save(function (err, response) {
      cb(err, response);
    });
  },
  removeCurrency: function (currency, cb) {
    db.Currencies.remove({
      _id: currency._id
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  updateCurrency: function (currency, cb) {
    db.Currencies.update({
      _id: currency._id
    }, {
      $set: {
        text: currency.text,
        symbol: currency.symbol
      }
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  listCurrencies: function (cb) {
    db.Currencies.find()
      .sort({
        pos: "asc"
      }).exec(function (err, currencies) {
        cb(err, currencies);
      });
  },
  listFrontCurrencies: function (cb) {
    db.Currencies.find({
      pos: {
        $ne: null
      }
    }).sort({
      pos: "asc"
    }).exec(function (err, currencies) {
      cb(err, currencies);
    });
  },
  currencyMenu: function (id, action, cb) {
    db.Currencies.findOne({
      _id: id
    }).exec(function (err, curr) {
      if (err || !curr) {
        cb(err, curr);
      } else {
        if (action == "ban") {
          db.Currencies.update({
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
              db.Currencies.find({
                pos: {
                  $ne: null
                }
              }).sort({
                pos: "asc"
              }).exec(function (err, currencies) {
                var cont = 0;
                async.mapSeries(currencies, function (currency, cbm) {
                  var last = false;
                  if (cont == (currencies.length - 1)) {
                    last = true;
                  }
                  db.Currencies.update({
                    _id: currency._doc._id.toString()
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
              var last = curr.last;
              db.Currencies.update({
                _id: id
              }, {
                $set: {
                  pos: (curr.pos - 1),
                  last: false
                }
              }).exec(function (err) {
                cbp(err, last);
              });
            },
            function (last, cbp) {
              db.Currencies.update({
                _id: {
                  $ne: id
                },
                pos: (curr.pos - 1)
              }, {
                $set: {
                  pos: curr.pos,
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
              db.Currencies.findOne({
                _id: {
                  $ne: id
                },
                pos: (curr.pos + 1)
              }).exec(function (err, obj) {
                if (err) {
                  cbp(err, null);
                } else {
                  var last = obj.last;
                  db.Currencies.update({
                    _id: {
                      $ne: id
                    },
                    pos: (curr.pos + 1),
                  }, {
                    $set: {
                      pos: curr.pos,
                      last: false
                    }
                  }).exec(function (err) {
                    cbp(err, last);
                  });
                }
              });
            },
            function (last, cbp) {
              db.Currencies.update({
                _id: id
              }, {
                $set: {
                  pos: (curr.pos + 1),
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
          db.Currencies.find({
            pos: {
              $ne: null
            }
          }).sort({
            pos: "asc"
          }).exec(function (err, currencies) {
            if (!currencies.length) {
              db.Currencies.update({
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
              async.mapSeries(currencies, function (currency, cbm) {
                db.Currencies.update({
                  _id: currency._doc._id.toString()
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
                  db.Currencies.update({
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
  export: function (cb) {
    var exec = require("child_process");

    fs.writeFileSync("backup.js", "exports.data={");
    var data = fs.createWriteStream("backup.js", {
      flags: "r+",
      start: 14
    });
    var collectionList = [
      "configurations",
      "currencies",
      "equipment",
      "isofields",
      "landings",
      "languages",
      "localizations",
      "media",
      "notifications",
      "offers",
      "pagemedias",
      "particulars",
      "requests",
      "ships",
      "shiptypes",
      "subscriptions",
      "texts",
      "users"
    ];
    var config = {
      host: process.env.OPENSHIFT_MONGODB_DB_HOST ? process.env.OPENSHIFT_MONGODB_DB_HOST : "127.0.0.1",
      port: process.env.OPENSHIFT_MONGODB_DB_PORT ? process.env.OPENSHIFT_MONGODB_DB_PORT : "27017",
      dataBase: process.env.OPENSHIFT_APP_NAME ? process.env.OPENSHIFT_APP_NAME : "AlquilerDeBarcos",
      user: process.env.OPENSHIFT_MONGODB_DB_USERNAME ? process.env.OPENSHIFT_MONGODB_DB_USERNAME : "root",
      password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD ? process.env.OPENSHIFT_MONGODB_DB_PASSWORD : "root"
    };
    async.mapSeries(collectionList, function (collection, cbm) {
      var generate = "mongoexport -h " + config.host + ":" + config.port + " -d " + config.dataBase + " --jsonArray -c " + collection + " -o backup/" + collection + ".json";
      if (global.config.production) {
        generate = "mongoexport -h " + config.host + ":" + config.port + " --username " + config.user + " --password " + config.password + " -d " + config.dataBase + " --jsonArray -c " + collection + " -o backup/" + collection + ".json";

      }
      console.log("*********************************");
      console.error(generate);
      console.log("*********************************");
      exec.exec(generate,
        function (error, stdout, stderr) {
          if (error) {
            //console.log(error);
            cbm(error, false);
          } else {
            if (stdout) {
              //console.log(stdout);
            }
            if (stderr) {
              //console.log(stderr);
            }
            var fileName = "backup/" + collection + ".json";
            var newFile = fs.createReadStream(fileName);
            data.write(collection + ":", function () {
              newFile.pipe(data, {
                end: false
              });
              newFile.on("end", function () {
                fs.unlinkSync("backup/" + collection + ".json");
                if (collection != "users") {
                  data.write(",", function () {
                    cbm(null, true);
                  });
                } else {
                  cbm(null, true);
                }
              });
            });
          }
        });
    }, function (err, result) {
      if (err || !result) {
        cb(err, null);
      } else {
        data.end("}");

        console.log("*********************************");
        console.error("FINISH");
        console.log("*********************************");
        cb(null, true);
      }
    });
  },
  import: function (files, cb) {
    var file = files.file;
    var restoreData = require(file.path).data;

    var _ = require("lodash");
    var tools = require("./../../../tools/mongo/tools");

    var collections = [];
    _.forEach(restoreData, function (value, key) {
      collections.push(key);
    });


    async.mapSeries(collections, function (collection, cbm) {
      async.waterfall([
        function (cbs) {
          tools.removeData(collection, function (err, response) {
            cbs(err, response);
          });
        },
        function (rem, cbs) {
          if (restoreData[collection].length) {
            tools.restoreCollectionV1(collection, restoreData, function (err, response) {
              cbs(err, response);
            });
          } else {
            cbs(null, true);
          }

        }
      ], function (err, resultSeries) {
        cbm(err, resultSeries);
      });
    }, function (err, result) {
      cb(err, result);
    });





  }
};
module.exports = configurationFunctions;