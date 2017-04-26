"use strict";

var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var crypto = require("crypto");
var debug = require("debug")("sermepa:api");

debug.log = console.log.bind(console);

var Sermepa = function() {
  function Sermepa(params) {
    _classCallCheck(this, Sermepa);

    this.params = params || {};
  }

  //noinspection JSUnusedGlobalSymbols


  _createClass(Sermepa, [
    {
      key: "set",
      value: function set(key, value) {
        this.params[key] = value;
      }
    }, {
      key: "get",
      value: function get(key) {
        return this.params[key];
      }
    }, {
      key: "getOrder",
      value: function getOrder() {
        return (this.params["Ds_Merchant_Order"] || this.params["DS_MERCHANT_ORDER"] || "").trim();
      }
    }, {
      key: "getOrderNotif",
      value: function getOrderNotif() {
        return (this.params["Ds_Order"] || this.params["DS_ORDER"] || "").trim();
      }
    }, {
      key: "createFormParameters",
      value: function createFormParameters(key) {
        var merchantParams = Sermepa.base64encode(JSON.stringify(this.params));
        return {
          Ds_SignatureVersion: "HMAC_SHA256_V1",
          Ds_MerchantParameters: merchantParams,
          Ds_Signature: Sermepa.encode(merchantParams, key, this.getOrder())
        };
      }

      //noinspection JSUnusedGlobalSymbols

    }, {
      key: "createMerchantSignatureNotif",
      value: function createMerchantSignatureNotif(key, data) {
        var sig = Sermepa.encode(data, key, this.getOrderNotif());

        return sig.replace(/\+/g, "-").replace(/\//g, "_");
      }
    }
  ], [
    {
      key: "processResponse",
      value: function processResponse(key, response) {
        var data = response.Ds_MerchantParameters;

        if (!data) return { error: new Error("no Ds_MerchantParameters") };

        var params = JSON.parse(Sermepa.base64decode(data));

        params.Ds_Date = decodeURIComponent(params.Ds_Date);
        params.Ds_Hour = decodeURIComponent(params.Ds_Hour);

        var obj = new Sermepa(params);
        var ret = { params: params, obj: obj };
        var sig = obj.createMerchantSignatureNotif(key, data);

        if (sig != response.Ds_Signature) ret.error = new Error("FIRMA KO");

        return ret;
      }
    }, {
      key: "encode",
      value: function encode(data, key, order) {
        var k = Sermepa.encrypt3DES(order, key);
        return Sermepa.mac256(data, k);
      }
    }, {
      key: "encrypt3DES",
      value: function encrypt3DES(str, key) {
        var secretKey = new Buffer(key, "base64");
        var iv = new Buffer(8);
        iv.fill(0);
        var cipher = crypto.createCipheriv("des-ede3-cbc", secretKey, iv);
        cipher.setAutoPadding(false);

        return cipher.update(Sermepa.zeroPad(str, 8), "utf8", "base64") + cipher.final("base64");
      }
    }, {
      key: "mac256",
      value: function mac256(data, key) {
        var hexMac256 = crypto.createHmac("sha256", new Buffer(key, "base64")).update(data).digest("hex");
        return new Buffer(hexMac256, "hex").toString("base64");
      }
    }, {
      key: "base64encode",
      value: function base64encode(str) {
        return new Buffer(str).toString("base64");
      }
    }, {
      key: "base64decode",
      value: function base64decode(str) {
        return new Buffer(str, "base64").toString();
      }
    }, {
      key: "zeroPad",
      value: function zeroPad(str, blocksize) {
        var buf = new Buffer(str, "utf8");
        var pad = new Buffer((blocksize - buf.length % blocksize) % blocksize);

        pad.fill(0);

        return Buffer.concat([buf, pad]);
      }
    }
  ]);

  return Sermepa;
}();

module.exports = Sermepa;