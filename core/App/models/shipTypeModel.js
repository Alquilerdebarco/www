/**
 * Created by ernestomr87@gmail.comon 3/21/2016.
 */


module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var shipTypeSchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    description: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    remove: {type: Boolean, required: true, default: false}
  }, {versionKey: false});

  return mongoose.model("shipType", shipTypeSchema);
};