/**
 * Created by Ernesto on 12/13/2016.
 */
var fs = require("fs-extra");
var async = require("async");
var mediaViewModel = require("./mediaViewModel");

var pageMediaFunctions = {
  addPhotos: function (page, files, cb) {

    var file = files.file;
    global.page = page;

    db.pageMedias.findOne({
      page: page
    }).exec(function (err, page) {
      if (err) {
        cb(err, page);
      } else {
        if (page) {
          if (page.photos.length < 4) {
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
                  db.pageMedias.update({
                    page: global.page
                  }, {
                    $push: {
                      photos: medias._doc._id
                    },
                  }).exec(function (err, success) {
                    delete global.page;
                    cb(err, success);
                  });

                }
              });
            });

          } else {
            var error = {
              message: "Máximo Requerido (4 Fotos)"
            };
            cb(error, null);
          }
        }
        else {
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
                var pageM = new db.pageMedias({
                  page: global.page,
                  photos: [medias._doc._id]
                });
                pageM.save(function (err, success) {
                  delete global.page;
                  cb(err, success);
                });
              }
            });
          });
        }
      }
    }
        );
  },
  getPhotos: function (page, cb) {
    db.pageMedias.findOne({
      page: page
    }).exec(function (err, pageM) {
      cb(err, pageM);
    });
  },
  removePhoto: function (id, cb) {
    async.waterfall([
      function (cbw) {
        db.Medias.findByIdAndRemove(id).exec(function (err, obj) {
          cbw(err, obj);
        });
      },
      function (obj, cbw) {
        db.pageMedias.findOne({photos: id}).exec(function (err, pMedia) {
          if (err) {
            cbw(err, pMedia);
          }
          else {
            var array = [];
            for (var i = 0; i < pMedia._doc.photos.length; i++) {
              if (pMedia._doc.photos[i].toString() != obj._doc._id.toString()) {
                array.push(pMedia._doc.photos[i]);
              }
            }
            db.pageMedias.update({photos: id}, {photos: array}).exec(function (err, obj) {
              delete global.page;
              cbw(err, obj);
            });

          }
        });
      }
    ], function (err, response) {
      cb(err, response);
    });
  }
};
module.exports = pageMediaFunctions;