/**
 * Created by ernestomr87@gmail.com on 3/12/2016.
 */

var request = require('request');
var urlUtil = require('url');
var paypal_api = require('paypal-rest-sdk');

var first_config = {
    'mode': 'live',
    'client_id': 'AeUsFFBfVAPGxODEg6VNgtWY05BiI8MyKTHyMIkD7GV0DxI_dki0UJt5Vh2otAy0FlvoLsqxnyy_4qki',
    'client_secret': 'EFsFpPyQIgNSDlUmoLbD7vaEC6jQyDA0ZgEurmiRr3Byb34GX3BLE5M4lNRNtc7mNO-lMmm6BeRuO2sr'
};

paypal_api.configure(first_config);

function loadPaypalConf(cb) {
    db.Configurations.findOne().exec(function (err, paypaData) {
        cb(err, paypaData);
    })
}

function loadConfiguration(cb) {
    db.Configurations.findOne().exec(function (err, success) {
        cb(err, success);
    });
}




var connectionPage = "/es/estado-reserva?code=1";

var payments = {
    /* PAYPAL */

    // paypalRefund: function (monto, saleId, cb) {
    //     paypal_api.configure(global.config.paypallConfig.api);
    //     var tempPrice = monto.toFixed(2);
    //     var data = {
    //         "amount": {
    //             "currency": "EUR",
    //             "total": tempPrice
    //         }
    //     };
    //
    //     paypal_api.sale.refund(saleId, data, function (error, refund) {
    //         if (error == null && refund != null) {
    //             if (cb) cb(true);
    //         } else {
    //             if (cb) cb(false);
    //         }
    //     });
    // },

    payWithPaypal: function (payment, cb) {
        loadPaypalConf(function (err, conf) {
            if (err || !conf) {
                cb(err, conf);
            }
            else {
                var server = conf._doc.general.domain;
                var first_config = {
                    'mode': conf._doc.paypal.mode,
                    'client_id': conf._doc.paypal.client_id,
                    'client_secret': conf._doc.paypal.client_secret
                };

                paypal_api.configure(first_config);

                paypal_api.payment.create(payment, function (error, payment) {
                    if (error) {
                        var url = server + connectionPage;
                        cb(err, url);
                    } else {
                        if (payment.payer.payment_method == 'paypal') {
                            var redirectUrl;
                            console.log(payment);
                            for (var i = 0; i < payment.links.length; i++) {
                                var link = payment.links[i];
                                if (link.method == 'REDIRECT') {
                                    redirectUrl = link.href;
                                }
                            }
                            cb(payment.id, redirectUrl);
                        }
                    }
                });
            }
        })
    },

    executePayWithPaypall: function (sale, cb) {

        var execute_payment_json = {
            "payer_id": sale._doc.PayerID
        };
        var paymentId = sale._doc.paymentId;
        loadPaypalConf(function (err, conf) {
            if (err || !conf) {
                cb(err, conf);
            }
            else {
                var first_config = {
                    'mode': conf._doc.paypal.mode,
                    'client_id': conf._doc.paypal.client_id,
                    'client_secret': conf._doc.paypal.client_secret
                };

                paypal_api.configure(first_config);
                paypal_api.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                    if (error) {
                        console.log(error.response);
                        cb(false);
                    } else {
                        console.log("Get Payment Response");
                        console.log(JSON.stringify(payment));
                        cb(payment.transactions[0].related_resources[0].sale.id);
                    }
                });
            }
        })
    },

    // logPaypal: function () {
    //     var params = req.body;
    //     ipn.verify(params, function callback(err, msg) {
    //         if (err) {
    //             console.error(msg);
    //             req.session.ipn.push(msg);
    //         } else {
    //             msg
    //             if (params.payment_status == 'Completed') {
    //                 req.session.ipn.push(params);
    //             }
    //         }
    //         res.json(req.session.ipn);
    //     });
    // },

    preparePayment: function (data, cb) {
        loadConfiguration(function (err, conf) {
            if (err) {
                cb(err, false);
            }
            else {
                var server = conf._doc.general.domain;
                if (server) {
                    var rurl = server + "/service/engine/return";
                    var curl = server + "/service/engine/cancel";


                    var payment = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": rurl,
                            "cancel_url": curl
                        },
                        "transactions": [{
                            "amount": {
                                "total": data.price,
                                "currency": "EUR"
                            },
                            "description": "Alquiler de Barco",
                        }]
                    };

                    cb(null, payment);
                }
                else {
                    cb(true, null);
                }
            }
        })
    },

    /* REDSYS */

    postRefund: function (form_data, cb) {
        request.post({url: form_data.URL, form: form_data}, function (err, httpResponse, body) {
            if (err) {
                cb(err, null);
            }
            else {
                cb(null, body);
            }
        })
    },

    generateTPVFormDiferido: function (price, description, cb) {
        db.Configurations.findOne().select('redsys general').exec(function (err, redsysDoc) {
            if (err || !redsysDoc) {
                cb(err, redsysDoc);
            }
            else {
                var server = redsysDoc._doc.general.domain;
                var rurl = server + "/service/engine/return";
                var curl = server + "/service/engine/cancel";

                var redsys = new Redsys({
                    "merchant": {
                        "code": redsysDoc.redsys.merchant.code,
                        "terminal": redsysDoc.redsys.merchant.terminal,
                        "titular": redsysDoc.redsys.merchant.titular,
                        "name": redsysDoc.redsys.merchant.name,
                        "secret": redsysDoc.redsys.merchant.secret
                    },
                    "language": "auto",
                    "test": redsysDoc.redsys.test
                });

                var form_data = redsys.create_payment({
                    total: price,
                    currency: "EUR",
                    order: ((new Date()).getTime() + "").substring(0, 12),
                    description: description,
                    //data: "CART DATA",
                    transaction_type: '0',
                    redirect_urls: {
                        return_url: rurl,
                        cancel_url: curl
                    }
                });
                console.log(form_data);
                cb(false, form_data);
            }
        })
    }
}

module.exports = payments;



