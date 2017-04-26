/**
 * Created by ernestomr87@gmail.com on 3/7/2016.
 */

var PATH = '/service/messages';
var server;
var session = require('./../../middlewares/session');
var messageViewModel = require('./../viewModels/messageViewModel');

var message = {
        registerRoutes: function (app) {
            server = app;
            app.post(PATH, session.authService, this.create);
            app.get(PATH, session.authService, this.get);
            app.put(PATH, session.authService, this.list);
            //server.io.route('ready', this.create)
        },

        create: function (req, res) {
            var userOne = req.body.userOne,
                userTwo = req.body.userTwo,
                text = req.body.text,
                room = req.body.room;

            messageViewModel.create(userOne, userTwo, req.user, text, function (err, msg) {
                if (err || !msg) {
                    req.io.broadcast('message', {
                        room: room,
                        res: false,
                        error: err
                    });
                    return res.json({res: false, error: err});
                }
                else {
                    req.io.broadcast('message', {
                        room: room,
                        res: true,
                        error: null
                    });
                    return res.json({res: true, error: err});
                }


            });
        },
        list: function (req, res) {
            messageViewModel.list(req.user, function (err, msgs) {
                return res.json({res: msgs, error: err});
            });
        }
        ,
        get: function (req, res) {
            var userOne = req.query.userOne;
            var userTwo = req.query.userTwo;

            messageViewModel.get(userOne, userTwo, req.user, function (err, msgs) {
                return res.json({res: msgs, error: err});
            });
        }
    }
    ;

module.exports = message;
