/**
 * Created by ernestomr87@gmail.com on1/16/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;
  var componentSchema = new Schema({
    id: {type: String, required: true},
    type: {type: String, enum: ["text", "paragraph"]},
    text: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
  });
  var textSchema = new Schema({
    pos: {type: Number, require: true, default: null},
    last:{type: Boolean, required: false, default: false},
    group: {type: String, required: true, unique: true},
    components: [componentSchema],
    photos: [{
      id: {type: String, required: true},
      media: [{type: Schema.Types.ObjectId, ref: "Media"}]
    }]
  }, {versionKey: false});
  return mongoose.model("Text", textSchema);
};
