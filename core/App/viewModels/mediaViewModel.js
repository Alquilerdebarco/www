/**
 * Created by ernestomr87@gmail.com on 14/04/2015.
 */


var async = require('async');
var fs = require('fs-extra');
var _ = require('lodash');


var mediaFunctions = {
    createAvatar: function (file, cb) {

        var string = file.data.replace("data:image/png;base64,", "");
        var buffer = new Buffer(string, 'base64');

        var media = new db.Medias({
            data: buffer,
            contentType: file.contentType,
            fieldName: file.fieldName,
            name: file.name
        });

        media.save(function (err, a) {
            cb(err, a);
        });
    },

    create: function (file, cb) {

        // var string = file.data.replace("data:image/png;base64,", "");
        // var buffer = new Buffer(string, 'base64');

        var media = new db.Medias({
            data: file.data,
            contentType: file.contentType,
            fieldName: file.fieldName,
            name: file.name
        });

        media.save(function (err, a) {
            cb(err, a);
        });
    },
    get: function (id, cb) {
        db.Medias.findOne({_id: id}, function (err, success) {
            cb(err, success);
        })
    },
    remove: function (id, cb) {
        db.Medias.remove({_id: id}, function (err, success) {
            cb(err, success);
        });
    }

};

module.exports = mediaFunctions;
