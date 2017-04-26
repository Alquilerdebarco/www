/**
 * Created by ernestomr87@gmail.comon 3/25/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;
  var Mixed = Schema.Types.Mixed;

  var mailSchema = new Schema({
    mailOptions: {type: Mixed, required: true},
    date: {type: Date, required: true, default: Date.now}
  }, {versionKey: false});
  return mongoose.model("Mail", mailSchema);
};
