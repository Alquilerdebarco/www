/**
 * Created by ernestomr87@gmail.comon 3/21/2016.
 */


module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var landingSchema = new Schema({
    pos: {type: Number, require: true, default: null},
    last:{type: Boolean, required: false, default: false},
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    title: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    description: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    text1: [{type: Schema.Types.ObjectId, ref: "IsoField"}],
    text2: [{type: Schema.Types.ObjectId, ref: "IsoField"}],
    publish: {type: Boolean, require: true, default: false},
    country: {type: String, require: true, default: 0},
    city: {type: String, require: true, default: 0},
    area: {type: String, require: true, default: 0},
    port: {type: String, require: true, default: 0},
    shipType: {type: Schema.Types.ObjectId, ref: "shipType"},
    experience: {type: Schema.Types.ObjectId, default:null},
    cont: {type: Number, require: true, default: 0},
    noindex: {type: Boolean, required: false, default: false},
    nofollow: {type: Boolean, required: false, default: false}
  }, {versionKey: false});
  return mongoose.model("Landing", landingSchema);
};
