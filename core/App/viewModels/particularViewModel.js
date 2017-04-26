/**
 * Created by Ernesto on 5/10/2016.
 */

var async = require('async');

var notificationViewModel = require('./notificationViewModel');

var validator = require('validator');
var validateObject = function (object) {
    if (!validator.isLength(object.name, 2, 30)) {
        console.log(11);
        return false;
    }
    if (!validator.isLength(object.specifications, 2, 300)) {
        console.log(11);
        return false;
    }
    if (!validator.isLength(object.detail, 2, 300)) {
        console.log(11);
        return false;
    }
    object.dimension = validator.toFloat(object.dimension);
    if (object.dimension > 400 || object.dimension < 0) {
        console.log(6);
        return false;
    }
    if (!validator.isLength(object.area, 2, 50)) {
        console.log(11);
        return false;
    }
    if (!validator.isEmail(object.email)) {
        console.log(1);
        return false;
    }
    if (!validator.isLength(object.mobile, 6, 15)) {
        console.log(11);
        return false;
    }
    return true;
}


var particularFunctions = {
    /*BACKEND*/
    create: function (particular, cb) {

        try {
            if (validateObject(particular)) {
                var value = particular;
                var part = db.Particulars({
                    name: value.name,
                    specifications: value.specifications,
                    detail: value.detail,
                    dimension: value.dimension,
                    area: value.area,
                    email: value.email,
                    telephone: value.telephone,
                    mobile: value.mobile
                });

                part.save(function (err, user) {
                    if (err || !user) {
                        cb(err, user);
                    } else {
                        cb(err, user);
                        notificationViewModel.sendMailParticular("5669b342ef0fa2841b956b38", user, function (err, success) {
                            console.log(err, success);
                        });
                    }
                });
            } else {
                var error = {
                    message: "Lo sentimos!. Formulario incorrecto."
                };
                cb(error, null);
            }


        } catch (err) {
            cb(err, false);
        }
    },
    list: function (limit, skip, string, sortOptions, cb) {
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
                    email: word
                }, {
                    area: word
                }]
            };
        }
        async.parallel([
            function (callback) {
                db.Particulars.count(query).exec(function (err, count) {
                    callback(err, count);
                });

            },
            function (callback) {
                db.Languages.findOne({
                    iso: 'es'
                }).exec(function (err, lang) {
                    db.Particulars.find(query)
                        .sort(sortAux)
                        .populate('specifications')
                        .limit(limit).skip(skip).exec(function (err, data) {
                            if (err || !data) {
                                cb(err, false)
                            } else {
                                async.map(data, function (item, cbmap) {
                                    item = JSON.parse(JSON.stringify(item));
                                    db.shipTypes.findOne({
                                            _id: item.specifications
                                        })
                                        .select('name')
                                        .populate({
                                            path: 'name',
                                            select: 'value',
                                            match: {
                                                language: lang._doc._id
                                            }
                                        }).exec(function (err, type) {
                                            item.specifications = type;
                                            cbmap(err, item);
                                        })
                                }, function (err, resultsM) {
                                    callback(err, resultsM);
                                })
                            }

                        });
                })
            }
        ], function (err, results) {
            if (err || !results) {
                cb(err, null, 0);
            } else {
                cb(null, results[1], results[0]);
            }
        });
    },

    status: function (id, cb) {
        db.Particulars.findOne({
            _id: id
        }).exec(function (err, part) {
            if (err || !part) {
                cb(err, part);
            } else {
                db.Particulars.update({
                    _id: part._doc._id
                }, {
                    $set: {
                        status: !part._doc.status
                    }
                }).exec(function (err, success) {
                    cb(err, success);
                })
            }
        });
    },
    remove: function (id, cb) {
        db.Particulars.remove({
            _id: id
        }).exec(function (err, part) {
            if (err || !part) {
                cb(err, false);
            } else {
                cb(false, part);
            }

        });
    }
};

module.exports = particularFunctions;