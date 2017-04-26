/**
 * Created by ernestomr87@gmail.com on 10/01/15.
 */

'use strict';
var userViewModel = require('./../App/viewModels/userViewModel');

var sessionFunctions = {
    socketAuth: function (req, cb) {
        var user = false;
        if (req.data.userOne == req.session.passport.user) {
            user = req.data.userOne;
        }
        else if (req.data.userTwo == req.session.passport.user) {
            user = req.data.userTwo;
        }

        if (user) {
            userViewModel.get(user, function (err, user) {
                cb(err, user);
            });
        }
        else {
            cb(null, user);
        }

    },
    auth: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    return next();
                }
                else {
                    req.logOut();
                    return res.redirect('/backoffice/login');
                }
            })
        }
        else {
            req.logOut();
            return res.redirect('/backoffice/login');
        }
    },
    authService: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    return next();
                }
                else {
                    req.logOut();
                    var error = {
                        message: "Sorry! You don't have permissions",
                        code: 666
                    };
                    return res.json({res: false, error: error})
                }
            })
        }
        else {
            req.logOut();
            var error = {
                message: "Sorry! You don't have permissions",
                code: 666
            };
            return res.json({res: false, error: error})
        }
    },


    noAuth: function (req, res, next) {
        if (req.user) {
            if (req.user.permissions.isAdmin) {
                return res.redirect('/backoffice');
            }
            else {
                return res.redirect('/');
            }
        }
        else {
            return next()
        }
    },
    isAdmin: function (req, res, next) {
        var is_admin = req.user && req.user.permissions.isAdmin;
        return is_admin ? next() : res.redirect('/backoffice/login');
    },
    isShipOwner: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    var isShipOwner = req.user && req.user.permissions.isShipOwner;
                    if (isShipOwner) {
                        return next();
                    }
                    else {
                        req.logOut();
                        return res.redirect('/backoffice/login');
                    }

                }
                else {
                    req.logOut();
                    return res.redirect('/backoffice/login');
                }
            })
        }
        else {
            req.logOut();
            return res.redirect('/backoffice/login');
        }

    },
    isShipOwnerService: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    var isShipOwner = req.user && req.user.permissions.isShipOwner;
                    if (isShipOwner) {
                        return next();
                    }
                    else {
                        req.logOut();
                        var error = {
                            message: "Sorry! You don't have permissions",
                            code: 666
                        };
                        return res.json({res: false, error: error})
                    }

                }
                else {
                    req.logOut();
                    var error = {
                        message: "Sorry! You don't have permissions",
                        code: 666
                    };
                    return res.json({res: false, error: error})
                }
            })
        }
        else {
            req.logOut();
            var error = {
                message: "Sorry! You don't have permissions",
                code: 666
            };
            return res.json({res: false, error: error})
        }

    },
    hasPermitions: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    var is_admin = req.user && req.user.permissions.isAdmin;
                    var isShipOwner = req.user && req.user.permissions.isShipOwner;
                    var permission = is_admin || isShipOwner;
                    if (permission) {
                        return next();
                    }
                    else {
                        req.logOut();
                        return res.redirect('/backoffice/login');
                    }
                }
                else {
                    req.logOut();
                    return res.redirect('/backoffice/login');
                }
            })
        }
        else {
            req.logOut();
            return res.redirect('/backoffice/login');
        }
    },
    hasUser: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    var is_user = req.user && !req.user.permissions.isAdmin && !req.user.permissions.isShipOwner;
                    var isShipOwner = req.user && req.user.permissions.isShipOwner;
                    var permission = is_user || isShipOwner;
                    if (permission) {
                        return next();
                    }
                    else {
                        req.logOut();
                        return res.redirect('/backoffice/login');
                    }
                }
                else {
                    req.logOut();
                    return res.redirect('/backoffice/login');
                }
            })
        }
        else {
            req.logOut();
            return res.redirect('/backoffice/login');
        }
    },
    hasPermitionsService: function (req, res, next) {
        if (req.user) {
            db.Users.count({_id: req.user._id, remove: false}).exec(function (err, count) {
                if (count) {
                    var is_admin = req.user && req.user.permissions.isAdmin;
                    var isShipOwner = req.user && req.user.permissions.isShipOwner;
                    var permission = is_admin || isShipOwner;
                    if (permission) {
                        return next();
                    }
                    else {
                        req.logOut();
                        var error = {
                            message: "Sorry! You don't have permissions",
                            code: 666
                        };
                        return res.json({res: false, error: error})
                    }
                }
                else {
                    req.logOut();
                    var error = {
                        message: "Sorry! You don't have permissions",
                        code: 666
                    };
                    return res.json({res: false, error: error})
                }
            })
        }
        else {
            req.logOut();
            var error = {
                message: "Sorry! You don't have permissions",
                code: 666
            };
            return res.json({res: false, error: error})
        }
    },
    isXhr: function (req, res, next) {
        return req.xhr ? next() : res.status(403).json({error: 'dont allow'});
    },
    cookie: function (req, res, next) {
        req.session.closecookie = true;
    },
    nocache: function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        next();
    },
    language: function (req, res, next) {
        if (req.params.culture != 'favicon.ico') {
            if (req.session.lang) {
                if (req.session.lang != req.params.culture) {
                    if (req.session.isoRoutes) {
                        var route = req.session.isoRoutes[req.params.culture];
                        if (route == '/' + req.params.culture) {
                            return next();
                        } else {
                            return res.redirect(route);
                        }

                    }
                    else {
                        return next();
                    }

                }
                else {
                    return next();
                }
            }
            else {
                return next();

            }
        }
        else {
            return next();

        }


    }
}

module.exports = sessionFunctions;
