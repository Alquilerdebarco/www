/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 21/3/2016.
 */
var SINGLE_PATH_ROUTE = '/:landing/:name/:slug/:xp_ship';
var PATH_ROUTE = '/:culture/:landing/:name/:slug/:xp_ship';
var utils = require('../utils/functions');
var textViewModel = require('../viewModels/textViewModel');
var landingView = require('../viewModels/landingViewModel');
var shipController = require('../front-controllers/shipdetailsController');
var async = require('async');
var _ = require('lodash');

function renderPage(req,res,culture) {
    utils.validateCulture(culture, function (lang) {
        if (lang) {
            req.session.lang = culture;
            var coin = req.session.coin || null;
            var user = req.user;
            landingView.getAll(culture, function (err, landing) {
                if (err || !landing) {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                } else {
                    textViewModel.getByGroupArray(culture, ['slugs'], function (err, slugs) {
                        if (!err && slugs) {
                            if (slugs.slug_ship == req.params.name) {
                                var exist = false, meta = "";
                                var date = req.query.startDate ? parseInt(req.query.startDate) : null;
                                async.map(landing, function (lan, callback) {
                                    if (req.params.landing == lan._doc.slug[0]._doc.value) {
                                        exist = true;
                                        var filter = [];
                                        meta = {desc: lan._doc.description[0].value};
                                        if (lan._doc.country != "0") {
                                            filter.push(lan._doc.country.slug[0].value);
                                            if (lan._doc.city != "0") {
                                                filter.push(lan._doc.city.slug[0]._doc.value);
                                                if (lan._doc.area != "0") {
                                                    filter.push(lan._doc.area.slug[0].value)
                                                    if (lan._doc.port != "0") {
                                                        filter.push(lan._doc.port.slug[0]._doc.value);
                                                        if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                            filter.push(lan._doc.experience.slug, "0", date);
                                                        } else {
                                                            filter.push("0", "0", date);
                                                        }

                                                    } else {
                                                        if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                            filter.push("0", lan._doc.experience.slug, "0", date);
                                                        } else {
                                                            filter.push("0", "0", "0", date);
                                                        }

                                                    }

                                                } else {
                                                    if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                        filter.push("0", "0", lan._doc.experience.slug, "0", date)
                                                    } else {
                                                        filter.push("0", "0", "0", "0", date);
                                                    }

                                                }

                                            } else {
                                                if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                    filter.push("0", "0", "0", lan._doc.experience.slug, "0", date)
                                                } else {
                                                    filter.push("0", "0", "0", "0", "0", date);
                                                }

                                            }

                                        } else {
                                            if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                filter.push("0", "0", "0", "0", lan._doc.experience.slug, "0", date)
                                            } else {
                                                filter.push("0", "0", "0", "0", "0", "0", date);
                                            }

                                        }
                                        filter.push("0", "0", "0", "0", "0");
                                        var sendfilter = {
                                            filter: filter
                                        }
                                        callback(false, sendfilter);
                                    }
                                    else {
                                        callback(false, null)
                                    }
                                }, function (err, filters) {
                                    if (err || !exist) {
                                        var status = "404";
                                        req.body.local = true;
                                        utils.goToIndex(req, res, status);
                                    } else {
                                        var filter = [], valid = false;
                                        for (var i = 0; i < filters.length && !valid; i++) {
                                            if (filters[i]) {
                                                filter = filters[i].filter;
                                                valid = true
                                            }
                                        }
                                        if (_.isEmpty(filter)) {
                                            var status = "404";
                                            req.body.local = true;
                                            utils.goToIndex(req, res, status);
                                        } else {
                                            textViewModel.getByGroupArray(culture, ['general', 'ship-details', 'slugs'], function (err, text) {
                                                if (!err && text) {
                                                    shipController.shipFunctions(culture, req.params.slug, req.params.xp_ship, coin, function (err, array) {
                                                        if (err || !array) {
                                                            var status = "404";
                                                            req.body.local = true;
                                                            utils.goToIndex(req, res, status);
                                                        } else {
                                                            utils.loadData(culture, null, null, null, coin, function (err, datas) {
                                                                if (!err && datas) {
                                                                    res.render(utils.front_path + utils.front_base, {
                                                                        page: 'ship-details',
                                                                        imgs: datas[2],
                                                                        language: lang._doc.iso,
                                                                        languages: datas[0],
                                                                        ship: array.ship,
                                                                        texts: text,
                                                                        title:datas[4][0],
                                                                        recomendation: array.recomend,
                                                                        filters: filter,
                                                                        metas: meta,
                                                                        user: req.user,
                                                                        slogans: datas[4],
                                                                        landing: datas[5],
                                                                        durations: datas[7].durations,
                                                                        general_land: datas[6],
                                                                        symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
                                                                        routes: req.session.onlyRoutes,
                                                                        landingsMenu:datas[10],
                                                                        textsMenu:datas[11],
                                                                        currenciesMenu:datas[12]

                                                                    });

                                                                } else {
                                                                    var status = "404";
                                                                    req.body.local = true;
                                                                    utils.goToIndex(req, res, status);
                                                                }
                                                            })
                                                        }
                                                    })

                                                } else {
                                                    var status = "404";
                                                    req.body.local = true;
                                                    utils.goToIndex(req, res, status);
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                var status = "404";
                                req.body.local = true;
                                utils.goToIndex(req, res, status);
                            }
                        }
                        else {
                            var status = "404";
                            req.body.local = true;
                            utils.goToIndex(req, res, status);
                        }
                    })
                }
            })


        }
        else {
            utils.goToIndex(req, res, "404");
        }
    })
}
function savePATH_ROUTE(req, res, next) {
    var name = req.params.name,
        slug = req.params.landing,
        xp_ship = req.params.xp_ship;
    var routes = {};

    try {
        async.parallel([
            function (cbp) {
                db.IsoFields.find({value: slug})
                    .exec(function (err, isos) {
                        if (err || !isos) {
                            cbp(null, false);
                        }
                        else {
                            async.map(isos, function (iso, cbm) {
                                db.Landings.findOne({slug: iso._doc._id})
                                    .populate('slug')
                                    .exec(function (err, land) {
                                        if (err || !land) {
                                            cbm(null, false);
                                        }
                                        else {
                                            cbm(null, land)
                                        }
                                    });
                            }, function (err, results) {
                                for (var i = 0; i < results.length; i++) {
                                    var land = false;
                                    if (results[i]) {
                                        land = results[i];
                                        break;
                                    }
                                }
                                if (land) {
                                    var texts = land._doc.slug;
                                    if (!texts) {
                                        cbp(null, false);
                                    }
                                    else {
                                        cbp(null, texts);
                                    }
                                }
                                else {
                                    cbp(null, false);
                                }
                            });


                        }
                    })
            },
            function (cbp) {
                var routes = {};
                db.Texts.findOne({group: 'slugs'})
                    .populate('components.text')
                    .exec(function (err, textSlug) {
                        for (var i = 0; i < textSlug._doc.components.length; i++) {
                            for (var j = 0; j < textSlug._doc.components[i]._doc.text.length; j++) {
                                if (textSlug._doc.components[i]._doc.text[j]._doc.value == name) {
                                    var texts = textSlug._doc.components[i]._doc.text;
                                    break;
                                }
                            }
                        }
                        if (texts) {
                            for (var i = 0; i < texts.length; i++) {
                                routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
                            }
                            cbp(null, routes);
                        }
                        else {
                            cbp(true, null);
                        }
                    })
            },//5
            function (cbp) {
                var routes = {};
                db.Configurations.findOne()
                    .populate('shipSettings.experiences.slug')
                    .exec(function (err, conf) {
                        if (err || !conf) {
                            cbp(err, conf);
                        }
                        else {

                            for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                                var sxp = conf._doc.shipSettings.experiences[i]._doc.slug;
                                for (var j = 0; j < sxp.length; j++) {
                                    if (sxp[j]._doc.value == xp_ship) {
                                        var texts = sxp;
                                        break;
                                    }

                                }

                            }
                            if (texts) {
                                for (var i = 0; i < texts.length; i++) {
                                    routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
                                }
                                cbp(null, routes);
                            }
                            else {
                                cbp(true, null);
                            }

                        }
                    });

            }
        ], function (err, results) {
            if (err) {
                utils.goToIndex(req, res, "404");
            }
            else {
                var newRoutes = {};
                var onlyRoutes = [];
                var texts = results[0];
                for (var i = 0; i < texts.length; i++) {
                    routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
                }
                db.Languages.find().exec(function (err, langs) {
                    for (var i = 0; i < langs.length; i++) {
                        if(langs[i]._doc.iso == "es"){
                            var aux = {
                                url: '/' + routes[langs[i]._doc._id.toString()] + '/' + results[1][langs[i]._doc._id.toString()] + '/' + req.params.slug + '/' + results[2][langs[i]._doc._id.toString()],
                                lang: langs[i]._doc.iso
                            }
                            newRoutes[langs[i]._doc.iso] = '/' + routes[langs[i]._doc._id.toString()] + '/' + results[1][langs[i]._doc._id.toString()] + '/' + req.params.slug + '/' + results[2][langs[i]._doc._id.toString()];
                        }else{
                            var aux = {
                                url: '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()] + '/' + results[1][langs[i]._doc._id.toString()] + '/' + req.params.slug + '/' + results[2][langs[i]._doc._id.toString()],
                                lang: langs[i]._doc.iso
                            }
                            newRoutes[langs[i]._doc.iso] = '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()] + '/' + results[1][langs[i]._doc._id.toString()] + '/' + req.params.slug + '/' + results[2][langs[i]._doc._id.toString()];
                        }

                        onlyRoutes.push(aux);

                    }
                    req.session.onlyRoutes = onlyRoutes;
                    req.session.isoRoutes = newRoutes;
                    return next();
                });
            }

        });
    }
    catch (err) {
        utils.goToIndex(req, res, "404");
    }

};
exports.configRoutes = function (app) {
    app.get(SINGLE_PATH_ROUTE, utils.construction,savePATH_ROUTE, function (req, res) {
        var culture = "es";
        renderPage(req,res,culture);

    });
    app.get(PATH_ROUTE, utils.construction, savePATH_ROUTE, function (req, res) {
        var culture = req.params.culture;
        renderPage(req,res,culture);

    });
};