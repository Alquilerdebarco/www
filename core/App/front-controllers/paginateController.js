/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 12/2/2016.
 */


var utils = require('../utils/functions');
var textViewModel = require('../viewModels/textViewModel');

exports.paginateFunctions = function (culture, cb) {

    textViewModel.getByGroupArray(culture, ['general', 'index', 'slugs'], function (err, text) {
        if (!err) {
            cb(false, text);
        } else {
            cb(err, false);
        }
    })

};
