/**
 * Created by Ernesto on 5/10/2016.
 */

var PATH = '/service/particular';
var session = require('./../../middlewares/session');
var particularViewModel = require('./../viewModels/particularViewModel');


var particular = {
    registerRoutes: function (app) {
        app.post(PATH, this.create);
        app.get(PATH, this.list);
        app.post(PATH + '/status', this.status);
        app.delete(PATH, this.remove);
    },
    create: function (req, res) {
        var particular = JSON.parse(req.body.particular);
        particularViewModel.create(particular, function (err, success) {
            if (err || !success) {
                return res.json({
                    res: false,
                    error: err
                });
            } else {
                return res.json({
                    res: true,
                    error: err
                });
            }
        })

    },
    list: function (req, res) {
        var limit = parseInt(req.query.limit);
        var skip = parseInt(req.query.skip);
        var string = req.query.string;
        var sortOptions = req.query.sortOptions ? JSON.parse(req.query.sortOptions) : null;

        particularViewModel.list(limit, skip, string,sortOptions, function (err, success, count) {
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
    status: function (req, res) {
        var id = req.body.id;
        particularViewModel.status(id, function (err, success) {
            if (err || !success) {
                return res.json({
                    res: false,
                    error: err
                });
            } else {
                return res.json({
                    res: true,
                    error: err
                });
            }
        })

    },
    remove: function (req, res) {
        var id = req.query.id;
        particularViewModel.remove(id, function (err, success) {
            if (err || !success) {
                return res.json({
                    res: false,
                    error: err
                });
            } else {
                return res.json({
                    res: true,
                    error: err
                });
            }
        })
    }
};

module.exports = particular;