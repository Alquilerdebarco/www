/**
 * Created by ernestomr87@gmail.com on 11/25/2015.
 */

var async = require("async");
//rutas para culture es
var SINGLE_PATH_ROUTE = "/:slug";
var SINGLE_PATH = "/:name/:slug";
var SINGLE_PATH_SHIP = "/:name/:slug/:xp";

var PATH_ROUTE = "/:culture/:slug";
var PATH = "/:culture/:name/:slug"; //paginate
var PATH_SHIP = "/:culture/:name/:slug/:xp"; //detalle

var languageModelView = require("../App/viewModels/languageViewModel");
var textViewModel = require("../App/viewModels/textViewModel");
var aboutController = require("../App/front-controllers/aboutController");
var frequentlyQuestionsController = require("../App/front-controllers/frequentlyQuestionsController");
var sailorController = require("../App/front-controllers/sealerguideController");
var userController = require("../App/front-controllers/userguideController");
var rentShipController = require("../App/front-controllers/rentshipController");
var privateController = require("../App/front-controllers/privateownerController");
var enterpriseController = require("../App/front-controllers/enterpriseownerController");
var privacyController = require("../App/front-controllers/privacyController");
var conditionsController = require("../App/front-controllers/conditionsController");
var shipController = require("../App/front-controllers/shipdetailsController");
var shipModelView = require("../App/viewModels/shipViewModel");
var our_shipsController = require("../App/front-controllers/ourshipsController");
var bookingController = require("../App/front-controllers/bookingController");
var answerController = require("../App/front-controllers/answerController");
var landingView = require("../App/viewModels/landingViewModel");
var configurationModelView = require("../App/viewModels/configurationViewModel");
var newsletterController = require("../App/front-controllers/newsletterController");
var secondPayController = require("../App/front-controllers/secondPayController");
var utils = require("../App/utils/functions");
var _ = require("lodash");
var landingSelect = {
  _id: null
};

function renderPages(datas, page, lang, routes, text, filters, title, metas, user, photos, cancel, booking, landingSelect, res, status, allships, book, susc, first, redsys) {
  utils.getSEO(function (err, seo) {
    var noindex = false,
      nofollow = false;
    if (seo) {
      if (page === "about-us") {
        noindex = seo.page_about.noindex;
        nofollow = seo.page_about.nofollow;
      } else if (page === "sealer-guide") {
        noindex = seo.page_sailor_guide.noindex;
        nofollow = seo.page_sailor_guide.nofollow;
      } else if (page === "user-guide") {
        noindex = seo.page_user_guide.noindex;
        nofollow = seo.page_user_guide.nofollow;
      } else if (page === "rent-your-ship") {
        noindex = seo.page_announce.noindex;
        nofollow = seo.page_announce.nofollow;
      } else if (page === "private-owner") {
        noindex = seo.page_register_private.noindex;
        nofollow = seo.page_register_private.nofollow;
      } else if (page === "enterprise-owner") {
        noindex = seo.page_register_owner.noindex;
        nofollow = seo.page_register_owner.nofollow;
      } else if (page === "privacy-politics") {
        noindex = seo.page_cookies_privacy.noindex;
        nofollow = seo.page_cookies_privacy.nofollow;
      } else if (page === "service-conditions") {
        noindex = seo.page_service_conditions.noindex;
        nofollow = seo.page_service_conditions.nofollow;
      } else if (page === "login-user") {
        noindex = seo.page_access_user.noindex;
        nofollow = seo.page_access_user.nofollow;
      } else if (page === "login-owner") {
        noindex = seo.page_access_owner.noindex;
        nofollow = seo.page_access_owner.nofollow;
      } else if (page === "map") {
        noindex = seo.page_site_map.noindex;
        nofollow = seo.page_site_map.nofollow;
      } else if (page === "our-ships") {
        noindex = seo.page_our_ships.noindex;
        nofollow = seo.page_our_ships.nofollow;
      } else if (page === "index") {
        noindex = seo.page_index.noindex;
        nofollow = seo.page_index.nofollow;
      } else if (page === "frequently-questions") {
        noindex = seo.page_frequently_questions.noindex;
        nofollow = seo.page_frequently_questions.nofollow;
      }
    }
    var methodPayment = {
      redsys: datas[9]._doc.redsys.active,
      paypal: datas[9]._doc.paypal.active,
    };
    if (page === "index") {
      if (!_.isEmpty(datas[1]) && datas[1].list.length) {
        res.render(utils.front_path + utils.front_base, {
          page: page,
          imgs: datas[2],
          photos: photos,
          language: lang._doc.iso,
          languages: datas[0],
          ships: datas[1],
          texts: text,
          title: title,
          filters: filters || null,
          metas: metas,
          user: user || null,
          slogans: datas[4],
          landing: datas[5],
          general_land: datas[6],
          symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
          routes: routes,
          cancel: cancel,
          booking: booking,
          status: status,
          noindex: noindex,
          nofollow: nofollow,
          landingSelect: landingSelect._id,
          landingsMenu: datas[10],
          textsMenu: datas[11],
          currenciesMenu: datas[12]

        });
      } else {
        res.render(utils.front_path + utils.front_base, {
          page: page,
          imgs: datas[2],
          photos: photos,
          language: lang._doc.iso,
          languages: datas[0],
          ships: datas[1],
          texts: text,
          title: title,
          filters: filters || null,
          metas: metas,
          user: user || null,
          slogans: datas[4],
          landing: datas[5],
          general_land: datas[6],
          symbol: "€",
          routes: routes,
          cancel: cancel,
          booking: booking,
          allships: allships,
          status: status,
          noindex: noindex,
          nofollow: nofollow,
          landingSelect: landingSelect._id,
          landingsMenu: datas[10],
          textsMenu: datas[11],
          currenciesMenu: datas[12]

        });
      }
    } else {
      if (!_.isEmpty(datas[1]) && datas[1].list.length) {
        res.render(utils.front_path + utils.front_base, {
          page: page,
          imgs: datas[2],
          photos: photos,
          language: lang._doc.iso,
          languages: datas[0],
          texts: text,
          title: title,
          filters: filters || null,
          metas: metas,
          user: user || null,
          slogans: datas[4],
          landing: datas[5],
          general_land: datas[6],
          susc: susc,
          book: book,
          first: first,
          symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
          routes: routes,
          cancel: cancel,
          redsys: redsys,
          booking: booking,
          allships: allships,
          status: status,
          landingSelect: landingSelect._id,
          shipType: datas[8],
          noindex: noindex,
          nofollow: nofollow,
          landingsMenu: datas[10],
          textsMenu: datas[11],
          currenciesMenu: datas[12],
          methodPayment: methodPayment
        });
      } else {
        res.render(utils.front_path + utils.front_base, {
          page: page,
          imgs: datas[2],
          photos: photos,
          language: lang._doc.iso,
          languages: datas[0],
          ships: datas[1],
          texts: text,
          title: title,
          filters: filters || null,
          metas: metas,
          user: user || null,
          susc: susc,
          book: book,
          first: first,
          slogans: datas[4],
          landing: datas[5],
          general_land: datas[6],
          symbol: "€",
          routes: routes,
          cancel: cancel,
          booking: booking,
          allships: allships,
          status: status,
          shipType: datas[8],
          noindex: noindex,
          nofollow: nofollow,
          landingSelect: landingSelect._id,
          landingsMenu: datas[10],
          textsMenu: datas[11],
          currenciesMenu: datas[12],
        });
      }
    }
  });
}

function savePATH_ROUTE(req, res, next) {
  var slug = req.params.slug;
  var culture = req.params.culture;
  var params = culture ? culture : slug;
  utils.validateCulture(params, function (lang) {
    if (lang && (params === slug)) next();
    else {
      var routes = {};
      async.parallel([
        function (cbp) {
          db.Texts.findOne({
              group: "slugs"
            })
            .populate("components.text")
            .exec(function (err, textSlug) {
              if (textSlug) {
                for (var i = 0; i < textSlug._doc.components.length; i++) {
                  for (var j = 0; j < textSlug._doc.components[i]._doc.text.length; j++) {
                    if (textSlug._doc.components[i]._doc.text[j]._doc.value === slug) {
                      var texts = textSlug._doc.components[i]._doc.text;
                      break;
                    }
                  }
                }
              }

              if (!texts) {
                cbp(null, false);
              } else {
                cbp(null, texts);
              }
            });
        },
        function (cbp) {
          db.IsoFields.find({
              value: slug
            })
            .exec(function (err, isos) {
              if (err || !isos) {
                cbp(null, false);
              } else {
                async.map(isos, function (iso, cbm) {
                  db.Landings.findOne({
                      slug: iso._doc._id
                    })
                    .populate("slug")
                    .exec(function (err, land) {
                      if (err || !land) {
                        cbm(null, false);
                      } else {
                        cbm(null, land);
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
                    } else {
                      cbp(null, texts);
                    }
                  } else {
                    cbp(null, false);
                  }
                });


              }
            });
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
              if (langs[i]._doc.iso === "es") {
                var aux = {
                  url: "/" + routes[langs[i]._doc._id.toString()],
                  lang: langs[i]._doc.iso
                };
                newRoutes[langs[i]._doc.iso] = "/" + routes[langs[i]._doc._id.toString()];
              } else {
                var aux = {
                  url: "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()],
                  lang: langs[i]._doc.iso
                };
                newRoutes[langs[i]._doc.iso] = "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()];
              }

              onlyRoutes.push(aux);

            }
            req.session.onlyRoutes = onlyRoutes;
            req.session.isoRoutes = newRoutes;
            return next();
          });
        } else if (result[0]) {
          var texts = result[0];
          for (var i = 0; i < texts.length; i++) {
            routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
          }
          db.Languages.find().exec(function (err, langs) {
            for (var i = 0; i < langs.length; i++) {
              if (langs[i]._doc.iso === "es") {
                var aux = {
                  url: "/" + routes[langs[i]._doc._id.toString()],
                  lang: langs[i]._doc.iso
                };
                newRoutes[langs[i]._doc.iso] = "/" + routes[langs[i]._doc._id.toString()];
              } else {
                var aux = {
                  url: "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()],
                  lang: langs[i]._doc.iso
                };
                newRoutes[langs[i]._doc.iso] = "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()];
              }

              onlyRoutes.push(aux);

            }
            req.session.onlyRoutes = onlyRoutes;
            req.session.isoRoutes = newRoutes;
            return next();
          });
        } else {
          return next();
          //utils.goToIndex(req, res, "404");
        }
      });
    }
  });
}

function savePATH(req, res, next) {
  // var culture = req.params.culture;
  var slug = req.params.slug;
  var name = req.params.name;
  var routes = {};

  db.Texts.findOne({
      group: "slugs"
    })
    .populate("components.text")
    .exec(function (err, textSlug) {
      for (var i = 0; i < textSlug._doc.components.length; i++) {
        for (var j = 0; j < textSlug._doc.components[i]._doc.text.length; j++) {
          if (textSlug._doc.components[i]._doc.text[j]._doc.value === name) {
            var texts = textSlug._doc.components[i]._doc.text;
            break;
          }
        }
      }


      if (texts) {
        for (var i = 0; i < texts.length; i++) {
          routes[texts[i]._doc.language.toString()] = texts[i]._doc.value;
        }
        var newRoutes = {};
        var onlyRoutes = [];
        db.Languages.find().exec(function (err, langs) {
          for (var i = 0; i < langs.length; i++) {
            if (langs[i]._doc.iso === "es") {
              var aux = {
                url: "/" + routes[langs[i]._doc._id.toString()] + "/" + slug,
                lang: langs[i]._doc.iso
              };
              newRoutes[langs[i]._doc.iso] = "/" + routes[langs[i]._doc._id.toString()] + "/" + slug;
            } else {
              var aux = {
                url: "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()] + "/" + slug,
                lang: langs[i]._doc.iso
              };
              newRoutes[langs[i]._doc.iso] = "/" + langs[i]._doc.iso + "/" + routes[langs[i]._doc._id.toString()] + "/" + slug;
            }

            onlyRoutes.push(aux);

          }
          req.session.onlyRoutes = onlyRoutes;
          req.session.isoRoutes = newRoutes;
          return next();
        });
      } else {
        return next();
        // utils.goToIndex(req, res, "404");
      }
    });
}

function savePATH_SHIP(req, res, next) {
  //var culture = req.params.culture;
  var slug = req.params.slug;
  var name = req.params.name;
  var xp = req.params.xp;

  async.parallel([
    function (cbp) {
      var routes = {};
      db.Texts.findOne({
          group: "slugs"
        })
        .populate("components.text")
        .exec(function (err, textSlug) {
          for (var i = 0; i < textSlug._doc.components.length; i++) {
            for (var j = 0; j < textSlug._doc.components[i]._doc.text.length; j++) {
              if (textSlug._doc.components[i]._doc.text[j]._doc.value === name) {
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
          } else {
            cbp(true, null);
          }
        });
    },
    function (cbp) {
      if (xp !== 0) {
        var routes = {};
        db.Configurations.findOne()
          .populate("shipSettings.experiences.slug")
          .exec(function (err, conf) {
            if (err || !conf) {
              cbp(err, conf);
            } else {

              for (var i = 0; i < conf._doc.shipSettings.experiences.length; i++) {
                var sxp = conf._doc.shipSettings.experiences[i]._doc.slug;
                for (var j = 0; j < sxp.length; j++) {
                  if (sxp[j]._doc.value === xp) {
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
              } else {
                cbp(true, null);
              }
            }
          });
      } else {
        cbp(null, 0);
      }

    }
  ], function (err, results) {
    if (!err) {
      var newRoutes = {};
      var onlyRoutes = [];
      db.Languages.find().exec(function (err, langs) {
        for (var i = 0; i < langs.length; i++) {
          if (langs[i]._doc.iso === "es") {
            var aux = {
              url: "/" + results[0][langs[i]._doc._id.toString()] + "/" + slug + "/" + results[1][langs[i]._doc._id.toString()],
              lang: langs[i]._doc.iso
            };
            newRoutes[langs[i]._doc.iso] = "/" + results[0][langs[i]._doc._id.toString()] + "/" + slug + "/" + results[1][langs[i]._doc._id.toString()];
          } else {
            var aux = {
              url: "/" + langs[i]._doc.iso + "/" + results[0][langs[i]._doc._id.toString()] + "/" + slug + "/" + results[1][langs[i]._doc._id.toString()],
              lang: langs[i]._doc.iso
            };
            newRoutes[langs[i]._doc.iso] = "/" + langs[i]._doc.iso + "/" + results[0][langs[i]._doc._id.toString()] + "/" + slug + "/" + results[1][langs[i]._doc._id.toString()];
          }

          onlyRoutes.push(aux);

        }
        req.session.onlyRoutes = onlyRoutes;
        req.session.isoRoutes = newRoutes;
        return next();
      });
    } else {
      utils.goToIndex(req, res, "404");
    }
  });


}

function saveRoute(req, res, next) {
  var newRoutes = {};
  var onlyRoutes = [];
  db.Languages.find().exec(function (err, langs) {
    for (var i = 0; i < langs.length; i++) {
      if (langs[i]._doc.iso === "es") {
        var aux = {
          url: "/",
          lang: langs[i]._doc.iso
        };
        newRoutes[langs[i]._doc.iso] = "/";
      } else {
        var aux = {
          url: "/" + langs[i]._doc.iso,
          lang: langs[i]._doc.iso
        };
        newRoutes[langs[i]._doc.iso] = "/" + langs[i]._doc.iso;
      }

      onlyRoutes.push(aux);

    }
    req.session.onlyRoutes = onlyRoutes;
    req.session.isoRoutes = newRoutes;
    return next();
  });
}

exports.configRoutes = function (app) {

  app.get("/", utils.construction, saveRoute, function (req, res) {
    try {
      var coin = req.session.coin || null;
      languageModelView.default(function (err, lang) {
        if (err || !lang) {
          res.redirect("/500");
        } else {
          req.session.lang = "es";
          textViewModel.getByGroupArray("es", ["general", 'index', "slugs"], function (err, text) {
            if (!err) {
              utils.loadData("es", null, null, null, coin, function (err, datas) {
                if (!err) {
                  renderPages(datas, "index", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                } else {
                  var status = "404";
                  req.body.local = true;
                  utils.goToIndex(req, res, status);
                }
              });
            } else {
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          });
        }
      });
    } catch (err) {
      console.error(err);
      res.redirect("/500");
    }
  });
  app.get(SINGLE_PATH_ROUTE, utils.construction, savePATH_ROUTE, function (req, res, next) {
    try {
      // if(req.params.slug === 'es'){
      //     res.redirect("/")
      // }
      // else{
      var coin = req.session.coin || null;
      utils.validateCulture(req.params.slug, function (lang) {
        if (lang) next();
        else {
          var culture = "es";
          req.session.lang = culture;
          utils.validateCulture(culture, function (lang) {
            if (lang) {
              textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
                if (!err) {
                  if (slugs) {
                    if (slugs.slug_about === req.params.slug) {
                      aboutController.aboutFunctions(culture, function (err, texts) {
                        if (!err) {
                          var metas = {
                            desc: texts.about_description_meta
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "about-us", lang, req.session.onlyRoutes, texts[0], null, texts[0].about_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_sailor_guide === req.params.slug) {
                      sailorController.sailorFunctions(culture, function (err, texts) {
                        if (!err) {
                          var metas = {
                            desc: texts.sailor_description_meta
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "sealer-guide", lang, req.session.onlyRoutes, texts[0], null, texts[0].sailor_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_frequently_questions === req.params.slug) {
                      frequentlyQuestionsController.frequentlyQuestionsFunctions(culture, function (err, texts) {
                        if (!err) {
                          var metas = {
                            desc: texts.description_meta
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "frequently-questions", lang, req.session.onlyRoutes, texts, null, texts.description_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_user_guide === req.params.slug) {
                      userController.userFunctions(culture, function (err, texts) {
                        if (!err) {
                          var metas = {
                            desc: texts.guide_description_meta
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "user-guide", lang, req.session.onlyRoutes, texts[0], null, texts[0].guide_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);

                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_announce === req.params.slug) {
                      rentShipController.rentFunctions(culture, function (err, texts) {
                        if (!err) {
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "rent-your-ship", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_private === req.params.slug) {
                      privateController.privateFunctions(culture, function (err, texts) {
                        if (!err) {
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "private-owner", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_enterprise === req.params.slug) {
                      enterpriseController.enterpriseFunctions(culture, function (err, texts) {
                        if (!err) {
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "enterprise-owner", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_privacy === req.params.slug) {
                      privacyController.privacyFunctions(culture, function (err, text) {
                        if (!err) {
                          var metas = {
                            desc: text.privacy_description_meta
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "privacy-politics", lang, req.session.onlyRoutes, text, null, text.privacy_title_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_conditions === req.params.slug) {
                      conditionsController.conditionsFunction(culture, function (err, text) {
                        if (!err) {
                          var metas = {
                            desc: text.conditions_title_description
                          };
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "service-conditions", lang, req.session.onlyRoutes, text, null, text.conditions_title_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else if (slugs.slug_access_user === req.params.slug) {
                      conditionsController.conditionsFunction(culture, function (err, text) {
                        utils.loadData(culture, null, null, null, coin, function (err, datas) {
                          if (!err) {
                            renderPages(datas, "login-user", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                          } else {
                            var status = "404";
                            req.body.local = true;
                            utils.goToIndex(req, res, status);
                          }
                        });
                      });
                    } else if (slugs.slug_access_owner === req.params.slug) {
                      conditionsController.conditionsFunction(culture, function (err, text) {
                        utils.loadData(culture, null, null, null, coin, function (err, datas) {
                          if (!err) {
                            renderPages(datas, "login-owner", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                          } else {
                            var status = "404";
                            req.body.local = true;
                            utils.goToIndex(req, res, status);
                          }
                        });
                      });
                    } else if (slugs.slug_map === req.params.slug) {
                      conditionsController.conditionsFunction(culture, function (err, text) {
                        utils.loadData(culture, null, null, null, coin, function (err, datas) {
                          if (!err) {
                            renderPages(datas, "map", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                          } else {
                            var status = "404";
                            req.body.local = true;
                            utils.goToIndex(req, res, status);
                          }
                        });
                      });
                    } else if (slugs.slug_answer === req.params.slug) {
                      var status = req.query.code ? parseInt(req.query.code) : null;
                      answerController.answerFunctions(culture, function (err, text) {
                        if (err || !text) {
                          status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        } else {
                          utils.loadData(culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "answer", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, status, null, null, null, null, null);
                            } else {
                              status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        }

                      });
                    } else if (slugs.slug_our_ships === req.params.slug) {
                      shipModelView.allships(culture, function (err, allships) {
                        if (!err) {
                          our_shipsController.our_shipsFunctions(culture, function (err, text) {
                            if (!err && text) {
                              utils.loadData(culture, null, null, null, coin, function (err, datas) {
                                if (!err) {
                                  renderPages(datas, "our-ships", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, allships, null, null, null, null);
                                } else {
                                  var status = "404";
                                  req.body.local = true;
                                  utils.goToIndex(req, res, status);
                                }
                              });
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      landingView.getAll(culture, function (err, landing) {
                        if (err || !landing) {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        } else {
                          var exist = false,
                            meta = "";

                          async.map(landing, function (lan, callback) {
                            if (lan && (req.params.slug === lan._doc.slug[0]._doc.value)) {
                              landingSelect = lan._doc;
                              exist = true;
                              var filter = [];
                              var date = req.query.startDate ? parseInt(req.query.startDate) : null;
                              var duration = req.query.duration;
                              var length = req.query.length === 0 ? null : req.query.length;
                              var number_p = req.query.number === 0 ? null : req.query.number;
                              var shipowner = req.query.shipowner === 0 ? null : req.query.shipowner;
                              meta = {
                                desc: lan._doc.description[0].value
                              };
                              var filterq = [],
                                sendfilter = {};
                              if (duration) {
                                var array = duration.split(",");
                                var quantity = parseInt(array[0]);
                                var unity = parseInt(array[1]);
                                configurationModelView.v2GetDurationanbyQandU(unity, quantity, function (err, dur) {
                                  if (!err) {
                                    duration = dur.toString();
                                    if (lan._doc.country !== "0") {
                                      filter.push(lan._doc.country.slug[0].value);
                                      filterq.push(lan._doc.country._id.toString());
                                      if (lan._doc.city !== "0") {
                                        filter.push(lan._doc.city.slug[0]._doc.value);
                                        filterq.push(lan._doc.city._id.toString());
                                        if (lan._doc.area !== "0") {
                                          filter.push(lan._doc.area.slug[0].value);
                                          filterq.push(lan._doc.area._id.toString());
                                          if (lan._doc.port !== "0") {
                                            filter.push(lan._doc.port.slug[0]._doc.value);
                                            filterq.push(lan._doc.port._id.toString());
                                            if (lan._doc.experience !== "0" && lan._doc.experience) {
                                              filter.push(lan._doc.experience.slug, req.query.duration, date);
                                              filterq.push(lan._doc.experience._id.toString(), duration, date);
                                            } else {
                                              filter.push("0", req.query.duration, date);
                                              filterq.push(null, duration, date);
                                            }


                                          } else {
                                            if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                              filter.push("0", lan._doc.experience.slug, req.query.duration, date);
                                              filterq.push(null, lan._doc.experience._id.toString(), duration, date);
                                            } else {
                                              filter.push("0", "0", req.query.duration, date);
                                              filterq.push(null, null, duration, date);
                                            }

                                          }

                                        } else {
                                          if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                            filter.push("0", "0", lan._doc.experience.slug, req.query.duration, date);
                                            filterq.push(null, null, lan._doc.experience._id.toString(), duration, date);
                                          } else {
                                            filter.push("0", "0", "0", req.query.duration, date);
                                            filterq.push(null, null, null, duration, date);
                                          }

                                        }


                                      } else {
                                        if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                          filter.push("0", "0", "0", lan._doc.experience.slug, req.query.duration, date);
                                          filterq.push(null, null, null, lan._doc.experience._id.toString(), duration, date);
                                        } else {
                                          filter.push("0", "0", "0", "0", req.query.duration, date);
                                          filterq.push(null, null, null, null, duration, date);
                                        }

                                      }


                                    } else {
                                      if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                        filter.push("0", "0", "0", "0", lan._doc.experience.slug, req.query.duration, date);
                                        filterq.push(null, null, null, null, lan._doc.experience._id.toString(), duration, date);
                                      } else {
                                        filter.push("0", "0", "0", "0", "0", req.query.duration, date);
                                        filterq.push(null, null, null, null, null, duration, date);
                                      }

                                    }
                                    if (lan._doc.shipType) {
                                      if (shipowner) {
                                        if (shipowner === "2") shipowner = parseInt(shipowner);
                                        else {
                                          shipowner = eval(shipowner);
                                          shipowner = shipowner ? 1 : 0;
                                        }
                                        filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                        filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                        sendfilter = {
                                          filter: filter,
                                          filterq: filterq
                                        };
                                        callback(false, sendfilter);
                                      } else {
                                        filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                        filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                        sendfilter = {
                                          filter: filter,
                                          filterq: filterq
                                        };
                                        callback(false, sendfilter);
                                      }


                                    } else {
                                      if (shipowner) {
                                        if (shipowner === "2") shipowner = parseInt(shipowner);
                                        else {
                                          shipowner = eval(shipowner);
                                          shipowner = shipowner ? 1 : 0;
                                        }
                                        filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                        filterq.push(null, length, number_p, shipowner);
                                        sendfilter = {
                                          filter: filter,
                                          filterq: filterq
                                        };
                                        callback(false, sendfilter);
                                      } else {
                                        filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                        filterq.push(null, length, number_p, null);
                                        sendfilter = {
                                          filter: filter,
                                          filterq: filterq
                                        };
                                        callback(false, sendfilter);
                                      }

                                    }
                                  } else {
                                    callback(err, false);
                                  }
                                });
                              } else {
                                if (lan._doc.country !== "0") {
                                  filter.push(lan._doc.country.slug[0].value);
                                  filterq.push(lan._doc.country._id.toString());
                                  if (lan._doc.city !== "0") {
                                    filter.push(lan._doc.city.slug[0]._doc.value);
                                    filterq.push(lan._doc.city._id.toString());
                                    if (lan._doc.area !== "0") {
                                      filter.push(lan._doc.area.slug[0].value);
                                      filterq.push(lan._doc.area._id.toString());
                                      if (lan._doc.port !== "0") {
                                        filter.push(lan._doc.port.slug[0]._doc.value);
                                        filterq.push(lan._doc.port._id.toString());
                                        if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                          filter.push(lan._doc.experience.slug, "0", date);
                                          filterq.push(lan._doc.experience._id.toString(), null, date);
                                        } else {
                                          filter.push("0", "0", date);
                                          filterq.push(null, null, date);
                                        }


                                      } else {
                                        if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                          filter.push("0", lan._doc.experience.slug, "0", date);
                                          filterq.push(null, lan._doc.experience._id.toString(), null, date);
                                        } else {
                                          filter.push("0", "0", "0", date);
                                          filterq.push(null, null, null, date);
                                        }

                                      }

                                    } else {
                                      if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                        filter.push("0", "0", lan._doc.experience.slug, "0", date);
                                        filterq.push(null, null, lan._doc.experience._id.toString(), null, date);
                                      } else {
                                        filter.push("0", "0", "0", "0", date);
                                        filterq.push(null, null, null, null, date);
                                      }

                                    }


                                  } else {
                                    if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                      filter.push("0", "0", "0", lan._doc.experience.slug, "0", date);
                                      filterq.push(null, null, null, lan._doc.experience._id.toString(), null, date);
                                    } else {
                                      filter.push("0", "0", "0", "0", "0", date);
                                      filterq.push(null, null, null, null, null, date);
                                    }

                                  }


                                } else {
                                  if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                    filter.push("0", "0", "0", "0", lan._doc.experience.slug, "0", date);
                                    filterq.push(null, null, null, null, lan._doc.experience._id.toString(), null, date);
                                  } else {
                                    filter.push("0", "0", "0", "0", "0", "0", date);
                                    filterq.push(null, null, null, null, null, null, date);
                                  }

                                }
                                if (lan._doc.shipType) {
                                  if (shipowner) {
                                    if (shipowner === "2") shipowner = parseInt(shipowner);
                                    else {
                                      shipowner = eval(shipowner);
                                      shipowner = shipowner ? 1 : 0;
                                    }
                                    filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                    filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  } else {
                                    filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                    filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  }


                                } else {
                                  if (shipowner) {
                                    if (shipowner === "2") shipowner = parseInt(shipowner);
                                    else {
                                      shipowner = eval(shipowner);
                                      shipowner = shipowner ? 1 : 0;
                                    }
                                    filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                    filterq.push(null, length, number_p, shipowner);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  } else {
                                    filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                    filterq.push(null, length, number_p, null);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  }

                                }
                              }
                            } else {
                              callback(false, null);
                            }
                          }, function (err, filters) {
                            if (err || !exist) {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            } else {
                              var filter = [],
                                filterq = [],
                                valid = false;
                              for (var i = 0; i < filters.length && !valid; i++) {
                                if (filters[i]) {
                                  filter = filters[i].filter;
                                  filterq = filters[i].filterq;
                                  valid = true;
                                }

                              }
                              if (_.isEmpty(filter) || _.isEmpty(filterq)) {
                                var status = "404";
                                req.body.local = true;
                                utils.goToIndex(req, res, status);
                              } else {
                                textViewModel.getByGroupArray(req.params.culture, ["general", "index", "slugs"], function (err, text) {
                                  if (!err) {
                                    utils.loadData(culture, null, null, filterq, coin, function (err, datas) {
                                      if (!err) {
                                        //datas, page, lang,routes, text, filters, title, metas, user, photos,cancel, booking,landingSelect,res, status,allships
                                        renderPages(datas, "index", lang, req.session.onlyRoutes, text, filter, datas[4][0], meta, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                                      } else {
                                        var status = "404";
                                        req.body.local = true;
                                        utils.goToIndex(req, res, status);
                                      }
                                    });
                                  } else {
                                    var status = "404";
                                    req.body.local = true;
                                    utils.goToIndex(req, res, status);
                                  }
                                });
                              }
                            }
                          });
                        }

                      });
                    }
                  } else {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                  }
                } else {
                  console.error(err);
                  res.redirect("/500");
                }
              });
            } else {
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          });
        }
      });

      // }
    } catch (e) {
      console.error(e);
      res.redirect("/500");
    }
  });
  app.get(PATH_ROUTE, utils.construction, savePATH_ROUTE, function (req, res, next) {
    try {
      var culture = req.params.culture;
      req.session.lang = culture;
      var coin = req.session.coin || null;
      utils.validateCulture(culture, function (lang) {
        if (lang) {
          textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
            if (!err) {
              if (slugs) {
                if (slugs.slug_about === req.params.slug) {
                  aboutController.aboutFunctions(culture, function (err, texts) {
                    if (!err) {
                      var metas = {
                        desc: texts.about_description_meta
                      };
                      utils.loadData(culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "about-us", lang, req.session.onlyRoutes, texts[0], null, texts[0].about_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_sailor_guide === req.params.slug) {
                  sailorController.sailorFunctions(culture, function (err, texts) {
                    if (!err) {
                      var metas = {
                        desc: texts.sailor_description_meta
                      };
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "sealer-guide", lang, req.session.onlyRoutes, texts[0], null, texts[0].sailor_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_frequently_questions === req.params.slug) {
                  frequentlyQuestionsController.frequentlyQuestionsFunctions(culture, function (err, texts) {
                    if (!err) {
                      var metas = {
                        desc: texts.description_meta
                      };
                      utils.loadData(culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "frequently-questions", lang, req.session.onlyRoutes, texts, null, texts.description_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_user_guide === req.params.slug) {
                  userController.userFunctions(culture, function (err, texts) {
                    if (!err) {
                      var metas = {
                        desc: texts.guide_description_meta
                      };
                      utils.loadData(culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "user-guide", lang, req.session.onlyRoutes, texts[0], null, texts[0].guide_title_meta, metas, req.user, texts[1], null, null, landingSelect, res, null, null, null, null, null, null);

                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_announce === req.params.slug) {
                  rentShipController.rentFunctions(culture, function (err, texts) {
                    if (!err) {
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "rent-your-ship", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_private === req.params.slug) {
                  privateController.privateFunctions(culture, function (err, texts) {
                    if (!err) {
                      utils.loadData(culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "private-owner", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_enterprise === req.params.slug) {
                  enterpriseController.enterpriseFunctions(culture, function (err, texts) {
                    if (!err) {
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "enterprise-owner", lang, req.session.onlyRoutes, texts, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_privacy === req.params.slug) {
                  privacyController.privacyFunctions(culture, function (err, text) {
                    if (!err) {
                      var metas = {
                        desc: text.privacy_description_meta
                      };
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "privacy-politics", lang, req.session.onlyRoutes, text, null, text.privacy_title_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_conditions === req.params.slug) {
                  conditionsController.conditionsFunction(culture, function (err, text) {
                    if (!err) {
                      var metas = {
                        desc: text.conditions_title_description
                      };
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "service-conditions", lang, req.session.onlyRoutes, text, null, text.conditions_title_meta, metas, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else if (slugs.slug_access_user === req.params.slug) {
                  conditionsController.conditionsFunction(culture, function (err, text) {
                    utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                      if (!err) {
                        renderPages(datas, "login-user", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  });
                } else if (slugs.slug_access_owner === req.params.slug) {
                  conditionsController.conditionsFunction(culture, function (err, text) {
                    utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                      if (!err) {
                        renderPages(datas, "login-owner", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  });
                } else if (slugs.slug_map === req.params.slug) {
                  conditionsController.conditionsFunction(culture, function (err, text) {
                    utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                      if (!err) {
                        renderPages(datas, "map", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  });
                } else if (slugs.slug_answer === req.params.slug) {
                  var status = req.query.code ? parseInt(req.query.code) : null;
                  answerController.answerFunctions(culture, function (err, text) {
                    if (err || !text) {
                      status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    } else {
                      utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                        if (!err) {
                          renderPages(datas, "answer", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, status, null, null, null, null, null);
                        } else {
                          status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    }

                  });
                } else if (slugs.slug_our_ships === req.params.slug) {
                  shipModelView.allships(culture, function (err, allships) {
                    if (!err) {
                      our_shipsController.our_shipsFunctions(culture, function (err, text) {
                        if (!err && text) {
                          utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                            if (!err) {
                              renderPages(datas, "our-ships", lang, req.session.onlyRoutes, text, null, datas[4][0], datas[3], req.user, null, null, null, landingSelect, res, null, allships, null, null, null, null);
                            } else {
                              var status = "404";
                              req.body.local = true;
                              utils.goToIndex(req, res, status);
                            }
                          });
                        } else {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        }
                      });
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                } else {
                  landingView.getAll(req.session.lang, function (err, landing) {
                    if (err || !landing) {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    } else {
                      var exist = false,
                        meta = "";

                      async.map(landing, function (lan, callback) {
                        if (lan && (req.params.slug === lan._doc.slug[0]._doc.value)) {
                          landingSelect = lan._doc;
                          exist = true;
                          var filter = [];
                          var date = req.query.startDate ? parseInt(req.query.startDate) : null;
                          var duration = req.query.duration;
                          var length = req.query.length === 0 ? null : req.query.length;
                          var number_p = req.query.number === 0 ? null : req.query.number;
                          var shipowner = req.query.shipowner === 0 ? null : req.query.shipowner;
                          meta = {
                            desc: lan._doc.description[0].value
                          };
                          var filterq = [],
                            sendfilter = {};
                          if (duration) {
                            var array = duration.split(",");
                            var quantity = parseInt(array[0]);
                            var unity = parseInt(array[1]);
                            configurationModelView.v2GetDurationanbyQandU(unity, quantity, function (err, dur) {
                              if (!err) {
                                duration = dur.toString();
                                if (lan._doc.country !== "0") {
                                  filter.push(lan._doc.country.slug[0].value);
                                  filterq.push(lan._doc.country._id.toString());
                                  if (lan._doc.city !== "0") {
                                    filter.push(lan._doc.city.slug[0]._doc.value);
                                    filterq.push(lan._doc.city._id.toString());
                                    if (lan._doc.area !== "0") {
                                      filter.push(lan._doc.area.slug[0].value);
                                      filterq.push(lan._doc.area._id.toString());
                                      if (lan._doc.port !== "0") {
                                        filter.push(lan._doc.port.slug[0]._doc.value);
                                        filterq.push(lan._doc.port._id.toString());
                                        if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                          filter.push(lan._doc.experience.slug, req.query.duration, date);
                                          filterq.push(lan._doc.experience._id.toString(), duration, date);
                                        } else {
                                          filter.push("0", req.query.duration, date);
                                          filterq.push(null, duration, date);
                                        }


                                      } else {
                                        if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                          filter.push("0", lan._doc.experience.slug, req.query.duration, date);
                                          filterq.push(null, lan._doc.experience._id.toString(), duration, date);
                                        } else {
                                          filter.push("0", "0", req.query.duration, date);
                                          filterq.push(null, null, duration, date);
                                        }

                                      }

                                    } else {
                                      if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                        filter.push("0", "0", lan._doc.experience.slug, req.query.duration, date);
                                        filterq.push(null, null, lan._doc.experience._id.toString(), duration, date);
                                      } else {
                                        filter.push("0", "0", "0", req.query.duration, date);
                                        filterq.push(null, null, null, duration, date);
                                      }

                                    }
                                  } else {
                                    if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                      filter.push("0", "0", "0", lan._doc.experience.slug, req.query.duration, date);
                                      filterq.push(null, null, null, lan._doc.experience._id.toString(), duration, date);
                                    } else {
                                      filter.push("0", "0", "0", "0", req.query.duration, date);
                                      filterq.push(null, null, null, null, duration, date);
                                    }
                                  }


                                } else {
                                  if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                    filter.push("0", "0", "0", "0", lan._doc.experience.slug, req.query.duration, date);
                                    filterq.push(null, null, null, null, lan._doc.experience._id.toString(), duration, date);
                                  } else {
                                    filter.push("0", "0", "0", "0", "0", req.query.duration, date);
                                    filterq.push(null, null, null, null, null, duration, date);
                                  }

                                }
                                if (lan._doc.shipType) {
                                  if (shipowner) {
                                    if (shipowner === "2") shipowner = parseInt(shipowner);
                                    else {
                                      shipowner = eval(shipowner);
                                      shipowner = shipowner ? 1 : 0;
                                    }
                                    filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                    filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  } else {
                                    filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                    filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  }


                                } else {
                                  if (shipowner) {
                                    if (shipowner === "2") shipowner = parseInt(shipowner);
                                    else {
                                      shipowner = eval(shipowner);
                                      shipowner = shipowner ? 1 : 0;
                                    }
                                    filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                    filterq.push(null, length, number_p, shipowner);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  } else {
                                    filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                    filterq.push(null, length, number_p, null);
                                    sendfilter = {
                                      filter: filter,
                                      filterq: filterq
                                    };
                                    callback(false, sendfilter);
                                  }

                                }
                              } else {
                                callback(err, false);
                              }
                            });
                          } else {
                            if (lan._doc.country !== "0") {
                              filter.push(lan._doc.country.slug[0].value);
                              filterq.push(lan._doc.country._id.toString());
                              if (lan._doc.city !== "0") {
                                filter.push(lan._doc.city.slug[0]._doc.value);
                                filterq.push(lan._doc.city._id.toString());
                                if (lan._doc.area !== "0") {
                                  filter.push(lan._doc.area.slug[0].value);
                                  filterq.push(lan._doc.area._id.toString());
                                  if (lan._doc.port !== "0") {
                                    filter.push(lan._doc.port.slug[0]._doc.value);
                                    filterq.push(lan._doc.port._id.toString());
                                    if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                      filter.push(lan._doc.experience.slug, "0", date);
                                      filterq.push(lan._doc.experience._id.toString(), null, date);
                                    } else {
                                      filter.push("0", "0", date);
                                      filterq.push(null, null, date);
                                    }
                                  } else {
                                    if (lan._doc.experience !== "0" && lan._doc.experience) {
                                      filter.push("0", lan._doc.experience.slug, "0", date);
                                      filterq.push(null, lan._doc.experience._id.toString(), null, date);
                                    } else {
                                      filter.push("0", "0", "0", date);
                                      filterq.push(null, null, null, date);
                                    }

                                  }

                                } else {
                                  filter.push("0");
                                  filterq.push(null);
                                  if (lan._doc.port !== "0") {
                                    filter.push(lan._doc.port.slug[0]._doc.value);
                                    filterq.push(lan._doc.port._id.toString());
                                    if (lan._doc.experience !== "0" && lan._doc.experience !== undefined && lan._doc.experience !== null) {
                                      filter.push(lan._doc.experience.slug, "0", date);
                                      filterq.push(lan._doc.experience._id.toString(), null, date);
                                    } else {
                                      filter.push("0", "0", date);
                                      filterq.push(null, null, date);
                                    }
                                  } else {
                                    if (lan._doc.experience !== "0" && lan._doc.experience !== undefined && lan._doc.experience !== null) {
                                      filter.push("0", lan._doc.experience.slug, "0", date);
                                      filterq.push(null, lan._doc.experience._id.toString(), null, date);
                                    } else {
                                      filter.push("0", "0", "0", date);
                                      filterq.push(null, null, null, date);
                                    }

                                  }

                                }


                              } else {
                                if (lan._doc.experience !== "0" && lan._doc.experience !== undefined && lan._doc.experience !== null) {
                                  filter.push("0", "0", "0", lan._doc.experience.slug, "0", date);
                                  filterq.push(null, null, null, lan._doc.experience._id.toString(), null, date);
                                } else {
                                  filter.push("0", "0", "0", "0", "0", date);
                                  filterq.push(null, null, null, null, null, date);
                                }

                              }


                            } else {
                              if (lan._doc.experience !== "0" && lan._doc.experience !== undefined) {
                                filter.push("0", "0", "0", "0", lan._doc.experience.slug, "0", date);
                                filterq.push(null, null, null, null, lan._doc.experience._id.toString(), null, date);
                              } else {
                                filter.push("0", "0", "0", "0", "0", "0", date);
                                filterq.push(null, null, null, null, null, null, date);
                              }

                            }
                            if (lan._doc.shipType) {
                              if (shipowner) {
                                if (shipowner === "2") shipowner = parseInt(shipowner);
                                else {
                                  shipowner = eval(shipowner);
                                  shipowner = shipowner ? 1 : 0;
                                }
                                filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                filterq.push(lan._doc.shipType._id.toString(), length, number_p, shipowner);
                                sendfilter = {
                                  filter: filter,
                                  filterq: filterq
                                };
                                callback(false, sendfilter);
                              } else {
                                filter.push(lan._doc.shipType.slug, req.query.length, req.query.number, req.query.shipowner, lan._doc.shipType._id.toString());
                                filterq.push(lan._doc.shipType._id.toString(), length, number_p, null);
                                sendfilter = {
                                  filter: filter,
                                  filterq: filterq
                                };
                                callback(false, sendfilter);
                              }


                            } else {
                              if (shipowner) {
                                if (shipowner === "2") shipowner = parseInt(shipowner);
                                else {
                                  shipowner = eval(shipowner);
                                  shipowner = shipowner ? 1 : 0;
                                }
                                filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                filterq.push(null, length, number_p, shipowner);
                                sendfilter = {
                                  filter: filter,
                                  filterq: filterq
                                };
                                callback(false, sendfilter);
                              } else {
                                filter.push("0", req.query.length, req.query.number, req.query.shipowner, "0");
                                filterq.push(null, length, number_p, null);
                                sendfilter = {
                                  filter: filter,
                                  filterq: filterq
                                };
                                callback(false, sendfilter);
                              }

                            }
                          }
                        } else {
                          callback(false, null);
                        }
                      }, function (err, filters) {
                        if (err || !exist) {
                          var status = "404";
                          req.body.local = true;
                          utils.goToIndex(req, res, status);
                        } else {
                          var filter = [],
                            filterq = [],
                            valid = false;
                          for (var i = 0; i < filters.length && !valid; i++) {
                            if (filters[i]) {
                              filter = filters[i].filter;
                              filterq = filters[i].filterq;
                              valid = true;
                            }

                          }
                          if (_.isEmpty(filter) || _.isEmpty(filterq)) {
                            var status = "404";
                            req.body.local = true;
                            utils.goToIndex(req, res, status);
                          } else {
                            textViewModel.getByGroupArray(req.params.culture, ["general", "index", "slugs"], function (err, text) {
                              if (!err) {

                                utils.loadData(culture, null, null, filterq, coin, function (err, datas) {
                                  if (!err) {
                                    //datas, page, lang,routes, text, filters, title, metas, user, photos,cancel, booking,landingSelect,res, status,allships
                                    renderPages(datas, "index", lang, req.session.onlyRoutes, text, filter, datas[4][0], meta, req.user, null, null, null, landingSelect, res, null, null, null, null, null, null);
                                  } else {
                                    var status = "404";
                                    req.body.local = true;
                                    utils.goToIndex(req, res, status);
                                  }
                                });
                              } else {
                                var status = "404";
                                req.body.local = true;
                                utils.goToIndex(req, res, status);
                              }
                            });
                          }
                        }
                      });
                    }

                  });
                }
              } else {
                var status = "404";
                req.body.local = true;
                utils.goToIndex(req, res, status);
              }
            } else {
              console.error(err);
              res.redirect("/500");
            }
          });
        } else {
          next();
          // var status = "404";
          // req.body.local = true;
          // utils.goToIndex(req, res, status);
        }
      });
    } catch (err) {
      console.error(err);
      res.redirect("/500");
    }
  });
  app.get(SINGLE_PATH, utils.construction, savePATH, function (req, res) {
    //req.session.lang = culture;
    try {
      var culture = "es";
      var slug = req.params.slug;
      var coin = req.session.coin || null;
      utils.validateCulture(culture, function (lang) {
        if (lang) {
          textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
            if (!err) {
              if (slugs.slug_pay_booking === req.params.name) {
                req.session.lang = culture;
                bookingController.bookingFunctions(culture, slug, coin, function (err, booking) {
                  if (err || !booking) {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(culture, null, null, null, coin, function (err, datas) {
                      if (!err) {
                        renderPages(datas, "pay_booking", lang, req.session.onlyRoutes, booking.text, null, datas[4][0], datas[3], req.user, null, false, booking, landingSelect, res, null, null, booking.book, null, true, booking.redsys);
                        // res.render(utils.front_path + utils.front_base, {
                        //     page: "pay_booking",
                        //     imgs: datas[2],
                        //     language: lang._doc.iso,
                        //     languages: datas[0],
                        //     texts: booking.text,
                        //     book: booking.book,
                        //     redsys: booking.redsys,
                        //     title: datas[4][0],
                        //     filters: null,
                        //     first: true,
                        //     cancel: false,
                        //     metas: datas[3],
                        //     slogans: datas[4],
                        //     landing: datas[5],
                        //     general_land: datas[6],
                        //     user: req.user,
                        //     symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol || "€",
                        //     routes: req.session.onlyRoutes,
                        //     landingSelect: landingSelect._id || null
                        // });
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  }

                });
              } else if (slugs.slug_newsletter === req.params.name) {
                req.session.lang = culture;
                newsletterController.newsletterFunction(culture, req.params.slug, coin, function (err, susc) {
                  if (err || !susc) {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(culture, null, null, null, coin, function (err, datas) {
                      if (!err && datas) {
                        renderPages(datas, "newsletter", lang, req.session.onlyRoutes, susc.text, null, datas[4][0], datas[3], req.user, null, false, null, landingSelect, res, null, null, null, susc.susc, null, null);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  }

                });
              } else if (slugs.slug_cancel_newsletter === req.params.name) {
                req.session.lang = culture;
                newsletterController.newsletterFunction(culture, req.params.slug, coin, function (err, susc) {
                  if (err || !susc) {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(culture, null, null, null, coin, function (err, datas) {
                      if (!err && datas) {
                        renderPages(datas, "newsletter", lang, req.session.onlyRoutes, susc.text, null, datas[4][0], datas[3], req.user, null, true, null, landingSelect, res, null, null, null, susc.susc, null, null);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  }

                });
              } else if (slugs.slug_cancel_booking === req.params.name) {
                var status = "404";
                req.body.local = true;
                utils.goToIndex(req, res, status);
                // cancelbookingController.cancelFunctions(culture,req.params.slug,coin, function (err, book) {
                //     if(err || !book){
                //         var status = "404";
                //         req.body.local = true;
                //         utils.goToIndex(req, res, status);
                //     }else{
                //         utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                //             if (!err) {
                //                 res.render(utils.front_path + utils.front_base, {
                //                     page: 'pay_booking',
                //                     imgs: datas[2],
                //                     language: lang._doc.iso,
                //                     languages: datas[0],
                //                     texts: book.text,
                //                     title:datas[4][0],
                //                     book:book.book,
                //                     filters: null,
                //                     title:datas[4][0],
                //                     cancel:true,
                //                     first:null,
                //                     metas: datas[3],
                //                     slogans: datas[4],
                //                     landing: datas[5],
                //                      general_land: datas[6],
                //                     user: req.user,
                //                     symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol || "€",
                //                     routes: req.session.onlyRoutes,landingSelect:landingSelect._id||null
                //                 });
                //             } else {
                //                 var status = "404";
                //                 req.body.local = true;
                //                 utils.goToIndex(req, res, status);
                //             }
                //         });
                //     }
                //
                // })
              } else if (slugs.slug_second_pay === req.params.name) {
                req.session.lang = culture;
                secondPayController.secondpayFunctions(culture, req.params.slug, coin, function (err, book) {
                  if (err || !book) {
                    var status = "404";
                    req.body.local = true;
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(culture, null, null, null, coin, function (err, datas) {
                      if (!err) {
                        renderPages(datas, "pay_booking", lang, req.session.onlyRoutes, book.text, null, datas[4][0], datas[3], req.user, null, false, null, landingSelect, res, null, null, book.book, null, false, book.redsys);
                      } else {
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      }
                    });
                  }

                });
              } else {
                var status = "404";
                req.body.local = true;
                utils.goToIndex(req, res, status);
              }
            } else {
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          });
        } else {
          var status = "404";
          req.body.local = true;
          utils.goToIndex(req, res, status);
        }
      });
    } catch (error) {
      console.error(error);
      res.redirect("/500");
    }

  });
  app.get(PATH, utils.construction, savePATH, function (req, res, next) {
    var culture = req.params.culture;
    var coin = req.session.coin || null;
    var slug = req.params.slug || null;
    utils.validateCulture(culture, function (lang) {
      if (lang) {
        req.session.lang = culture;
        textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
          if (!err) {
            if (slugs.slug_pay_booking === req.params.name) {
              req.session.lang = culture;
              bookingController.bookingFunctions(culture, slug, coin, function (err, booking) {
                if (err || !booking) {
                  var status = "404";
                  req.body.local = true;
                  utils.goToIndex(req, res, status);
                } else {
                  utils.loadData(culture, null, null, null, coin, function (err, datas) {
                    if (!err) {
                      renderPages(datas, "pay_booking", lang, req.session.onlyRoutes, booking.text, null, datas[4][0], datas[3], req.user, null, false, booking, landingSelect, res, null, null, booking.book, null, true, booking.redsys);
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                }

              });
            } else if (slugs.slug_newsletter === req.params.name) {
              req.session.lang = culture;
              newsletterController.newsletterFunction(culture, req.params.slug, coin, function (err, susc) {
                if (err || !susc) {
                  var status = "404";
                  req.body.local = true;
                  utils.goToIndex(req, res, status);
                } else {
                  utils.loadData(culture, null, null, null, coin, function (err, datas) {
                    if (!err && datas) {
                      renderPages(datas, "newsletter", lang, req.session.onlyRoutes, susc.text, null, datas[4][0], datas[3], req.user, null, false, null, landingSelect, res, null, null, null, susc.susc, null, null);
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                }

              });
            } else if (slugs.slug_cancel_newsletter === req.params.name) {
              req.session.lang = culture;
              newsletterController.newsletterFunction(culture, req.params.slug, coin, function (err, susc) {
                if (err || !susc) {
                  var status = "404";
                  req.body.local = true;
                  utils.goToIndex(req, res, status);
                } else {
                  utils.loadData(culture, null, null, null, coin, function (err, datas) {
                    if (!err && datas) {
                      renderPages(datas, "newsletter", lang, req.session.onlyRoutes, susc.text, null, datas[4][0], datas[3], req.user, null, true, null, landingSelect, res, null, null, null, susc.susc, null, null);
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                }

              });
            } else if (slugs.slug_cancel_booking === req.params.name) {
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
              // cancelbookingController.cancelFunctions(culture,req.params.slug,coin, function (err, book) {
              //     if(err || !book){
              //         var status = "404";
              //         req.body.local = true;
              //         utils.goToIndex(req, res, status);
              //     }else{
              //         utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
              //             if (!err) {
              //                 res.render(utils.front_path + utils.front_base, {
              //                     page: 'pay_booking',
              //                     imgs: datas[2],
              //                     language: lang._doc.iso,
              //                     languages: datas[0],
              //                     texts: book.text,
              //                     title:datas[4][0],
              //                     book:book.book,
              //                     filters: null,
              //                     title:datas[4][0],
              //                     cancel:true,
              //                     first:null,
              //                     metas: datas[3],
              //                     slogans: datas[4],
              //                     landing: datas[5],
              //                      general_land: datas[6],
              //                     user: req.user,
              //                     symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol || "€",
              //                     routes: req.session.onlyRoutes,landingSelect:landingSelect._id||null
              //                 });
              //             } else {
              //                 var status = "404";
              //                 req.body.local = true;
              //                 utils.goToIndex(req, res, status);
              //             }
              //         });
              //     }
              //
              // })
            } else if (slugs.slug_second_pay === req.params.name) {
              req.session.lang = culture;
              secondPayController.secondpayFunctions(culture, req.params.slug, coin, function (err, book) {
                if (err || !book) {
                  var status = "404";
                  req.body.local = true;
                  utils.goToIndex(req, res, status);
                } else {
                  utils.loadData(culture, null, null, null, coin, function (err, datas) {
                    if (!err) {
                      renderPages(datas, "pay_booking", lang, req.session.onlyRoutes, book.text, null, datas[4][0], datas[3], req.user, null, false, null, landingSelect, res, null, null, book.book, null, false, book.redsys);
                    } else {
                      var status = "404";
                      req.body.local = true;
                      utils.goToIndex(req, res, status);
                    }
                  });
                }

              });
            } else {
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          } else {
            var status = "404";
            req.body.local = true;
            utils.goToIndex(req, res, status);
          }
        });
      } else {
        next();
        // var status = "404";
        // req.body.local = true;
        // utils.goToIndex(req, res, status);
      }
    });
  });
  app.get(SINGLE_PATH_SHIP, utils.construction, savePATH_SHIP, function (req, res) {
    try {
      var culture = "es";
      var coin = req.session.coin || null;
      utils.validateCulture(culture, function (lang) {
        if (lang) {
          textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
            if (!err && slugs) {
              if (slugs.slug_ship === req.params.name) {
                req.session.lang = culture;
                shipController.shipFunctions(culture, req.params.slug, req.params.xp, coin, function (err, array) {
                  if (err || !array) {
                    console.log("no ship");
                    var status = "404";
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(culture, null, null, null, coin, function (err, datas) {
                      if (err || !datas) {
                        console.log("no datas");
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      } else {
                        if (array.ship.seasons.length && array.ship.seasons[0].experiences.length) {
                          var cont = 0;
                          for (var i = 0; i < datas[2].length; i++) {
                            datas[2][i].text = datas[4][cont];
                            cont++;
                            if (cont >= datas[4].length) {
                              cont = 0;
                            }
                          }
                          res.render(utils.front_path + utils.front_base, {
                            page: "ship-details",
                            imgs: datas[2],
                            ship: array.ship,
                            ships: datas[1],
                            language: lang._doc.iso,
                            languages: datas[0],
                            texts: array.text,
                            title: datas[4][0],
                            filters: [],
                            recomendation: array.recomend,
                            metas: datas[3],
                            slogans: datas[4],
                            landing: datas[5],
                            general_land: datas[6],
                            durations: datas[7].durations,
                            experiences: datas[7].experiences,
                            user: req.user,
                            symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
                            routes: req.session.onlyRoutes,
                            landingSelect: landingSelect._id || null,
                            noindex: array.ship.noindex,
                            nofollow: array.ship.nofollow,
                            landingsMenu: datas[10],
                            textsMenu: datas[11],
                            currenciesMenu: datas[12]
                          });
                        } else {
                          console.log("no lang");
                          var status = "404";
                          utils.goToIndex(req, res, status);
                        }

                      }
                    });
                  }
                });
              } else {
                console.log("no match with slug name");
                var status = "404";
                req.body.local = true;
                utils.goToIndex(req, res, status);
              }
            } else {
              console.log("no slugs");
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          });
        } else {
          console.log("no lang");
          var status = "404";
          utils.goToIndex(req, res, status);
        }
      });
    } catch (err) {
      console.error(err);
      res.redirect("/500");
    }
  });
  app.get(PATH_SHIP, utils.construction, savePATH_SHIP, function (req, res, next) {
    try {
      var culture = req.params.culture;
      req.session.lang = culture;
      var coin = req.session.coin || null;
      utils.validateCulture(culture, function (lang) {
        if (lang) {
          textViewModel.getByGroupArray(culture, ["slugs"], function (err, slugs) {
            if (!err && slugs) {
              if (slugs.slug_ship === req.params.name) {
                shipController.shipFunctions(culture, req.params.slug, req.params.xp, coin, function (err, array) {
                  if (err || !array) {
                    console.log("no ship");
                    var status = "404";
                    utils.goToIndex(req, res, status);
                  } else {
                    utils.loadData(req.params.culture, null, null, null, coin, function (err, datas) {
                      if (err || !datas) {
                        console.log("no datas");
                        var status = "404";
                        req.body.local = true;
                        utils.goToIndex(req, res, status);
                      } else {
                        if (array.ship.seasons.length && array.ship.seasons[0].experiences.length) {
                          res.render(utils.front_path + utils.front_base, {
                            page: "ship-details",
                            imgs: datas[2],
                            ship: array.ship,
                            language: lang._doc.iso,
                            languages: datas[0],
                            texts: array.text,
                            title: datas[4][0],
                            filters: null,
                            recomendation: array.recomend,
                            metas: datas[3],
                            slogans: datas[4],
                            landing: datas[5],
                            general_land: datas[6],
                            durations: datas[7].durations,
                            experiences: datas[7].experiences,
                            user: req.user,
                            symbol: datas[1].list[0].seasons[0].experiences[0].durations[0].symbol,
                            routes: req.session.onlyRoutes,
                            landingSelect: landingSelect._id || null,
                            noindex: array.ship.noindex,
                            nofollow: array.ship.nofollow,
                            landingsMenu: datas[10],
                            textsMenu: datas[11],
                            currenciesMenu: datas[12]
                          });
                        } else {
                          console.log("no lang");
                          var status = "404";
                          utils.goToIndex(req, res, status);
                        }

                      }
                    });
                  }
                });
              } else {
                console.log("no match with slug name");
                var status = "404";
                req.body.local = true;
                utils.goToIndex(req, res, status);
              }
            } else {
              console.log("no slugs");
              var status = "404";
              req.body.local = true;
              utils.goToIndex(req, res, status);
            }
          });
        } else {
          next();
          // console.log("no lang");
          // var status = "404";
          // utils.goToIndex(req, res, status);
        }
      });
    } catch (err) {
      console.error(err);
      res.redirect("/500");
    }
  });
};