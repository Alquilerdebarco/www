/**
 * Created by Gabriel Pérez Carballo <gaperezcarballo@gmail.com>
 on 26/11/2015.
 */

$(function () {
  $("ul.selectors li").first().addClass("first-selector");
  // var calendar = new Date();

  var l = $(".hidden.l").html();
  var country = $("ul.countries");
  var city = $("ul div.cities");
  var area = $("ul div.area");
  var port = $("ul div.ports");
  var duration = $("ul.duration");
  var countries = [];
  var experiences = [];
  var allzones = [];
  var list = [];
  var country_sel = 0, port_sel = 0, city_sel = 0, area_sel = 0, duration_sel = 0, xp_sel = 0, day_sel = 0;
  var ship_t = 0, slora = 0, number_p = 0, shipowner = "0", breadcrumb = {}, id_country = 0, id_city = 0, id_area = 0,
    id_port = 0,
    id_duration = 0, id_xp = 0, id_shiptype = 0;


  function initializeVars() {
    if (filters) {
      if (filters[0] != "0" && filters[0] != undefined) {
        country_sel = filters[0];
      } else {
        if (page == "index") {
          $(".first-title").html($(".first-title").html().replace("[target]", ""));
          $(".first-title").html($(".first-title").html().slice($(".first-title").html()[0], -3));
        }
      }
      if (filters[3] != "0" && filters[3] != undefined) {
        port_sel = filters[3];
      } else if (filters[2] != "0" && filters[2] != undefined) {
        area_sel = filters[2];
      } else if (filters[1] != "0" && filters[1] != undefined) {
        city_sel = filters[1];
      }
      if (filters[4] != "0" && filters[4] != undefined) {
        xp_sel = filters[4];
      }
      if (filters[5] != "0" && filters[5] != undefined) {
        duration_sel = filters[5];
      }
      if (filters[7] != "0" && filters[7] != undefined) {
        ship_t = filters[7]
      }
      if (filters[8] != "0" && filters[8] != undefined) {
        slora = filters[8]
      }
      if (filters[9] != "0" && filters[9] != undefined) {
        number_p = filters[9]
      }
      if (filters[10] != "0" && filters[10] != undefined) {
        shipowner = filters[10]
      }
      if (filters[11] != "0" && filters[11] != undefined) {
        id_shiptype = filters[11]
      }
    }
  }

  initializeVars();
  function initCalendar() {
    if (filters) {
      if (filters[6] != "0" && filters[6] != null) {
        day_sel = new Date(parseInt(filters[6]))
        $("#dp3.date > input").attr("value", "" + day_sel.getDate() + "/" + (day_sel.getMonth() + 1) + "/" + day_sel.getFullYear());
      } else {
        day_sel = 0//new Date()
        $("#dp3.date > input").attr("value", "" + texts.gen_select);
      }
    } else {
      day_sel = 0//new Date()
      $("#dp3.date > input").attr("value", "" + texts.gen_select);
    }
  }

  initCalendar();
  function paintingCalendar() {
    $("#dp3.date").datepicker({
      startDate: "today",
      format: "dd/mm/yyyy",
      orientation: "bottom auto",
      language: "es",
      todayHighlight: true
    }).on("changeDate", function (ev) {
      day_sel = new Date(ev.date);
      //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()));
      //$('#calendar').text(calendar.getMonth() + 1 + "-" + calendar.getDate() + "-" + calendar.getFullYear());
      $("#dp3").datepicker("hide");
    })
    $("#dp3.date").on("click", function () {
      $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th").first().addClass("prev");
      $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th:last-child").addClass("next");
      $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th").first().html("<");
      $(".datepicker.dropdown-menu table.table-condensed thead tr.isohead th:last-child").html(">");
    });
  }

  paintingCalendar();

  function loadLocalizations() {
    $.ajax({
      url: "/service/localization/countryFront",
      type: "GET",
      data: {
        culture: l
      }

    }).done(function (count) {
      for (var i = 0; i < count.res.length; i++) {
        list.push("<li><a>" + count.res[i].name[0].value + "</a></li>");
        countries.push(count.res[i]);

      }
      organizeCity();

      filterZones();
      //list.push('<li><a>' + count[i].name[0].value + '</a></li>');
      country.append(list.join(""));
      $("ul.countries li a").on("click", function () {
        var $this = $(this);
        $("ul.countries li a").removeClass("select");
        $this.addClass("select");
        var aux = "";
        aux = $this;
        for (var i = 0; i < countries.length; i++) {
          if (countries[i].name[0].value == aux.html()) {
            country_sel = countries[i].slug[0].value;
            id_country = countries[i]._id;
          }

        }
        $("#filter-zone").attr("disabled", false);
        $("#countries .text").html(aux.html());
        $("#filter-zone").val("");
        load_cities(country_sel)
      });

    }).fail(function (err) {
      console.log(err)
    })
  }

  function organizeCity() {
    var temp_country = {};
    if (filters) {
      if (filters[0] != "0") {
        for (var i = 0; i < countries.length; i++) {
          if (countries[i].slug[0].value == filters[0]) {
            $("#countries .text").html(countries[i].name[0].value);
            country_sel = countries[i].slug[0].value;
            if (page == "index") {
              $("h1.first-title").html($("h1.first-title").html().replace("[target]", countries[i].name[0].value));
              $("h1.first-title").html($("h1.first-title").html().replace("[ships]", texts.general_ships));
              $("h1.first-title").addClass("act");
            }
            breadcrumb.country = countries[i].name[0].value;
            $("a.filter2-country").html("" + breadcrumb.country);
            id_country = countries[i]._id;

          }
          if (filters[3] != "0") {
            for (var j = 0; j < countries[i].cities.length; j++) {
              for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
                for (var m = 0; m < countries[i].cities[j].areas[k].ports.length; m++) {
                  if (countries[i].cities[j].areas[k].ports[m].slug[0].value == filters[3]) {
                    $("#filter-zone").val("" + countries[i].cities[j].areas[k].ports[m].name[0].value);
                    if (page == "index") {
                      $("h1.first-title").html($("h1.first-title").html().replace(countries[i].name[0].value, countries[i].cities[j].areas[k].ports[m].name[0].value));
                    }

                    breadcrumb.port = countries[i].cities[j].areas[k].ports[m].name[0].value;
                    var ct = " <img src=\"/frontEnd/img/ic_8_braeadcrumbs_forward.png\" srcset=\"/frontEnd/img/ic_8_braeadcrumbs_forward@2x.png 2x\" class=\"inline-block forward ct\">";
                    var cta = "<a class=\"filter2-city inline-block cta\">" + countries[i].cities[j].name[0].value + "</a>"
                    var aport = "<a class=\"filter2-area inline-block\">" + countries[i].cities[j].areas[k].name[0].value + "</a>"
                    var apor = " <img src=\"/frontEnd/img/ic_8_braeadcrumbs_forward.png\" srcset=\"/frontEnd/img/ic_8_braeadcrumbs_forward@2x.png 2x\" class=\"inline-block forward aport\">";
                    $(ct).insertAfter("a.filter2-country");
                    $(cta).insertAfter("img.inline-block.forward.ct");
                    if (filters[2] != "0") {
                      $(apor).insertAfter("a.filter2-city.inline-block.cta");
                      $(aport).insertAfter("img.inline-block.forward.aport");
                    }

                    $("a.filter2-port").html("" + breadcrumb.port);
                    id_port = countries[i].cities[j].areas[k].ports[m]._id;
                    id_area = countries[i].cities[j].areas[k]._id;
                    id_city = countries[i].cities[j]._id;
                    submitShip()
                  }
                }


              }


            }
          } else if (filters[2] != "0") {
            for (var j = 0; j < countries[i].cities.length; j++) {
              for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
                if (countries[i].cities[j].areas[k].slug[0].value == filters[2]) {
                  $("#filter-zone").val("" + countries[i].cities[j].areas[k].name[0].value);
                  if (page == "index") {
                    $("h1.first-title").html($("h1.first-title").html().replace(countries[i].name[0].value, countries[i].cities[j].areas[k].name[0].value));
                  }
                  breadcrumb.area = countries[i].cities[j].areas[k].name[0].value;
                  var ct = " <img src=\"/frontEnd/img/ic_8_braeadcrumbs_forward.png\" srcset=\"/frontEnd/img/ic_8_braeadcrumbs_forward@2x.png 2x\" class=\"inline-block forward ct\">";
                  var cta = "<a class=\"filter2-city inline-block\">" + countries[i].cities[j].name[0].value + "</a>"
                  $(ct).insertBefore("a.filter2-area");
                  $(cta).insertBefore("img.inline-block.forward.ct");
                  $("a.filter2-area").html("" + breadcrumb.area);
                  id_area = countries[i].cities[j].areas[k]._id;
                  id_city = countries[i].cities[j]._id;
                  submitShip()
                }

              }


            }
          }
          else if (filters[1] != "0") {
            for (var j = 0; j < countries[i].cities.length; j++) {
              if (countries[i].cities[j].slug[0].value == filters[1]) {
                $("#filter-zone").val("" + countries[i].cities[j].name[0].value);
                if (page == "index") {
                  $("h1.first-title").html($("h1.first-title").html().replace(countries[i].name[0].value, countries[i].cities[j].name[0].value));
                }
                breadcrumb.city = countries[i].cities[j].name[0].value;
                $("a.filter2-city").html("" + breadcrumb.city);
                id_city = countries[i].cities[j]._id;
              }

            }
          }


        }
        load_cities(country_sel)
      }
      else {
        $("h1.first-title").html($("h1.first-title").html().replace("[ships]", texts.general_ships));
      }
    }
    else {
      if (page == "index") {
        $("h1.first-title").html($("h1.first-title").html().replace("[target]", countries[0].name[0].value));
        $("h1.first-title").html($("h1.first-title").html().replace("[ships]", texts.general_ships));
        $("h1.first-title").addClass("act");
      }
      var stop = false;
      for (var i = 0; i < countries.length && !stop; i++) {
        if (l == countries[i].iso) {
          temp_country = countries[i];
          stop = true;
        }

      }
      if (temp_country.name) {
        $("#countries .text").html(temp_country.name[0].value);
        country_sel = temp_country.slug[0].value;
        id_country = temp_country._id;
        load_cities(country_sel);
        if (country_sel == "0" || country_sel == 0) {
          $("#filter-zone").attr("disabled", true);
        }
      } else {
        $("#filter-zone").attr("disabled", true);
      }

    }
  }

  loadLocalizations();

  $(".cookie .description .row p a").attr("href", "/" + l + "/" + texts.slug_conditions);
  $(".modal .modal-footer .conditions p a").attr("href", "/" + l + "/" + texts.slug_conditions)
  function loadXp() {

    $.ajax({
      type: "GET",
      url: "/service/configurations/listFront",
      data: {
        culture: l
      }
    }).done(function (data) {
      experiences = data.res.experiences;
      organizeXp();
      //“2 Horas”, “Medio Día" (eliminar 4h), “1 Día”, “2 Días”, “3 Días”, “4 Días”, “5 Días”, “6 Días”, “1 Semana”, “8 Días”, “9 Días”, “10 Días”, “11 Días”, “12 Días”, “13 Días”, “2 Semanas”, “3 Semanas”, “4 Semana

      // for (var i = 0; i < data.res.durations.length; i++) {
      //   if (data.res.durations[i].unity == 0) {
      //     aux1.push((data.res.durations[i].quantity + "," + data.res.durations[i].unity).toString());
      //     du.push(data.res.durations[i].name[0].value);
      //     list.push("<li><a class=\"" + data.res.durations[i].quantity + "," + data.res.durations[i].unity + "\">" + data.res.durations[i].name[0].value + " </a></li>");
      //   }
      //   else if (data.res.durations[i].unity == 1) {
      //     aux1.push((data.res.durations[i].quantity + "," + data.res.durations[i].unity).toString())
      //     du.push(data.res.durations[i].name[0].value);
      //     list.push("<li><a class=\"" + data.res.durations[i].quantity + "," + data.res.durations[i].unity + "\">" + data.res.durations[i].name[0].value + " </a></li>");
      //   } else {
      //     aux1.push((data.res.durations[i].quantity + "," + data.res.durations[i].unity).toString());
      //     du.push(data.res.durations[i].name[0].value);
      //     list.push("<li><a class=\"" + data.res.durations[i].quantity + "," + data.res.durations[i].unity + "\">" + data.res.durations[i].name[0].value + "</a></li>");
      //   }
      //
      // }

      var hourConst, dayConst, weekConst;
      for (var i = 0; i < data.res.durations.length; i++) {
        if (data.res.durations[i].unity == 0) {
          hourConst = data.res.durations[i].unity;
        }
        else if (data.res.durations[i].unity == 1) {
          dayConst = data.res.durations[i].unity;
        } else {
          weekConst = data.res.durations[i].unity;
        }
      }


      var list = [
        '<li><a class="2,' + hourConst + '"> 2 ' + texts.det_ship_hours + ' </a></li>',
        '<li><a class="4,' + hourConst + '"> ' + texts.halfDay + ' </a></li>',
        '<li><a class="1,' + dayConst + '"> 1 ' + texts.globalDay + ' </a></li>',
        '<li><a class="2,' + dayConst + '"> 2 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="3,' + dayConst + '"> 3 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="4,' + dayConst + '"> 4 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="5,' + dayConst + '"> 5 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="6,' + dayConst + '"> 6 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="1,' + weekConst + '"> 1 ' + texts.det_ship_week + ' </a></li>',
        '<li><a class="8,' + dayConst + '"> 8 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="9,' + dayConst + '"> 9 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="10,' + dayConst + '"> 10 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="11,' + dayConst + '"> 11 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="12,' + dayConst + '"> 12 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="13,' + dayConst + '"> 13 ' + texts.det_ship_days + ' </a></li>',
        '<li><a class="2,' + weekConst + '"> 2 ' + texts.det_ship_weeks + ' </a></li>',
        '<li><a class="3,' + weekConst + '"> 3 ' + texts.det_ship_weeks + ' </a></li>',
        '<li><a class="4,' + weekConst + '"> 4 ' + texts.det_ship_weeks + ' </a></li>',
      ];
      var aux1 = [
        (2 + "," + hourConst).toString(),
        (4 + "," + hourConst).toString(),
        (1 + "," + dayConst).toString(),
        (2 + "," + dayConst).toString(),
        (3 + "," + dayConst).toString(),
        (4 + "," + dayConst).toString(),
        (5 + "," + dayConst).toString(),
        (6 + "," + dayConst).toString(),
        (1 + "," + weekConst).toString(),
        (8 + "," + dayConst).toString(),
        (9 + "," + dayConst).toString(),
        (10 + "," + dayConst).toString(),
        (11 + "," + dayConst).toString(),
        (12 + "," + dayConst).toString(),
        (13 + "," + dayConst).toString(),
        (2 + "," + weekConst).toString(),
        (3 + "," + weekConst).toString(),
        (4 + "," + weekConst).toString(),
      ];

      var du = [
        (2 + texts.det_ship_hours).toString(),
        (texts.halfDay).toString(),
        (1 + texts.globalDay).toString(),
        (2 + texts.det_ship_days).toString(),
        (3 + texts.det_ship_days).toString(),
        (4 + texts.det_ship_days).toString(),
        (5 + texts.det_ship_days).toString(),
        (6 + texts.det_ship_days).toString(),
        (1 + texts.det_ship_week).toString(),
        (8 + texts.det_ship_days).toString(),
        (9 + texts.det_ship_days).toString(),
        (10 + texts.det_ship_days).toString(),
        (11 + texts.det_ship_days).toString(),
        (12 + texts.det_ship_days).toString(),
        (13 + texts.det_ship_days).toString(),
        (2 + texts.det_ship_week).toString(),
        (3 + texts.det_ship_week).toString(),
        (4 + texts.det_ship_week).toString(),
      ];

      duration.append(list.join(""));
      if (filters) {
        if (filters[5] != 0) {
          for (var i = 0; i < aux1.length; i++) {
            if (aux1[i] == filters[5]) {
              $("#length .text").html(du[i]);
              break;
            }
          }
        }
      }

      $("ul.duration li a").on("click", function () {
        var $this = $(this);
        $("ul.duration li a").removeClass("select");
        $this.addClass("select");
        $("#length .text").html($this.html());
        duration_sel = $this.attr('class').split(" ")[0]

        // for (var i = 0; i < data.res.durations.length; i++) {
        //   if ($this.hasClass((data.res.durations[i].quantity).toString() + "," + (data.res.durations[i].unity).toString())) {
        //     duration_sel = (data.res.durations[i].quantity).toString() + "," + (data.res.durations[i].unity).toString();
        //   }
        // }
        //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()))
      })
    });
  }

  loadXp();
  function organizeXp() {
    var aux = "";
    var xp = [];
    for (var i = 0; i < (experiences.length - 1); i++) {
      for (var j = i + 1; j < experiences.length; j++) {
        if (experiences[i].name[0].value > experiences[j].name[0].value) {
          aux = experiences[j];
          experiences[j] = experiences[i];
          experiences[i] = aux;
        }
      }
    }
    for (var i = 0; i < experiences.length; i++) {
      xp.push("<li><a>" + experiences[i].name[0].value + "</a></li>");
      if (filters) {
        if (filters[4] != 0) {
          if (filters[4] == experiences[i].slug[0].value) {
            $("#xp .text").html(experiences[i].name[0].value);
            breadcrumb.xp = experiences[i].name[0].value;
            id_xp = experiences[i]._id;
            if ($(".first-title").html()) {
              var split = $(".first-title").html().split(" ");
              var tmp = null;
              for (var j = 0; j < split.length; j++) {
                if (split[j].length > 1) {
                  tmp = split[j];
                  break
                }
              }
              if (tmp) {
                var aux = $(".first-title").html().replace(tmp, experiences[i].name[0].value);
                $(".first-title").html(aux);
              }

            }

          }
        }
      } else {
        if (experiences[i].default) {
          $("#xp .text").html(experiences[i].name[0].value);
          xp_sel = experiences[i].slug[0].value;
          id_xp = experiences[i]._id;
        }
      }

    }
    $(".dropdown-menu.xps").append(xp.join(""));

    $("ul.xps li a").on("click", function () {
      var $this = $(this);
      $("ul.xps li a").removeClass("select");
      $this.addClass("select");
      $("#xp .text").html($this.html());
      var exist = false;
      for (var i = 0; i < experiences.length && !exist; i++) {
        if (experiences[i].name[0].value == $this.html()) {
          xp_sel = experiences[i].slug[0].value;
          id_xp = experiences[i]._id;
          exist = true;
          submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
        }

      }
      //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()))
    });
  }

  //var country_sel = {};

  function load_cities(count) {
    var list = [];
    var list0 = [];
    var list2 = [];
    city.empty();
    area.empty();
    port.empty();
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].slug[0].value == count) {
        for (var j = 0; j < countries[i].cities.length; j++) {
          list.push("<li ><a>" + countries[i].cities[j].name[0].value + "</a></li>");
          for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
            list0.push("<li class=\"area\"><a>" + countries[i].cities[j].areas[k].name[0].value + "</a></li>")
            for (var m = 0; m < countries[i].cities[j].areas[k].ports.length; m++) {
              list2.push("<li class=\"port\"><a>" + countries[i].cities[j].areas[k].ports[m].name[0].value + "</a></li>")

            }
          }


        }
      }

    }
    city.append(list.join(""));
    area.append(list0.join(""));
    port.append(list2.join(""));
    $(".cities li a").on("click", function () {
      var $this = $(this);
      $(".cities li a").removeClass("select");
      $this.addClass("select");
      var aux = "";
      aux = $this;
      $("#filter-zone").val("" + aux.html());
      for (var i = 0; i < countries.length; i++) {
        if (countries[i].slug[0].value == count) {
          for (var j = 0; j < countries[i].cities.length; j++) {
            if (countries[i].cities[j].name[0].value == aux.html()) {
              city_sel = countries[i].cities[j].slug[0].value;
              area_sel = 0;
              port_sel = 0;
              id_area = 0;
              id_port = 0;
              id_city = countries[i].cities[j]._id;
            }

          }
        }

      }
      //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()));
    });
    $(".area li a").on("click", function () {
      var $this = $(this);
      $(".area li a").removeClass("select");
      $this.addClass("select");
      var aux = "";
      aux = $this;
      $("#filter-zone").val("" + aux.html());
      for (var i = 0; i < countries.length; i++) {
        if (countries[i].slug[0].value == count) {
          for (var j = 0; j < countries[i].cities.length; j++) {
            for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
              if (countries[i].cities[j].areas[k].name[0].value == aux.html()) {
                area_sel = countries[i].cities[j].areas[k].slug[0].value;
                city_sel = 0;
                port_sel = 0;
                id_port = 0;
                id_area = countries[i].cities[j].areas[k]._id;
                id_city = countries[i].cities[j]._id;
              }

            }


          }
        }

      }
      //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()))
    });
    $(".ports li a").on("click", function () {
      var $this = $(this);
      $(".ports li a").removeClass("select");
      $this.addClass("select");
      var aux = "";
      aux = $this;
      $("#filter-zone").val("" + aux.html());
      for (var i = 0; i < countries.length; i++) {
        if (countries[i].slug[0].value == count) {
          for (var j = 0; j < countries[i].cities.length; j++) {
            for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
              for (var m = 0; m < countries[i].cities[j].areas[k].ports.length; m++) {
                if (countries[i].cities[j].areas[k].ports[m].name[0].value == aux.html()) {
                  area_sel = 0;
                  city_sel = 0;
                  port_sel = countries[i].cities[j].areas[k].ports[m].slug[0].value;
                  id_area = 0;
                  id_city = countries[i].cities[j]._id;
                  id_port = countries[i].cities[j].areas[k].ports[m]._id;
                }

              }

            }


          }
        }

      }
      //$('.btn-search').attr('href', '/' + l + '/' + country_sel + '/' + city_sel + '/' + area_sel + '/' + port_sel + '/' + xp_sel + '/' + duration_sel + '/' + (day_sel == 0 ? 0 : day_sel.getTime()))
    });

  }

//desplegar el helper
  var slide = false;

  $(".helper").on("click", function () {
    $(".general-help").attr("style", "width:288px; -webkit-transition: width .20s ease-in-out; -moz-transition:" +
      " width .20s ease-in-out; -ms-transition: width .20s ease-in-out; -o-transition: width .20s ease-in-out;" +
      " transition: width .20s ease-in-out;")
    slide = true;
    window.onscroll = function () {
      if (window.pageYOffset >= 100) {
        $(".general-help").addClass("blue");
      } else {
        $(".general-help").removeClass("blue");
      }
    }
    if ($("#header-toogle").hasClass("in")) {
      $("#header-toogle").removeClass("in");
      $("#header-toogle").addClass("collapse");
    }
  });

  //ocultar el helper

  $("#body").on("click", function () {
    if (!slide) {
      $(".general-help").attr("style", "width:0px; -webkit-transition: width .20s ease-in-out; -moz-transition:" +
        " width .20s ease-in-out; -ms-transition: width .20s ease-in-out; -o-transition: width .20s ease-in-out;" +
        " transition: width .20s ease-in-out;")
    } else {
      slide = false;
    }
    //if ($('#header-toogle').hasClass('in')) {
    //    $('#header-toogle').removeClass('in');
    //    $('#header-toogle').addClass('collapse');
    //}
  });
  $(".complete-top-bar").on("mouseleave", function (event) {
    if ($("#header-toogle").hasClass("in")) {
      $("#header-toogle").removeClass("in");
      $("#header-toogle").addClass("collapse");
    }
  });
  var values = document.cookie.split("; ");
  var showCookie = true;
  for (var i = 0; i < values.length; i++) {
    if (values[i] == "cookie=true") {
      showCookie = false;
      break;
    }
  }
  if (showCookie) {
    $(".cookie").show();
  }
  $(".cookie .closed img").click(function () {
    $(".cookie").hide(100);
    document.cookie = "cookie=true";
  });
  // $('.img-title').html('' + slogans[0]);
  // setInterval(function () {
  //   var pos = Math.floor((Math.random() * ((slogans.length - 1) - 0 + 1)) + 0);
  //   $('.img-title').attr("style", "-webkit-transition-delay: 1s; -moz-transition-delay:" +
  //     " 1s; -ms-transition-delay: 1s; -o-transition-delay: 1s;" +
  //     " transition-delay: 1s");
  //   $('.img-title').html('' + slogans[pos]);
  // }, 5000);
  var select_money = 0;
  // var money = [
  //   {
  //     text: "USD",
  //     symbol: "$"
  //   }, {
  //     text: "GBP",
  //     symbol: "₤"
  //   }, {
  //     text: "EUR",
  //     symbol: "€"
  //   }
  // ];

  function money_fix() {
    for (var i = 0; i < money.length; i++) {
      if (symbol == money[i].symbol) {
        select_money = money[i].text;
      }
    }
    if (symbol == money[2].symbol) {
      $(".dollar").remove();
      $("span.euro").html("" + symbol);
    } else {
      $(".euro").remove();
      $("span.dollar").html("" + symbol);
    }

    $('.symbol').html('' + symbol);
  }

  money_fix();

  function load_money() {
    $(".moneda").html("" + select_money + " <img width=\"8px\" height=\"8px\"" +
      "src=\"/frontEnd/img/ic_8_expand_down@2x.png\">");
    var allm = [];
    var allm1 = [];
    $(".dropdown-menu.money").empty();
    $(".xs-money").empty();
    money.forEach(function (m) {
      if (m.text == select_money) {
        allm.push("<li><a class=\"active\" href=\"/" + l + "/currency/" + m.text + "\">" + m.text + "</a></li>");
        allm1.push("<a class=\"active col-xs-2\" style=\"color: #9dc1d3;cursor: default\" href=\"#\"><strong>" + m.text + "</strong></a>");
      } else {
        allm.push("<li><a href=\"/" + l + "/currency/" + m.text + "\">" + m.text + "</a></li>");
        allm1.push("<a class=\"active col-xs-2\" style=\"color: white;\" href=\"/" + l + "/currency/" + m.text + "\">" + m.text + "</a>");
      }
    })

    $(".xs-money").append(allm1.join(""));
    $(".dropdown-menu.money").append(allm.join(""));

  }

  load_money();


  function scroller(scroll) {
    if (page != "index") {
      if (page == "ship-details") {
        $("html, body").animate({
          scrollTop: scroll//$(".breadcumb").offset().top
        }, 1000);
      }

    } else if (filters) {
      $("html, body").animate({
        scrollTop: scroll//$(".breadcumb").offset().top
      }, 1000);
    }

  }


  $("#create_account").on("click", function () {
    $("#show_login_form").hide();
    $("#general-register").hide();
    $("#mailRegister").show();
  });
  $("#mail-register").on("click", function () {
    $("#general-register").hide();
    $("#mailRegister").show();
  });
  $(".wake_login").on("click", function () {
    $("#show_login_form").show();
    $("#general-register").hide();
    $("#mailRegister").hide();
  });
  function registerEventSee_More(list) {
    for (var i = 0; i < list.length; i++) {
      $("#" + i).on("click", function () {
        var pos = $(this).attr("id");
        submitFilter(list[pos].localization.country._id, list[pos].localization.city._id, 0, 0, 0, 0, list[pos].seasons[0].experiences[0].experience.id, list[pos].shipType._id);
        return false;
      });
    }
  }

  if (page == "index") {
    registerEventSee_More(ships.list);
  }
  // $('#subscribe-btn').attr("disabled", true);
  //$('#part-form').validationEngine();
  // $('#formLoginB').validate({
  //     rules: {
  //         email: {
  //             required: true,
  //             email: true
  //         },
  //         password: {
  //             required: true
  //         }
  //     },
  //     messages:{
  //         email:{
  //             required:texts.valid_req,
  //             email:texts.valid_email
  //         },
  //         password:{
  //             required:texts.valid_req
  //         }
  //
  //     },
  //     errorClass: 'help-block',
  //     errorElement: 'span',
  //     highlight: function (element, errorClass, validClass) {
  //         $(element).parents('.input-group').removeClass('has-success').addClass('has-error');
  //         $('#sub_button').attr("disabled", true)
  //     },
  //     unhighlight: function (element, errorClass, validClass) {
  //         $(element).parents('.input-group').removeClass('has-error').addClass('has-success');
  //         $('#sub_button').attr("disabled", false);
  //     }
  //
  // });
  $("#newsletter").validate({
    rules: {
      register_email: {
        required: true,
        email: true
      }
    },
    messages: {
      register_email: {
        required: texts.valid_req,
        email: texts.valid_email
      }
    },
    errorClass: "help-block",
    errorElement: "span",
    highlight: function (element, errorClass, validClass) {
      $(element).parents(".input-group").removeClass("has-success").addClass("has-error");
      // $('#subscribe-btn').attr("disabled", true)
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).parents(".input-group").removeClass("has-error").addClass("has-success");
      // $('#subscribe-btn').attr("disabled", false);
      // $('#subscribe-btn').attr("style", "color: rgba(255, 255, 255, 1); border: 1px solid rgba(255, 255, 255, 1);");
    },
    submitHandler: function (form) {
      var email = $("#register_email").val();
      $.ajax({
        type: "POST",
        url: "/service/subscriptions",
        data: {
          email: email
        }
      }).done(function (data) {
        if (data.res) {
          ajaxDoneMsg(texts.solic_success, texts.newsletter_subscribe, "#page_container", false);

        } else if (data.error.code) {
          if (data.error.code == 11000) {
            ajaxDoneMsg(texts.solic_failed, texts.email_used, "#page_container", true, ["#register_email"]);
          } else {
            ajaxDoneMsg(texts.solic_failed, "", "#page_container", true);
          }

        } else {
          ajaxDoneMsg(texts.solic_failed, "", "#page_container", true);
        }
      }).fail(function (data) {
        ajaxDoneMsg(texts.solic_failed, "", "#page_container", true);
      })
    }

  });
  $(".register").attr("disabled", true);

  $.validator.addMethod("isophone", function (value, element) {
    return this.optional(element) || /^\d{3}\s\d{3}\s\d{3}$/i.test(value);
  }, "Please enter a valid phone value");

  $("#form-mailRegister").validate({
    rules: {
      reg_name: {
        required: true
      },
      reg_lastname: {
        required: true
        // minlength: 6
      },
      reg_email: {
        required: true,
        email: true
      },
      reg_pass: {
        required: true,
        minlength: 6
      },
      reg_pass_confirm: {
        required: true,
        minlength: 6,
        equalTo: "#reg_pass"
      },
      reg_phone: {
        required: true,
        isophone: true,
        minlength: 7
      },
      reg_address: {
        required: true
      }
    },
    messages: {
      reg_name: {
        required: texts.valid_req
      },
      reg_lastname: {
        required: texts.valid_req
        // minlength: texts.valid_minlength.replace("[number]","6")
      },
      reg_email: {
        required: texts.valid_req,
        email: texts.valid_email
      },
      reg_pass: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6")
      },
      reg_pass_confirm: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
        equalTo: texts.valid_match
      },
      reg_phone: {
        required: texts.valid_req,
        minlength: texts.valid_minlength.replace("[number]", "6"),
        isophone: texts.valid_digits
      },
      reg_address: {
        required: texts.valid_req
      }

    },
    errorClass: "help-block",
    errorElement: "span",
    highlight: function (element, errorClass, validClass) {
      $(element).parents(".input-group").removeClass("has-success").addClass("has-error");
      $(".register").attr("disabled", true);
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).parents(".input-group").removeClass("has-error").addClass("has-success");
      $(".register").attr("disabled", false);
    },
    submitHandler: function (form) {
      var name = $("#reg_name").val(),
        surname = $("#reg_lastname").val(),
        email = $("#reg_email").val(),
        password = $("#reg_pass").val(),
        password2 = $("#reg_pass_confirm").val(),
        mobile = $("#reg_mobile").val(),
        address = $("#reg_address").val();
      $.ajax({
        type: "POST",
        url: "/service/users/register",
        data: {
          name: name,
          surname: surname,
          email: email,
          password: password,
          password2: password2,
          mobile: mobile,
          address: address
        }
      }).done(function (data) {
        if (!data.res) {
          $(".notification").attr("style", "display:block; background-color: red; color: white");
          $(".notification p").html(texts.solic_failed);
          setTimeout(function () {
            $(".notification").attr("style", "display:none;")
          }, 3000);
        } else {
          $("#mailRegister").hide();
          clearForm();
          $("#compose-modal-login-back").modal("hide");
          $(".notification").attr("style", "display:block; background-color: green; color: white");
          $(".notification p").html(texts.registerSuccessRequest);
          setTimeout(function () {
            $(".notification").attr("style", "display:none;")
          }, 3000);
        }


      }).fail(function (data) {
        $("#mailRegister").show()
      })
    }
  });

  function clearForm() {
    $("#reg_name").val("");
    $("#reg_lastname").val("");
    $("#reg_email").val("");
    $("#reg_pass").val("");
    $("#reg_pass-confirm").val("");
    $("#reg_phone").val("");
    $("#reg_address").val("");
  }


  function loadShipType() {
    var list = [];
    var names = [], values = [];
    if (filters) {
      $.ajax({
        url: "/service/configurations/typesFront",
        type: "GET",
        data: {
          culture: l
        }
      }).done(function (data) {
        if (data.res) {
          list.push("<li><a class=\"-1 toCapitalize\">" + texts.any + "</a></li>");
          for (var i = 0; i < data.res.length; i++) {
            list.push("<li><a class=\"" + data.res[i].slug[0].value + "\">" + data.res[i].name[0].value + "</a></li>")

          }
          $("ul.dropdown-menu.ship-type").append(list.join(""));
          var exist = false;
          for (var i = 0; i < data.res.length && !exist; i++) {
            if (ship_t == data.res[i].slug[0].value) {
              $("#ship-type .text").html(data.res[i].name[0].value);
              $("ul.dropdown-menu.ship-type li a").find("." + ship_t).addClass("active");
              breadcrumb.shipt = data.res[i].name[0].value;
              $("a.filter2-type-ship").html("" + breadcrumb.shipt);
              $("h1.first-title").html($("h1.first-title").html().replace(texts.general_ships, breadcrumb.shipt));
              exist = true;
            }


          }
          $("ul.dropdown-menu.ship-type li a").on("click", function () {
            var exist = false;
            if ($(this).hasClass("-1")) {
              id_shiptype = "0";
              submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
            } else {
              for (var j = 0; j < data.res.length && !exist; j++) {
                if ($(this).hasClass(data.res[j].slug[0].value)) {
                  id_shiptype = data.res[j]._id;
                  exist = true;
                  submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
                }
              }
            }


          })
        }
      })


    }

  }


  function eslora() {
    var list = [];
    var names = [], values = [];
    if (filters) {

      list.push("<li><a class=\"0 toCapitalize\">" + texts.any + "</a></li>",
        "<li><a class=\"6\" >" + texts.less_filter + " 6 " + texts.meters + "</a></li>",
        "<li><a class=\"6,12\" >" + texts.between_filter + " 6 " + texts.and_filter + " 12 " + texts.meters + "</a></li>",
        "<li><a class=\"12,15\" >" + texts.between_filter + " 12 " + texts.and_filter + " 15 " + texts.meters + "</a></li>",
        "<li><a class=\"15\">" + texts.more_filter + " 15 " + texts.meters + "</a></li>"
      )
      ;
      $("ul.dropdown-menu.eslora").append(list.join(""));

      values.push("6", "6,12", "12,15", "15");
      names.push(texts.less_filter + " 6 " + texts.meters, texts.between_filter + " 6 " + texts.and_filter + " 12 " + texts.meters, texts.between_filter + " 12 " + texts.and_filter + " 15 " + texts.meters, texts.more_filter + " 15 " + texts.meters);
      for (var i = 0; i < values.length; i++) {
        if (slora == values[i]) {
          $("#eslora .text").html(names[i]);
          $("ul.dropdown-menu.eslora li a").find("." + slora).addClass("active");
        }

      }

      $("ul.dropdown-menu.eslora li a").on("click", function () {
        var $this = $(this);
        if ($this.hasClass("6")) {
          slora = "6";
        } else if ($this.hasClass("6,12")) {
          slora = "6,12";
        }
        else if ($this.hasClass("12,15")) {
          slora = "12,15";
        }
        else if ($this.hasClass("15")) {
          slora = "15";
        } else {
          slora = "0";
        }
        submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
      })
    }

  }


  function numberofPeople() {
    var list = [];
    var names = [], values = []
    if (filters) {

      list.push("<li><a class=\"toCapitalize\" >" + texts.any + "</a></li>",
        "<li><a class=\"1\" >" + " 1 " + texts.people + "</a></li>",
        "<li><a class=\"2\" >" + " 2 " + texts.peoples + "</a></li>",
        "<li><a class=\"3\" >" + " 3 " + texts.peoples + "</a></li>",
        "<li><a class=\"4\" >" + " 4 " + texts.peoples + "</a></li>",
        "<li><a class=\"5\" >" + " 5 " + texts.peoples + "</a></li>",
        "<li><a class=\"6\" >" + " 6 " + texts.peoples + "</a></li>",
        "<li><a class=\"7\" >" + " 7 " + texts.peoples + "</a></li>",
        "<li><a class=\"8\" >" + " 8 " + texts.peoples + "</a></li>",
        "<li><a class=\"9\" >" + " 9 " + texts.peoples + "</a></li>",
        "<li><a class=\"10\" >" + " 10 " + texts.peoples + "</a></li>",
        "<li><a class=\"11\" >" + " 11 " + texts.peoples + "</a></li>",
        "<li><a class=\"12\" >" + " 12 " + texts.peoples + "</a></li>",
        "<li><a class=\"12*\">" + texts.more_filter + " 12 " + texts.peoples + "</a></li>"
      );
      $("ul.dropdown-menu.number-passa").append(list.join(""));

      values.push("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "12*");
      names.push(" 1 " + texts.people, " 2 " + texts.peoples, " 3 " + texts.peoples, " 4 " + texts.peoples, " 5 " + texts.peoples, " 6 " + texts.peoples, " 7 " + texts.peoples, " 8 " + texts.peoples, " 9 " + texts.peoples, " 10 " + texts.peoples, " 11 " + texts.peoples, " 12 " + texts.peoples, texts.more_filter + " 12 " + texts.peoples);
      for (var i = 0; i < values.length; i++) {
        if (number_p == values[i]) {
          $("#number-passa .text").html(names[i]);
          $("ul.dropdown-menu.number-passa li a").find("." + number_p).addClass("active");
        }

      }

      $("ul.dropdown-menu.number-passa li a").on("click", function () {
        var $this = $(this);
        if ($this.hasClass("1")) {
          number_p = "1";
        }
        else if ($this.hasClass("2")) {
          number_p = "2";
        } else if ($this.hasClass("3")) {
          number_p = "3";
        } else if ($this.hasClass("4")) {
          number_p = "4";
        } else if ($this.hasClass("5")) {
          number_p = "5";
        } else if ($this.hasClass("6")) {
          number_p = "6";
        } else if ($this.hasClass("7")) {
          number_p = "7";
        } else if ($this.hasClass("8")) {
          number_p = "8";
        } else if ($this.hasClass("9")) {
          number_p = "9";
        } else if ($this.hasClass("10")) {
          number_p = "10";
        } else if ($this.hasClass("11")) {
          number_p = "11";
        } else if ($this.hasClass("12")) {
          number_p = "12";
        } else if ($this.hasClass("12*")) {
          number_p = "12*";
        } else {
          number_p = "0"
        }
        submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
      })
    }

  }


  function loadShipowner() {
    var list = [];
    var names = [], values = [];
    if (filters) {

      list.push("<li><a class=\"default\">" + texts.with_or_without_master + "</a></li>",
        "<li><a class=\"true\">" + texts.with_master + "</a></li>",
        "<li><a class=\"false\">" + texts.without_master + "</a></li>"
      );
      $("ul.dropdown-menu.patron").append(list.join(""));

      values.push("true", "false");
      names.push(texts.with_master, texts.without_master);
      for (var i = 0; i < values.length; i++) {
        if (shipowner == values[i]) {
          $("#patron .text").html(names[i]);
          $("ul.dropdown-menu.patron li a").find("." + shipowner).addClass("active");
        }

      }


      $("ul.dropdown-menu.patron li a").on("click", function () {
        var $this = $(this);
        if ($this.hasClass("true")) {
          shipowner = true;
        } else if ($this.hasClass("false")) {
          shipowner = false;
        } else {
          shipowner = "0"
        }
        submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
      })
    }

  }

  window.onresize = asperRatio;
  // loadShipowner();
  function asperRatio() {
    setTimeout(function () {
      $(".card .header").attr("style", "height:" + $(".card .header img").width() / 1.77 + "px !important"); //1.77
    }, 100);

  }

  asperRatio();
  function personal_scroll() {
    if (window.screen.width < 480) {
      scroller(450);
    } else if (window.screen.width > 481 && window.screen.width < 767) {
      scroller(450);
    } else if (window.screen.width >= 768 && window.screen.width < 991) {
      scroller(500);
    }
    else {
      scroller(570);
    }
  }

  personal_scroll();
  //function breadcrumbfc() {
  //    //$('.breadcrumb').on('click', function () {
  //    //    if (window.screen.width < 480) {
  //    //        scroller(40);
  //    //    } else if (window.screen.width > 481 && window.screen.width < 767) {
  //    //        scroller(40);
  //    //    } else {
  //    //        scroller(430);
  //    //    }
  //    //})
  //}
  //
  //breadcrumbfc();
  function searchB() {
    $(".btn-search").on("click", function () {
      submitFilter(id_country, id_city, id_area, id_port, id_duration, day_sel, id_xp, id_shiptype)
    })
  }

  searchB();
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
          var url_orig = "/" + l + "/" + data.res;
          var url_sec = "?";
          if (day_sel != "0") {
            url_sec = url_sec + "startDate=" + day_sel.getTime() + "&"
          }
          if (duration_sel != "0") {
            url_sec = url_sec + "duration=" + duration_sel + "&"
          }
          if (slora != "0") {
            url_sec = url_sec + "length=" + slora + "&"
          }
          if (number_p != "0") {
            url_sec = url_sec + "number=" + number_p + "&"
          }
          if (shipowner != "0" || !shipowner) {
            url_sec = url_sec + "shipowner=" + shipowner + "&"
          }
          window.location = url_orig + url_sec.slice(url_sec[0], -1);
        }
      })
    }

  }

  //submitFilter()
  function submitShip() {
    $("a.filter2-type-ship").on("click", function () {
      submitFilter(0, 0, 0, 0, 0, 0, 0, id_shiptype)
    })
    $("a.filter2-country").on("click", function () {
      submitFilter(id_country, 0, 0, 0, 0, 0, 0, 0)
    })
    $("a.filter2-port").on("click", function () {
      submitFilter(id_country, id_city, 0, id_port, 0, 0, 0, 0)
    })
    $("a.filter2-area").on("click", function () {
      submitFilter(id_country, id_city, id_area, 0, 0, 0, 0, 0)
    })
    $("a.filter2-city").on("click", function () {
      submitFilter(id_country, id_city, 0, 0, 0, 0, 0, 0)
    })
  }

  submitShip()

  function filterZones() {
    for (var i = 0; i < countries.length; i++) {
      if (countries[i]._id == id_country) {
        for (var j = 0; j < countries[i].cities.length; j++) {
          allzones.push(countries[i].cities[j]);
          for (var k = 0; k < countries[i].cities[j].areas.length; k++) {
            allzones.push(countries[i].cities[j].areas[k]);
            for (var m = 0; m < countries[i].cities[j].areas[k].ports.length; m++) {
              allzones.push(countries[i].cities[j].areas[k].ports[m]);

            }
          }
        }
      }

    }
    var list = []
    for (var i = 0; i < allzones.length; i++) {
      list.push("<li><a>" + allzones[i].name[0].value + "</a></li>");

    }
    $("ul.dropdown-menu.filters-zones").append(list.join(""));
    //console.log(""+ allzones);
    $("#filter-zone").keyup(function () {
      var inputout = $(this).val();
      if ($("ul.dropdown-menu.filters-zones li a").filter(function () {
          if ($(this).html().toLowerCase().indexOf(inputout.toLowerCase()) == -1) {
            $(this).hide()
          } else {
            $(this).show()
          }
        })) {
        if (inputout.length == 0) {
          $("ul.dropdown-menu.filters-zones").attr("style", "display:none");
        } else {
          $("ul.dropdown-menu.filters-zones").attr("style", "display:block");
          $("#filter-zone").parents(".input-group-btn").removeClass("open")
        }

      }

    })
    $("ul.dropdown-menu.filters-zones li a").on("click", function () {
      $("#filter-zone").val("" + $(this).html());
      $("ul.dropdown-menu.filters-zones").attr("style", "display:none");

    })
  }

  $("#drop-zones").on("click", function () {
    $("ul.dropdown-menu.filters-zones").attr("style", "display:none");
  })
  if (page == "our-ships") {
    function fix_our_ships() {
      $(".country-ship").on("click", function () {
        for (var i = 0; i < allships.length; i++) {
          for (var j = 0; j < allships[i].length; j++) {
            if ($(".country-ship").html() == allships[i][j].name) {
              submitFilter(allships[i][j].location.country, "0", "0", "0", "0", "0", "0", "0"); //id_xp
            }
          }
        }
      })
      $(".city-ship").on("click", function () {
        for (var i = 0; i < allships.length; i++) {
          for (var j = 0; j < allships[i].length; j++) {
            for (var k = 0; k < allships[i][j].ships.length; k++) {
              for (var m = 0; m < allships[i][j].ships[k].length; m++) {
                if ($(this).html() == allships[i][j].ships[k][m].name) {
                  submitFilter(allships[i][j].ships[k][m].location.country, allships[i][j].ships[k][m].location.city, "0", "0", "0", "0", "0", allships[i][j].ships[k][m].location.shipType);
                }

              }

            }

          }
        }
      })

    }

    fix_our_ships()
  }
  if (l == "en") {
    // $('ul.dropdown-menu.eslora').attr("style","width:125%");
    $(".owner-style").removeClass("col-lg-2");
    $(".filter2 .btn.btn-default.dropdown-toggle#patron .caret").attr("style", "margin-top:4%");
  }

  $("img.lazy").lazyload({
    effect: "fadeIn"
  });
  var cant_load = 1;

  function loadSeconfilters() {
    loadShipType();
    loadShipowner();
    numberofPeople();
    eslora();
  }

  loadSeconfilters();
  function loadMoreships() {
    $.ajax({
      type: "GET",
      url: "/service/ships/listFront",
      data: {
        culture: l,
        limit: (cant_load + 1) * 10,
        filter: null

      }
    }).done(function (ships) {
      // // Grab the template
      cant_load++;
      $.get("/frontEnd/view/index.ejs", function (template) {
        // Compile the EJS template.
        var func = ejs.compile(template);
        var language = l;
        var data = {
          ships: ships,
          language: language,
          filters: filters,
          general_land: general_land,
          landingSelect: landingSelect,
          landing: landing
        };
        // Grab the data
        var html = func(data);
        $(".container.index").html(html);
        $("img.lazy").lazyload({
          effect: "fadeIn"
        });
        asperRatio();
        organizeCity();
        loadSeconfilters();
        organizeXp();
        registerEventSee_More(ships.list);
        money_fix();
      });

    }).fail(function (error) {
      console.log(error);
    })
  }

  $(".see-more").on("click", function () {
    loadMoreships()
  });
  //loadMoreships()

  window.onscroll = function () {
    if (window.pageYOffset >= 100) {
      $(".dropdown-menu.zone").addClass("top-zero");
    } else {
      $(".dropdown-menu.zone").removeClass("top-zero");
    }
  };

  var tmp = true;
  // window.onresize = function () {
  //   if (window.innerWidth > 767) {
  //     $(".accordion-toggle.title").removeClass("pointer")
  //     $(".dropdown-menu.zone #cities").collapse("show")
  //     $(".dropdown-menu.zone #cities").removeClass("collapse")
  //     $(".dropdown-menu.zone #cities").addClass("in")
  //     $(".dropdown-menu.zone #cities").attr("style", "height=auto;")
  //     $(".dropdown-menu.zone #ports").collapse("show")
  //     $(".dropdown-menu.zone #ports").addClass("in")
  //     $(".dropdown-menu.zone #ports").attr("style", "height=auto;")
  //     $(".dropdown-menu.zone #area").collapse("show")
  //     $(".dropdown-menu.zone #area").addClass("in")
  //     $(".dropdown-menu.zone #area").attr("style", "height=auto;")
  //     tmp = true;
  //   } else if (tmp) {
  //     $(".accordion-toggle.title").addClass("pointer")
  //     $(".dropdown-menu.zone #cities").collapse("show")
  //     $(".dropdown-menu.zone #cities").removeClass("collapse")
  //     $(".dropdown-menu.zone #cities").addClass("in")
  //     $(".dropdown-menu.zone #cities").attr("style", "height=auto;")
  //     $(".dropdown-menu.zone #ports").collapse("hide")
  //     $(".dropdown-menu.zone #ports").removeClass("in")
  //     $(".dropdown-menu.zone #area").collapse("hide")
  //     $(".dropdown-menu.zone #area").removeClass("in")
  //     tmp = false;
  //   }
  // }
  //
  // if (window.innerWidth <= 767) {
  //   $(".dropdown-menu.zone #ports").collapse("hide")
  //   $(".dropdown-menu.zone #area").collapse("hide")
  //   $(".accordion-toggle.title").addClass("pointer")
  // }

  // $(".accordion-toggle.title").click(function (e) {
  //   if (window.innerWidth <= 767) {
  //     var identify = $(this).attr("identify");
  //     if (identify == "cities") {
  //       $(".dropdown-menu.zone #ports").collapse("hide")
  //       $(".dropdown-menu.zone #area").collapse("hide")
  //     } else if (identify == "ports") {
  //       $(".dropdown-menu.zone #cities").collapse("hide")
  //       $(".dropdown-menu.zone #area").collapse("hide")
  //     } else if (identify == "area") {
  //       $(".dropdown-menu.zone #cities").collapse("hide")
  //       $(".dropdown-menu.zone #ports").collapse("hide")
  //     }
  //     $("#" + identify).collapse("toggle")
  //   }
  //   e.stopPropagation();
  // })

  $("#span-caret-filter-location").click(function (e) {
    if ($("ul.countries li a.select").length > 0
      || $("ul.countries").parent().children("button").children("span.text").html() != texts.any) {
      if ($("#filter-zone").parents(".input-group-btn.open").length > 0) {
        $("#filter-zone").parents(".input-group-btn").removeClass("open")
      } else {
        $(".input-group-btn").removeClass("open")
        $("#filter-zone").parents(".input-group-btn").addClass("open")
      }
    }
    $("ul.dropdown-menu.filters-zones").attr("style", "display:none");
    return false
  })
  $("#filter-zone").click(function (e) {
    if ($("ul.countries li a.select").length > 0
      || $("ul.countries").parent().children("button").children("span.text").html() != texts.any) {
      if ($("#filter-zone").parents(".input-group-btn.open").length > 0) {
        $("#filter-zone").parents(".input-group-btn").removeClass("open")
      } else {
        $(".input-group-btn").removeClass("open")
        $("#filter-zone").parents(".input-group-btn").addClass("open")
      }
    }
    $("ul.dropdown-menu.filters-zones").attr("style", "display:none");
    return false
  })

  $("body").click(function (e) {
    if (!(e.target.id == "filter-zone" || e.target.id == "span-caret-filter-location")) {
      $("#filter-zone").parents(".input-group-btn").removeClass("open")
    }
  })

  $(".dropdown-menu.zone").click(function () {
    $("#filter-zone").parents(".input-group-btn").removeClass("open")
  })
  if (page == "about-us") {
    function asperImg() {
      setTimeout(function () {
        $("#scroll-me .container-photo-about-us").attr("style", "height:" + $("#scroll-me .container-photo-about-us img").width() / 1.77 + "px !important"); //1.77
      }, 100);

    }

    asperImg();
    window.onresize = asperImg;
  }
});

function validateFormatPhone(identify) {
  var fieldValue = "",
    lastKey;
  /*$(identify).keyup(function (e, v) {
   validate(this, e)
   });*/
  $(identify).blur(function (e, v) {
    validate(this, e, true)
  });

  function validate(me, e, blur) {
    if (blur
      || (lastKey && (lastKey == 17 && e.keyCode == 86))
      || (me.value != fieldValue && !(e.keyCode == 37 || e.keyCode == 39))) {
      var value = me.value,
        tmp = "";
      fieldValue = value;
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
      if (value != "" || (value != "" && value != " ")) {
        if (value.match(/^\+/)) {
          value = "+" + clearValue(value);
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
      }
    }
    lastKey = e.keyCode;
  }

  function clearValue(value) {
    return value.replace(/\D/g, "");
  }
}


function ajaxDoneMsg(title, subtitle, context, err, cmpErr) {
  var myCarousel1 = $("#carousel-example-generic");
  myCarousel1.carousel({
    interval: 2000
  });

  // if (myCarousel1.length) {
  //   var parallax_mirror = $('.parallax-mirror'),
  //     englobe = $('.englobe').parent();
  //   myCarousel1.hide();
  //   parallax_mirror.hide();
  //   englobe.hide();
  // }
  $(context).hide();

  $('html, body').animate({
    scrollTop: 0
  }, 1000);


  var myCarousel = $("#myCarousel");
  // if (myCarousel.length) {
  //   var parallax_mirror = $('.parallax-mirror'),
  //     englobe = $('.englobe').parent();
  //   myCarousel.hide();
  //   parallax_mirror.hide();
  //   englobe.hide();
  // }
  // $(context).hide();
  $('html, body').animate({
    scrollTop: 0
  }, 1000);

  $(".page_notification button")
    .click(function () {
      if (err) {
        $(context).show();
        if (myCarousel.length) {
          myCarousel.show();
          parallax_mirror.show();
          englobe.show();
        }
        $(".page_notification").hide();
        if (cmpErr && cmpErr.length > 0) {
          cmpErr.forEach(function (cmp) {
            $(cmp).parents(".form-group").removeClass("has-success").addClass("has-error");
            $(cmp).parents(".input-group").removeClass("has-success").addClass("has-error");
          })
        }
        $("html, body").animate({
          scrollTop: 0
        }, 1000);
      } else {
        window.location.reload();
      }
    });
  var src = err ? "/frontEnd/img/ic_32_error_sign.png" : "/frontEnd/img/ic_32_checkmark_green.png",
    srcset = err ? "/frontEnd/img/ic_32_error_sign@2x.png 2x" : "/frontEnd/img/ic_32_checkmark_green@2x.png 2x";
  $(".notif_body .title").html(title).attr("style", "color:" + (err ? "#d9534f" : "#5cb85c"));
  $(".notif_body .priv_notif_text").html(subtitle);
  $(".page_notification").show();
  $(".page_notification .confirm img")
    .attr({src: src, srcset: srcset});
}