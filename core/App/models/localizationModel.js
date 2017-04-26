/**
 * Created by ernestomr87@gmail.com on 12/4/2015.
 */

module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var portSchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    latitude: {type: String, required: true},
    longitude: {type: String, required: true}
  });
  var areaSchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    ports: [portSchema]
  });
  var citySchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    areas: [areaSchema]
  });
  var countrySchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    iso: {type: String, required: true, unique: true},
    cities: [citySchema],
    remove: {type: Boolean, required: true, default: false}
  }, {versionKey: false});
  return mongoose.model("Localization", countrySchema);
};
