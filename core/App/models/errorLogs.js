/**
 * Created by ernestomr87@gmail.comon 3/21/2016.
 */


module.exports = function (mongoose) {

    var Schema = mongoose.Schema;
    Mixed = Schema.Types.Mixed;

    var errorSchema = new Schema({
        error: {type: Mixed},
        date: {type: Date, required: true, default: Date.now}
    }, {versionKey: false});
    return mongoose.model('Error', errorSchema);
};
