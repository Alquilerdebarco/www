/**
 * Created by Ernesto on 12/13/2016.
 */


module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var pageMediaSchema = new Schema({
    page: {type: String, required: true, unique: true},
    photos: [{
      type: Schema.Types.ObjectId,
      ref: "Media"
    }]
  }, {versionKey: false});

  return mongoose.model("pageMedia", pageMediaSchema);
};

