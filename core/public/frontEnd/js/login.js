/**
 * Created by LI5VANY on 1/11/2016.
 */

$(document).ready(function () {

  // $('.asterisk').append(' <span style="color: red">*</span>');

  $(document).ajaxStart(function () {
    $.LoadingOverlay("show");
  });
  $(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
  });

  $('.required')
    .closest(".form-group")
    .append(
      '<span class="required-span" style="">' + texts.required + '</span>'
    );

  $('#login-form #email').parents(".form-group").children("span").remove();
  $('#formLogin #email').parents(".form-group").children("span").remove();
  $('#login-form #password').parents(".form-group").children("span").remove();
  $('#formLogin #password').parents(".form-group").children("span").remove();

  function my_highlight(element, errorClass, validClass) {
    $(element).parents('.form-group').removeClass('has-success').addClass('has-error');
    $(element).parents('.form-group').children('.required-span').addClass('hidden');
  }

  function my_unhighlight(element, errorClass, validClass) {
    $(element).parents('.form-group').removeClass('has-error').addClass('has-success');
    $(element).parents('.form-group').children('.required-span').removeClass('hidden');
  }

  $('#login-form').validate({
    rules: {
      email: {required: true, email: true},
      password: {required: true, minlength: 6}
    },
    messages: {
      email: {required: '', email: texts.valid_email},
      password: {required: '', minlength: texts.valid_minlength.replace("[number]", "6")}
    },
    errorClass: 'help-block',
    errorElement: 'span',
    highlight: my_highlight,
    unhighlight: my_unhighlight,
    submitHandler: function (form) {
      var email = $('#email').val(),
        password = $('#password').val(),
        remember_here = $('#remember_here');
      if (remember_here.is(':checked')) {
        localStorage.email = email;
        localStorage.password = password;
        localStorage.remember_here = remember_here.val();
      } else {
        localStorage.email = '';
        localStorage.password = '';
        localStorage.remember_here = '';
      }
      $.ajax({
        url: '/access-users',
        type: 'POST',
        data: {email: email, password: password}
      }).done(function (data) {
        if (data.res) {
          window.location = '/backoffice';
        } else {
          ajaxDoneMsg(texts.solic_failed, 'Usuario o contraseña incorrecto', '#hidden_me', true, ['#email', '#password']);
        }
      }).fail(function (data) {
        ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
      })
    }

  });

  $('#reset_pass-form').validate({
    rules: {
      reset_pass_email: {required: true, email: true}
    },
    messages: {
      reset_pass_email: {required: texts.valid_req, email: texts.valid_email}
    },
    errorClass: 'help-block',
    errorElement: 'span',
    highlight: my_highlight,
    unhighlight: my_unhighlight,
    submitHandler: function (form) {
      $.ajax({
        type: "POST",
        url: "/service/users/apply-change-password",
        data: {
          email: $('#reset_pass_email').val()
        }
      }).done(function (data) {
        if (data.res) {
          ajaxDoneMsg(texts.solic_success, '', '#hidden_me', false);
        } else if (data.error.code) {
          if (data.error.code == "11000") {
            ajaxDoneMsg(texts.solic_failed, texts.email_used, '#hidden_me', true, ['#reset_pass_email']);
          } else {
            ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
          }
        } else {
          ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
        }
      }).fail(function (data) {
        ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
      })
    }

  });

  // validateFormatPhone('#register_telephone');
  // validateFormatPhone('#register_mobile');
  $.validator.addMethod("isophone", function (value, element) {
    return this.optional(element) || /^\d{3}\s\d{3}\s\d{3}$/i.test(value);
  }, "Please enter a valid phone value");
  // $("#register_mobile").inputmask("999-999-999");
  $("#form-register").validate({
    rules: {
      register_email_user: {required: true, email: true},
      register_name: {required: true},
      register_surname: {required: true},
      // register_telephone: {required: true, phone: true, minlength: 7},
      register_mobile: {required: true, minlength: 6},
      register_city: {required: true},
      register_pass: {required: true, minlength: 6},
      register_rep_pass: {required: true, minlength: 6, equalTo: "#register_pass"},
    },
    messages: {
      register_email_user: {required: texts.valid_req, email: texts.valid_email},
      register_name: {required: texts.valid_req},
      register_surname: {required: texts.valid_req},
      // register_telephone: {required: texts.valid_req, minlength: texts.valid_minlength.replace("[number]", "6"), phone: texts.valid_digits},
      register_mobile: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
      },
      register_city: {required: texts.valid_req},
      register_pass: {required: texts.valid_req, minlength: texts.valid_minlength.replace("[number]", "6")},
      register_rep_pass: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
        equalTo: texts.valid_match
      },
    },
    errorClass: 'help-block',
    errorElement: 'span',
    highlight: my_highlight,
    unhighlight: my_unhighlight,
    submitHandler: function (form) {
      var name = $('#register_name').val(),
        surname = $('#register_surname').val(),
        email = $('#register_email_user').val(),
        // telephone = $('#register_telephone').val(),
        mobile = $('#register_mobile').val(),
        city = $('#register_city').val(),
        password = $('#register_pass').val(),
        password2 = $('#register_rep_pass').val(),
        subscription = $('#subscription').is(":checked") ? 1 : '';

      $.ajax({
        url: '/service/users/register',
        type: 'POST',
        dataType: 'JSON',
        data: {
          name: name,
          surname: surname,
          email: email,
          // telephone: telephone,
          mobile: mobile,
          address: city,
          password: password,
          password2: password2,
          subscription: subscription
        }
      }).done(function (data) {
        if (data.res) {
          registerBack();
          clearValues();
          ajaxDoneMsg(texts.registerSuccessRequest, '', '#hidden_me', false);
        } else if (data.error.code) {
          if (data.error.code == "11000") {
            ajaxDoneMsg(texts.solic_failed, texts.email_used, '#hidden_me', true, ['#register_email_user']);
          } else {
            ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
          }
        } else {
          ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
        }

      }).fail(function (err) {
        ajaxDoneMsg(texts.solic_failed, '', '#hidden_me', true);
      })
    }
  });

  function clearValues() {
    $('#register_name').val(''),
      $('#register_surname').val(''),
      $('#register_email_user').val(''),
      $('#register_telephone').val(''),
      $('#register_mobile').val(''),
      $('#register_city').val(''),
      $('#register_pass').val(''),
      $('#register_rep_pass').val(''),
      $('#subscription').val('');
  }

  $("#register").click(function () {
    var login = $("#login-form"),
      register = $("#form-register"),
      title = $("#title-register");
    login.hide();
    register.removeClass("hidden");
    title.removeClass("hidden");
    register.show();
    title.show();
  });

  $("#lost-pass").click(function () {
    var login = $('#login-form');
    login.hide();
    var form = $('#reset_pass-form');
    form.removeClass('hidden');
    form.show();
    var email = $('#reset_pass-email');
    email.focus();
    email.select();
  });

  function registerBack() {
    $('#reset_pass-form').hide();
    $("#form-register").hide();
    $("#title-register").hide();
    $('#login-form').show();
    var pass = $('#password');
    pass.focus();
    pass.select();
  };

  $("#register_back").click(function () {
    registerBack()
  });

  $("#back-form-group").click(function () {
    $('#reset_pass-form').hide();
    $("#form-register").hide();
    $("#title-register").hide();
    $('#login-form').show();
    var pass = $('#password');
    pass.focus();
    pass.select();
  });

  if (localStorage.remember_here && localStorage.remember_here != '') {
    $('#remember_here').attr('checked', 'checked');
    $('#login-form #email').val(localStorage.email);
    $('#login-form #password').val(localStorage.password);
  } else {
    $('#remember_here').removeAttr('checked');
    $('#login-form #email').val('');
    $('#login-form #password').val('');
  }

});