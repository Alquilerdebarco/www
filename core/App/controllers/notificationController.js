/**
 * Created by ernestomr87@gmail.com on 1/29/2016.
 */


var notificationViewModel = require('./../../App/viewModels/notificationViewModel');
var session = require('./../../middlewares/session');

var PATH = '/service/notifications';
notification = {
    registerRoutes: function (app) {
        app.get(PATH, session.isAdmin, this.get);
        app.post(PATH + '/saveNotificationUserRegister', session.isAdmin, this.saveNotificationUserRegister);
        app.post(PATH + '/saveNotificationUserParticular', session.isAdmin, this.saveNotificationUserParticular);

        app.post(PATH + '/saveNotificationBulletin', session.isAdmin, this.saveNotificationBulletin);
        app.put(PATH + '/saveNotificationBulletin', session.isAdmin, this.sendNotificationBulletin);


        app.post(PATH + '/saveNotificationRecoveryPassword', session.isAdmin, this.saveNotificationRecoveryPassword);
        app.post(PATH + '/saveNotificationPublicationBoat', session.isAdmin, this.saveNotificationPublicationBoat);

        app.post(PATH + '/saveNotificationUserRequest', session.isAdmin, this.saveNotificationUserRequest);
        app.post(PATH + '/saveNotificationOwnerRequest', session.isAdmin, this.saveNotificationOwnerRequest);

        app.post(PATH + '/saveNotificationUserOffer', session.isAdmin, this.saveNotificationUserOffer);
        app.post(PATH + '/saveNotificationOwnerOffer', session.isAdmin, this.saveNotificationOwnerOffer);

        app.post(PATH + '/saveNotificationUserBuyConfirmation', session.isAdmin, this.saveNotificationUserBuyConfirmation);
        app.post(PATH + '/saveNotificationOwnerBuyConfirmation', session.isAdmin, this.saveNotificationOwnerBuyConfirmation);

        app.post(PATH + '/saveNotificationUserRefundConfirmation', session.isAdmin, this.saveNotificationUserRefundConfirmation);
        app.post(PATH + '/saveNotificationOwnerRefundConfirmation', session.isAdmin, this.saveNotificationOwnerRefundConfirmation);

        app.post(PATH + '/saveNotificationRejectRequest', session.isAdmin, this.saveNotificationRejectRequest);

        app.post(PATH + '/saveNotificationUserExpireTime', session.isAdmin, this.saveNotificationUserExpireTime);


    },
    get: function (req, res) {
        notificationViewModel.get(function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: success, error: err});
            }
        });
    },
    saveNotificationUserRegister: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserRegister(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationUserParticular: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserParticular(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationBulletin: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationBulletin(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    sendNotificationBulletin: function (req, res) {
        notificationViewModel.sendNotificationBulletin(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationRecoveryPassword: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationRecoveryPassword(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationPublicationBoat: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationPublicationBoat(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationUserRequest: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserRequest(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationOwnerRequest: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationOwnerRequest(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationUserOffer: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserOffer(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationOwnerOffer: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationOwnerOffer(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationUserBuyConfirmation: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserBuyConfirmation(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationOwnerBuyConfirmation: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationOwnerBuyConfirmation(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationUserRefundConfirmation: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserRefundConfirmation(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationOwnerRefundConfirmation: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationOwnerRefundConfirmation(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },

    saveNotificationRejectRequest: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationRejectRequest(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },
    saveNotificationUserExpireTime: function (req, res) {
        var data = req.body.data;
        notificationViewModel.saveNotificationUserExpireTime(data, function (err, success) {
            if (err || !success) {
                return res.json({res: false, error: err});
            }
            else {
                return res.json({res: true, error: err});
            }
        });
    },




};
module.exports = notification;
