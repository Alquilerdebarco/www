/**
 * Created by ernestomr87@gmail.com on 3/11/2016.
 */

var async = require('async');
var uuid = require('node-uuid');
var notificationViewModel = require('./notificationViewModel');

function validateEmail(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email)) {
        return false;
    } else {
        return true;
    }
}

var subscriptionFunctions = {

    create: function (iso, email, cb) {
        if (validateEmail(email)) {
            db.Languages.findOne({
                iso: iso
            }).exec(function (err, lang) {
                if (err || !lang) {
                    cb(err, lang);
                } else {

                    var sus = db.Subscriptions({
                        token: uuid.v4(),
                        email: email,
                        language: lang._doc._id
                    });

                    sus.save(function (err, subscript) {
                        if (err || !subscript) {
                            cb(err, subscript);
                        } else {
                            notificationViewModel.sendMailSubscription(subscript.language, subscript, function (err, success) {
                                cb(err, success);
                            })
                        }
                    });
                }
            })
        } else {
            var error = {
                message: "Email Incorrecto"
            };
            cb(error, null);
        }
    },
    update: function (token, name, lastname, cb) {
        db.Subscriptions.update({
            token: token
        }, {
            name: name,
            lastname: lastname
        }, function (err, susc) {
            if (err || !susc) {
                cb(err, false);
            } else {
                cb(false, susc);
            }
        })
    },
    list: function (limit, skip, string, remove, sortOptions, cb) {
        var sortAux = {
            _id: 1
        };
        if (sortOptions) {
            sortAux = {};
            sortAux[sortOptions.field] = sortOptions.sort;
        }
        var query = {};
        if (string.length) {
            var word = new RegExp(string, 'i');
            query = {
                $or: [{
                    name: word
                }, {
                    surname: word
                }, {
                    email: word
                }]
            };
        }
        if (remove !=null) {
            query['remove'] = remove;
        }
        async.parallel([
            function (callback) {
                db.Subscriptions.count(query).exec(function (err, count) {
                    callback(err, count);
                });

            },
            function (callback) {
                db.Subscriptions.find(query)
                    .sort(sortAux)
                    .limit(limit).skip(skip).exec(function (err, data) {
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
    },
    removeSusc: function (token, reason, text, email, cb) {
        db.Subscriptions.update({
            token: token
        }, {
            remove: true,
            reason: reason,
            text: text,
            email: email + "," + uuid.v4()
        }, function (err, succes) {
            cb(err, succes);
        });
    },
    removeComplete: function (id, cb) {
        db.Subscriptions.remove({
            _id: id
        }).exec(function (err, succes) {
            cb(err, succes);
        });
    },
    remove: function (id, reason, email, cb) {
        db.Subscriptions.update({
            _id: id
        }, {
            remove: true,
            reason: reason,
            text: "",
            email: email + "," + uuid.v4()
        }).exec(function (err, succes) {
            cb(err, succes);
        });
    },
    toggle: function (id, reason, email, remove, cb) {
        db.Subscriptions.update({
            _id: id
        }, {
            remove: !remove,
            reason: remove ? '0' : reason,
            text: "",
            email: email + "," + uuid.v4()
        }).exec(function (err, succes) {
            cb(err, succes);
        });
    },
    getbyToken: function (token, cb) {
        db.Subscriptions.findOne({
            token: token,
            remove: false
        }).exec(function (err, susc) {
            if (err || !susc) {
                cb(err, false);
            } else {
                cb(false, susc);
            }
        })
    }
};

module.exports = subscriptionFunctions;