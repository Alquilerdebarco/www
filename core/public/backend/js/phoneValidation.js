/**
 * Created by 7i5vany@gmail.com on 05/12/2016.
 */

$(function () {
    var fieldValue = {},
        lastKey;
    /*$('input[ng-validate="phoneValidationStrategy"], input[ng-validate="mobileValidationStrategy"]').keyup(function (e, v) {
        validate(this, e)
    });*/

    $('input[ng-validate="phoneValidationStrategy"], input[ng-validate="mobileValidationStrategy"]').blur(function (e, v) {
        validate(this, e, true)
    });

    function validate(me, e, blur) {
        if (blur
            || (lastKey && (lastKey == 17 && e.keyCode == 86))
            || (me.value != fieldValue[me.name ? me.name : 'tmp'] && !(e.keyCode == 37 || e.keyCode == 39))) {
            var value = me.value,
                tmp = '';
            fieldValue[me.name ? me.name : 'tmp'] = value;
            /*if (value.match(/^\+/)) {
                if (value.length == 3) {
                    tmp = value.substring(0, 3) + ' ';
                } else if (value.length > 3 && value.length == 6) {
                    value = '+' + clearValue(value);
                    tmp = value.substring(0, 3) + ' ' + value.substring(3, 6) + '-';
                } else if (value.length > 6 && value.length == 10) {
                    value = '+' + clearValue(value);
                    tmp = value.substring(0, 3) + ' ' + value.substring(3, 5) + '-' + value.substring(5, 9) + '-';
                } else if (((e.keyCode == 86 && (e.ctrlKey || lastKey == 17)) || blur) && value.length > 10) {
                    value = '+' + clearValue(value).substring(0, 14);
                    tmp = value.substring(0, 3) + ' ' + value.substring(3, 5) + '-' + value.substring(5, 8) + '-' + value.substring(8, 12);
                } else if (value.length > 14) {
                    value = '+' + clearValue(value).substring(0, 14);
                    tmp = value.substring(0, 3) + ' ' + value.substring(3, 5) + '-' + value.substring(5, 8) + '-' + value.substring(8, 12);
                }
            } else {
                if (value.length == 2) {
                    tmp = value.substring(0, 2) + '-';
                } else if (value.length > 2 && value.length == 6) {
                    value = clearValue(value);
                    tmp = value.substring(0, 2) + '-' + value.substring(2, 6) + '-';
                } else if (((e.keyCode == 86 && (e.ctrlKey || lastKey == 17)) || blur) && value.length > 8) {
                    value = clearValue(value).substring(0, 9);
                    tmp = value.substring(0, 2) + '-' + value.substring(2, 5) + '-' + value.substring(5, 9);
                } else if (value.length > 11) {
                    value = clearValue(value).substring(0, 9);
                    tmp = value.substring(0, 2) + '-' + value.substring(2, 5) + '-' + value.substring(5, 9);
                }
            }*/
            if (value != '' || (value != '' && value != ' ')) {
                if (value.match(/^\+/)) {
                    value = '+' + clearValue(value);
                    tmp = value.substring(0, 3) + " " + value.substring(3, 5) + " " + value.substring(5, value.length)
                } else if (value.match(/^00/)) {
                    value = clearValue(value);
                    tmp = value.substring(0, 4) + " " + value.substring(4, 6) + " " + value.substring(6, value.length)
                } else {
                    value = clearValue(value);
                    tmp = value.substring(0, 2) + " " + value.substring(2, value.length)
                }
            }
            if (tmp) {
                $(me).val(tmp);
                $(me).change();
            }
        }
        lastKey = e.keyCode;
    }

    function clearValue(value) {
        return value.replace(/\D/g,'');
    }
});