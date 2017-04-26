/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

var validator = require("./../../middlewares/validations");
var async = require("async");
var isoFieldView = require("./IsoFieldViewModel");

var languageFunctions = {

  create: function (iso, name, status, def, cb) {

    var validateIso = validator.textValidate(iso, 2, 1, "alphanumeric");
    var validateName = validator.textValidate(name, 2, 1, "alphanumeric");

    if (!validateIso) {
      cb(validateIso[0], false);
      return;
    }
    if (!validateName) {
      cb(validateName[0], false);
      return;
    }

    iso = iso.toLowerCase();
    name = name.toLowerCase();

    var lang = new db.Languages({
      iso: iso,
      name: name,
      default: def,
      status: status
    });

    lang.save(function (err, lang) {
      cb(err, lang);
    });
  },
  update: function (id, iso, name, cb) {
    var validateId = validator.textValidate(id, 24, 1, "alphanumeric");
    var validateIso = validator.textValidate(iso, 2, 1, "alphanumeric");
    var validateName = validator.textValidate(name, 2, 1, "alphanumeric");

    if (!validateId) {
      cb(validateId[0], false);
      return;
    }
    if (!validateIso) {
      cb(validateIso[0], false);
      return;
    }
    if (!validateName) {
      cb(validateName[0], false);
      return;
    }

    iso = iso.toLowerCase();
    name = name.toLowerCase();


    var query = {_id: id};
    db.Languages.update(query, {name: name, iso: iso}, function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      }
      else {
        db.Languages.findOne(query, function (err, lang) {
          cb(err, lang);
        });
      }

    });

  },
  list: function (limit, skip, remove, cb) {
    async.parallel([
      function (callback) {
        db.Languages.count({remove: false}).exec(function (err, count) {
          callback(err, count);
        });
      },
      function (callback) {
        db.Languages.count({remove: true}).exec(function (err, count) {
          callback(err, count);
        });
      },
      function (callback) {
        db.Languages.find({remove: remove}).sort({ pos: "asc",_id: 1 }).limit(limit).skip(skip).exec(function (err, data) {
          callback(err, data);
        });
      }
    ], function (err, results) {
      if (err || !results) {
        cb(err, null, 0);
      } else {
        cb(null, results[2], results[0], results[1]);
      }
    });
  },
  listFront: function (cb) {
    db.Languages.find({
      pos: {
        $ne: null
      },
      remove: false,
      status:true
    })
    .sort({ pos: "asc",_id: 1 })
    .exec(function (err, langs) {
      cb(err, langs);
    });
  },
  status: function (id, cb) {
    var validateId = validator.textValidate(id, 24, 1, "alphanumeric");

    if (!validateId) {
      cb(validateId[0], false);
      return;
    }

    async.waterfall([
      function (cbs) {
        db.Languages.findOne({_id: id, remove: false}).exec(function (err, lang) {
          cbs(err, lang);
        });
      },
      function (lang, cbs) {
        db.Languages.update({_id: id}, {$set: {status: !lang.status}}).exec(function (err, success) {
          cbs(err, success);
        });
      }
    ], function (err, result) {
      cb(err, result);
    });
  },
  toTrash: function (id, cb) {
    var validateId = validator.textValidate(id, 24, 1, "alphanumeric");

    if (!validateId) {
      cb(validateId[0], false);
      return;
    }
    db.Languages.update({_id: id, default: false}, {
      $set: {
        remove: true,
        status: false
      }
    }).exec(function (err, success) {
      cb(err, success);
    });
  },
  toRestore: function (id, cb) {
    var validateId = validator.textValidate(id, 24, 1, "alphanumeric");

    if (!validateId) {
      cb(validateId[0], false);
      return;
    }
    db.Languages.update({_id: id}, {$set: {remove: false}}).exec(function (err, success) {
      cb(err, success);
    });
  },
  remove: function (id, cb) {
    var validateId = validator.textValidate(id, 24, 1, "alphanumeric");

    if (!validateId) {
      cb(validateId[0], false);
      return;
    }
    isoFieldView.getByLanguage(id, function (err, isf) {
      if(err || !isf){
        cb(err,false);
      }else{
        async.map(isf, function (f, callback) {
          isoFieldView.remove(f._doc._id, function (err, success) {
            callback(err,success);
          });
        }, function (err, results) {
          if(err || !results){
            cb(err,false);
          }else{
            db.Languages.remove({_id: id, default: false}).exec(function (err, success) {
              cb(err, success);
            });
          }
        });
      }
    });

  },
  listActivates: function (cb) {
    db.Languages.find({status: true}).exec(function (err, langs) {
      cb(err, langs);
    });
  },
  default:function(cb){
    db.Languages.findOne({default:true}).exec(function(err, lang){
      cb(err, lang);
    });
  },
  exist:function(lang,cb){
    db.Languages.findOne({iso:lang}).exec(function(err, lang){
      cb(err, lang);
    });
  },
  getLanguageByISO: function (iso, cb) {
    try {
      db.Languages.findOne({remove: false,status:true, iso: iso}).exec(function (err, language) {
        cb(err, language);
      });
    }
    catch (err) {
      cb(err, null);
    }
  },
  menu: function (id, action, cb) {
    db.Languages.findOne({
      _id: id
    }).exec(function (err, lang) {
      if (err || !lang) {
        cb(err, lang);
      } else {
        if (action == "ban") {
          db.Languages.update({
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
              db.Languages.find({
                pos: {
                  $ne: null
                }
              }).sort({
                pos: "asc"
              }).exec(function (err, languages) {
                var cont = 0;
                async.mapSeries(languages, function (language, cbm) {
                  var last = false;
                  if (cont == (languages.length - 1)) {
                    last = true;
                  }
                  db.Languages.update({
                    _id: language._doc._id.toString()
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
              var last = lang.last;
              db.Languages.update({
                _id: id
              }, {
                $set: {
                  pos: (lang.pos - 1),
                  last: false
                }
              }).exec(function (err) {
                cbp(err, last);
              });
            },
            function (last, cbp) {
              db.Languages.update({
                _id: {
                  $ne: id
                },
                pos: (lang.pos - 1)
              }, {
                $set: {
                  pos: lang.pos,
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
              db.Languages.findOne({
                _id: {
                  $ne: id
                },
                pos: (lang.pos + 1)
              }).exec(function (err, obj) {
                if (err) {
                  cbp(err, null);
                } else {
                  var last = obj.last;
                  db.Languages.update({
                    _id: {
                      $ne: id
                    },
                    pos: (lang.pos + 1),
                  }, {
                    $set: {
                      pos: lang.pos,
                      last: false
                    }
                  }).exec(function (err) {
                    cbp(err, last);
                  });
                }
              });
            },
            function (last, cbp) {
              db.Languages.update({
                _id: id
              }, {
                $set: {
                  pos: (lang.pos + 1),
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
          db.Languages.find({
            pos: {
              $ne: null
            }
          }).sort({
            pos: "asc"
          }).exec(function (err, languages) {
            if (!languages.length) {
              db.Languages.update({
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
              async.mapSeries(languages, function (langs, cbm) {
                db.Languages.update({
                  _id: lang._doc._id.toString()
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
                  db.Languages.update({
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
};
module.exports = languageFunctions;