/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 20/3/2016.
 */

var _ = require('lodash');
var async = require('async');

var PATH_ROUTE = '/:culture/:slug/:name/:number';
//var PATH_SHIP = '/:culture/:name/:slug/:xp';//detalle
var utils = require('../utils/functions');
var textViewModel = require('../viewModels/textViewModel');
var configurationModelView = require('../viewModels/configurationViewModel');
var landingView = require('../viewModels/landingViewModel');


function savePATH_ROUTE(req, res, next) {
    var culture = req.params.culture;
    var slug = req.params.slug;

    var routes = {};


    async.parallel([
        function (cbp) {
            db.Texts.findOne({group: 'slugs'})
                .populate('components.text')
                .exec(function (err, textSlug) {
                    for (var i = 0; i < textSlug._doc.components.length; i++) {
                        for (var j = 0; j < textSlug._doc.components[i]._doc.text.length; j++) {
                            if (textSlug._doc.components[i]._doc.text[j]._doc.value == slug) {
                                var texts = textSlug._doc.components[i]._doc.text;
                                break;
                            }
                        }
                    }
                    if (!texts) {
                        cbp(null, false);
                    }
                    else {
                        cbp(null, texts);
                    }
                })
        },
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
                            if (textSlug._doc.components[i]._doc.text[j]._doc.value == req.params.name) {
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
        }
    ], function (err, result) {
        var newRoutes = {};
        var onlyRoutes = [];
        if (result[1]) {
            var texts = result[1];
            for (var i = 0; i < texts.length; i++) {
                routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
            }
            db.Languages.find().exec(function (err, langs) {
                for (var i = 0; i < langs.length; i++) {
                    var aux = {
                        url: '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()] + '/'+ result[2][langs[i]._doc._id.toString()]+'/'+req.params.number,
                        lang: langs[i]._doc.iso
                    }
                    onlyRoutes.push(aux);
                    newRoutes[langs[i]._doc.iso] = '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()]+ '/'+ result[2][langs[i]._doc._id.toString()]+'/'+req.params.number;
                }
                req.session.onlyRoutes = onlyRoutes;
                req.session.isoRoutes = newRoutes;
                return next();
            });
        }
        else if (result[0]) {
            var texts = result[0];
            for (var i = 0; i < texts.length; i++) {
                routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
            }
            db.Languages.find().exec(function (err, langs) {
                for (var i = 0; i < langs.length; i++) {
                    var aux = {
                        url: '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()]+'/'+req.params.name,
                        lang: langs[i]._doc.iso
                    }
                    onlyRoutes.push(aux);
                    newRoutes[langs[i]._doc.iso] = '/' + langs[i]._doc.iso + '/' + routes[langs[i]._doc._id.toString()];
                }
                req.session.onlyRoutes = onlyRoutes;
                req.session.isoRoutes = newRoutes;
                return next();
            });
        }
        else {
            utils.goToIndex(req, res, "404");
        }
    });
};

exports.configRoutes = function (app) {
    app.get(PATH_ROUTE, utils.construction, savePATH_ROUTE, function (req, res,next) {
        var coin = req.session.coin || null;
        var culture = req.params.culture;
        req.session.lang = req.params.culture;
        utils.validateCulture(req.params.culture, function (lang) {
            if (lang) {
                landingView.getAll(req.params.culture, function (err, landing) {
                    if (err || !landing) {
                        var status = "500";
                        utils.goToIndex(req, res, status);
                    }
                    else {
                        textViewModel.getByGroupArray(culture, ['slugs'], function (err, slugs) {
                            if (!err && slugs) {
                                if (slugs.slug_page == req.params.name) {
                                    var exist = false, meta = "";
                                    var limit = 10;
                                    var skip = (req.params.number - 1) * limit;
                                    async.map(landing, function (lan, callback) {
                                        if (req.params.slug == lan._doc.slug[0]._doc.value) {
                                            exist = true;
                                           var filter = [];
                                            var date = req.query.startDate ? parseInt(req.query.startDate) : null;
                                            var duration = req.query.duration;
                                            var length = req.query.length == 0 ? null : req.query.length;
                                            var number_p = req.query.number == 0 ? null : req.query.number;
                                            var shipowner = req.query.shipowner == 0 ? null : req.query.shipowner;
                                            meta = {desc: lan._doc.description[0].value};
                                            var filterq = [], sendfilter = {};
                                            if (duration) {
                                                var array = duration.split(",");
                                                var quantity = parseInt(array[0]);
                                                var unity = parseInt(array[1]);
                                                configurationModelView.getDurationanbyQandU(unity, quantity, function (err, dur) {
                                                    if (!err && dur) {
                                                        duration = dur.toString();
                                                        if (lan._doc.country != "0") {
                                                            filter.push(lan._doc.country.slug[0].value);
                                                            filterq.push(lan._doc.country._id.toString());
                                                            if (lan._doc.city != "0") {
                                                                filter.push(lan._doc.city.slug[0]._doc.value);
                                                                filterq.push(lan._doc.city._id.toString());
                                                                if (lan._doc.area != "0") {
                                                                    filter.push(lan._doc.area.slug[0].value);
                                                                    filterq.push(lan._doc.area._id.toString());
                                                                    if (lan._doc.port != "0") {
                                                                        filter.push(lan._doc.port.slug[0]._doc.value);
                                                                        filterq.push(lan._doc.port._id.toString());
                                                                        if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                            filter.push(lan._doc.experience.slug, req.query.duration, date);
                                                                            filterq.push(lan._doc.experience._id.toString(), duration, date);
                                                                        } else {
                                                                            filter.push("0", req.query.duration, date);
                                                                            filterq.push(null, duration, date);
                                                                        }
                                                                    } else {
                                                                        if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                            filter.push("0", lan._doc.experience.slug, req.query.duration, date);
                                                                            filterq.push(null, lan._doc.experience._id.toString(), duration, date);
                                                                        } else {
                                                                            filter.push("0", "0", req.query.duration, date);
                                                                            filterq.push(null, null, duration, date);
                                                                        }

                                                                    }

                                                                } else {
                                                                    if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                        filter.push("0", "0", lan._doc.experience.slug, req.query.duration, date);
                                                                        filterq.push(null, null, lan._doc.experience._id.toString(), duration, date);
                                                                    } else {
                                                                        filter.push("0", "0", "0", req.query.duration, date);
                                                                        filterq.push(null, null, null, duration, date);
                                                                    }

                                                                }


                                                            } else {
                                                                if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                    filter.push("0", "0", "0", lan._doc.experience.slug, req.query.duration, date);
                                                                    filterq.push(null, null, null, lan._doc.experience._id.toString(), duration, date);
                                                                } else {
                                                                    filter.push("0", "0", "0", "0", req.query.duration, date);
                                                                    filterq.push(null, null, null, null, duration, date);
                                                                }

                                                            }


                                                        }
                                                        else {
                                                            if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                filter.push("0", "0", "0", "0", lan._doc.experience.slug, req.query.duration, date)
                                                                filterq.push(null, null, null, null, lan._doc.experience._id.toString(), duration, date);
                                                            } else {
                                                                filter.push("0", "0", "0", "0", "0", req.query.duration, date);
                                                                filterq.push(null, null, null, null, null, duration, date);
                                                            }

                                                        }
                                                        if (lan._doc.shipType) {
                                                            if(shipowner){
                                                                if(shipowner == "2") shipowner = parseInt(shipowner);
                                                                else{
                                                                    shipowner = eval(shipowner);
                                                                    shipowner = shipowner ? 1 : 0;
                                                                }
                                                                filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner,lan._doc.shipType._id.toString());
                                                                filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                                                sendfilter = {
                                                                    filter: filter,
                                                                    filterq: filterq
                                                                }
                                                                callback(false, sendfilter);
                                                            }else{
                                                                filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                                                filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                                                sendfilter = {
                                                                    filter: filter,
                                                                    filterq: filterq
                                                                }
                                                                callback(false, sendfilter);
                                                            }
                                                        } else {
                                                            if(shipowner){
                                                                if(shipowner == "2") shipowner = parseInt(shipowner);
                                                                else{
                                                                    shipowner = eval(shipowner);
                                                                    shipowner = shipowner ? 1 : 0;
                                                                }
                                                                filter.push("0", req.query.length, req.query.number, req.query.shipowner,"0");
                                                                filterq.push(null, length, number_p, shipowner);
                                                                sendfilter = {
                                                                    filter: filter,
                                                                    filterq: filterq
                                                                }
                                                                callback(false, sendfilter);
                                                            }else{
                                                                filter.push("0", req.query.length, req.query.number, req.query.shipowner,"0");
                                                                filterq.push(null, length, number_p, null);
                                                                sendfilter = {
                                                                    filter: filter,
                                                                    filterq: filterq
                                                                }
                                                                callback(false, sendfilter);
                                                            }

                                                        }
                                                    } else {
                                                        callback(err, false);
                                                    }
                                                })
                                            }
                                            else {
                                                if (lan._doc.country != "0") {
                                                    filter.push(lan._doc.country.slug[0].value);
                                                    filterq.push(lan._doc.country._id.toString());
                                                    if (lan._doc.city != "0") {
                                                        filter.push(lan._doc.city.slug[0]._doc.value);
                                                        filterq.push(lan._doc.city._id.toString());
                                                        if (lan._doc.area != "0") {
                                                            filter.push(lan._doc.area.slug[0].value)
                                                            filterq.push(lan._doc.area._id.toString())
                                                            if (lan._doc.port != "0") {
                                                                filter.push(lan._doc.port.slug[0]._doc.value);
                                                                filterq.push(lan._doc.port._id.toString());
                                                                if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                    filter.push(lan._doc.experience.slug, "0", date);
                                                                    filterq.push(lan._doc.experience._id.toString(), null, date);
                                                                } else {
                                                                    filter.push("0", "0", date);
                                                                    filterq.push(null, null, date);
                                                                }


                                                            } else {
                                                                if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                    filter.push("0", lan._doc.experience.slug, "0", date);
                                                                    filterq.push(null, lan._doc.experience._id.toString(), null, date);
                                                                } else {
                                                                    filter.push("0", "0", "0", date);
                                                                    filterq.push(null, null, null, date)
                                                                }

                                                            }

                                                        } else {
                                                            if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                                filter.push("0", "0", lan._doc.experience.slug, "0", date)
                                                                filterq.push(null, null, lan._doc.experience._id.toString(), null, date);
                                                            } else {
                                                                filter.push("0", "0", "0", "0", date);
                                                                filterq.push(null, null, null, null, date)
                                                            }

                                                        }


                                                    } else {
                                                        if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                            filter.push("0", "0", "0", lan._doc.experience.slug, "0", date);
                                                            filterq.push(null, null, null, lan._doc.experience._id.toString(), null, date);
                                                        } else {
                                                            filter.push("0", "0", "0", "0", "0", date);
                                                            filterq.push(null, null, null, null, null, date);
                                                        }

                                                    }


                                                } else {
                                                    if (lan._doc.experience != "0" && lan._doc.experience != undefined) {
                                                        filter.push("0", "0", "0", "0", lan._doc.experience.slug, "0", date)
                                                        filterq.push(null, null, null, null, lan._doc.experience._id.toString(), null, date);
                                                    } else {
                                                        filter.push("0", "0", "0", "0", "0", "0", date);
                                                        filterq.push(null, null, null, null, null, null, date)
                                                    }

                                                }
                                                if (lan._doc.shipType) {
                                                    if(shipowner){
                                                        if(shipowner == "2") shipowner = parseInt(shipowner);
                                                        else{
                                                            shipowner = eval(shipowner);
                                                            shipowner = shipowner ? 1 : 0;
                                                        }
                                                        filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner,lan._doc.shipType._id.toString());
                                                        filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                                        sendfilter = {
                                                            filter: filter,
                                                            filterq: filterq
                                                        }
                                                        callback(false, sendfilter);
                                                    }else{
                                                        filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                                        filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                                        sendfilter = {
                                                            filter: filter,
                                                            filterq: filterq
                                                        }
                                                        callback(false, sendfilter);
                                                    }


                                                } else {
                                                    if(shipowner){
                                                        if(shipowner == "2") shipowner = parseInt(shipowner);
                                                        else{
                                                            shipowner = eval(shipowner);
                                                            shipowner = shipowner ? 1 : 0;
                                                        }
                                                        filter.push("0", req.query.length, req.query.number, req.query.shipowner,"0");
                                                        filterq.push(null, length, number_p, shipowner);
                                                        sendfilter = {
                                                            filter: filter,
                                                            filterq: filterq
                                                        }
                                                        callback(false, sendfilter);
                                                    }else{
                                                        filter.push("0", req.query.length, req.query.number, req.query.shipowner,"0");
                                                        filterq.push(null, length, number_p, null);
                                                        sendfilter = {
                                                            filter: filter,
                                                            filterq: filterq
                                                        }
                                                        callback(false, sendfilter);
                                                    }

                                                }
                                            }
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
                                            var filter = [], filterq = [], valid = false;
                                            for (var i = 0; i < filters.length && !valid; i++) {
                                                if (filters[i]) {
                                                    filter = filters[i].filter;
                                                    filterq = filters[i].filterq;
                                                    valid = true
                                                }

                                            }
                                            if (_.isEmpty(filter) || _.isEmpty(filterq)) {
                                                var status = "404";
                                                req.body.local = true;
                                                utils.goToIndex(req, res, status);
                                            } else {
                                                textViewModel.getByGroupArray(req.params.culture, ['general', 'index', 'slugs'], function (err, text) {
                                                    if (!err) {
                                                        utils.loadData(req.params.culture, limit, skip, filterq, coin, function (err, datas) {
                                                            if (!err) {
                                                                if (!_.isEmpty(datas[1]) && datas[1].list.length) {
                                                                    res.render(utils.front_path + utils.front_base, {
                                                                        page: 'index',
                                                                        imgs: datas[2],
                                                                        language: lang._doc.iso,
                                                                        languages: datas[0],
                                                                        ships: datas[1],
                                                                        texts: text,
                                                                        title:datas[4][0],
                                                                        filters: filter,
                                                                        metas: meta,
                                                                        user: req.user,
                                                                        slogans: datas[4],
                                                                        landing: datas[5],
                                                                        general_land:datas[6],
                                                                        symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
                                                                        routes: req.session.onlyRoutes,
                                                                        landingsMenu:datas[10],
                                                                        textsMenu:datas[11],
                                                                        currenciesMenu:datas[12]

                                                                    });
                                                                }
                                                                else {
                                                                    res.render(utils.front_path + utils.front_base, {
                                                                        page: 'index',
                                                                        imgs: datas[2],
                                                                        language: lang._doc.iso,
                                                                        languages: datas[0],
                                                                        ships: {list: []},
                                                                        texts: text,
                                                                        filters: filter,
                                                                        title:datas[4][0],
                                                                        metas: datas[3],
                                                                        user: req.user,
                                                                        slogans: datas[4],
                                                                        landing: datas[5],
                                                                        general_land:datas[6],
                                                                        symbol: "€",
                                                                        routes: req.session.onlyRoutes,
                                                                        landingsMenu:datas[10],
                                                                        textsMenu:datas[11],
                                                                        currenciesMenu:datas[12]

                                                                    });
                                                                }
                                                            } else {
                                                                var status = "404";
                                                                req.body.local = true;
                                                                utils.goToIndex(req, res, status);
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
                                else{
                                   return next();
                                }
                            }
                            else{
                                var status = "404";
                                utils.goToIndex(req, res, status);
                            }
                        })
                    }

                })
            }
            else {
                utils.goToIndex(req, res, "404");
            }
        });

    });
};

