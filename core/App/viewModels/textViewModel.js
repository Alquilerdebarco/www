/**
 * Created by ernestomr87@gmail.com on1/18/2016.
 */

var async = require("async");
var _ = require("lodash");
var isoFieldView = require("./IsoFieldViewModel");
var languageView = require("./languageViewModel");
var mediaViewModel = require("./mediaViewModel");

function fixComponents(components, cb) {
  async.map(components, function (cmp, callback) {
    if (cmp.type == "text") {
      isoFieldView.reformatIsoField(cmp.text, function (text) {
        cmp.text = text;
        callback(null, cmp);
      });
    } else if (cmp.type == "paragraph") {
      isoFieldView.reformatIsoField(cmp.paragraph, function (text) {
        cmp.paragraph = text;
        callback(null, cmp);
      });
    }
  }, function (err, result) {
    cb(err, result);
  });
}

var textFunctions = {

  /*FRONTEND*/
  getByGroupArray: function (culture, groups, cb) {

    languageView.getLanguageByISO(culture, function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      } else {
        async.map(groups, function (g, callback) {
          db.Texts.findOne({
              group: g
            })
            .populate({
              path: "components.text",
              select: "value",
              match: {
                language: lang._doc._id
              }
            }).exec(function (err, texts) {
              callback(err, texts);
            });
        }, function (err, result) {
          if (err || !result) {
            cb(true, false);
          } else {
            var texts = {};
            for (var i = 0; i < result.length; i++) {
              if (result[i]) {
                for (var j = 0; j < result[i]._doc.components.length; j++) {
                  texts[result[i]._doc.components[j]._doc.id] = "";
                  if (result[i]._doc.components[j]._doc.text[0]) {
                    texts[result[i]._doc.components[j]._doc.id] = result[i]._doc.components[j]._doc.text[0]._doc.value;
                  } else {
                    texts[result[i]._doc.components[j]._doc.id] = "";
                  }
                }
              }
            }
            cb(false, texts);
          }
        });

      }
    });


  },
  getByGroup: function (culture, group, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      } else {
        db.Texts.findOne({
            group: group
          })
          .populate({
            path: "components.text",
            select: "value",
            match: {
              language: lang._doc._id
            },
          }).exec(function (err, texts) {
            var slogans = [];
            if (texts) {
              for (var i = 0; i < texts._doc.components.length; i++) {
                slogans.push(texts._doc.components[i]._doc.text[0]._doc.value);
              }
            }
            cb(err, slogans);
          });
      }
    });


  },
  /*BACKEND*/
  create: function (text, cb) {
    try {
      fixComponents(text.components, function (err, components) {
        if (err || !components) {
          cb(err, components);
        } else {
          async.map(components, function (cmp, callback) {
            if (cmp.type == "text") {
              isoFieldView.validateCreateIsoField(cmp.text, function (data) {
                if (data) {
                  callback(null, data);
                } else {
                  callback(true, data);
                }
              });
            } else if (cmp.type == "paragraph") {
              isoFieldView.validateCreateIsoField(cmp.paragraph, function (data) {
                if (data) {
                  callback(null, data);
                } else {
                  callback(true, data);
                }
              });
            }
          }, function (err, result) {
            if (err || !result) {
              cb(err, result);
            } else {
              async.map(components, function (cmp, callback) {
                if (cmp.type == "text") {
                  async.map(cmp.text, function (text, callbackm) {
                    isoFieldView.create(text._id, text.value, function (err, iso) {
                      callbackm(err, iso);
                    });

                  }, function (err, result) {
                    if (err || !result) {
                      callback(err, result);
                    } else {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                        array.push(result[i]._doc._id);
                      }
                      var aux = {
                        id: cmp.id,
                        type: cmp.type,
                        text: array,
                      };
                      callback(err, aux);
                    }
                  });
                } else if (cmp.type == "paragraph") {
                  async.map(cmp.paragraph, function (paragraph, callbackm) {
                    isoFieldView.create(paragraph._id, paragraph.value, function (err, iso) {
                      callbackm(err, iso);
                    });

                  }, function (err, result) {
                    if (err || !result) {
                      callback(err, result);
                    } else {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                        array.push(result[i]._doc._id);
                      }
                      var aux = {
                        id: cmp.id,
                        type: cmp.type,
                        text: array,
                      };
                      callback(err, aux);
                    }
                  });
                }
              }, function (err, result) {
                if (err || !result) {
                  cb(err, result);
                } else {
                  var textDB = db.Texts({
                    group: text.group,
                    components: result,
                    // view: text.view
                  });
                  textDB.save(function (err, item) {
                    cb(err, item);
                  });
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
  list: function (limit, skip, list, cb) {
    async.parallel([
      function (callback) {
        db.Texts.count().exec(function (err, count) {
          callback(err, count);
        });
      },
      function (callback) {
        db.Texts.find()
          .populate("components.text")
          .sort({
            _id: 1
          }).exec(function (err, data) {
            if (err || !data) {
              cb(err, data);
            } else {
              var array = [];
              for (var i = 0; i < data.length; i++) {
                var components = [];
                for (var j = 0; j < data[i].components.length; j++) {
                  if (data[i].components[j].type == "text") {
                    var aux = {
                      _id: data[i].components[j].id,
                      id: data[i].components[j].id,
                      type: data[i].components[j].type,
                      text: data[i].components[j].text,
                    };
                  } else if (data[i].components[j].type == "paragraph") {
                    var aux = {
                      _id: data[i].components[j].id,
                      id: data[i].components[j].id,
                      type: data[i].components[j].type,
                      paragraph: data[i].components[j].text,
                    };
                  }
                  components.push(aux);
                }
                var tmp = {
                  _id: data[i]._doc._id,
                  group: data[i]._doc.group,
                  components: components,
                  photos: data[i]._doc.photos,
                  // view: data[i]._doc.view
                };
                array.push(tmp);
              }
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
  remove: function (id, cb) {
    db.Texts.findOne({
      _id: id
    }).exec(function (err, text) {
      if (err || !text) {
        cb(err, text);
      } else {
        async.map(text._doc.components, function (cmp, callback) {
          async.map(cmp.text, function (text, callbackm) {
            isoFieldView.remove(text, function (err, iso) {
              callbackm(err, iso);
            });

          }, function (err, result) {
            callback(err, result);
          });
        }, function (err, result) {
          if (err || !result) {
            cb(err, result);
          } else {
            db.Texts.remove({
              _id: id
            }).exec(function (err, success) {
              cb(err, success);
            });
          }
        });
      }
    });
  },
  update: function (text, cb) {
    try {
      this.remove(text._id, function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          textFunctions.create(text, function (err, p) {
            cb(err, p);
          });
        }
      });
    } catch (err) {
      cb(err, false);
    }
  },
  addPhotos: function (id, identification, file, cb) {
    if (id.length && identification.length && file) {
      db.Texts.findOne({
        _id: id
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
          if (success.photos.length < 20) {
            mediaViewModel.create(file, function (err, medias) {
              if (err) {
                cb(err, medias);
              } else {
                try {
                  var aux = {
                    id: identification,
                    media: medias._doc._id
                  };
                  db.Texts.findByIdAndUpdate({
                      _id: id
                    }, {
                      $push: {
                        photos: aux
                      }
                    }, {
                      new: true
                    })
                    .populate("components.text")
                    .exec(function (err, success) {
                      cb(err, success);
                    });
                } catch (error) {
                  cb(error, false);
                }
              }

            });
          } else {
            var error = {
              message: "Máximo Requerido (20 Fotos)"
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
  delPhotos: function (id, photo, cb) {
    if (id && photo) {
      db.Texts.findOne({
        _id: id
      }).exec(function (err, success) {
        if (err || !success) {
          cb(err, success);
        } else {
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

                db.Texts.findByIdAndUpdate({
                    _id: id
                  }, {
                    $set: {
                      photos: newArray
                    }
                  }, {
                    new: true
                  })
                  .populate("components.text")
                  .exec(function (err, success) {
                    cb(err, success);
                  });
              } catch (error) {
                cb(error, false);
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
  getAdminText: function (user, group, cb) {
    languageView.getLanguageByISO(user.language.iso, function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      } else {
        db.Texts.findOne({
            group: group
          })
          .populate({
            path: "components.text",
            select: "value",
            match: {
              language: lang._doc._id
            },
          }).exec(function (err, texts) {
            if (err || !texts) {
              cb(err, texts);
            } else {
              var obj = {};
              for (var i = 0; i < texts._doc.components.length; i++) {
                obj[texts._doc.components[i].id] = "";
                if (texts._doc.components[i]._doc.text.length)
                  obj[texts._doc.components[i].id] = texts._doc.components[i]._doc.text[0]._doc.value;
              }
              cb(err, obj);
            }

          });
      }
    });
  },
  getGroupText: function (group, cb) {
    db.Texts.findOne({
        group: group
      })
      .populate("components.text").exec(function (err, text) {
        if (err || !text) {
          cb(err, text);
        } else {
          var components = [];
          for (var j = 0; j < text.components.length; j++) {
            if (text.components[j].type == "text") {
              var aux = {
                _id: text.components[j].id,
                id: text.components[j].id,
                type: text.components[j].type,
                text: text.components[j].text || text.components[j].id
              };
            } else if (text.components[j].type == "paragraph") {
              var aux = {
                _id: text.components[j].id,
                id: text.components[j].id,
                type: text.components[j].type,
                paragraph: text.components[j].text || text.components[j].id
              };
            }
            components.push(aux);
          }
          var tmp = {
            _id: text._doc._id,
            group: text._doc.group,
            components: components,
            photos: text._doc.photos,
            // view: text._doc.view,
            pos: text._doc.pos,
            last: text._doc.last
          };
          cb(null, tmp);
        }

      });
  },
  menu: function (id, action, cb) {
    db.Texts.findOne({
      _id: id
    }).exec(function (err, txt) {
      if (err || !txt) {
        cb(err, txt);
      } else {
        if (action == "ban") {
          db.Texts.update({
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
              db.Texts.find({
                pos: {
                  $ne: null
                }
              }).sort({
                pos: "asc"
              }).exec(function (err, texts) {
                var cont = 0;
                async.mapSeries(texts, function (text, cbm) {
                  var last = false;
                  if (cont == (texts.length - 1)) {
                    last = true;
                  }
                  db.Texts.update({
                    _id: text._doc._id.toString()
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
              var last = txt.last;
              db.Texts.update({
                _id: id
              }, {
                $set: {
                  pos: (txt.pos - 1),
                  last: false
                }
              }).exec(function (err) {
                cbp(err, last);
              });
            },
            function (last, cbp) {
              db.Texts.update({
                _id: {
                  $ne: id
                },
                pos: (txt.pos - 1)
              }, {
                $set: {
                  pos: txt.pos,
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
              db.Texts.findOne({
                _id: {
                  $ne: id
                },
                pos: (txt.pos + 1)
              }).exec(function (err, obj) {
                if (err) {
                  cbp(err, null);
                } else {
                  var last = obj.last;
                  db.Texts.update({
                    _id: {
                      $ne: id
                    },
                    pos: (txt.pos + 1),
                  }, {
                    $set: {
                      pos: txt.pos,
                      last: false
                    }
                  }).exec(function (err) {
                    cbp(err, last);
                  });
                }

              });
            },
            function (last, cbp) {
              db.Texts.update({
                _id: id
              }, {
                $set: {
                  pos: (txt.pos + 1),
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
          db.Texts.find({
            pos: {
              $ne: null
            }
          }).sort({
            pos: "asc"
          }).exec(function (err, texts) {
            if (!texts.length) {
              db.Texts.update({
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
              async.mapSeries(texts, function (text, cbm) {
                db.Texts.update({
                  _id: text._doc._id.toString()
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
                  db.Texts.update({
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
  listMenu: function (culture, cb) {
    languageView.getLanguageByISO(culture, function (err, lang) {
      if (lang) {
        db.Texts.find({
            pos: {
              $ne: null
            }
          }).populate({
            path: "components.text",
            select: "value",
            match: {
              language: lang._doc._id
            },
          }).sort({
            pos: "asc"
          })
          .exec(function (err, data) {
            if (err || !data) {
              cb(err, data);
            } else {
              var array = [];
              var aux;
              for (var i = 0; i < data.length; i++) {
                var components = [];
                for (var j = 0; j < data[i].components.length; j++) {
                  if (data[i].components[j].type == "text") {
                    aux = {
                      _id: data[i].components[j].id,
                      id: data[i].components[j].id,
                      type: data[i].components[j].type,
                      text: data[i].components[j].text,
                    };
                  } else if (data[i].components[j].type == "paragraph") {
                    aux = {
                      _id: data[i].components[j].id,
                      id: data[i].components[j].id,
                      type: data[i].components[j].type,
                      paragraph: data[i].components[j].text,
                    };
                  }
                  components.push(aux);
                }
                var pos = null;
                for (var k = 0; k < components.length; k++) {
                  if (components[k].id.indexOf("title") >= 0 && components[k].id.indexOf("title_meta") < 0) {
                    pos = k;
                    break;
                  }
                }
                var items = components.splice(pos, 1);
                // if (items[0].paragraph && items[0].paragraph[0].value) {
                //   items[0].paragraph[0].value = items[0].paragraph[0].value.replace("<p><strong>", "");
                //   items[0].paragraph[0].value = items[0].paragraph[0].value.replace("</strong></p>", "");
                // }
                for (var j = 0; j < components.length; j++) {
                  items.push(components[j]);
                }
                var tmp = {
                  pos: data[i].pos,
                  last: data[i].last,
                  _id: data[i]._doc._id,
                  group: data[i]._doc.group,
                  components: items,
                  photos: data[i]._doc.photos,
                  // view: data[i]._doc.view
                };
                array.push(tmp);
              }

              async.map(array, function (text, cbm) {
                var slugId = null;
                switch (text.group) {
                  case "user-guide":
                    slugId = "slug_user_guide";
                    break;
                  case "sailor-guide":
                    slugId = "slug_sailor_guide";
                    break;
                  case "about-us":
                    slugId = "slug_about";
                    break;
                  case "service-conditions":
                    slugId = "slug_conditions";
                    break;
                  case "frequently-questions":
                    slugId = "slug_frequently_questions";
                    break;
                  default:
                    slugId = "slug_privacy";
                    break;
                }
                db.Texts.findOne({
                  group: "slugs",
                  // view: true
                }).populate({
                  path: "components.text",
                  select: "value",
                  match: {
                    language: lang._doc._id
                  },
                }).exec(function (err, slugs) {
                  if (err) {
                    cbm(err, null);
                  } {
                    for (var i = 0; i < slugs.components.length; i++) {
                      if (slugs.components[i].id == slugId) {
                        text.slug = slugs.components[i].text[0].value;
                        break;
                      }
                    }
                    cbm(null, text);
                  }
                });
              }, function (err, result) {
                cb(null, result);
              });
            }
          });
      } else {
        cb(err, false);
      }
    });
  },
};

module.exports = textFunctions;