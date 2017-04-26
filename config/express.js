/**
 * Created by ernestomr87@gmail.com on 12/1/2015.
 */

var express = require("express");
var path = require("path");

//var compression = require('compression');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var ejs = require("ejs"),
  LRU = require("lru-cache");
var session = require("express-session");
var connectMongostore = require("connect-mongostore")(session);
var conf = {
  secret: "076ee61d63aa10a125ea872411e433b9"
};

exports.configExpress = function (app) {
  app.set("view engine", "ejs");
  ejs.cache = LRU(100);
  app.locals.pretty = true;
  app.set("views", path.join(__dirname, "../core/views"));
  app.use(logger("dev"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    secret: conf.secret,
    resave: false,
    saveUninitialized: true,
    store: new connectMongostore(global.config.mongoUrl),
    cookie: { maxAge: 1000 * 60 * 60 * 12 }
  }));
  app.use(express.static(path.join(__dirname, "../core/public")));
};
