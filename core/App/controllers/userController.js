/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

var _ = require("lodash");
var userViewModel = require("./../../App/viewModels/userViewModel");

var session = require("./../../middlewares/session");

var PATH = "/service/users";
user = {
  registerRoutes: function (app) {

    app.get(PATH, session.isAdmin, this.list);
    app.post(PATH, session.isAdmin, this.create);
    app.put(PATH, session.isAdmin, this.update);
    app.delete(PATH, session.isAdmin, this.remove);
    app.post(PATH + "/permissions", session.isAdmin, this.permissionsAdmin);
    app.put(PATH + "/permissions", session.isAdmin, this.permissionsOwner);
    app.post(PATH + "/register", this.register);
    app.post(PATH + "/invoice", session.auth, this.invoice);
    app.post(PATH + "/profile", session.auth, this.profile);
    app.post(PATH + "/contract", session.auth, this.contract);
    app.post(PATH + "/accept", session.auth, this.accept);
    app.post(PATH + "/avatar/:id", multipartMiddleware, this.avatar);
    app.post(PATH + "/status", this.status);
    app.get(PATH + "/activate/:key", this.activate);
    app.post(PATH + "/apply-change-password", this.applyChangePassword);
    app.post(PATH + "/change-password", this.changePassword);
    app.post(PATH + "/user-change-password", this.userChangePassword);

  },
  create: function (req, res) {
    var name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      password = req.body.password,
      password2 = req.body.password2,
      // telephone = req.body.telephone,
      telephone = null,
      mobile = req.body.mobile,
      address = req.body.address,
      permissions = req.body.permissions || null;
    var error = {
      errmsg: ""
    };
    if (_.isEmpty(name) || _.isEmpty(surname) ||
      _.isEmpty(email) || _.isEmpty(password) || _.isEmpty(address)) {
      var error = {
        message: "Formulario Incorrecto."
      };
      res.json({
        res: false,
        error: error
      });
    }
    if (password2 != password) {
      error.errmsg = "Form incorrect";
      res.json({
        res: false,
        error: error
      });
    } else {
      userViewModel.create(name, surname, email, password, telephone, mobile, address, permissions, false, "", req.session.lang, function (err, user) {
        return res.json({
          res: user,
          error: err
        });
      });
    }
  },
  register: function (req, res) {
    var name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      password = req.body.password,
      password2 = req.body.password2,
      // telephone = req.body.telephone,
      telephone = null,
      mobile = req.body.mobile,
      typeShipOwner = req.body.typeShipOwner == "" ? null : req.body.typeShipOwner,
      address = req.body.address,
      subscription = req.body.subscription,
      web = req.body.web;

    if (_.isEmpty(name) || _.isEmpty(surname) || _.isEmpty(email) || _.isEmpty(password) || _.isEmpty(address) || password2 != password) {
      var error = {
        message: "Formulario Incorrecto."
      };
      return res.json({
        res: false,
        error: error
      });
    }

    userViewModel.create(name, surname, email, password, telephone, mobile, address, typeShipOwner, subscription, web, req.session.lang, function (err, user) {
      var resp = false;
      if (user) resp = true;
      return res.json({
        res: resp,
        error: err
      });
    });


  },
  update: function (req, res) {
    var id = req.body.id,
      name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      // telephone = req.body.telephone,
      telephone = null,
      mobile = req.body.mobile || null,
      permissions = req.body.permissions,
      address = req.body.address,
      web = req.body.web || null,
      commission = req.body.commission ? req.body.commission : null;


    if (_.isEmpty(name) || _.isEmpty(surname) ||
      _.isEmpty(email) || _.isEmpty(address)) {
      var error = {
        message: "Formulario Incorrecto."
      };
      res.json({
        res: false,
        error: error
      });
    } else {
      userViewModel.update(id, name, surname, email, telephone, mobile, address, permissions, commission, web, function (err, user) {
        return res.json({
          res: user,
          error: err
        });
      });
    }
  },
  profile: function (req, res) {
    var id = req.user._id.toString(),
      name = req.body.name,
      surname = req.body.surname,
      email = req.body.email,
      // telephone = req.body.telephone,
      telephone = null,
      mobile = req.body.mobile || null,
      permissions = req.body.permissions,
      address = req.body.address,
      web = req.body.web || null;


    if (_.isEmpty(name) || _.isEmpty(surname) ||
      _.isEmpty(email) || _.isEmpty(address)) {
      var error = {
        message: "Formulario Incorrecto."
      };
      res.json({
        res: false,
        error: error
      });
    } else {
      userViewModel.update(id, name, surname, email, telephone, mobile, address, permissions, null, web, function (err, user) {
        if (err || !user) {
          return res.json({
            res: user,
            error: err
          });
        } else {
          return res.json({
            res: user
          });
        }
      });
    }
  },
  list: function (req, res) {
    var limit = req.query.limit;
    var skip = req.query.skip;
    var string = req.query.string;
    var status = req.query.status;
    var permissions = req.query.permissions;
    var user = req.user;
    var sortOptions = req.query.sortOptions ? JSON.parse(req.query.sortOptions) : null;
    userViewModel.list(limit, skip, string, status, permissions, sortOptions, user, function (err, user, count) {
      if (err || !user) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: user,
          cont: count
        });
      }
    });
  },
  get: function (req, res) {
    var id = req.query.id;
    userViewModel.get(id, function (err, user) {
      if (err || !user) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: user
        });
      }
    });
  },
  activate: function (req, res) {
    req.logout();
    var key = req.query.key;
    if (!key) {
      key = req.originalUrl.replace("/service/users/activate/", "");
    }

    userViewModel.activate(key, function (err, user) {
      if (err || !user) {
        return res.redirect("/backoffice/login/activate/failure");
      } else {
        var us = {
          _id: user._doc._id.toString(),
          name: user._doc.name,
          surname: user._doc.surname,
          slug: user._doc.slug,
          email: user._doc.email,
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
          invoice: user._doc.invoice
        };
        req.logIn(us, function () {
          return res.redirect("/backoffice");
        });

      }
    });
  },
  status: function (req, res) {
    var id = req.body.id;
    userViewModel.status(id, function (err, user) {
      if (err || !user) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: user,
          err: err
        });
      }
    });
  },
  avatar: function (req, res) {
    var id = req.originalUrl.replace("/service/users/avatar/", "");
    var file = {
      data: req.body.data,
      contentType: req.body.contentType,
      fieldName: req.body.fieldName,
      name: req.body.name
    };
    userViewModel.addAvatar(id, file, function (err, user) {
      if (err || !user) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          res: user,
          error: err
        });

      }

    });
  },
  remove: function (req, res) {
    var id = req.query.id;
    var email = req.query.email;
    if (id == req.user._id.toString()) {
      var error = {
        message: "Lo sentimos! Usted no puede eliminarse."
      };
      return res.json({
        res: false,
        error: error
      });
    } else {
      userViewModel.remove(id, email, function (err, user) {
        if (err || !user) {
          return res.json({
            res: false,
            error: err
          });
        } else {
          return res.json({
            res: user
          });
        }
      });
    }


  },
  applyChangePassword: function (req, res) {
    var email = req.body.email;
    userViewModel.applyChangePassword(email, function (err, activationKey) {
      if (err || !activationKey) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        //Enviar Correo
        return res.json({
          res: true
        });
      }
    });
  },
  changePassword: function (req, res) {
    var id = req.body.id;
    var token = req.body.token;
    var password = req.body.password;
    var password2 = req.body.password2;


    if (_.isEmpty(id) || _.isEmpty(token) || _.isEmpty(password) || _.isEmpty(password2)) {
      error.errmsg = "Form incorrect";
      res.json({
        res: false,
        error: error
      });
    }
    if (password2 != password) {
      error.errmsg = "Form incorrect";
      res.json({
        res: false,
        error: error
      });
    } else {
      userViewModel.changePassword(id, token, password, function (err, success) {
        if (err || !success) {
          return res.json({
            res: false,
            error: err
          });
        } else {
          return res.json({
            res: true
          });
        }
      });
    }

  },
  userChangePassword: function (req, res) {
    var id = req.body.id;
    var password = req.body.password;
    var password2 = req.body.password2;


    if (_.isEmpty(id) || _.isEmpty(password) || _.isEmpty(password2)) {
      var error = {
        message: "Formulario Incorrecto"
      };
      res.json({
        res: false,
        error: error
      });
    } else if (password2 != password) {
      var error = {
        message: "Formulario Incorrecto"
      };
      res.json({
        res: false,
        error: error
      });
    } else if (req.user.permissions.isAdmin || req.user._id.toString() == id) {
      userViewModel.userChangePassword(id, password, function (err, success) {
        if (err || !success) {
          return res.json({
            res: false,
            error: err
          });
        } else {
          return res.json({
            res: true
          });
        }
      });
    } else {
      var error = {
        message: "No tiene permisos para realizar la acción"
      };

      res.json({
        res: false,
        error: error
      });
    }

  },
  permissionsAdmin: function (req, res) {
    var id = req.body.id;
    userViewModel.permissionsAdmin(id, function (err, user) {
      if (err || !user) {
        return res.json({
          res: user,
          error: err
        });
      } else {
        return res.json({
          res: user,
          err: err
        });
      }
    });
  },
  permissionsOwner: function (req, res) {
    var id = req.body.id;
    userViewModel.permissionsOwner(id, function (err, user) {
      if (err || !user) {
        return res.json({
          res: user,
          error: err
        });
      } else {
        return res.json({
          res: user,
          err: err
        });
      }
    });
  },
  invoice: function (req, res) {
    var fiscalName = req.body.fiscalName || null;
    var nifCif = req.body.nifCif || null;
    var dni = req.body.dni || null;
    var swift = req.body.swift || null;
    var iban = req.body.iban || null;
    var email = req.body.email || null;
    var mobile = req.body.mobile || null;
    var address = req.body.address || null;
    var postalCode = req.body.postalCode || null;
    var city = req.body.city || null;
    var country = req.body.country || null;

    userViewModel.invoice(req.user._id, fiscalName, nifCif, dni, swift, iban, email, mobile, address, postalCode, city, country, function (err, user) {
      if (err || !user) {
        return res.json({
          res: user,
          error: err
        });
      } else {
        return res.json({
          res: user
        });
      }
    });
  },
  contract: function (req, res) {
    var id = req.user._id;
    var lang = req.session.lang || "es";
    userViewModel.contract(id, lang, function (err, contract) {
      if (err || !contract) {
        return res.json({
          res: false,
          error: err
        });
      } else {
        return res.json({
          error: false,
          res: contract
        });
      }
    });
  },
  accept: function (req, res) {
    var id = req.user._id;
    var accept = req.body.accept;
    if (accept == "on") {
      accept = true;
    }
    else {
      accept = false;
    }
    userViewModel.accept(id, accept, function () {
      res.redirect("/backoffice");
    });
  }
};
module.exports = user;