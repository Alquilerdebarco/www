/**
 * Created by ernestomr87@gmail.com on 2/26/2016.
 */

module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var offerSchema = new Schema({
      index: {type: Number, required: true},
      token: {type: String, required: true},
      request: {type: Schema.Types.ObjectId, ref: "Request", required: true},
      email: {type: String, required: true},
      shipowner: {type: Schema.Types.ObjectId, ref: "User", required: true},
      client: {type: Schema.Types.ObjectId, ref: "User", default: null},
      ship: {type: Schema.Types.ObjectId, ref: "Ship", required: true},
      experience: {type: Schema.Types.ObjectId, required: true},
      duration: {
        unity: {type: Number, enum: [0, 1, 7], required: true, default: 0},
        quantity: {type: Number, required: true, default: 0}
      },
      conversation: {
        client: {
          email: {type: String, required: true},
          text: {type: String, required: false},
          date: {type: Date, required: true}
        },
        owner: {
          text: {type: String, required: true},
          date: {type: Date, required: true, default: Date.now}
        }
      },
      numPas: {type: Number, required: true},
      patron: {type: Boolean, required: true, default: false},
      discount: {type: Number, min: 0, max: 100, default: 100},
      pricePatron: {type: Number, required: true},
      priceRent: {type: Number, required: true},
      price: {type: Number, required: true},
      firstPrice: {type: Number, required: true},
      secondPrice: {type: Number, required: true},
      percentage: {type: Number, min: 0, max: 100, default: 100},
      finish: {type: Boolean, required: true, default: true},
      conditions: {type: String, required: true},
      status: {type: String, enum: ["send", "reject", "cancel", "accept", "refund"], default: "send"},
      createDate: {type: Date, required: true, default: Date.now},
      bookDate: {type: Date, required: true},
      cancelDate: {type: Date},
      // 0	No hay, se paga el 100% para formalizar la reserva
      // 1	Dos meses antes del alquiler
      // 2	Un mes antes del alquiler
      // 3	Dos semanas antes del alquiler
      // 4	Una semana antes del alquiler
      // 5	En el check-in
      secondPayment: {type: String, enum: ["0", "1", "2", "3", "4", "5"], default: "0"},
      // 0	Se cambia el día o se devuelve el dinero
      // 1	Se cambia el día o se devuelve el 75% de la reserva
      // 2	Se cambia el día o se devuelve el 50% de la reserva
      // 3	Se cambia el día
      // 4	El cliente pierde el dinero
      refund: {type: String, enum: ["0", "1", "2", "3", "4"], default: "4"},
      sale: [
        {
          bookingDate: {type: Date},
          method: {type: String},
          paymentId: {type: String},
          token: {type: String},
          receipt: {type: String},

          dsMerchantParameters: {type: String},
          dsSignature: {type: String},
          dsSignatureVersion: {type: String}
        }
      ],
      cancelation: {
        // 0	Mal día.
        // 1	Segundo pago expirado
        motive: {type: String, enum: ["0", "1"]},
        date: {type: Date}
      },
      language: {type: Schema.Types.ObjectId, ref: "Language", required: true}

    }, {versionKey: false}
  );
  return mongoose.model("Offer", offerSchema);
};