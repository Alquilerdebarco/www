/**
 * Created by ernestomr87@gmail.com on 12/23/2015.
 */

var functions = require('./../utils/functions');

function formatDate(date) {
    var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    return new Date(y, m, d);
}

var eventFunctions = {

    create: function (title, type, start, end, cb) {
        var nEnd = end ? new Date(end) : new Date(start);
        var nStart = new Date(start);

        nEnd = formatDate(nEnd);
        nStart = formatDate(nStart);

        var event = new db.Events({
            title: title,
            type: type,
            start: functions.dateToUtc(nStart),
            end: functions.dateToUtc(nEnd)
        });
        event.save(function (err, success) {
            cb(err, success);
        });
    },
    update: function (id, title, start, end, cb) {

        var nEnd = formatDate(end),
            nStart = formatDate(start);

        db.Events.findOneAndUpdate({_id: id}, {
            $set: {
                title: title,
                start: functions.dateToUtc(nStart),
                end: functions.dateToUtc(nEnd)
            }
        }, {new: true}).exec(function (err, event) {
            cb(err, event);
        });
    },
    remove: function (id, cb) {
        db.Events.remove({_id: id}).exec(function (err, success) {
            cb(err, success);
        });
    },


};

module.exports = eventFunctions;