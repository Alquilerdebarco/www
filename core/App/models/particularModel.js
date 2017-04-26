/**
 * Created by Ernesto on 5/10/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var particularSchema = new Schema({
    name: {type: String, required: true},
    specifications: {type: Schema.Types.ObjectId, ref: "shipType", required: true},
    detail: {type: String, required: true},
    dimension: {type: String, required: true, default: 0},
    area: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    telephone: {type: String, required: false},
    mobile: {type: String, required: true},
    status: {type: Boolean, required: true, default: false},
    registerDate: {type: Date, required: true, default: Date.now},
  }, {versionKey: false});
  return mongoose.model("Particular", particularSchema);
};