/**
 * Created by ernestomr87@gmail.com on 3/7/2016.
 */

var async = require('async');
var userViewModel = require('./userViewModel');
var functions = require('./../utils/functions');


function validateUsers(userOne, userTwo, cb) {
    async.parallel([
        function (cbp) {
            userViewModel.get(userOne, function (err, user) {
                cbp(err, user);
            });
        },
        function (cbp) {
            userViewModel.get(userTwo, function (err, user) {
                cbp(err, user);
            });
        }
    ], function (err, results) {
        if (err || !results) {
            cb(err, results);
        }
        else {
            cb(null, true);
        }
    });
};

function getConversation(userOne, userTwo, cb) {
    async.parallel([
        function (cbp) {
            db.Messages.findOne().and([{userOne: userOne}, {userTwo: userTwo}]).exec(function (err, convesation) {
                cbp(err, convesation);
            });
        },
        function (cbp) {
            db.Messages.findOne().and([{userOne: userTwo}, {userTwo: userOne}]).exec(function (err, convesation) {
                cbp(err, convesation);
            });
        }
    ], function (err, result) {
        if (err || !result) {
            cb(err, result);
        }
        else {
            var res = false;
            if (result[0]) {
                res = result[0];
            }
            else if (result[1]) {
                res = result[1];
            }
            if (res) {
                for (var i = 0; i < res.messages.length - 1; i++) {
                    for (var j = i + 1; j < res.messages.length; j++) {
                        if (res.messages[i].date < res.messages[j].date) {
                            var aux = res.messages[i].date;
                            res.messages[i].date = res.messages[j].date;
                            res.messages[j].date = aux;
                        }
                    }
                }
                cb(null, res);
            }
            else {
                cb(null, false);
            }
        }
    });
};

var messageFunctions = {

    create: function (userOne, userTwo, user, text, cb) {
        validateUsers(userOne, userTwo, function (err, success) {
            if (err || !success) {
                cb(err, success);
            }
            else {

                getConversation(userOne, userTwo, function (err, cnv) {
                    if (err || !cnv) {
                        var messages = [];
                        var aux = {
                            user: user._id,
                            text: text,
                            date: functions.dateToUtc(new Date())
                        };
                        messages.push(aux);

                        var m = new db.Messages({
                            userOne: userOne,
                            userTwo: userTwo,
                            messages: messages
                        });

                        m.save(function (err, mm) {
                            cb(err, mm);
                        });

                    }
                    else {
                        var aux = {
                            user: user._id,
                            text: text,
                            date: functions.dateToUtc(new Date())
                        };

                        db.Messages.findOneAndUpdate({_id: cnv._doc._id},
                            {$push: {messages: aux}}, {new: true})
                            .exec(function (err, mm) {
                                cb(err, mm);
                            });
                    }
                });
            }
        });

    },
    get: function (userOne, userTwo, user, cb) {
        validateUsers(userOne, userTwo, function (err, success) {
            if (err || !success) {
                cb(err, success);
            }
            else {
                getConversation(userOne, userTwo, function (err, conv) {
                    if (err || !conv) {
                        cb(err, conv);
                    }
                    else {
                        if (!conv) {
                            cb(null, []);
                        }
                        else {
                            var messages = conv._doc.messages;
                            var oldMsg = conv._doc.messages;

                            for (var i = 0; i < messages.length; i++) {
                                if (messages[i].user != user._id.toString()) {
                                    messages[i].check = true;
                                }

                            }

                            db.Messages.update({_id: conv._doc._id}, {$set: {messages: messages}})
                                .exec(function (err, success) {
                                    if (err || !success) {
                                        cb(err, success);
                                    }
                                    else {
                                        cb(null, oldMsg);
                                    }
                                });
                        }
                    }
                });
            }
        });
    },
    list: function (user, cb) {
        db.Messages.find({$or: [{userOne: user._id}, {userTwo: user._id}]})
            .sort({'messages.date': -1})
            .populate('userOne userTwo')
            .exec(function (err, msgs) {
                if (err || !msgs) {
                    cb(err, msgs);
                }
                else {
                    var messages = [];
                    for (var i = 0; i < msgs.length; i++) {
                        var auxUser = msgs[i]._doc.userOne;
                        if (msgs[i]._doc.userOne._id.toString() == user._id) {
                            auxUser = msgs[i]._doc.userTwo;
                        }
                        var check = false;
                        var date = null;
                        var text = "";
                        for (var j = msgs[i].messages.length - 1; j >= 0; j--) {
                            if (j == (msgs[i].messages.length - 1)) {
                                text = msgs[i].messages[j].text;
                                date = msgs[i].messages[j].date;
                            }
                            if (!msgs[i].messages[j].check && msgs[i].messages[j].user != user._id.toString()) {
                                check = true;
                                text = msgs[i].messages[j].text;
                                date = msgs[i].messages[j].date;
                            }
                        }
                        if (text.length > 120) {
                            text = text.substring(0, 120) + " ...";
                        }

                        var aux = {
                            _id: msgs[i]._doc._id,
                            user: auxUser,
                            check: check,
                            text: text,
                            date: functions.dateToUtc(date)
                        }
                        messages.push(aux);
                    }

                    cb(null, messages);
                }
            });
    },
    notification: function (user, cb) {
        db.Messages.find({$or: [{userOne: user._id}, {userTwo: user._id}]})
            .sort({'messages.date': -1})
            .populate('userOne userTwo')
            .exec(function (err, msgs) {
                if (err || !msgs) {
                    cb(err, msgs);
                }
                else {
                    var messages = [];
                    for (var i = 0; i < msgs.length; i++) {
                        var auxUser = msgs[i]._doc.userOne;
                        if (msgs[i]._doc.userOne._id.toString() == user._id) {
                            auxUser = msgs[i]._doc.userTwo;
                        }
                        var check = false;
                        var date = null;
                        var text = "";
                        for (var j = msgs[i].messages.length - 1; j >= 0; j--) {
                            if (j == (msgs[i].messages.length - 1)) {
                                text = msgs[i].messages[j].text;
                                date = msgs[i].messages[j].date;
                            }
                            if (!msgs[i].messages[j].check && msgs[i].messages[j].user != user._id.toString()) {
                                check = true;
                                text = msgs[i].messages[j].text;
                                date = msgs[i].messages[j].date;
                            }
                        }
                        if (text.length > 120) {
                            text = text.substring(0, 120) + " ...";
                        }

                        var aux = {
                            _id: msgs[i]._doc._id,
                            user: auxUser,
                            check: check,
                            text: text,
                            date: functions.dateToUtc(date)
                        }
                        if (aux.check) {
                            messages.push(aux);
                        }

                    }

                    cb(null, messages);
                }
            });
    }
};

module.exports = messageFunctions;