var Redsys, Utils, crypto, currency_mapping, language_mapping, _;
var __bind = function (fn, me) {
    return function () {
        return fn.apply(me, arguments);
    };
};
crypto = require('crypto');
_ = require('lodash');
Utils = require('./utils');
currency_mapping = {
    'EUR': 978,
    'USD': 840
};
language_mapping = {
    'auto': 0,
    'es': 1,
    'en': 2
};
Redsys = (function () {
    Redsys.TransactionTypes = {
        STANDAR_PAYMENT: '0',
        CARD_IN_ARCHIVE_INITIAL: 'L',
        CARD_IN_ARCHIVE: 'M'
    };
    function Redsys(config) {
        this.config = config != null ? config : {};
        this.validate_response = __bind(this.validate_response, this);
        this.create_payment = __bind(this.create_payment, this);
        this.sign = __bind(this.sign, this);
        this.form_url = "https://sis.redsys.es/sis/";
        if (this.config.test) {
            this.form_url = "https://sis-t.redsys.es:25443/sis/";
        }
        this.config.language = this.convert_language(this.config.language);
    }

    Redsys.prototype.build_payload = function (data) {
        var str, _ref, _ref2;
        str = "" + data.total + data.order + this.config.merchant.code + data.currency;
        if (typeof data.transaction_type != 'undefined') {
            str += data.transaction_type;
        }
        if ((_ref = data.redirect_urls) != null ? _ref.callback : void 0) {
            str += (_ref2 = data.redirect_urls) != null ? _ref2.callback : void 0;
        }
        str += this.config.merchant.secret;
        return str;
    };

    Redsys.prototype.build_response_payload = function (data) {
        var str;
        str = "" + data.Ds_Amount + data.Ds_Order + data.Ds_MerchantCode + data.Ds_Currency + data.Ds_Response + this.config.merchant.secret;
        return str;
    };

    Redsys.prototype.sign = function (data) {
        var shasum;
        shasum = crypto.createHash('sha1');
        shasum.update(data);
        return shasum.digest('hex');
    };

    Redsys.prototype.convert_currency = function (currency) {
        return currency_mapping[currency] || "Unknown!";
    };

    Redsys.prototype.convert_language = function (language) {
        if (typeof language_mapping[language] == 'undefined') {
            return "Unknown!";
        } else {
            return language_mapping[language];
        }
    };

    Redsys.prototype.normalize = function (data) {
        var normalize_data, _ref, _ref2, _ref3;
        if (Math.floor(data.total) != data.total) {

        }
        data.total *= 100;
        data.currency = this.convert_currency(data.currency);
        normalize_data = {
            total: data.total,
            currency: data.currency,
            description: Utils.format(data.description, 125),
            titular: Utils.format(this.config.merchant.titular, 60),
            merchant_code: Utils.formatNumber(this.config.merchant.code, 9),
            merchant_url: Utils.format((_ref = data.redirect_urls) != null ? _ref.callback : void 0, 250),
            merchant_url_ok: Utils.format((_ref2 = data.redirect_urls) != null ? _ref2.return_url : void 0, 250),
            merchant_url_ko: Utils.format((_ref3 = data.redirect_urls) != null ? _ref3.cancel_url : void 0, 250),
            merchant_name: Utils.format(this.config.merchant.name, 25),
            language: Utils.formatNumber(this.config.language, 3),
            terminal: Utils.formatNumber(this.config.merchant.terminal, 3),
            transaction_type: data.transaction_type
        };
        if (data.transaction_type == "L") {
            data.order = Utils.format(data.order, 4, 10);
            normalize_data.order = data.order;
        } else {
            data.order = Utils.format(data.order, 4, 12);
            normalize_data.order = data.order;
        }
        if (data.authorization_code) {
            normalize_data.authorization_code = Utils.formatNumber(data.authorization_code, 6);
        }
        if (data.data) {
            normalize_data.data = Utils.format(data.data, 1024);
        }

        normalize_data.signature = Utils.format(this.sign(this.build_payload(data)), 40);
        return normalize_data;
    };

    Redsys.prototype.create_payment = function (order_data) {
        var form_data, tpv_data;
        tpv_data = this.normalize(order_data);
        form_data = {
            URL: this.form_url + "realizarPago",
            Ds_Merchant_Amount: tpv_data.total,
            Ds_Merchant_Currency: tpv_data.currency,
            Ds_Merchant_Order: tpv_data.order,
            Ds_Merchant_MerchantCode: tpv_data.merchant_code,
            Ds_Merchant_ConsumerLanguage: tpv_data.language,
            Ds_Merchant_MerchantSignature: tpv_data.signature,
            Ds_Merchant_Terminal: tpv_data.terminal,
            Ds_Merchant_TransactionType: tpv_data.transaction_type,
            Ds_Merchant_MerchantURL: tpv_data.merchant_url,
            Ds_Merchant_UrlOK: tpv_data.merchant_url_ok,
            Ds_Merchant_UrlKO: tpv_data.merchant_url_ko
        };
        if (tpv_data.transaction_type != "L") {
            _.extend(form_data, {
                Ds_Merchant_Titular: tpv_data.titular,
                Ds_Merchant_ProductDescription: tpv_data.description,
                Ds_Merchant_MerchantName: tpv_data.merchant_name
            });
            if (tpv_data.authorization_code) {
                form_data.Ds_Merchant_AuthorisationCode = tpv_data.authorization_code;
            }
            if (tpv_data.data) {
                form_data.Ds_Merchant_MerchantData = tpv_data.data;
            }
        }
        return form_data;
    };

    Redsys.prototype.validate_response = function (response) {
        var signature;
        signature = this.sign(this.build_response_payload(response));
        return response.Ds_Signature.toLowerCase() == signature;
    };
    return Redsys;
})();
module.exports = {
    Redsys: Redsys
};