/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var isoFieldSchema = new Schema({
    language: {type: Schema.Types.ObjectId, ref: "Language", required: true},
    value: {type: String, required: true}
  }, {versionKey: false}
    );
  return mongoose.model("IsoField", isoFieldSchema);
};