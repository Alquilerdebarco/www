/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 25/5/2016.
 */

var textViewModel = require('../viewModels/textViewModel');
var offerViewModel = require('../viewModels/offerViewModel');
var _ = require('lodash');
exports.cancelFunctions = function (culture,token,coin,cb) {
    textViewModel.getByGroupArray(culture, ['general','slugs','ship-details'], function (err, text) {
        if (!err && text) {
            offerViewModel.getRefund(token,culture,coin, function(err,book){
                if(err || !book){
                    cb(err,false);
                }else{
                        var booking = {
                            text:text,
                            book:book
                        };
                        cb(false,booking);
                }
            })

        }else{
            cb(err,false);
        }
    })
};