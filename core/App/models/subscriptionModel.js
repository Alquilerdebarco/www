/**
 * Created by ernestomr87@gmail.com on 3/11/2016.
 */


module.exports = function (mongoose) {

  var Schema = mongoose.Schema;

  var subscriptionSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    token: {type: String, required: true},
    language: {type: Schema.Types.ObjectId, ref: "Language", default: "5669b342ef0fa2841b956b38"},
    email: {type: String, required: true, unique: true},
    remove: {type: Boolean, required: true, default: false},
        // 0 default(no se ha dado de baja)
        // 1 No quiere seguir recibiendo estos email
        // 2 Nunca me suscribí a esta lista de correo
        // 3 Estos correos electrónicos son inapropiados
        // 4 Estos correos son spam, deberían ser reportados
        // 5 Otros motivos (escribe una razón a continuación)
        // 6 Por Administrador
    reason: {type: String, enum: ["0", "1", "2", "3", "4", "5","6"], required: true, default: "0"},
    text: {type: String},
    registerDate: { type: Date, required: true, default: Date.now },
  }, {versionKey: false});
  return mongoose.model("Subscription", subscriptionSchema);
};