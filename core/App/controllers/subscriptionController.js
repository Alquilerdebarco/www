/**
 * Created by ernestomr87@gmail.com on 3/11/2016.
 */

var PATH = '/service/subscriptions';
var server;
//var session = require('./../../middlewares/session');
var subscriptionViewModel = require('./../viewModels/subscriptionViewModel');
var _ = require('lodash');


var subscription = {
    registerRoutes: function (app) {
        server = app;
        app.post(PATH, this.create);
        app.delete(PATH, this.remove);
        app.post(PATH + '/remove', this.removeComplete);
        app.get(PATH, this.list);
        app.put(PATH + '/update', this.update);
        app.delete(PATH + '/newsletter', this.removeFront);
        app.post(PATH + '/toggle', this.toggle);
    },
    create: function (req, res) {
        var email = req.body.email;
        var iso = req.session.lang || 'es';
        subscriptionViewModel.create(iso, email, function (err, success) {
            if (err || !success) {
                res.json({
                    res: success,
                    error: err
                });
            } else {
                res.json({
                    res: true,
                    error: err
                });
            }
        });
    },
    update: function (req, res) {
        var name = req.body.name;
        var lastname = req.body.lastname;
        var token = req.body.token;
        if (!_.isEmpty(name) || !_.isEmpty(lastname) || !_.isEmpty(token)) {
            subscriptionViewModel.update(token, name, lastname, function (err, susc) {
                if (err || !susc) {
                    return res.json({
                        res: false,
                        error: err
                    });
                } else {
                    return res.json({
                        res: susc,
                        error: false
                    });
                }

            })
        } else {
            return res.json({
                res: false,
                error: 'Invalid form'
            });
        }
    },
    list: function (req, res) {
        var limit = parseInt(req.query.limit);
        var skip = parseInt(req.query.skip);
        var string = req.query.string;
        var sortOptions = req.query.sortOptions ? JSON.parse(req.query.sortOptions) : null;

        var remove = eval(req.query.remove) || null;
        subscriptionViewModel.list(limit, skip, string, remove, sortOptions, function (err, success, count) {
            if (err || !success) {
                return res.json({
                    res: false,
                    error: err
                });
            } else {
                return res.json({
                    res: success,
                    cont: count
                });
            }
        })
    },
    remove: function (req, res) {
        var id = req.query.id;
        var reason = req.query.reason;
        var email = req.query.email;
        if (!_.isEmpty(id) || !_.isEmpty(reason) || !_.isEmpty(email)) {
            subscriptionViewModel.remove(id, reason, email, function (err, msgs) {
                return res.json({
                    res: msgs,
                    error: err
                });
            });
        } else {
            return res.json({
                res: false,
                error: 'Invalid form'
            });
        }
    },
    toggle: function (req, res) {
        var id = req.body.id;
        var reason = req.body.reason;
        var email = req.body.email;
        var remove = req.body.remove;
        if (!_.isEmpty(id) || !_.isEmpty(reason) || !_.isEmpty(email)) {
            subscriptionViewModel.toggle(id, reason, email, remove, function (err, msgs) {
                return res.json({
                    res: msgs,
                    error: err
                });
            });
        } else {
            return res.json({
                res: false,
                error: 'Invalid form'
            });
        }
    },
    removeComplete: function (req, res) {
        var id = req.body.id;
        if (!_.isEmpty(id)) {
            subscriptionViewModel.removeComplete(id, function (err, msgs) {
                return res.json({
                    res: msgs,
                    error: err
                });
            });
        } else {
            return res.json({
                res: false,
                error: 'Invalid form'
            });
        }
    },
    removeFront: function (req, res) {
        var token = req.body.token;
        var reason = req.body.reason;
        var email = req.body.email;
        var text = req.body.text;
        if (!_.isEmpty(token) || !_.isEmpty(reason) || !_.isEmpty(email)) {
            subscriptionViewModel.removeSusc(token, reason, text, email, function (err, success) {
                if (err || !success) {
                    return res.json({
                        res: false,
                        error: err
                    });
                } else {
                    return res.json({
                        res: true,
                        error: false
                    });
                }
            })
        } else {
            return res.json({
                res: false,
                error: 'Invalid form'
            });
        }
    }
};

module.exports = subscription;