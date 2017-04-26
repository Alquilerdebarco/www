/**
 * Created by ernestomr87@gmail.com on 12/23/2015.
 */



module.exports = function (mongoose) {

  var Schema = mongoose.Schema;
  var eventSchema = new Schema({
    title: {type: String, required: true},
    type: {type: String, enum: ["locked", "booked", "canceled"], default: "locked"},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    paymentData: {}
  }, {versionKey: false}
    );

  return mongoose.model("Event", eventSchema);
};