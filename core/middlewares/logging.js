/**
 * Created by ernestomr87@gmail.com on 10/01/15.
 */

global.passport = require("passport");
global.localStrategy = require("passport-local").Strategy;

function formatUser(user) {

  try {
    var us = {
      _id: user._doc._id.toString(),
      name: user._doc.name,
      surname: user._doc.surname,
      slug: user._doc.slug,
      email: user._doc.email,
      // telephone: user._doc.telephone,
      mobile: user._doc.mobile,
      registerDate: user._doc.registerDate,
      permissions: user._doc.permissions,
      address: user._doc.address,
      status: user._doc.status,
      avatar: user._doc.avatar,
      complete: user._doc.complete,
      language: {
        _id: user._doc.language._id,
        iso: user._doc.language.iso,
        name: user._doc.language.name
      },
      contact: user._doc.contact,
      invoice: user._doc.invoice,
      web: user._doc.web,
      accept: user._doc.accept
    };
    return us;
  }
  catch (err) {
    return false;
  }
}

exports.configPassport = function (app) {
  passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
  },
    function (email, password, done) {
      db.Users.findOne({email: email, status: true})
        .populate("language")
        .exec(function (err, user) {
          if (err || !user)
            return done(null, false);

          user.validPassword(password, function (err, isValid) {
            if (err || !isValid)
              return done(null, false);

            var us = formatUser(user);
            if (us) {
              return done(null, us);
            }
            else {
              return done(true, false);
            }
          });
        });
    }
  ));
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    if (id) {
      db.Users.findOne({_id: id})
        .populate("language")
        .exec(function (err, user) {

          var us = formatUser(user);
          if (us) {
            done(err, us);
          }
          else {
            done(true, false);
          }


        });
    }
    else {
      done(true, false);
    }
  });
  app.use(passport.initialize());
  app.use(passport.session());
};