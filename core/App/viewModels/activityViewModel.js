/**
 * Created by ernestomr87@gmail.comon 3/21/2016.
 */

var async = require('async');
var _ = require('lodash');
var functions = require('./../utils/functions');

var activityFunctions = {

    create: function (entity, action, object, user, cb) {
        var user = user._id || user;
        var activity = new db.Activities({
            user: user,
            entity: entity,
            action: action,
            object: object,
            date: functions.dateToUtc(new Date())
        });

        activity.save(function (err, success) {
            cb(err, success);
        });
    },
    list: function (limit, skip, user, cb) {
        var query = {user: user._id};
        if (!user.permissions.isAdmin && !user.permissions.isShipOwner) {
            query = {user: user._id, entity: {$ne: 'request'}}
        }
        if (user.permissions.isAdmin) {
            query = {};
        }


        async.parallel([
            function (callback) {
                db.Activities.count(query).exec(function (err, count) {
                    callback(err, count);
                });
            },
            function (callback) {
                db.Activities.find(query)
                    .sort({date: -1}).limit(limit).skip(skip)
                    .populate({
                        path: 'user',
                        select: 'name surname'
                    })
                    .exec(function (err, data) {
                        callback(err, data);
                    });
            }
        ], function (err, results) {
            if (err || !results) {
                cb(err, null, 0);
            } else {
                cb(null, results[1], results[0]);
            }
        });
    }
};

module.exports = activityFunctions;
