/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com>
 on 09/12/2015.
 */

$(function () {
  if (page == "ship-details") {
    // $("#phone").inputmask("999-999-999");
    var myCarousel1 = $("#carousel-example-generic");
    myCarousel1.carousel({
      interval: 2000
    });
    /*$.validator.addMethod("phone", function (value, element) {
     return this.optional(element) || /^(\+\d\d\s)?\d\d\-\d\d\d\-\d\d\d\d$/i.test(value);
     }, "Please enter a valid phone value");*/
    $.validator.addMethod("phone", function (value, element) {
      return this.optional(element) || /^(00)?\+?[\d\s]+$/i.test(value);
    }, "Please enter a valid phone value");
    var d = new Date();
    var dayActual = "01";
    var monthActual = d.getMonth() + 1;
    var yearActual = d.getFullYear();
    var reserve_day = 0;
    var durations = $("#durations");
    var dur_sel = 0;
    var price_sel = 0;
    var l = $(".hidden.l").html();
    $(".datepicker table tr td.day.old").addClass("disabled");
    $(".datepicker table tr td.day.new").addClass("disabled");
    function calendar() {
      var disabled_Days = [];
      var locked = [];
      var actually = monthActual;
      for (var i = 0; i < detail.locks.length; i++) {
        var start = new Date(detail.locks[i].start).getTime();
        var end = new Date(detail.locks[i].end).getTime();
        for (var j = start; j <= end; j += 86400000) {
          var disable = new Date(j);
          var temp = disable.getDate() + "/" + (disable.getMonth() + 1) + "/" + disable.getFullYear();
          disabled_Days.push(temp);
          locked.push(disable);
        }

      }
      var stringReplace = texts.general_ships + " " + detail.manufacturer + " " + detail.model;
      $("h1.first-title").html($("h1.first-title").html().replace("[target]", detail.localization.country.name[0].value));
      $("h1.first-title").html($("h1.first-title").html().replace("[ships]", stringReplace));
      $("h1.first-title").addClass("act");

      var available_days = [];
      for (var i = 0; i < detail.seasons.length; i++) {

        var start_season = new Date(detail.seasons[i].start).getTime();
        var end_season = new Date(detail.seasons[i].end).getTime();
        for (var j = start_season; j <= end_season; j += 86400000) {
          var available = new Date(j);
          available_days.push(available);
        }

      }
      var fixMonth = 0;
      var fixNextMonth = 0;
      for (var i = 1; i <= 6; i++) {
        var nextDay = "00";
        var netxMonth = monthActual + 1;
        if (monthActual <= 0) {
          if (monthActual <= -12) monthActual = monthActual % 12;
          fixMonth = 12 + monthActual;
          //fixYear = yearActual-1;
          fixMonth == 12 ? fixNextMonth = fixMonth : fixNextMonth = fixMonth + 1;
          fixMonth == 12 ? nextDay = "31" : nextDay = "00";
          $("#month-list").append("<div class=\"\" id=\"" + i + "-month\"><div class=\"col-xs-12 col-sm-6 col-md-4 border-calendar\"></div></div>");
          $("#" + i + "-month div").datepicker({
            startDate: dayActual + "/" + fixMonth + "/" + yearActual,
            endDate: nextDay + "/" + fixNextMonth + "/" + yearActual,
            maxViewMode: 0,
            language: "es",
            todayHighlight: true,
            beforeShowDay: function (date) {
              //var tmp = new Date(date).getTime();
              var class_asign = {
                classes: "disable",
                tooltip: ""
              };
              var lock = false;
              for (var i = 0; i < locked.length && !lock; i++) {
                var d = new Date(locked[i])
                if (date.getMonth() == d.getMonth() && date.getDate() == d.getDate() && date.getFullYear() == d.getFullYear()) {
                  class_asign.classes = "disabled locked";
                  class_asign.tooltip = "locked day";
                  lock = true;
                  return class_asign;
                }

              }

              lock = false;
              for (var i = 0; i < available_days.length && !lock; i++) {
                var avi = new Date(available_days[i]);
                if (date.getMonth() == avi.getMonth() && date.getDate() == avi.getDate() && date.getFullYear() == avi.getFullYear()) {
                  class_asign.classes = "available";
                  lock = true;
                  return class_asign;
                }

              }

            }

          });
        } else {
          if (monthActual > 12) monthActual = monthActual % 12;
          monthActual == 12 ? netxMonth = monthActual : netxMonth = monthActual + 1;
          monthActual == 12 ? nextDay = "31" : nextDay = "00";
          $("#month-list").append("<div class=\"\" id=\"" + i + "-month\"><div class=\"col-xs-12 col-sm-6 col-md-4 border-calendar\"></div></div>");
          $("#" + i + "-month div").datepicker({
            startDate: dayActual + "/" + monthActual + "/" + yearActual,
            endDate: nextDay + "/" + netxMonth + "/" + yearActual,
            maxViewMode: 0,
            language: "es",
            todayHighlight: true,
            beforeShowDay: function (date) {
              //var tmp = new Date(date).getTime();
              var class_asign = {
                classes: "",
                tooltip: ""
              };
              var lock = false;
              for (var i = 0; i < locked.length && !lock; i++) {
                var d = new Date(locked[i])
                if (date.getMonth() == d.getMonth() && date.getDate() == d.getDate() && date.getFullYear() == d.getFullYear()) {
                  class_asign.classes = "disabled locked";
                  class_asign.tooltip = "locked day";
                  lock = true;
                  return class_asign;
                }

              }

              lock = false;
              for (var i = 0; i < available_days.length && !lock; i++) {
                var avi = new Date(available_days[i]);
                if (date.getMonth() == avi.getMonth() && date.getDate() == avi.getDate() && date.getFullYear() == avi.getFullYear()) {
                  class_asign.classes = "available";
                  lock = true;
                  return class_asign;
                }

              }

            }
          });
        }

        if (monthActual % 12 == 0 || monthActual == 0) yearActual++;
        dayActual = "01";
        monthActual++;
        //netxMonth++;

      }
      var first = $("#1-month .datepicker tr.isohead .datepicker-switch").html();
      var last = $("#6-month .datepicker tr.isohead .datepicker-switch").html();
      $(".month-actuals").html("" + first + " - " + last);
      $("th.datepicker-switch").attr("style", "width:100%; text-align:center;");
    }

    var auxArea = detail.localization.area ? detail.localization.area.name[0].value : "";
    var frame = "<iframe width=\"100%\" height=\"600\" src=\"http://www.mapsdirections.info/en/custom-google-maps/map.php?width=100%&height=600&hl=ru&coord=" +
      detail.localization.port.latitude + "," +
      detail.localization.port.longitude + "&q=" + detail.localization.country.name[0].value + "%2C%20" +
      detail.localization.city.name[0].value + "%2C" + auxArea + "%20+(" +
      detail.localization.port.name[0].value + ")&ie=UTF8&t=&z=14&iwloc=B&output=embed\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"></iframe>";


    $("#mapGoogle").append(frame);


    var dur_offer = 0,
      durat = [],
      values_duration = [],
      xp = [];

    function changeOptionDuration(xp) {
      var names = []
      $("#durations option").remove();
      durations = $("#durations");
      durations.append("<option value=\"\">" + texts.det_choose + "</option>")
      var week = false;
      if (xp) {
        xp.durations.forEach(function (duration) {
          if (duration.duration.unity == 0) {
            if (duration.duration.quantity == 2) {
              names.push("<option value=\"0,2\">" + 2 + " " + texts.det_ship_hours + "</option>")
            } else if (duration.duration.quantity == 4) {
              names.push("<option value=\"0,4\">" + 4 + " " + texts.det_ship_hours + "</option>")
            }
          } else if (duration.duration.unity == 1) {
            names.push("<option value=\"1,1\">" + 1 + " " + texts.det_schedule_day + "</option>", "<option value=\"1,2\">" + 2 + " " + texts.det_ship_days + "</option>", "<option value=\"1,3\">" + 3 + " " + texts.det_ship_days + "</option>", "<option value=\"1,4\">" + 4 + " " + texts.det_ship_days + "</option>", "<option value=\"1,5\">" + 5 + " " + texts.det_ship_days + "</option>", "<option value=\"1,6\">" + 6 + " " + texts.det_ship_days + "</option>", "<option value=\"1,7\">" + 7 + " " + texts.det_ship_days + "</option>", "<option value=\"1,8\">" + 8 + " " + texts.det_ship_days + "</option>", "<option value=\"1,9\">" + 9 + " " + texts.det_ship_days + "</option>", "<option value=\"1,10\">" + 10 + " " + texts.det_ship_days + "</option>", "<option value=\"1,11\">" + 11 + " " + texts.det_ship_days + "</option>", "<option value=\"1,12\">" + 12 + " " + texts.det_ship_days + "</option>", "<option value=\"1,13\">" + 13 + " " + texts.det_ship_days + "</option>", "<option value=\"7,2\">" + 2 + " " + texts.det_ship_weeks + "</option>", "<option value=\"7,3\">" + 3 + " " + texts.det_ship_weeks + "</option>", "<option value=\"7,4\">" + 4 + " " + texts.det_ship_weeks + "</option>")
            week = true
          } else if (duration.duration.unity == 7 && !week) {
            names.push("<option value=\"1,7\">" + 7 + " " + texts.det_ship_days + "</option>", "<option value=\"1,8\">" + 8 + " " + texts.det_ship_days + "</option>", "<option value=\"1,9\">" + 9 + " " + texts.det_ship_days + "</option>", "<option value=\"1,10\">" + 10 + " " + texts.det_ship_days + "</option>", "<option value=\"1,11\">" + 11 + " " + texts.det_ship_days + "</option>", "<option value=\"1,12\">" + 12 + " " + texts.det_ship_days + "</option>", "<option value=\"1,13\">" + 13 + " " + texts.det_ship_days + "</option>", "<option value=\"7,2\">" + 2 + " " + texts.det_ship_weeks + "</option>", "<option value=\"7,3\">" + 3 + " " + texts.det_ship_weeks + "</option>", "<option value=\"7,4\">" + 4 + " " + texts.det_ship_weeks + "</option>")
          }
        })
        durations.append(names);
      }
    }

    function loadDurations() {
      $.ajax({
        type: "GET",
        url: "/service/configurations/listFront",
        data: {
          culture: lang
        }
      }).done(function (data) {
        var list = [];
        durat = data.res.durations;
        var aux = "";
        for (var i = 0; i < data.res.experiences.length - 1; i++) {
          for (var j = i + 1; j < data.res.experiences.length; j++) {
            if (data.res.experiences[i].name[0].value > data.res.experiences[j].name[0].value) {
              aux = data.res.experiences[j];
              data.res.experiences[j] = data.res.experiences[i];
              data.res.experiences[i] = aux;

            }
          }

        }
        xp = data.res.experiences;
        detail.seasons.forEach(function (season) {
          if ((new Date(season.start).getTime() <= new Date().getTime() && new Date(season.end).getTime() >= new Date().getTime())) {
            season.experiences.forEach(function (xp) {
              $("#ship_xp").append("<option value=\"" + xp.experience.id + "\">" + xp.experience.name + "</option>");
              if (xp.experience.id == detail.xp.id) {
                $("#ship_xp").val(detail.xp.id);
                changeOptionDuration(xp)
              }
            })
          }
        })
        $("#ship_xp").on("change", function () {
          var id = this.value;
          if (id) {
            detail.seasons.forEach(function (season) {
              if ((new Date(season.start).getTime() <= new Date().getTime() && new Date(season.end).getTime() >= new Date().getTime())) {
                season.experiences.forEach(function (xp) {
                  if (xp.experience.id == id) {
                    changeOptionDuration(xp)
                  }
                })
              }
            })
          } else {
            changeOptionDuration()
          }
        })

        // for (var i = 0; i < data.res.durations.length; i++) {
        //     if (data.res.durations[i].unity == 0) {
        //         list.push('<option value="' + data.res.durations[i]._id + '">' + data.res.durations[i].quantity + texts.det_ship_hours + '</option>')
        //     }
        //     else if (data.res.durations[i].unity == 1) {
        //         list.push('<option value="' + data.res.durations[i]._id + '">' + data.res.durations[i].quantity + texts.det_ship_days + '</option>')
        //     }
        //     else {
        //         list.push('<option value="' + data.res.durations[i]._id + '">' + data.res.durations[i].quantity + texts.det_ship_week + '</option>')
        //     }
        // }
        values_duration.push("0,2", "0,4", "1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "1,7", "1,8", "1,9", "1,10", "1,11", "1,12", "1,13", "7,1", "7,2", "7,3", "7,4");
        // names.push();
        for (var i = 0; i < durat.length; i++) {
          var exist = false;
          for (var j = 0; j < detail.discounts.length && !exist; j++) {
            if (durat[i]._id == detail.discounts[j].minDuration) {
              if (durat[i].unity == 0) {
                $("." + detail.discounts[j].minDuration).html(durat[i].quantity + texts.det_ship_hours);
                exist = true;
              } else if (durat[i].unity == 1) {
                $("." + detail.discounts[j].minDuration).html(durat[i].quantity + texts.det_ship_days);
                exist = true;
              } else {
                $("." + detail.discounts[j].minDuration).html(durat[i].quantity + texts.det_ship_weeks);
                exist = true;
              }
            }

          }

        }

        // for (var i = 0; i < durat.length; i++) {
        //     var exist = false;
        //     for (var j = 0; j < detail.conditions.patron.length && !exist; j++) {
        //         if (durat[i]._id == detail.conditions.patron[j].duration) {
        //             if (detail.seasons[0].experiences[0].durations[0].symbol == '€') {
        //                 if (durat[i].unity == 0) {
        //                     $('.skipper_price').append('<li><p>' + detail.conditions.patron[j].price + '<span class="euro">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + " / " + durat[i].quantity + texts.det_ship_hours + '</p></li>');
        //                     exist = true;
        //                 }
        //                 else if (durat[i].unity == 1) {
        //                     $('.skipper_price').append('<li><p>' + detail.conditions.patron[j].price + '<span class="euro">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + " / " + durat[i].quantity + texts.det_ship_days + '</p></li>');
        //                     exist = true;
        //                 }
        //                 else {
        //                     $('.skipper_price').append('<li><p>' + detail.conditions.patron[j].price + '<span class="euro">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + " / " + durat[i].quantity + texts.det_ship_week + '</p></li>');
        //                     exist = true;
        //                 }
        //             } else {
        //                 if (durat[i].unity == 0) {
        //                     $('.skipper_price').append('<li><p>' + '<span class="dollar">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + detail.conditions.patron[j].price + " / " + durat[i].quantity + texts.det_ship_hours + '</p></li>');
        //                     exist = true;
        //                 }
        //                 else if (durat[i].unity == 1) {
        //                     $('.skipper_price').append('<li><p>' + '<span class="dollar">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + detail.conditions.patron[j].price + " / " + durat[i].quantity + texts.det_ship_days + '</p></li>');
        //                     exist = true;
        //                 }
        //                 else {
        //                     $('.skipper_price').append('<li><p>' + '<span class="dollar">' + detail.seasons[0].experiences[0].durations[0].symbol + '</span>' + detail.conditions.patron[j].price + " / " + durat[i].quantity + texts.det_ship_week + '</p></li>');
        //                     exist = true;
        //                 }
        //             }
        //
        //         }
        //
        //     }
        //
        // }
        //durations.append(list.join(''));
        $("#durations").on("change", function () {
          if ($(this).val() == "") {
            $("#how-many").html("" + detail.seasons[0].experiences[0].durations[0].symbol + 0)
          } else {
            var stop = false;
            //console.log($(this).val().html())
            for (var i = 0; i < detail.seasons.length && !stop; i++) {
              for (var j = 0; j < detail.seasons[i].experiences.length && !stop; j++) {
                if (filters) {
                  if (filters[6] != "0" && filters[6] != null) {
                    if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date(parseInt(filters[6])).getTime() && new Date(detail.seasons[i].end).getTime() > new Date(parseInt(filters[6])).getTime()) {
                      for (var k = 0; k < detail.seasons[i].experiences[j].durations.length; k++) {
                        if (detail.seasons[i].experiences[j].durations[k].duration.id == $(this).val()) {
                          $("#how-many").html("" + detail.seasons[i].experiences[j].durations[k].symbol + detail.seasons[i].experiences[j].durations[k].price);
                          price_sel = detail.seasons[i].experiences[j].durations[k].price;
                          stop = true;
                          dur_offer = $(this).html();
                        }

                      }
                    }
                  } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date().getTime() && new Date(detail.seasons[i].end).getTime() > new Date().getTime()) {
                    for (var k = 0; k < detail.seasons[i].experiences[j].durations.length; k++) {
                      if (detail.seasons[i].experiences[j].durations[k].duration.id == $(this).val()) {
                        $("#how-many").html("" + detail.seasons[i].experiences[j].durations[k].symbol + detail.seasons[i].experiences[j].durations[k].price);
                        price_sel = detail.seasons[i].experiences[j].durations[k].price;
                        stop = true;
                        dur_offer = $(this).html();
                      }

                    }
                  } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name) {
                    for (var k = 0; k < detail.seasons[i].experiences[j].durations.length; k++) {
                      if (detail.seasons[i].experiences[j].durations[k].duration.id == $(this).val()) {
                        $("#how-many").html("" + detail.seasons[i].experiences[j].durations[k].symbol + detail.seasons[i].experiences[j].durations[k].price);
                        price_sel = detail.seasons[i].experiences[j].durations[k].price;
                        stop = true;
                        dur_offer = $(this).html();
                      }

                    }
                  }
                } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date().getTime() && new Date(detail.seasons[i].end).getTime() > new Date().getTime()) {
                  for (var k = 0; k < detail.seasons[i].experiences[j].durations.length; k++) {
                    if (detail.seasons[i].experiences[j].durations[k].duration.id == $(this).val()) {
                      $("#how-many").html("" + detail.seasons[i].experiences[j].durations[k].symbol + detail.seasons[i].experiences[j].durations[k].price);
                      price_sel = detail.seasons[i].experiences[j].durations[k].price;
                      stop = true;
                      dur_offer = $(this).html();
                    }

                  }
                } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name) {
                  for (var k = 0; k < detail.seasons[i].experiences[j].durations.length; k++) {
                    if (detail.seasons[i].experiences[j].durations[k].duration.id == $(this).val()) {
                      $("#how-many").html("" + detail.seasons[i].experiences[j].durations[k].symbol + detail.seasons[i].experiences[j].durations[k].price);
                      price_sel = detail.seasons[i].experiences[j].durations[k].price;
                      stop = true;
                      dur_offer = $(this).html();
                    }

                  }
                }


              }

            }

          }
          dur_sel = $("#durations").val()
        })

      })
    }

    // function loadDurations(){
    // var list,names = [];
    //     list.push("0,2","0,4","1,1","1,2","1,3","1,4","1,5","1,6","1,7","1,8","1,9","1,10","1,11","1,12","1,13","7,1","7,2","7,3","7,4");
    //     names.push('<option value="0,2">"2" + texts.det_ship_hours</option>','<option value="0,4">"4" + texts.det_ship_hours</option>');
    //     durations.append(names);
    // }
    loadDurations();
    // $('#send-request').attr("disabled", true);
    $.validator.addMethod("isophone", function (value, element) {
      return this.optional(element) || /^\d{3}\s\d{3}\s\d{3}$/i.test(value);
    }, "Please enter a valid phone value");
    // validateFormatPhone('#phone');
    $("#formSolic").validate({
      rules: {
        reserv_day: {
          required: true
        },
        number_passag: {
          required: true
        },
        durations: {
          required: true
        },
        name: {
          required: true
        },
        phone: {
          required: true,
          minlength: 6
        },
        skipper: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        ship_xp: {
          required: true
        }

      },
      messages: {
        reserv_day: {
          required: texts.valid_req
        },
        number_passag: {
          required: texts.valid_req
        },
        durations: {
          required: texts.valid_req
        },
        name: {
          required: texts.valid_req
        },
        phone: {
          required: texts.valid_req,
        },
        skipper: {
          required: texts.valid_req
        },
        email: {
          required: texts.valid_req,
          email: texts.valid_email
        },
        ship_xp: {
          required: texts.valid_req
        }
      },
      errorClass: "help-block",
      errorElement: "span",
      highlight: function (element, errorClass, validClass) {
        $(element).parents(".input-group").removeClass("has-success").addClass("has-error");
        // $('#send-request').attr("disabled", true);
        $(element).parents(".form-group").children(".required-span").addClass("hidden");
        var tmp = $(".input-group span[for=reserv_day]");
        $(".input-group span[for=reserv_day]").remove();
        $("#cal-reserv")
          .closest(".form-group")
          .append(tmp[0])
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).parents(".input-group").removeClass("has-error").addClass("has-success");
        // $('#send-request').attr("disabled", false);
        $(element).parents(".form-group").children(".required-span").removeClass("hidden");
        $(".input-group span[for=reserv_day]").remove();
      },
      submitHandler: function (form) {
        $("#compose-modal-reserve").modal("hide");
        var dur = $("#durations").val().split(",");
        //var skip = $('#skipper').val() == "true"?true:false;
        var request = {
          //shipowner: detail.user._id,
          ship: detail._id,
          bookDate: reserve_day.getTime(),
          patron: $("#skipper").val(),
          numPas: parseInt(number_people),
          name: $("#name").val(),
          email: $("#email").val(),
          mobile: $("#phone").val(),
          duration: {
            unity: parseInt(dur[0]),
            quantity: parseInt(dur[1])
          },
          experience: $("#ship_xp").val(),
          //duration: dur_sel,
          // price: price_sel,
          message: replace_antipirate($("#something_else").val())
        };
        request = JSON.stringify(request);
        $.ajax({
          type: "POST",
          url: "/service/requests",
          dataType: "JSON",
          data: {
            request: request
          }
        }).done(function (data) {
          if (data.res) {
            //('<div class="modal-backdrop ' + c + '" />').appendTo(document.body)
            //durations.val("");
            $("#how-many").html("" + detail.seasons[0].experiences[0].durations[0].symbol + 0);
            //$('#something_else').val("");
            $("#compose-modal-offer .modal-body .attribs .start-date").html("" + reserve_day.toLocaleDateString());
            var stop = false;
            for (var i = 0; i < values_duration.length && !stop; i++) {
              if (values_duration[i] == $("#durations").val()) {
                var temp = values_duration[i].split(",");
                if (temp[0] == "0") {
                  dur_offer = temp[1] + " " + texts.det_ship_hours;
                } else if (temp[0] == "1") {
                  dur_offer = temp[1] + " " + texts.det_ship_days;
                } else {
                  dur_offer = temp[1] + " " + texts.det_ship_weeks;
                }
              }

            }
            $("#compose-modal-offer .modal-body .attribs .duration").html("" + dur_offer);
            //$('#compose-modal-offer .modal-body .attribs .price').html('' + price_sel);
            if (number_people == "1") {
              $(".number_pas").html(number_people + " " + texts.people);
            } else {
              $(".number_pas").html(number_people + " " + texts.peoples);
            }
            var aux = false,
              patron = 0;
            if ($("#skipper").val() == "true") {
              $(".skipper_solic").html(texts.det_need_skipper);
            } else {
              $(".skipper_solic").html(texts.det_no_skipper);
            }

            if (userSession) {
              $(".name").html(userSession.name+" "+userSession.surname);
              $(".email_solic").html(userSession.email);
              $(".phone_solic").html(userSession.mobile);
            }
            else{
              $(".name").html($("#name").val());
              $(".email_solic").html($("#email").val());
              $(".phone_solic").html($("#phone").val());
            }

            var stop = false;
            for (var i = 0; i < xp.length && !stop; i++) {
              if (xp[i]._id == $("#ship_xp").val()) {
                $(".xp_solic").html(xp[i].name[0].value);
                stop = true;
              }
            }

            $(".price_solic").html(data.res.price);
            var something_else = $("#something_else");
            if (something_else.val()) {
              $(".note_solic").html(something_else.val());
            } else {
              $(".note_solic").parents("tr").remove();
            }
            clearSolic();
            $("#compose-modal-offer").addClass("in");
            $("#compose-modal-offer").modal("show");
            //dinamicSize();
            //$('#compose-modal-offer .modal-header .close').on('click', function () {
            //    $('#compose-modal-offer').removeClass('in');
            //    $('#compose-modal-offer').attr("style", "display:none", "aria-hidden", "true");
            //})

          } else {
            $(".notification").attr("style", "display:block; background-color: red; color: white");
            $(".notification p").html(texts.solic_failed);
            setTimeout(function () {
              $(".notification").attr("style", "display:none;")
            }, 3000);
          }
        })
      }
    });

    //console.log(d.getMonth()+7)
    calendar();

    function clearSolic() {
      $("#skipper").val("");
      $("#durations").val("");
      $("#name").val("");
      $("#email").val("");
      $("#phone").val("");
      $("#ship_xp").val(detail.xp.id);
      $("#something_else").val("");
      $("#number_passag").val("");
    }

    reserve_day = new Date().getTime() + 86400000 * 2;
    reserve_day = new Date(reserve_day);
    $("#cal-reserv.date > input").attr("value", "" + (reserve_day.getDate()) + "/" + (reserve_day.getMonth() + 1) + "/" + reserve_day.getFullYear());

    function calendar_solic() {
      var reserv = new Date(); //Date.parse(detail.seasons[0].start)
      var day_start = reserv.getDate() + 2;
      var start_month = reserv.getMonth() + 1;
      //var reserv_end = new Date(Date.parse(detail.seasons[0].end));
      //var end_month = reserv_end.getMonth() + 1;
      var disabled_Days = [];
      // var locked = [];
      // for (var i = 0; i < detail.locks.length; i++) {
      //     var start = new Date(detail.locks[i].start).getTime();
      //     var end = new Date(detail.locks[i].end).getTime();
      //     for (var j = start; j <= end; j += 86400000) {
      //         var disable = new Date(j);
      //         var temp = disable.getDate() + '/' + (disable.getMonth() + 1) + '/' + disable.getFullYear();
      //         disabled_Days.push(temp);
      //         locked.push(disable);
      //     }
      //
      // }
      var available_days = [];
      for (var i = 0; i < detail.seasons.length; i++) {

        var start_season = new Date(detail.seasons[i].start).getTime();
        var end_season = new Date(detail.seasons[i].end).getTime();
        for (var j = start_season; j <= end_season; j += 86400000) {
          var available = new Date(j);
          available_days.push(available);
        }

      }
      $("#cal-reserv.date").datepicker({
        startDate: day_start + "/" + start_month + "/" + reserv.getFullYear(),
        // startDate: new Date(),
        //endDate: reserv_end.getDate() + "/" +end_month+ "/"  + reserv_end.getFullYear(),
        endDate: new Date(available_days[available_days.length - 1]),
        format: "dd/mm/yyyy",
        orientation: "bottom auto",
        language: "es",
        // datesDisabled: disabled_Days,
        beforeShowDay: function (date) {
          //var tmp = new Date(date).getTime();
          var class_asign = {
            classes: "",
            tooltip: ""
          };
          var lock = false;
          // for (var i = 0; i < locked.length && !lock; i++) {
          //     var d = new Date(locked[i])
          //     if (date.getMonth() == d.getMonth() && date.getDate() == d.getDate() && date.getFullYear() == d.getFullYear()) {
          //         class_asign.classes = 'disabled locked';
          //         class_asign.tooltip = 'locked day';
          //         lock = true;
          //         return class_asign;
          //     }
          //
          // }

          lock = false;
          for (var i = 0; i < available_days.length && !lock; i++) {
            var avi = new Date(available_days[i]);
            if (new Date().getTime() + 86400000 <= avi.getTime() && date.getMonth() == avi.getMonth() && date.getDate() == avi.getDate() && date.getFullYear() == avi.getFullYear()) {
              class_asign.classes = "available";
              lock = true;
              return class_asign;
            }

          }

        }
      }).on("changeDate", function (ev) {
        reserve_day = new Date(ev.date);
        //$('#calendar').text(calendar.getMonth() + 1 + "-" + calendar.getDate() + "-" + calendar.getFullYear());
        $("#cal-reserv").datepicker("hide");
      })
      $("#cal-reserv.date").on("click", function () {
        $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th").first().addClass("prev");
        $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th:last-child").addClass("next");
        $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th").first().html("<");
        $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th:last-child").html(">");
      })
    }

    calendar_solic();
    $("#cal-reserv").datepicker();
    $("#backward-calendar").on("click", function () {
      monthActual = monthActual - 12;
      dayActual = "01";
      if (monthActual <= 0) yearActual--;
      $("#month-list").empty();
      calendar();
    });
    $("#fordward-calendar").on("click", function () {
      dayActual = "01";
      $("#month-list").empty();
      calendar();
    });
    var actual_round = 1;
    var photos = detail.photos;
    var select_pic = null;
    var photos_show = [];
    var rounds = photos.length % 5 == 0 ? parseInt(photos.length / 5) : parseInt(photos.length / 5) + 1;

    function photos_component() {
      for (var i = 0; i < rounds; i++) {
        photos_show[i] = [];
        if ((i + 1) * 5 > photos.length) {
          for (var j = i * 5; j < photos.length; j++) {
            photos_show[i].push(photos[j].media);

          }
        } else {
          for (var j = i * 5; j < i * 5 + 5; j++) {
            photos_show[i].push(photos[j].media);

          }
        }


      }
      // console.log(photos_show)
      //            if (photos.length > 5) {
      //                //for (var i = 0; i < 5; i++) {
      //                //    photos_show.push(photos[i]);
      //                //    //$('.pics').append('<img id="' + photos_show[i].media + '" src="/service/media/' + photos_show[i].media + '" data-toggle="modal"' +
      //                //    //    'data-target="#compose-modal-photos" class="pointer">');
      //                //    $('.pics').append('<img id="' + photos_show[i].media + '" src="/service/media/' + photos_show[i].media + '">');
      //                //
      ////                }
      //            }
      if (photos.length <= 5) {
        //for (var i = 0; i < photos.length; i++) {
        //photos_show.push(photos[i].media)
        $("#left-arrow").attr("style", "display:none !important");
        $("#right-arrow").attr("style", "display:none !important");
        //$('.pics').append('<img id="' + photos[i].media + '" src="/service/media/' + photos[i].media + '">');
        //}
      }


    }

    photos_component();

    function pinting() {
      for (var i = 0; i < photos.length; i++) {
        $(".pics").append("<img id=\"" + photos[i].media + "\"  src=\"/service/media/" + photos[i].media + "\">");

      }
      $("#my-scroll").mCustomScrollbar({
        axis: "x",
        theme: "dark-thin",
        autoExpandScrollbar: true,
        scrollButtons: {enable: true},
        advanced: {autoExpandHorizontalScroll: true}
      });
      // for (var i = 0; i < photos_show[actual_round - 1].length; i++) {
      //     if (photos_show.length > 1) {
      //         $('.pics').append('<img id="' + photos_show[actual_round - 1][i] + '" class="adapt" src="/service/media/' + photos_show[actual_round - 1][i] + '">');
      //     } else {
      //         $('.pics').append('<img id="' + photos_show[actual_round - 1][i] + '" src="/service/media/' + photos_show[actual_round - 1][i] + '">');
      //     }
      //
      //
      // }

    }

    function lisent_change() {
      $(".ship-galery").on("mouseover", function () {
        var $this = $(this);
        select_pic = $this[0].id;
        // $('#compose-modal-photos .modal-body').append('<img src="/service/media/' + select_pic + '">');
        $(".card-details .header").empty();
        $(".card-details .header").append("<img id=\"ship-details-photo\" src=\"/service/media/" + select_pic + "\">");

        var items = [];
        for (var i = 0; i < photos.length; i++) {
          if ($this[0].id != photos[i].media) {
            var aux = {
              src: "/service/media/" + photos[i].media
            }
            items.push(aux)
          }
        }
        var aux = {
          src: "/service/media/" + select_pic
        }
        items.unshift(aux);


        $("#ship-details-photo").magnificPopup({
          items: items,
          gallery: {
            enabled: true
          },
          type: "image" // this is default type
        });

        $(".ship-galery").magnificPopup({
          items: items,
          gallery: {
            enabled: true
          },
          type: "image" // this is default type
        });

      })
    }

    function lisent_resp() {
      $(".pics-movil img").on("click", function () {
        var $this = $(this);
        select_pic = $this[0].id;
        // $('#compose-modal-photos .modal-body').append('<img src="/service/media/' + select_pic + '">');
        $(".card-details .header").empty();
        $(".card-details .header").append("<img id=\"ship-details-photo\" src=\"/service/media/" + select_pic + "\">");


        var items = [];
        for (var i = 0; i < photos.length; i++) {
          if ($this[0].id != photos[i].media) {
            var aux = {
              src: "/service/media/" + photos[i].media
            }
            items.push(aux)
          }
        }
        var aux = {
          src: "/service/media/" + select_pic
        }
        items.unshift(aux);


        $("#ship-details-photo").magnificPopup({
          items: items,
          gallery: {
            enabled: true
          },
          type: "image" // this is default type
        });

      })
    }

    lisent_resp()

    function priceByXp() {
      var price = 0;
      var stop = false;
      var list = []
      for (var i = 0; i < detail.seasons.length && !stop; i++) {
        for (var j = 0; j < detail.seasons[i].experiences.length && !stop; j++) {
          if (filters) {
            if (filters[6] != "0" && filters[6] != null) {
              if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date(parseInt(filters[6])).getTime() && new Date(detail.seasons[i].end).getTime() > new Date(parseInt(filters[6])).getTime()) {
                price = detail.seasons[i].experiences[j].durations[0].price;
                stop = true
              }
            } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date().getTime() && new Date(detail.seasons[i].end).getTime() > new Date().getTime()) {
              price = detail.seasons[i].experiences[j].durations[0].price;
              stop = true
            } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name) {
              price = detail.seasons[i].experiences[j].durations[0].price;
              stop = true
            }
          } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name && new Date(detail.seasons[i].start).getTime() < new Date().getTime() && new Date(detail.seasons[i].end).getTime() > new Date().getTime()) {
            price = detail.seasons[i].experiences[j].durations[0].price;
            stop = true
          } else if (detail.xp.name == detail.seasons[i].experiences[j].experience.name) {
            price = detail.seasons[i].experiences[j].durations[0].price;
            stop = true
          }
        }
      }


      $("#price_ship").html("" + price);
    }

    priceByXp();
    lisent_change();

    $("#desde").on("click", function () {
      $("#panels ul li").removeClass("active");
      $("#panels ul li.settings").addClass("active");
      $("#panels .tab-content div").removeClass("active in");
      $("#panels .tab-content div#settings").addClass("active in");

    })
    $("#charac").on("click", function () {
      $("#panels ul li").removeClass("active");
      $("#panels ul li:first-child").addClass("active");
      $("#panels .tab-content div").removeClass("active in");
      $("#panels .tab-content div:first-child").addClass("active in");

    })
    //var start = detail.seasons[0].start;
    // var end = detail.seasons[0].end;
    // $('.availability p.start').html(start);
    // $('.availability p.end').html(end);
    // console.log(parseDate(start,'dd/mm/yyyy'));
    $("#compose-modal-photos .close").on("click", function () {
      $("#compose-modal-photos .modal-body").empty();
    })

    function asperRatio() {
      $(".card-details .header").attr("style", "height:" + $(".card-details .header img").width() / 1.77 + "px");//1.77
      $(".card-details .pics img").attr("style", "height:" + $(".card-details .pics img").width() / 1.77 + "px");
      $("#pictures .picture").attr("style", "height:" + $(".card-details .header img").width() / 1.77 + "px");
      //$('.card-details .pics-movil img').attr("style","height:"+$('.card-details .pics-movil img').width()/2.39+"px");

    }

    asperRatio();

    $(".ship-details-photo2").magnificPopup({
      // items: items2,
      gallery: {
        enabled: true
      },
      type: "image" // this is default type

    })

    $(window).bind("orientationchange", function (event) {
      asperRatio();
    });

    var photoSelect = photos[0];
    var items = [];
    for (var i = 0; i < photos.length; i++) {
      if (photos[i].default) {
        photoSelect = photos[i];
      } else {
        var aux = {
          src: "/service/media/" + photos[i].media
        }
        items.push(aux)
      }
    }
    var aux = {
      src: "/service/media/" + photoSelect.media
    }
    items.unshift(aux);

    function magnificP() {
      $(".ship-details-photo").magnificPopup({
        items: items,
        gallery: {
          enabled: true
        },
        type: "image" // this is default type


        //$('#ship-details-photo').magnificPopup({
        //    items: {
        //        src: "/service/media/" + photoSelect.media
        //    },
        //    type: 'image' // this is default type
        //
        //});


      })
    }

    magnificP();

    function submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype) {
      if (id_country != 0 || id_city != 0 || id_area != 0 || id_port || id_duration != 0 || day_sel != 0 || id_xp != 0 || id_shiptype != 0) {
        var filter = {
          country: id_country,
          city: id_city,
          area: id_area,
          port: id_port,
          shipType: id_shiptype,
          experience: id_xp
        };
        filter = JSON.stringify(filter);
        $.ajax({
          url: "/service/landing/create",
          method: "POST",
          dataType: "JSON",
          data: {
            filter: filter,
            lang: l
          }
        }).done(function (data) {
          if (data.res) {
            window.location = "/" + l + "/" + data.res;

          }
        })
      }

    }

    function submitShip() {
      $("#time").on("click", function () {
        submitFilter(0, 0, 0, 0, 0, 0, 0, detail.shipType._id)
      })
      // $('#time').on('click', function () {
      //     submitFilter(0, 0, 0, 0, 0, 0, 0, 0)
      // })
      $("#port").on("click", function () {
        submitFilter(detail.localization.country._id, detail.localization.city._id, detail.localization.area._id, detail.localization.port._id, 0, 0, 0, 0)
      })
      $("#xp_selec").on("click", function () {
        submitFilter(0, 0, 0, 0, 0, 0, detail.xp._id, 0)
      })
      $("#city").on("click", function () {
        submitFilter(detail.localization.country._id, detail.localization.city._id, 0, 0, 0, 0, 0, 0)
      })
    }

    submitShip();
    $(".text_bail").html()
    var number_people = 0;

    function numberofPeoples() {
      var list = [];
      var names = [],
        values = []
      list.push(
        "<option value=\"1\" >" + " 1 " + texts.people + "</option>",
        "<option value=\"2\" >" + " 2 " + texts.peoples + "</option>",
        "<option value=\"3\" >" + " 3 " + texts.peoples + "</option>",
        "<option value=\"4\" >" + " 4 " + texts.peoples + "</option>",
        "<option value=\"5\" >" + " 5 " + texts.peoples + "</option>",
        "<option value=\"6\" >" + " 6 " + texts.peoples + "</option>",
        "<option value=\"7\" >" + " 7 " + texts.peoples + "</option>",
        "<option value=\"8\" >" + " 8 " + texts.peoples + "</option>",
        "<option value=\"9\" >" + " 9 " + texts.peoples + "</option>",
        "<option value=\"10\" >" + " 10 " + texts.peoples + "</option>",
        "<option value=\"11\" >" + " 11 " + texts.peoples + "</option>",
        "<option value=\"12\" >" + " 12 " + texts.peoples + "</option>",
        "<option value=\"12*\">" + texts.more_filter + " 12 " + texts.peoples + "</option>"
      );
      $("#number_passag").append(list.join(""));

      values.push("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "12*");
      names.push(" 1 " + texts.people, " 2 " + texts.peoples, " 3 " + texts.peoples, " 4 " + texts.peoples, " 5 " + texts.peoples, " 6 " + texts.peoples, " 7 " + texts.peoples, " 8 " + texts.peoples, " 9 " + texts.peoples, " 10 " + texts.peoples, " 11 " + texts.peoples, " 12 " + texts.peoples, texts.more_filter + " 12 " + texts.peoples);
      // for (var i = 0; i < values.length; i++) {
      //     if (number_people == values[i]) {
      //         $('#number_passag .text').html(names[i]);
      //         $('ul.dropdown-menu.number_passag li a').find('.' + number_people).addClass('active');
      //     }
      //
      // }

      $("#number_passag").on("change", function () {
        var $this = $(this);
        if ($this.val() == "1") {
          number_people = "1";
        }
        if ($this.val() == "2") {
          number_people = "2";
        } else if ($this.val() == "3") {
          number_people = "3";
        } else if ($this.val() == "4") {
          number_people = "4";
        } else if ($this.val() == "5") {
          number_people = "5";
        } else if ($this.val() == "6") {
          number_people = "6";
        } else if ($this.val() == "7") {
          number_people = "7";
        } else if ($this.val() == "8") {
          number_people = "8";
        } else if ($this.val() == "9") {
          number_people = "9";
        } else if ($this.val() == "10") {
          number_people = "10";
        } else if ($this.val() == "11") {
          number_people = "11";
        } else if ($this.val() == "12") {
          number_people = "12";
        } else if ($this.val() == "12*") {
          number_people = "13";
        }
        //submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
      })


    }

    numberofPeoples();
    //
    // function dinamicSize()   {
    //     $('.dinamic-size').attr("style","background-color:#14ABE2; height:"+$('.dinamic').width()+"px")
    // }
  }
  if (!$(".discount-offer .offer-item").length) {
    $(".discount-offer").remove()
  }

  function replace_antipirate(value) {
    var emailMatch = value.match(/[^\s]+\@[^\s]+/gi),
      urlMatch = value.match(/(([^\s]+)?\/\/[^\s]+)|(www[^\s]+)|([^\s]+\.[^\s]{2,})/gi),
      phoneMatch = value.match(/(\d\D?\D?\D?){8,}/gi);

    function my_replace(array) {
      for (var i in array) {
        var len = array[i].length,
          asterisks = "";
        while (len-- > 0) {
          asterisks += "*";
        }
        value = value.replace(array[i], asterisks);
      }
    }

    my_replace(emailMatch);
    my_replace(urlMatch);
    my_replace(phoneMatch);
    return value;
  }
});

function scrollerId(id) {
  $("html, body").animate({
    scrollTop: $("#" + id).offset().top
  }, 1000);
}