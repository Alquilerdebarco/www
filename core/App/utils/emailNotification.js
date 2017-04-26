/**
 * Created by ernestomr87@gmail.com on 3/22/2016.
 */

var nodemailer = require("nodemailer");

var emailNotification = {
  sendMessage: function(email, data, attachments, cb) {
    db.Configurations.findOne(function(err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        db.Configurations.findOne().select("mailSettings").exec(function(err, conf) {
          if (!err) {
            var smtpConfig = {
              host: conf.mailSettings.mailServer,
              port: conf.mailSettings.mailPort,
              secure: conf.mailSettings.secureConnection || false, // use SSL
              auth: {
                user: conf.mailSettings.user,
                pass: conf.mailSettings.password
              }
            };
            var transporter = nodemailer.createTransport(smtpConfig);

            var mailOptions = {
              from: "\"" + conf.mailSettings.name + "\" <" + conf.mailSettings.email + ">",
              to: email, 
              subject: data.subject,
              html: data.body,
              attachments: attachments
            };

            //var aux = JSON.parse(JSON.stringify(mailOptions));
            try {
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  cb(error, true);

                } else {
                  cb(null, true);
                  console.log("Message sent succesfull");
                }
              });
            } catch (error) {
              console.error(error);
              cb(err, false);
            }

          } else {
            cb(err, false);
          }
        });
      }
    });
  },
  sendMessageTest: function(email, data, cb) {
    db.Configurations.findOne(function(err, conf) {
      if (err || !conf) {
        cb(err, conf);
      } else {
        db.Configurations.findOne().select("mailSettings").exec(function(err, conf) {
          if (!err) {
            var smtpConfig = {
              host: conf.mailSettings.mailServer,
              port: conf.mailSettings.mailPort,
              secure: conf.mailSettings.secureConnection || false, // use SSL
              auth: {
                user: conf.mailSettings.user,
                pass: conf.mailSettings.password
              }
            };
            var transporter = nodemailer.createTransport(smtpConfig);

            var mailOptions = {
              from: "\"" + conf.mailSettings.name + "\" <" + conf.mailSettings.email + ">",
              to: email, // list of receivers
              subject: data.subject,
              html: data.body
            };

            try {
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.error(error);
                  cb(error, false);

                } else {
                  cb(null, true);
                  console.log("Message sent succesfull");
                }
              });
            } catch (err) {
              console.error(err);
              cb(err, false);
            }

          } else {
            cb(err, false);
          }
        });
      }
    });
  },
  sendMail: function(mailOptions, cb) {
    db.Configurations.findOne().select("mailSettings").exec(function(err, conf) {
      if (!err) {
        var smtpConfig = {
          host: conf.mailSettings.mailServer,
          port: conf.mailSettings.mailPort,
          secure: conf.mailSettings.secureConnection || false, // use SSL
          auth: {
            user: conf.mailSettings.user,
            pass: conf.mailSettings.password
          }
        };
        var transporter = nodemailer.createTransport(smtpConfig);
        try {
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error(error);
              cb(error, false);
            } else {
              cb(null, true);
            }
          });
        } catch (err) {
          console.error(err);
          cb(err, false);
        }

      } else {
        cb(err, false);
      }
    });
  }
};

module.exports = emailNotification;