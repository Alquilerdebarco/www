/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com> on 16/5/2016.
 */

$(function() {
  if (page == "pay_booking") {
    var values_duration = [];
    values_duration.push("0,2", "0,4", "1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "1,7", "1,8", "1,9", "1,10", "1,11", "1,12", "1,13", "7,1", "7,2", "7,3", "7,4");
    var durat = book.duration.unity.toString() + "," + book.duration.quantity.toString();
    var stop = false;
    for (var i = 0; i < values_duration.length && !stop; i++) {
      if (values_duration[i] == durat) {
        var temp = values_duration[i].split(",");
        if (temp[0] == "0") {
          $(".duration").html(temp[1] + " " + texts.det_ship_hours);
        } else if (temp[0] == "1") {
          $(".duration").html(temp[1] + " " + texts.det_ship_days);
        } else {
          $(".duration").html(temp[1] + " " + texts.det_ship_week);
        }
      }

    }
    var detail = book.ship;
    var frame = "<iframe width=\"100%\" height=\"600\" src=\"http://www.mapsdirections.info/en/custom-google-maps/map.php?width=100%&height=600&hl=ru&coord=" +
      detail.localization.port.latitude + "," +
      detail.localization.port.longitude + "&q=" + detail.localization.country.name[0].value + "%2C%20" +
      detail.localization.city.name[0].value + "%2C" + detail.localization.area.name[0].value + "%20+(" +
      detail.localization.port.name[0].value + ")&ie=UTF8&t=&z=14&iwloc=B&output=embed\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\"></iframe>";


    $("#mapGoogle").append(frame);

    function sendConfirm(type) {
      var token = {
        method: type ? "redsys" : "paypal",
        offer: book._id
      };
      token = JSON.stringify(token);
      if (type == 0) {
        // window.location = "/service/engine/book/" + token;
        window.location = "/service/engine/book/" + token;
      } else {
        $.post("/service/engine/session", { token: token })
          .done(function(data) {
            if (data.res) $("#tpvForm" + type).submit();
          });

      }
    }

    $(".btn-paypal").on("click", function() {
      sendConfirm(0);
    });
    $("#tpvBtn1").on("click", function() {
      sendConfirm(1);
    });
    $("#tpvBtn2").on("click", function () {
      sendConfirm(2);
    });

    //$("#tpvBtn").on("click", function() {
    //  $("#tpvForm").submit();
    //});

    function asperRatio() {
      $(".booking-body .media_space").attr("style", "height:" + $(".booking-body .media_space img").width() / 1.77 + "px");
    }

    asperRatio();
    window.onresize = asperRatio;;

    $(".btn-paypal").on("mouseover", function() {
      $(".btn-paypal img").attr({ src: "/frontEnd/img/img_70_payment_paypal_press.png", srcset: "/frontEnd/img/img_70_payment_paypal_press@2x.png 2x" });
    });
    $(".btn-paypal").on("mouseleave", function() {
      $(".btn-paypal img").attr({ src: "/frontEnd/img/img_70_payment_paypal_normal.png", srcset: "/frontEnd/img/img_70_payment_paypal_normal@2x.png 2x" });
    });
    $(".btn-redsys").on("mouseover", function() {
      $(".btn-redsys img").attr({ src: "/frontEnd/img/img_70__payment_redsys_press.png", srcset: "/frontEnd/img/img_70__payment_redsys_press@2x.png 2x" });
    });
    $(".btn-redsys").on("mouseleave", function() {
      $(".btn-redsys img").attr({ src: "/frontEnd/img/img_70__payment_redsys_normal.png", srcset: "/frontEnd/img/img_70__payment_redsys_normal@2x.png 2x" });
    });
  }


})