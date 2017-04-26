/**
 * Created by ernesto.rodriguez@isofact.com on 10/03/17.
 */

module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var currencySchema = new Schema({
    pos: {type: Number, require: true, default: null},
    last: {type: Boolean, required: false, default: false},
    text: {type: String, required: true, unique: true},
    symbol: {type: String, required: true, unique: true}
  }, {versionKey: false});
  return mongoose.model("Currency", currencySchema);
};