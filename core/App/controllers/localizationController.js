/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

var localizationViewModel = require('./../viewModels/localizationViewModel');
var PATH = '/service/localization';
var session = require('./../../middlewares/session');

var localization = {
    registerRoutes: function (app) {
        app.get(PATH, this.listLocalization);

        app.post(PATH + '/country', session.isAdmin, this.createCountry);
        app.put(PATH + '/country', session.isAdmin, this.updateCountry);
        app.get(PATH + '/country', session.isAdmin, this.listCounties);
        app.delete(PATH + '/country', session.isAdmin, this.removeCountry);
        app.get(PATH +'/countryFront', this.countryFront);

        app.post(PATH + '/city', session.isAdmin, this.createCity);
        app.put(PATH + '/city', session.isAdmin, this.updateCity);
        app.get(PATH + '/city', session.isAdmin, this.listCities);
        app.delete(PATH + '/city', session.isAdmin, this.removeCity);

        app.post(PATH + '/port', session.isAdmin, this.createPort);
        app.put(PATH + '/port', session.isAdmin, this.updatePort);
        app.get(PATH + '/port', session.isAdmin, this.listPorts);
        app.delete(PATH + '/port', session.isAdmin, this.removePort);

        app.post(PATH + '/area', session.isAdmin, this.createArea);
        app.put(PATH + '/area', session.isAdmin, this.updateArea);
        app.get(PATH + '/area', session.isAdmin, this.listAreas);
        app.delete(PATH + '/area', session.isAdmin, this.removeArea);
    },

    listLocalization: function (req, res) {
        localizationViewModel.listLocalization(function (err, localization) {
            if (err || !localization) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: localization});
            }
        })
    },
    countryFront: function(req, res){
        var culture = req.query.culture;
        localizationViewModel.countryFrontList(culture, function (err, list) {
            if(err || !list){
                return res.json({res:false, error:err})
            }else{
                return res.json({res:list, error:false})
            }
        })
    },
    createCountry: function (req, res) {
        var country = req.body.country;
        var iso = req.body.iso;
        localizationViewModel.createCountry(country,iso, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }

        });
    },
    updateCountry: function (req, res) {
        var country = req.body.country;
        var iso = req.body.iso;
        localizationViewModel.updateCountry(country,iso, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    listCounties: function (req, res) {
        var limit = req.query.limit;
        var skip = req.query.skip;
        localizationViewModel.listCounties(limit, skip, function (err, localization, count) {
            if (err || !localization) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: localization, cont: count});
            }
        })
    },
    removeCountry: function (req, res) {
        var country = JSON.parse(req.query.country);
        localizationViewModel.removeCountry(country, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },

    createCity: function (req, res) {
        var country_id = req.body.country_id;
        var city = req.body.city;
        localizationViewModel.createCity(country_id, city, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    updateCity: function (req, res) {
        var city = req.body.city;
        localizationViewModel.updateCity(city, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    listCities: function (req, res) {
        var limit = req.query.limit;
        var skip = req.query.skip;
        var filter = JSON.parse(req.query.filter);

        localizationViewModel.listCities(limit, skip, filter, function (err, localization, count) {
            if (err || !localization) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: localization, cont: count});
            }
        })
    },
    removeCity: function (req, res) {
        var city = JSON.parse(req.query.city);
        localizationViewModel.removeCity(city, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },

    createPort: function (req, res) {
        var country_id = req.body.country_id;
        var city_id = req.body.city_id;
        var area_id = req.body.area_id;
        var port = req.body.port;
        localizationViewModel.createPort(country_id, city_id, area_id, port, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    updatePort: function (req, res) {
        var port = req.body.port;
        localizationViewModel.updatePort(port, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    listPorts: function (req, res) {
        var limit = req.query.limit;
        var skip = req.query.skip;
        var filter = JSON.parse(req.query.filter);
        localizationViewModel.listPorts(limit, skip, filter, function (err, localization, count) {
            if (err || !localization) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: localization, cont: count});
            }
        })
    },
    removePort: function (req, res) {
        var port = JSON.parse(req.query.port);
        localizationViewModel.removePort(port, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },

    createArea: function (req, res) {
        var country_id = req.body.country_id;
        var city_id = req.body.city_id;
        var area = req.body.area;
        localizationViewModel.createArea(country_id, city_id, area, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    updateArea: function (req, res) {
        var area = req.body.area;
        localizationViewModel.updateArea(area, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    },
    listAreas: function (req, res) {
        var limit = req.query.limit;
        var skip = req.query.skip;
        var filter = JSON.parse(req.query.filter);
        localizationViewModel.listAreas(limit, skip, filter, function (err, localization, count) {
            if (err || !localization) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: localization, cont: count});
            }
        })
    },
    removeArea: function (req, res) {
        var area = JSON.parse(req.query.area);
        localizationViewModel.removeArea(area, function (err, localization) {
            if (err || !localization) {
                res.json({res: false, err: err});
            }
            else {
                res.json({res: true, err: err});
            }
        });
    }

};

module.exports = localization;