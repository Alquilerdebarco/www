var format;
var formatNumber;
var pad_left;
var pad_right;
pad_left = function (str, chr, len) {
    return (new Array(len + 1).join(chr) + str).slice(-len);
};
pad_right = function (str, chr, len) {
    return (str + new Array(len + 1).join(chr)).substr(0, len);
};
format = function (str, min, max) {
    if (str) {
        if (max && str.length > max) {
            str = str.substr(0, max);
        }
    }
    return str;
};
formatNumber = function (num, min) {
    if (num != null && min && (num + "").length < min) {
        num = pad_left(num, '0', min);
    }
    if (num != null) {
        return num + "";
    }
};
module.exports = {
    format: format,
    formatNumber: formatNumber
};