/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 11/5/2016.
 */

var textViewModel = require('../viewModels/textViewModel');
exports.answerFunctions = function (culture,cb) {
    textViewModel.getByGroupArray(culture, ['general','slugs','answer_booking'], function (err, text) {
        if (!err) {
            cb(false,text)
        }else{
            cb(err,false);
        }
    })
};