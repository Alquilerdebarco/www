/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 14/3/2016.
 */

var PATH_ROUTE = '/:culture/currency/:currency';
var textViewModel = require('../viewModels/textViewModel');
var shipViewModel = require('../viewModels/shipViewModel');
var _ = require('lodash');
exports.configRoutes = function (app) {
    app.get(PATH_ROUTE, function (req, res) {
        var currency = req.params.currency;
        if (!_.isEmpty(currency)) {
            shipViewModel.updateCoin(currency, function (coin) {
                req.session.coin = coin;
                var culture = req.params.culture;
                if (culture) {
                    if (req.session.isoRoutes) {
                        res.redirect(req.session.isoRoutes[req.params.culture]);
                    }
                    else {
                        res.redirect('/' + culture);
                    }
                } else {
                    res.redirect('/')
                }

            })
        } else {
            shipViewModel.updateCoin('EUR', function (err, coin) {
                return res.json({res: coin, err: err})
            })
        }
    });
}