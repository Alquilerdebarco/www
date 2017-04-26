/**
 * Created by ernestomr87@gmail.com on 1/29/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var notificationSchema = new Schema({
    userRegister: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    userParticular: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    bulletin: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    recoveryPassword: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    publicationBoat: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },

    userRequest: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    ownerRequest: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    rejectRequest: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },

    userOffer: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    ownerOffer: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    userBuyConfirmation: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    ownerBuyConfirmation: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    userRefundConfirmation: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    ownerRefundConfirmation: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    },
    userExpireTime: {
      subject: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
      body: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}]
    }


  }, {versionKey: false}
    );
  return mongoose.model("Notification", notificationSchema);
};
