/**
 * Created by ernestomr87@gmail.comon 5/25/2016.
 */


module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var equipmentSchema = new Schema({
    name: [{ type: Schema.Types.ObjectId, ref: "IsoField", required: true }],
    items: [{
      name: [{ type: Schema.Types.ObjectId, ref: "IsoField", required: true }],
      status: { type: Boolean, required: true, default: false }
    }]
  }, { versionKey: false });

  return mongoose.model("Equipment", equipmentSchema);
};