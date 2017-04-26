/**
 * Created by ernestomr87@gmail.comon 3/21/2016.
 */


 module.exports = function (mongoose) {

    var Schema = mongoose.Schema;

    var activitySchema = new Schema({
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        entity: {type: String, required: true},
        action: {type: String, required: true},
        object: {type: String},
        date: {type: Date, required: true, default: Date.now}
    }, {versionKey: false});

    return mongoose.model('Activity', activitySchema);
};