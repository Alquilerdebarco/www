/**
 * Created by ernestomr87@gmail.com on 11/28/2015.
 */

$(document).ready(function () {


    function disableElements() {
        $('#name').attr('disabled', true);
        $('#surname').attr('disabled', true);
        $('#email').attr('disabled', true);
        $('#password').attr('disabled', true);
        $('#password2').attr('disabled', true);
        $('#telephone').attr('disabled', true);
        $('#address').attr('disabled', true);
        $('#submitRegister').hide();

    }

    function enableElements() {
        $('#name').attr('disabled', false);
        $('#surname').attr('disabled', false);
        $('#email').attr('disabled', false);
        $('#password').attr('disabled', false);
        $('#password2').attr('disabled', false);
        $('#telephone').attr('disabled', false);
        $('#address').attr('disabled', false);
        $('#submitRegister').show();
    }

    function initializeVars() {
        $('#name').val('');
        $('#surname').val('');
        $('#email').val('');
        $('#password').val('');
        $('#password2').val('');
        $('#telephone').val('');
        $('#address').val('');

    }

    // disableElements();

    <!-- form validation -->
    $.listen('parsley:field:validate', function () {
        var password = $('#password').val(),
            password2 = $('#password2').val();

        validateFront(password, password2);
    });


    var validateFront = function (password, password2, type) {
        if (type != '0' && type != '1') {
            $("#tpp").remove();
            var aux = '<ul id="tpp" class="parsley-errors-list filled" id="parsley-id-5071"><li class="parsley-required">Debe seleccionar un tipo de propietario</li></ul>';
            $("#tp").append(aux);
        }
        if (password != password2) {
            $("#rpt").remove();
            var aux = '<ul id="rpt" class="parsley-errors-list filled" id="parsley-id-5071"><li class="parsley-required">Passwords do not match.</li></ul>';
            $("#rp").append(aux);

            $("#rp input").removeClass('parsley-error');
            $("#rp input").addClass('parsley-error');
            return false;
        }
        // else if (true === $('#register-form').parsley().isValid()) {
        //     $('.bs-callout-info').removeClass('hidden');
        //     $('.bs-callout-warning').addClass('hidden');
        //     return true;
        // }
        else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            return false;

        }
    };

    var validateForm = function (form) {
        if (true === form.parsley().isValid()) {
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

    $(":input").inputmask();

    $("#tu").change(function () {
        var user = $(this).val();

        $('#tp').hide();
        if (user == 2) {
            enableElements()
            $('#tp').show();
        }
        if (user == 1) {
            enableElements()
        }
        if (user == 0) {
            disableElements();
        }

    });

    $("#submitRegister").click(function () {

        var type = $('#type').val()==""?null : $('#type').val(),
            name = $('#name').val(),
            surname = $('#surname').val(),
            email = $('#email').val(),
            password = $('#password').val(),
            password2 = $('#password2').val(),
            mobile = $('#mobile').val(),
            address = $('#address').val();

        $('#register-form').parsley().validate();

        if (validateFront(password, password2, type)) {
            $.ajax({
                type: "POST",
                url: "/service/users/register",
                data: {
                    typeShipOwner: type,
                    name: name,
                    surname: surname,
                    email: email,
                    password: password,
                    password2: password2,
                    mobile: mobile,
                    address: address
                }
            }).done(function (data) {
                $("#register-form").fadeToggle(function () {
                    initializeVars();
                    $("#success-form").show(function () {
                        if (data.res) {
                            $("#msg-success").show();
                        }
                        else {
                            if (data.error.code == 11000) {
                                $("#msg-email-exist").show();
                            } else {
                                $("#msg-error").show();
                            }

                        }
                    });
                });
            });
        }
    });

    $('#login-form').validate({
        rules: {
            email: {required: true, email: true},
            password: {required: true, minlength: 6}
        },
        messages: {
            email: {required: 'Este campo es obligatorio', email: 'Por favor, entre un email válido'},
            password: {required: 'Este campo es obligatorio', minlength: 'Por favor, entre por lo menos 6 caracteres'}
        },
        errorClass: 'help-block',
        errorElement: 'span',
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.form-group').removeClass('has-success').addClass('has-error');
            $(element).parents('.form-group').children('.required-span').addClass('hidden');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.form-group').removeClass('has-error').addClass('has-success');
            $(element).parents('.form-group').children('.required-span').removeClass('hidden');
        },
        submitHandler: function (form) {
            var email = $('#email').val(),
                password = $('#password').val();
            $.ajax({
                url: '/access-users',
                type: 'POST',
                data: {email: email, password: password}
            }).done(function (data) {
                if (data.res) {
                    window.location = '/backoffice';
                } else {
                    window.location = '/backoffice/login/failure';
                }
            }).fail(function (data) {
                window.location = '/backoffice/login/failure';
            })
        }

    });

    $('#reset_pass_form').validate({
        rules: {
            reset_pass_email: {required: true, email: true}
        },
        messages: {
            reset_pass_email: {required: 'Este campo es obligatorio', email: 'Por favor, entre un email válido'}
        },
        errorClass: 'help-block',
        errorElement: 'span',
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.form-group').removeClass('has-success').addClass('has-error');
            $(element).parents('.form-group').children('.required-span').addClass('hidden');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.form-group').removeClass('has-error').addClass('has-success');
            $(element).parents('.form-group').children('.required-span').removeClass('hidden');
        },
        submitHandler: function (form) {
            var email = $('#reset_pass_email').val();
            $.ajax({
                type: "POST",
                url: "/service/users/apply-change-password",
                data: {
                    email: email,
                }
            }).done(function (data) {
                $("#reset_pass_form").fadeToggle(function () {
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

    $('#toreset_pass').click(function () {
        $("#login").fadeToggle(function () {
            $("#reset_pass").fadeToggle();
        });
    });

    $('.reset_tologin').click(function () {
        $("#reset_pass").fadeToggle(function () {
            $("#login").fadeToggle();
        });
    });

    $('#reset_pass .close').click(function () {
        $("#success-reset_pass").fadeToggle(function () {
            $("#reset_pass_form").fadeIn(function () {
                $("#msg-reset-success").hide();
                $("#msg-reset-error").hide();
            });
        });
    })

});


