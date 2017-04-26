/**
 * Created by ernesto.rodriguez@isofact.com on 4/11/16.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var tagSchema = new Schema({
    name: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    slug: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    title: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    description: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    remove: {type: Boolean, required: true, default: false}
  }, {versionKey: false});

  return mongoose.model("Tag", tagSchema);
};