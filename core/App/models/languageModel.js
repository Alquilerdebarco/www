/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var languageSchema = new Schema({
    pos: {type: Number, require: true, default: null},
    last:{type: Boolean, required: false, default: false},
    iso: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    default: {type: Boolean, required: false, default: false},
    status: {type: Boolean, required: false, default: false},
    remove: {type: Boolean, required: true, default: false},
    complete: {type: Boolean, required: true, default: false}
  }, {versionKey: false});
  return mongoose.model("Language", languageSchema);
};