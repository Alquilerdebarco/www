/**
 * Created by ernestomr87@gmail.com on22/07/2015.
 */

var async = require("async");
var lenguageView = require("./languageViewModel");
var _ = require("lodash");


var isoFieldFunctions = {


  create: function (language, value, cb) {
    var isoFieldBD = db.IsoFields({
      language: language,
      value: value
    });
    isoFieldBD.save(function (err, isoField) {
      if (err || !isoField) {
        cb(err, isoField);
      }
      else {
        cb(null, isoField);
      }
    });
  },

  get: function (id, cb) {
    db.IsoFields.findOne({_id: id, remove: false}).exec(function (err, field) {
      cb(err, field);
    });
  },

  remove: function (id, cb) {
    db.IsoFields.remove({_id: id}, function (err, success) {
      if (err || !success) {
        if (success == 0) {
          var error = {
            message: "Inalterado"
          };
          cb(error, null);
        }
        else {
          cb(err, null);
        }
      }
      else {
        cb(null, success);
      }
    });
  },

  update: function (id, language, value, cb) {
    db.IsoFields.update({_id: id}, {
      $set: {
        language: language,
        value: value
      }
    }, function (err, success) {
      if (err || !success) {
        cb(err, null);
      }
      else {
        cb(null, success);
      }
    });
  },

  cont: function (cb) {
    db.IsoFields.count({remove: false}, function (err, cont) {
      cb(err, cont);
    });
  },

  validateCreateIsoField: function (object, cb) {
    try {
      var lenguageView = require("./languageViewModel");
      lenguageView.listActivates(function (err, langs) {
        if (err || !langs) {
          cb(false);
        }
        else {
          var goOne = true;
          for (var i = 0; i < langs.length; i++) {
            var exist = false;
            for (var j = 0; j < object.length; j++) {
              if (langs[i]._doc.status) {
                if (langs[i]._doc._id.toString() == object[j]._id) {
                  if (_.isEmpty(object[j].value)) {
                    goOne = false;
                    break;
                  }
                  else {
                    exist = true;
                  }
                }
              }
              else {
                exist = true;
              }

            }
            if (!exist)  goOne = false;
            if (!goOne) break;
          }
          cb(goOne);
        }
      }
            );
    }
        catch (err) {
          cb(false);
        }

  },

  validateUpdateIsoField: function (object, cb) {
    var lenguageView = require("./languageViewModel");
    lenguageView.listActivates(function (err, langs) {
      if (err || !langs) {
        cb(false);
      }
      else {
        var goOne = true;
        for (var i = 0; i < langs.length; i++) {
          var exist = false;

          for (var j = 0; j < object.length; j++) {
            var item = object[j].language || object[j]._id;

            if (langs[i]._doc.status) {
              if (langs[i]._doc._id.toString() == item) {
                if (_.isEmpty(object[j].value)) {
                  goOne = false;
                  break;
                }
                else {
                  exist = true;
                }
              }
            }
            else {
              exist = true;
            }
          }
          if (!exist)  goOne = false;
          if (!goOne) break;
        }
        cb(goOne);
      }
    }
        );
  },

  reformatIsoField: function (object, cb) {
    var lenguageView = require("./languageViewModel");
    lenguageView.listActivates(function (err, langs) {
      if (err || !langs) {
        cb(false);
      }
      else {
        var array = [];
        if (object.length > langs.length) {
          for (var i = 0; i < object.length; i++) {
            var exist = false;
            for (var j = 0; j < langs.length; j++) {
              if (langs[j]._doc._id.toString() == object[i]._id) {
                exist = true;
                break;
              }
            }
            if (exist) {
              array.push(object[i]);
            }
          }
          cb(array);
        }
        else {
          cb(object);
        }

      }
    }
        );


  },

  getByLanguage: function (lang,cb) {
    try {
      db.IsoFields.find({language:lang}).exec(function (err, isofields) {
        cb(err,isofields);
      });
    }catch (e){
      cb(e,false);
    }
  },

  getByDefaultLanguage: function (cb) {
    lenguageView.default(function (lang) {
      db.IsoFields.find({language:lang._doc._id}).exec(function (err, fields) {
        cb(err,fields);
      });
    });
  }
};

module.exports = isoFieldFunctions;