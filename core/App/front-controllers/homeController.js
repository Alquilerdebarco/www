/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com>
 on 05/02/2016.
 */

var PATH_ROUTE = '/:culture';
var utils = require('../utils/functions');
var textViewModel = require('../viewModels/textViewModel');
var userModelView = require('../viewModels/userViewModel');
var shipModelView = require('../viewModels/shipViewModel');
var session = require('../../middlewares/session');
var _ = require('lodash');
var landingSelect = {
    id: null
};
function saveRoute(req, res, next) {
    var newRoutes = {};
    var onlyRoutes = [];
    if(req.params.culture == "es"){
        res.redirect("/");
    }else{
        db.Languages.find().exec(function (err, langs) {
            for (var i = 0; i < langs.length; i++) {
                var aux = {
                    url: '/' + langs[i]._doc.iso,
                    lang: langs[i]._doc.iso
                }
                onlyRoutes.push(aux);
                newRoutes[langs[i]._doc.iso] = '/' + langs[i]._doc.iso;
            }
            req.session.onlyRoutes = onlyRoutes;
            req.session.isoRoutes = newRoutes;
            return next();
        });
    }

}
function validateCulture(req, res, next) {
    utils.validateCulture(req.params.culture, function (lang) {
        if (lang) {
            return next();
        }
        else {
            return utils.goToIndex(req, res, "404");
        }
    });
}

exports.configRoutes = function (app) {
    app.get(PATH_ROUTE, validateCulture, session.language, utils.construction, saveRoute, function (req, res, next) {
        utils.validateCulture(req.params.culture, function (lang) {
            if (lang) {
                textViewModel.getByGroupArray(req.params.culture, ['general', 'index','slugs'], function (err, text) {
                    if (!err) {
                        utils.loadData(req.params.culture, null, null, null, req.session.coin, function (err, datas) {
                            if (!err && datas) {
                                if (!_.isEmpty(datas[1]) && datas[1].list.length) {
                                    res.render(utils.front_path + utils.front_base, {
                                        page: 'index',
                                        imgs: datas[2],
                                        language: lang._doc.iso,
                                        languages: datas[0],
                                        ships: datas[1],
                                        title:datas[4][0],
                                        texts: text,
                                        filters: null,
                                        metas: datas[3],
                                        user: req.user,
                                        slogans: datas[4],
                                        landing: datas[5],
                                        general_land: datas[6],
                                        symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
                                        routes: req.session.onlyRoutes,
                                        landingSelect: landingSelect._id || null,
                                        landingsMenu:datas[10],
                                        textsMenu:datas[11],
                                        currenciesMenu:datas[12]

                                    });
                                }else {
                                    res.render(utils.front_path + utils.front_base, {
                                        page: 'index',
                                        imgs: datas[2],
                                        language: lang._doc.iso,
                                        languages: datas[0],
                                        ships: {list: []},
                                        title:datas[4][0],
                                        texts: text,
                                        filters: null,
                                        metas: datas[3],
                                        user: req.user,
                                        slogans: datas[4],
                                        landing: datas[5],
                                        general_land: datas[6],
                                        symbol: "€",
                                        routes: req.session.onlyRoutes,
                                        landingSelect: landingSelect._id || null,
                                        landingsMenu:datas[10],
                                        textsMenu:datas[11],
                                        currenciesMenu:datas[12]
                                    })
                                }

                            } else {
                                utils.goToIndex(req, res, "404");
                            }
                        });
                    } else {
                        utils.goToIndex(req, res, "404");
                    }
                })

            }
            else {
                utils.goToIndex(req, res, "404");
            }
        });

    });
}
