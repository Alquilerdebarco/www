/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 17/5/2016.
 */

$(function () {
    if(page == 'newsletter'){
        var email = susc.email;
        var parts = email.split("@");
        var init = email.charAt(0);
        var split1 = [], split2 = [];
        for (var i = 1; i < parts[0].length; i++) {
            split1.push("*");
        }
        var part2 = parts[1].split(".");
        var init2 = part2[0].charAt(0);
        for (var i = 1; i < part2[0].length; i++) {
            split2.push("*");
        }
        for (var i = 0; i < split1.length; i++) {
            init += split1[i]
        }
        for (var i = 0; i < split2.length; i++) {
            init2 += split2[i];

        }
        $('#email_susc').val(init+"@"+init2+"."+part2[1]);
        var name = susc.name, lastname = susc.lastname;
        if(name) $('#name').val(name);
        if(lastname) $('#lastname').val(lastname);
        $('#formUpdate').validate({
            rules:{
                name:{
                    required:true
                },
                lastname:{
                    required:true
                }
            },
            messages:{
                name:{
                    required:texts.valid_req
                },
                lastname:{
                    required:texts.valid_req
                }
            },
            errorClass: 'help-block',
            errorElement: 'span',
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.input-group').removeClass('has-success').addClass('has-error');
                $('.update_profile').attr("disabled", true);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.input-group').removeClass('has-error').addClass('has-success');
                $('.update_profile').attr("disabled", false);
            },
            submitHandler: function (form) {
                var name = $('#name').val(),
                    lastname = $('#lastname').val();
                $.ajax({
                    type: "PUT",
                    url: "/service/subscriptions/update",
                    data: {
                        name: name,
                        lastname: lastname,
                        token:susc.token
                    }
                }).done(function (data) {
                    if (!data.res) {
                        $('.notification').attr('style', 'display:block; background-color: red; color: white');
                        $('.notification p').html(texts.solic_failed);
                        setTimeout(function () {
                            $('.notification').attr('style', 'display:none;')
                        }, 3000);
                    } else {
                        $('.notification').attr('style', 'display:block; background-color: green; color: white');
                        $('.notification p').html(texts.solic_success);
                        setTimeout(function () {
                            $('.notification').attr('style', 'display:none;')
                        }, 3000);
                    }


                }).fail(function (data) {
                    $('.notification').attr('style', 'display:block; background-color: red; color: white');
                    $('.notification p').html(texts.solic_failed);
                    setTimeout(function () {
                        $('.notification').attr('style', 'display:none;')
                    }, 3000);
                })
            }
        });

        $('#formLeaveNews').validate({
            rules:{
                options:{
                    required:true
                },
                area_reject:{
                    required:'#option5:checked'
                }
            },
            messages:{
                options:{
                    required:texts.valid_req
                },
                area_reject:{
                    required:texts.valid_req
                }
            },
            errorClass: 'help-block',
            errorElement: 'span',
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.input-group').removeClass('has-success').addClass('has-error');
                $('.btn-leave').attr("disabled", true);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.input-group').removeClass('has-error').addClass('has-success');
                $('.btn-leave').attr("disabled", false);
            },
            submitHandler: function (form) {
                var reason = $('input[name=options]:checked', '#formLeaveNews').val();
                var text = $('#area_reject').val();
                $.ajax({
                    type: "DELETE",
                    url: "/service/subscriptions/newsletter",
                    data: {
                        token: susc.token,
                        email:susc.email,
                        reason: reason,
                        text:text
                    }
                }).done(function (data) {
                    if (!data.res) {
                        $('.notification').attr('style', 'display:block; background-color: red; color: white');
                        $('.notification p').html(texts.solic_failed);
                        setTimeout(function () {
                            $('.notification').attr('style', 'display:none;')
                        }, 3000);
                    } else {
                        $('.news_back').attr("style","display:none");
                        $('.cancel_sucess').attr("style","display:block");
                        $('.notification').attr('style', 'display:block; background-color: green; color: white');
                        $('.notification p').html(texts.solic_success);
                        setTimeout(function () {
                            $('.notification').attr('style', 'display:none;')
                        }, 3000);
                    }


                }).fail(function (data) {
                    $('.notification').attr('style', 'display:block; background-color: red; color: white');
                    $('.notification p').html(texts.solic_failed);
                    setTimeout(function () {
                        $('.notification').attr('style', 'display:none;')
                    }, 3000);
                })
            }
        });
        $('#area_reject').hide();
        $('input[name="options"]:radio').click(function () {
            if($(this).val() == '5'){
                $('#area_reject').show();
                $('#area_reject').attr("required",true);
            }else{
                $('#area_reject').hide();
                $('#area_reject').attr("required",false);
            }
        })
    }

});