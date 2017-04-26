/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 10/3/2016.
 */

$(function () {
  $.validator.addMethod("slora", function (value, element) {
    return this.optional(element) || /^[0-9]+([,][0-9]+)?$/i.test(value) || /^[0-9]+([.][0-9]+)?$/i.test(value);
  }, "Please enter a valid slora value");
  $.validator.addMethod("phone", function (value, element) {
    return this.optional(element) || /^(00)?\+?[\d\s]+$/i.test(value);
  }, "Please enter a valid phone value");
  $.validator.addMethod("isophone", function (value, element) {
    return this.optional(element) || /^\d{3}[\-]\d{3}[\-]\d{3}$/i.test(value);
  }, "Please enter a valid phone value");
  $.validator.addMethod("url", function (value, element) {
    return this.optional(element) || /^(http(s)?\:\/{2})?(\w+(\.{1,2}|\/|\?|\%|\#|\&|\=|\-|\+|(\:\d+)))+(\w+(\.{1,2}|\/|\%|\#|\&|\=|\-|\+)+\w+\/?)+$/i.test(value);
  }, "Please enter a valid url value");

  // validateFormatPhone('#emp_phone');
  // validateFormatPhone('#emp_mobile');

  // $("#emp_mobile").inputmask("999-999-999");
  $("#emp-form").validate({
    rules: {
      emp_name: {
        required: true
      },
      emp_contact: {
        required: true

      },
      emp_email: {
        required: true,
        email: true
      },
      emp_pass: {
        required: true,
        minlength: 6
      },
      emp_pass_confirm: {
        required: true,
        minlength: 6,
        equalTo: "#emp_pass"
      },
      // emp_phone: {
      //     required: true,
      //     phone: true,
      //     minlength: 7
      // },
      emp_mobile: {
        required: true,
        minlength: 6
      },
      emp_prop: {
        required: true
      },
      emp_address: {
        required: true
      }
    },
    messages: {
      emp_name: {
        required: texts.valid_req
        // minlength:texts.valid_minlength.replace("[number]","4")
      },
      emp_contact: {
        required: texts.valid_req
        // minlength:texts.valid_minlength.replace("[number]","4")
      },
      emp_email: {
        required: texts.valid_req,
        email: texts.valid_email
      },
      emp_pass: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6")
      },
      emp_pass_confirm: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
        equalTo: texts.valid_match
      },
      // emp_phone: {
      //   required: texts.valid_req,
      //   minlength: texts.valid_minlength.replace("[number]", "6"),
      //   isophone: texts.valid_digits
      // },
      emp_mobile: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
      },
      emp_prop: {
        required: texts.valid_req
      },
      emp_address: {
        required: texts.valid_req
      }

    },
    errorClass: "help-block",
    errorElement: "span",
    highlight: function (element) {
      $(element).parents(".form-group").removeClass("has-success").addClass("has-error");
      $(element).parents(".form-group").children(".required-span").addClass("hidden");
      $("#emp-send").attr("disabled", true);
    },
    unhighlight: function (element) {
      $(element).parents(".form-group").removeClass("has-error").addClass("has-success");
      $(element).parents(".form-group").children(".required-span").removeClass("hidden");
      $("#emp-send").attr("disabled", false);
    },
    submitHandler: function (form) {
      var name = $("#emp_name").val(),
        surname = $("#emp_contact").val(),
        email = $("#emp_email").val(),
        password = $("#emp_pass").val(),
        password2 = $("#emp_pass_confirm").val(),
        // telephone = $('#emp_phone').val(),
        mobile = $("#emp_mobile").val(),
        typeShipOwner = $("#emp_prop").val(),
        address = $("#emp_address").val(),
        web = $("#emp_web").val();
      $.ajax({
        type: "POST",
        url: "/service/users/register",
        dataType: "JSON",
        data: {
          name: name,
          surname: surname,
          email: email,
          password: password,
          password2: password2,
          // telephone: telephone,
          mobile: mobile,
          address: address,
          typeShipOwner: typeShipOwner,
          web: web
        }
      }).done(function (data) {
        if (data.res) {
          $("#emp_name").val(""),
            $("#emp_contact").val(""),
            $("#emp_email").val(""),
            $("#emp_pass").val(""),
            $("#emp_pass_confirm").val(""),
            $("#emp_phone").val(""),
            $("#emp_prop").val(""),
            $("#emp_address").val("");
          ajaxDoneMsg(texts.registerSuccessRequest, '', '#hidden_me', false);
        } else if (data.error.code) {
          if (data.error.code == "11000") {
            ajaxDoneMsg(texts.solic_failed, texts.email_used, "#hidden_me", true, ["#emp_email"]);
          } else {
            ajaxDoneMsg(texts.solic_failed, "", "#hidden_me", true);
          }
        } else {
          ajaxDoneMsg(texts.solic_failed, "", "#hidden_me", true);
        }


      }).fail(function (err) {
        ajaxDoneMsg(texts.solic_failed, "", "#hidden_me", true);
      });
    }
  });

  // validateFormatPhone('#part_phone');
  // validateFormatPhone('#part_mobile');
  $("#part-form").validate({
    rules: {
      part_name: {
        required: true,
      },
      part_mark: {
        required: true
        // minlength: 4
      },
      part_detail: {
        required: true
      },
      part_eslora: {
        required: true,
        slora: true
      },
      part_local: {
        required: true
      },
      part_email: {
        required: true,
        email: true
      },
      // part_phone: {
      //   required: true,
      //   phone: true,
      //   minlength: 7
      // },
      part_mobile: {
        required: true
      }
    },
    messages: {
      part_name: {
        required: texts.valid_req
      },
      part_mark: {
        required: texts.valid_req
        // minlength:texts.valid_minlength.replace("[number]","4")
      },
      part_detail: {
        required: texts.valid_req
      },
      part_eslora: {
        required: texts.valid_req,
        slora: texts.valid_digits + " Ej:(10; 20,5; 10.65 )"
      },
      part_local: {
        required: texts.valid_req
        // minlength:texts.valid_minlength.replace("[number]","6")
      },
      part_email: {
        required: texts.valid_req,
        email: texts.valid_email
      },
      // part_phone: {
      //   required: texts.valid_req,
      //   phone: texts.valid_digits,
      //   minlength: texts.valid_minlength.replace("[number]", "6")
      // },
      part_mobile: {
        required: texts.valid_req,
      }
    },
    errorClass: "help-block",
    errorElement: "span",
    highlight: function (element, errorClass, validClass) {
      $(element).parents(".form-group").removeClass("has-success").addClass("has-error");
      $(element).parents(".form-group").children(".required-span").addClass("hidden");
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).parents(".form-group").removeClass("has-error").addClass("has-success");
      $(element).parents(".form-group").children(".required-span").removeClass("hidden");
    },
    submitHandler: function (form) {
      var slora = "";
      if ($("#part_eslora").val().indexOf(",") != -1) {
        slora = $("#part_eslora").val();
        slora = slora.replace(",", ".");
      } else {
        slora = $("#part_eslora").val();
      }
      var particular = {
        name: $("#part_name").val(),
        specifications: $("#part_mark").val(),
        detail: $("#part_detail").val(),
        dimension: slora,
        area: $("#part_local").val(),
        email: $("#part_email").val(),
        // telephone: $('#part_phone').val(),
        mobile: $("#part_mobile").val()
      };
      particular = JSON.stringify(particular);
      $.ajax({
        type: "POST",
        url: "/service/particular",
        dataType: "JSON",
        data: {
          particular: particular
        }
      }).done(function (data) {
        if (data.res) {
          $("#part_name").val("");
          $("#part_mark").val("");
          $("#part_detail").val("");
          $("#part_eslora").val("");
          $("#part_local").val("");
          $("#part_email").val("");
          $("#part_phone").val("");
          ajaxDoneMsg(texts.priv_subsrecibe_title, texts.priv_subsrecibe, "#hidden_me", false);
        } else if (data.error.code) {
          if (data.error.code == "11000") {
            ajaxDoneMsg(texts.solic_failed, texts.email_used, "#hidden_me", true, ["#part_email"]);
          } else {
            ajaxDoneMsg(texts.solic_failed, texts.priv_solicfail, "#hidden_me", true);
          }

        } else {
          ajaxDoneMsg(texts.solic_failed, texts.priv_solicfail, "#hidden_me", true);
        }

      }).fail(function (err) {
        ajaxDoneMsg(texts.solic_failed, texts.priv_solicfail, "#hidden_me", true);
      });
    }
  });

  function scroller(scroll) {
    $("html, body").animate({
      scrollTop: scroll //$(".breadcumb").offset().top
    }, 1000);
  }

});