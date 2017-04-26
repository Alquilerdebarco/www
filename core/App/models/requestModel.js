/**
 * Created by ernestomr87@gmail.com on 2/25/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var requestSchema = new Schema({
      index: {type: Number, required: true},
      shipowner: {type: Schema.Types.ObjectId, ref: "User", required: true},
      client: {type: Schema.Types.ObjectId, ref: "User", default: null},
      ship: {type: Schema.Types.ObjectId, ref: "Ship", required: true},
      shipName: {type: String, required: true},
      check: {type: Boolean, required: false},
      bookDate: {type: Date, required: true},
      createDate: {type: Date, required: true, default: Date.now},
      duration: {
        unity: {type: Number, enum: [0, 1], required: true, default: 0},
        quantity: {type: Number, required: true, default: 0}
      },
      numPas: {type: Number, required: true},
      patron: {type: Boolean, required: true, default: false},
      name: {type: String, required: true},
      email: {type: String, required: true},
      mobile: {type: String, required: true},
      message: {type: String},
      experience: {type: Schema.Types.ObjectId, required: true},
      language: {type: Schema.Types.ObjectId, ref: "Language", required: true},
      status: {type: String, enum: ["send", "reject", "accept"], default: "send"},

    }, {versionKey: false}
  );
  return mongoose.model("Request", requestSchema);
};
