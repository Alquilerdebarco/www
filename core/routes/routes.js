/**
 * Created by ernestomr87@gmail.com on 11/25/2015.
 */
//var iconv = require('iconv-lite');
var mediaView = require("./../App/viewModels/mediaViewModel");
var PATH_MEDIA = "/service/media";
var session = require("./../middlewares/session");

function logout(req, res, next) {
  req.logout();
  return next();
}

exports.configRoutes = function (app) {

    /*CONTROLLERS*/
  require("./../App/controllers/userController").registerRoutes(app);
  require("./../App/controllers/languageController").registerRoutes(app);
  require("./../App/controllers/localizationController").registerRoutes(app);
  require("./../App/controllers/shipController").registerRoutes(app);
  require("./../App/controllers/textController").registerRoutes(app);
  require("./../App/controllers/configurationController").registerRoutes(app);
  require("./../App/controllers/notificationController").registerRoutes(app);
  require("./../App/controllers/requestController").registerRoutes(app);
  require("./../App/controllers/offerController").registerRoutes(app);
    // require('./../App/controllers/messageController').registerRoutes(app);
  require("./../App/controllers/engineController").registerRoutes(app);
  require("./../App/controllers/subscriptionController").registerRoutes(app);
  require("./../App/controllers/landingController").registerRoutes(app);
  require("./../App/controllers/particularController").registerRoutes(app);

    /*MEDIA SERVICE*/
  app.get(PATH_MEDIA + "/:id", function (req, res) {
    mediaView.get(req.params.id, function (err, data) {
      if (err || !data) {
        return res.json({res: false});
      }
      else {
        res.contentType(data._doc.contentType);
        res.end(data._doc.data, "binary");
      }
    });
  });


    /*VISTAS LOAD-DATA*/
  require("./../../tools/mongo/express/routes").configRoutes(app);
    /*VISTAS Back-End*/
  require("./back-routes").configRoutes(app);

    /*VISTAS Comunes*/

  app.post("/service/session", function (req, res) {
    var se = req.user || null;
    res.json({res: se});
  });

  app.post("/login", logout,
        passport.authenticate("local", {
          successRedirect: "/",
          failureRedirect: "/backoffice/login/failure",
          failureFlash: false
        })
    );
  app.post("/access-users", function(req, res, next) {
    passport.authenticate("local", function(err, user) {
      if (err || !user) {
        return res.json({ res: false, error: err });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.json({ res: false, error: err });
        }
        return res.json({ res: true, error: err});
      });
    })(req, res, next);
  });
  app.post("/Blogin", logout,
        passport.authenticate("local", {
          successRedirect: "/backoffice",
          failureRedirect: "/backoffice/login/failure",
          failureFlash: false
        })
    );
  app.get("/logout", session.nocache, function (req, res) {
    req.logout();
    res.redirect("/");
  });
  app.get("/Blogout", session.nocache, function (req, res) {
    req.logout();
    res.redirect("/");
  });


    /*VISTAS Front-End*/
  app.get("/500", function (req, res) {
    var status = 500;
    var message = "Internal Server Error";
    var error = {
      status: status,
      stack: "Not available"
    };
    res.render("frontEnd/500", {
      message: message,
      error: error
    });
  });

  require("../App/front-controllers/changecurrencyController").configRoutes(app);
    //require('../App/front-controllers/paginate&filtersController').configRoutes(app);//filtro paginado
  require("./front-routes").configRoutes(app);
  require("../App/front-controllers/homeController").configRoutes(app);
  require("../App/front-controllers/filtershipdetailsController").configRoutes(app);//detalle filtro

};