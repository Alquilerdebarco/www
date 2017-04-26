/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

var bcrypt = require("bcrypt-nodejs");
//const mongooseExtendedFilter = require('mongoose-extended-filter');


module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    telephone: {type: String, required: false},
    mobile: {type: String, required: true},
    address: {type: String, required: false},
    password: {type: String, required: false},
    avatar: {type: Schema.Types.ObjectId, ref: "Media"},
    permissions: {
      isAdmin: {type: Boolean, required: true, default: false},
      isShipOwner: {type: Boolean, required: true, default: false},
      typeShipOwner: {type: Number, enum: [0, 1], default: 0} //0 Particular 1 Empresa
    },
    registerDate: {type: Date, required: true},
    activationKey: {type: String},
    socialId: {type: String, required: false},
    status: {type: Boolean, required: true, default: false},
    remove: {type: Boolean, required: true, default: false},
    language: {type: Schema.Types.ObjectId, ref: "Language", default: "5669b342ef0fa2841b956b38"},
    complete: {type: Boolean, required: true, default: false},
    invoice: {
      fiscalName: {type: String},   //Empresa
      nifCif: {type: String},       //Empresa
      dni: {type: String},          //Particular
      swift: {type: String},
      iban: {type: String},
      email: {type: String},
      mobile: {type: String},
      address: {type: String},
      postalCode: {type: String},
      city: {type: String},
      country: {type: String}
    },
    commission: {type: Number, required: false, default: 20},
    web: {type: String, required: false},
    accept: {type: Boolean, required: true, default: false}
  }, {versionKey: false});

  userSchema.methods.validPassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, valid) {
      if (err) return next(err);
      next(null, valid);
    });
  };
  return mongoose.model("User", userSchema);
};
