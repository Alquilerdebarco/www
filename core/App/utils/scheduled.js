var Scheduled = require("scheduled");
var async = require("async");
var utils = require("./functions");
var notificationViewModel = require("./../viewModels/notificationViewModel");
var emailNotification = require("./emailNotification");

var esLangId = "5669b342ef0fa2841b956b38";

var scheduledFunctions = {
  checkOffers: function () {
    var myJob = new Scheduled({
      id: "minuteTaskEven",
      pattern: "*/1440", // Tarea a ejecutar cada 1 día
      task: function () {
        db.Offers.find({finish: false, status: "accept"})
                    .populate("ship request")
                    .exec(function (err, offers) {
                      if (err || !offers) {
                        console.error(err);
                      }
                      else {
                        if (offers.length) {
                          async.map(offers, function (offer, cbm) {

                            var bookDate = utils.formatDate(offer.bookDate);
                            var today = new Date();
                            today = utils.formatDate(today);
                            var aux = 0;
                            var secondPayment = offer.secondPayment;
                            if (secondPayment == "3") {
                              aux = 2 * 7 * 86400000;
                            }
                            if (secondPayment == "4") {
                              aux = 7 * 86400000;
                            }

                            var tmp = bookDate.getTime();
                            var point = new Date(tmp - aux);

                            var count = (point.getTime() - today.getTime()) / 86400000;


                            if (count >= 0 && count <= 3 && offer._doc.sale.length == 1 && !offer._doc.finish) {
                              notificationViewModel.sendMailUserExpireTime(offer, esLangId, offer.email, count, function (err, success) {
                                console.warn("***************SEND MAIL NOTIFICATION******************");
                                cbm(null, false);
                              });
                            }
                            else if (count < 0) {
                              console.warn("***************REFUND BOOKING******************");
                              cbm(null, false);
                            }
                            else {
                              console.warn("***************NO SEND MAIL NOTIFICATION******************");
                              cbm(null, false);
                            }

                          }, function (err, results) {
                            console.warn("*******************OK*********************");
                          });
                        }
                      }
                    });
      }
    }).start();
  },
  checkMails: function (app) {
    var myJob = new Scheduled({
      id: "minuteTaskEven",
      pattern: "*/1", // Tarea a ejecutar cada 1 hora
      task: function () {
        db.Mails.find().exec(function (err, mails) {
          if (err || !mails) {
            console.log(err);
          }
          else {
            if (mails.length) {
              async.map(mails, function (mail, cb) {
                var mailOptions = JSON.parse(JSON.stringify(mail._doc.mailOptions));
                emailNotification.sendMail(mailOptions, function (err, success) {
                  if (!err) {
                    db.Mails.remove({_id: mail._doc._id}).exec(function (err, mailSuccess) {
                        console.log("Mail Remove Succesfull!!!");
                        cb(err, mailSuccess);
                      });
                  }
                  else {
                    cb(null, true);
                  }
                });

              }, function (err, results) {
                console.log(err, results);
              });
            }
            else {
              console.log("No Mails ************");
            }
          }

        });
      }
    }).start();
  }
};

module.exports = scheduledFunctions;

