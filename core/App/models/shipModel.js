/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

//const mongooseExtendedFilter = require('mongoose-extended-filter');
module.exports = function (mongoose) {

  var Schema = mongoose.Schema;


  var discountSchema = new Schema({
    type: {type: String, required: true},
    discount: {type: Number, required: true},
    max: {type: Number},
    min: {type: Number},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    minDuration: {type: Number, required: true},
    accumulation: {type: Boolean, required: true, default: false}
  });

  var shipSchema = new Schema({
    step: {type: Number, required: true, default: 1},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tags: [{type: Schema.Types.ObjectId, ref: "Tag"}],
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    title: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    description: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    finder: [{type: Schema.Types.ObjectId, ref: "IsoField", required: true}],
    manufacturer: {type: String, required: true},
    model: {type: String, required: true},
    year: {type: Number, required: true},
    lastRedecorate: {type: Number},
    shipType: {type: Schema.Types.ObjectId, ref: "shipType", required: true},
    rentType: {type: String, required: true},
    createDate: {type: Date, required: true, default: Date.now},
    photos: [
      {
        media: {type: Schema.Types.ObjectId, ref: "Media"},
        default: {type: Boolean, required: true, default: false}
      }
    ],
    localization: {
      country: {type: Schema.Types.ObjectId},
      city: {type: Schema.Types.ObjectId},
      area: {type: Schema.Types.ObjectId},
      port: {type: Schema.Types.ObjectId}
    },
    seasons: [{
      title: {type: String},
      color: {type: String},
      start: {type: Date},
      end: {type: Date},
      experiences: [
        {
          experience: {type: Schema.Types.ObjectId, required: true},
          durations: [{
            duration: {type: Schema.Types.ObjectId},
            price: {type: String, required: true}
          }]
        }
      ]
    }],
    locks: [{
      title: {type: String, required: true},
      type: {type: String, enum: ["locked", "booked"], required: true, default: "locked"},
      start: {type: Date, required: true},
      end: {type: Date, required: true},
      offer: {type: Schema.Types.ObjectId, ref: "Offer", required: true}
    }],
    publish: {type: Boolean, required: true, default: false},
    status: {type: Boolean, required: true, default: false},
    remove: {type: Boolean, required: true, default: false},
    technicalDetails: {
      habitability: {
        persons: {
          day: {type: Number, required: true, default: 0},
          night: {type: Number, required: true, default: 0}
        },
        cabins: {type: Number, required: true, default: 0},          //camarotes
        baths: {type: Number, required: true, default: 0}       //baños
      },
      measurements: {
        dimension: {type: String, required: true, default: 0},    //Eslora
        draught: {type: String, required: true, default: 0},    //Calado
        sleeve: {type: String, required: true, default: 0}        //Manga

      },
      engine: {
        combustible: {type: String, required: true, default: "gasoline"},
        power: {type: String, required: true, default: 0},       //Potencia
        speed: {
          max: {type: String, required: true, default: 0},
          cruising: {type: String, required: true, default: 0}   //Crucero
        },
        consume: {type: String, required: true, default: 0}        //Consumo medio
      },
      deposits: {
        freshwater: {type: String, required: true, default: 0},
        combustible: {type: String, required: true, default: 0}
      }
    },
    equipments: [
      {
        equipment: {type: Schema.Types.ObjectId, ref: "Equipment"},
        items: [{type: Schema.Types.ObjectId}],
        text: [
          {
            iso: {type: String},
            value: {type: String}
          }
        ]
      }
    ],
    conditions: {
      bail: {type: String, required: true, default: 0},
      bailOptions: {
        transfer: {type: Boolean, required: true, default: false},
        visa: {type: Boolean, required: true, default: false},
        cash: {type: Boolean, required: true, default: false},
        masterCard: {type: Boolean, required: true, default: false},
        cheque: {type: Boolean, required: true, default: false},
        americanExpress: {type: Boolean, required: true, default: false},
        euroCard: {type: Boolean, required: true, default: false}
      },
      patron: [
        {
          duration: {type: Schema.Types.ObjectId, required: true},
          price: {type: String, required: true, default: 0}
        }
      ],
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
      basePort: {type: String, enum: ["0", "1"], default: "0"},
      sleepBasePort: {type: String, enum: ["0", "1"], default: "0"},
      weekRentals: {
        checkIn: {
          day: {type: String, enum: ["0", "1", "2", "3", "4", "5", "6", "7"], default: "0"},
          hour: {
            type: String,
            enum: ["0", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            default: "0"
          }
        },
        checkOut: {
          day: {type: String, enum: ["0", "1", "2", "3", "4", "5", "6", "7"], default: "0"},
          hour: {
            type: String,
            enum: ["0", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            default: "0"
          }
        }
      },
      dayRentals: {
        checkIn: {
          hour: {
            type: String,
            enum: ["0", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            default: "0"
          }
        },
        checkOut: {
          hour: {
            type: String,
            enum: ["0", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
            default: "0"
          }
        }
      },
      extras: [{
                //1  Combustible </option>
                //2  Toallas </option>
                //3  Pack de bienvenida </option>
                //4  One way charter </option>
                //5  Transfer </option>
                //6  Cocina </option>
                //7  Camarero </option>
                //8  Motor fueraborda </option>
                //9  Limpieza final </option>
                //10 Vela gennaker </option>
                //11 Vela spinnaker </option>
                //12 Ropa de cama </option>
                //13 Embarcación auxiliar </option>
                //14 Internet Wi-Fi </option>
                //15 Texto Libre </option>
        extra: {
          type: String,
          required: true,
          default: "1"
        },
        name: {type: String},
        import: {type: String},
        period: {type: String, enum: ["0", "1", "2"], default: "0"},
        calculationBase: {type: String, enum: ["0", "1"], default: "0"},
        obligatory: {type: String, enum: ["0", "1"], default: "0"},
        included: {type: String, enum: ["0", "1"], default: "0"},
        payAt: {type: String, enum: ["0", "1"], default: "0"}
      }
      ],
      text: [{type: Schema.Types.ObjectId, ref: "IsoField"}]
    },
    discounts: [discountSchema],
    noindex: {type: Boolean, required: false, default: false},
    nofollow: {type: Boolean, required: false, default: false}
  }, {versionKey: false});

    //shipSchema.plugin(mongooseExtendedFilter);
  return mongoose.model("Ship", shipSchema);
};
