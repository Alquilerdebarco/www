/**
 * Created by ernestomr87@gmail.com on 12/2/2015.
 */

$(document).ready(function () {

    <!-- form validation -->
    $.listen('parsley:field:validate', function () {
        var password = $('#password').val(),
            password2 = $('#password2').val();

        validateFront(password, password2);
    });


    var validateFront = function (password, password2) {
        if (password != password2) {
            $("#rpt").remove();
            var aux = '<ul id="rpt" class="parsley-errors-list filled" id="parsley-id-5071"><li class="parsley-required">Passwords do not match.</li></ul>';
            $("#rp").append(aux);

            $("#rp input").removeClass('parsley-error');
            $("#rp input").addClass('parsley-error');
            return false;
        }
        else if (true === $('#reset_pass-form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
            return true;
        }
        else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            return false;

        }
    };
    <!-- /form validation -->

    $("#submit-reset_pass").click(function () {
        $('#reset_pass-form').parsley().validate();
        var id = $('#user-id').val();
        var token = $('#token').val();
        var password = $('#password').val();
        var password2 = $('#password2').val();
        if (validateFront(password, password2)) {
            $.ajax({
                type: "POST",
                url: "/service/users/change-password",
                data: {
                    id: id,
                    token: token,
                    password: password,
                    password2: password2
                }
            }).done(function (data) {
                $("#reset_pass-form").fadeToggle(function () {
                    $("#success-reset_pass").fadeIn(function () {
                        if (data.res) {
                            $("#msg-reset-success").show();
                        }
                        else {
                            $("#msg-reset-error").show();
                        }
                    });
                });
            });
        }
    });


});
