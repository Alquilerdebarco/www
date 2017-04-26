/**
 * Created by ernestomr87@gmail.com on20/07/2015.
 */

message = {
    invalid: 'invalid input',
    empty: 'please put something here',
    min: 'input is too short',
    max: 'input is too long',
    number_min: 'too low',
    number_max: 'too high',
    url: 'invalid URL',
    number: 'not a number',
    email: 'email address is invalid',
    email_repeat: 'emails do not match',
    password_repeat: 'passwords do not match',
    repeat: 'no match',
    complete: 'input is not complete',
    select: 'Please select an option'
};

var validator = {
    textValidate: function (string, minSize, cantWords, pattern) {
        if (string.length < minSize) {
            return [message.complete, false];
        }
        if (cantWords) {
            var words = string.split(' ');
            // iterrate on all the words
            var wordsLength = function (len) {
                for (var w = words.length; w--;)
                    if (words[w].length < len)
                        return false;
                return true;
            };

            if (words.length < cantWords || !wordsLength(2)) {
                return [message.complete, false];
            }

        }
        if (pattern) {
            var regex, jsRegex;
            switch (pattern) {
                case 'alphanumeric' :
                    regex = /^[a-z0-9]+$/i;
                    break;
                case 'numeric' :
                    regex = /^[0-9]+$/i;
                    break;
                case 'phone' :
                    regex = /^\+?([0-9]|[-|' '])+$/i;
                    break;
                default :
                    regex = pattern;
            }
            try {
                jsRegex = new RegExp(regex).test(string);
                if (string && !jsRegex)
                    return ['regex is invalid', false];
            }
            catch (err) {
                console.log(err, field, 'regex is invalid');
                return ['regex is invalid', false];
            }
        }

        return [null, true];

    }
};
module.exports = validator;

