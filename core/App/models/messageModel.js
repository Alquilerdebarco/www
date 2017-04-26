/**
 * Created by ernestomr87@gmail.comon 07/03/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var messageSchema = new Schema({
    userOne: {type: Schema.Types.ObjectId, ref: "User", required: true},
    userTwo: {type: Schema.Types.ObjectId, ref: "User", required: true},
    messages: [{
      user: {type: String, required: true},
      text: {type: String, required: true},
      date: {type: Date, required: true, default: Date.now},
      check: {type: Boolean, required: true, default: false}
    }]
  }, {versionKey: false});
  return mongoose.model("Message", messageSchema);
};
