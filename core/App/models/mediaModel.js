/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var mediaSchema = new Schema({
    data: {type: Buffer, required: true},
    contentType: {type: String, required: true},
    fieldName: {type: String, required: true},
    name: {type: String, required: true}
  }, {versionKey: false});
  return mongoose.model("Media", mediaSchema);
};