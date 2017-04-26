/**
 * Created by ernestomr87@gmail.com on 2/25/2016.
 */
var constHour = 3600000;
angular.module("rentShipApp.requestCtrl", [])
  .controller("requestCtrl", [
    "$scope", "$rootScope", "Requests", "Offers", "Ships", "$filter",
    function ($scope, $rootScope, Requests, Offers, Ships, $filter) {

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

      $rootScope.pageSelected = "requests";
      $scope.experiences = ExperiencesDatas;
      $scope.durations = DurationsDatas;
      $scope.requestId = RequestDatas;
      $scope.method = MethodtDatas;

      $scope.status = null;
      $scope.requests = [];
      $scope.currentPage = 1;
      $scope.maxSize = 50;
      $scope.skip = 0;
      $scope.check = null;
      $scope.imgAvatar = null;
      $scope.imgMedia = null;
      $scope.showRequest = 0;
      $scope.filter = [];
      $scope.shipId = null;
      $scope.duration = null;
      $scope.showDatePicker = false;
      $scope.shsh = false;
      $scope.formDurations = [];
      $scope.disables = [];
      $scope.daysData = [];
      $scope.posList = 0;
      $scope.minDate = new Date($rootScope.globalToday + 86400000);
      $scope.patronPrice = 0;
      $scope.conditions = "";
      $scope.showAlert = false;
      $scope.acceptOffersTotal = 0;
      $scope.rejectOffersTotal = 0;

      $scope.string_tab_content1 = "";
      $scope.string_tab_content2 = "";
      $scope.string_tab_content3 = "";
      $scope.tab = 0;
      $scope.selectTab = function (num) {
        $scope.tab = num;
      };
      $scope.sortOptions = {
        tab_content1: {
          field: "index",
          sort: 1
        },
        tab_content2: {
          field: "index",
          sort: 1
        },
        tab_content3: {
          field: "index",
          sort: 1
        }
      };
      $scope.changeSortOptions = function (field, tab) {
        if ($scope.sortOptions[tab].field != field) {
          $scope.sortOptions[tab].field = field;
          $scope.sortOptions[tab].sort = -1;
        } else {
          if ($scope.sortOptions[tab].sort == -1) $scope.sortOptions[tab].sort = 1;
          else if ($scope.sortOptions[tab].sort == 1) $scope.sortOptions[tab].sort = -1;
        }
        if (tab == "tab_content1") {
          $scope.listRequests();
        } else if (tab == "tab_content2") {
          $scope.listAccept();
        } else if (tab == "tab_content3") {
          $scope.listReject();
        }
      };
      $scope.initializeOffer1 = function () {
        $scope.offer = {
          request: null,
          email: null,
          bookDate: null,
          ship: null,
          experience: null,
          duration: {
            unity: null,
            quantity: null
          },
          patron: false,
          discount: 0,
          price: 0,
          percentage: 100,
          conditions: "",
        };
        $scope.systemDiscount = 0;
        $scope.typeDicount = 0;
        $scope.customDiscount = 0;
      };
      $scope.initializeOffer1();
      $scope.selectTypeDiscount = function (type) {
        $scope.typeDicount = type;
        $scope.preparePrice();
      };
      $scope.showPAB = false;
      $scope.preparePrice = function () {
        $scope.systemDiscount = 0;
        $scope.showPAB = false;
        if ($scope.typeDicount === 0) {
          $scope.discount = $scope.percentageOfDiscount ? parseInt(angular.copy($scope.percentageOfDiscount)) : 0;
        } else if ($scope.typeDicount === 1) {
          $scope.discount = parseInt($scope.customDiscount);
        } else {
          $scope.discount = 0;
        }
        if ($scope.discount >= 5) {
          $scope.showPAB = true;
          $scope.systemDiscount = 5;
        }

        $scope.discount = $scope.discount + $scope.systemDiscount;
        $scope.offer.price = angular.copy($scope.offer.oldPrice - (($scope.offer.oldPrice * $scope.discount) / 100));
        $scope.preparePercent();

      };
      $scope.listRequests = function () {
        Requests.get({
          limit: $scope.maxSize,
          skip: $scope.skip,
          check: $scope.check,
          string: $scope.string_tab_content1,
          sortOptions: $scope.sortOptions.tab_content1
        }, function (data) {
          if (!data.error) {
            $scope.totalItems = data.cont;
            $scope.requests = data.res;
            if ($scope.currentPage > 1 && !$scope.requests.length) {
              $scope.currentPage--;
              $scope.skip = $scope.skip - $scope.maxSize;
            }
          }
        });
      };
      $scope.listRequests();
      $scope.listAvailables = function (day) {
        var date = day;
        if (!angular.isDate(date)) {
          date = new Date(date);
        }

        day = angular.copy(
          {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            day: date.getUTCDate()
          });
        delete date;

        Ships.available.get({
          day: day
        }, function (data) {
          if (!data.error) {
            $scope.availables = data.res;
            var pos = 0;
            for (var i = 0; i < $scope.availables.length; i++) {
              if ($scope.availables[i]._id === $scope.shipId || $scope.availables[i]._id === $scope.request.ship._id) {
                pos = i;
                break;
              }
            }
            if ($scope.availables.length) {
              $scope.initializeOffer(pos);
            } else {
              $(".red.available-reserve").removeClass("available-reserve").addClass("avialables-yes");
            }

          }
        });
      };
      $scope.disableDays = function () {
        for (var i = 0; i < $scope.ship.locks.length; i++) {

          var start = $scope.ship.locks[i].start;
          var end = $scope.ship.locks[i].end;

          for (var j = start; j <= end; j += 86400000) {
            var aux = new Date(j);
            aux = new Date(aux.getUTCFullYear(), aux.getUTCMonth(), aux.getUTCDate());
            var tmp = aux.getDate() + "/" + (aux.getMonth() + 1) + "/" + aux.getFullYear();
            $scope.disables.push(tmp);
            aux = {
              title: $scope.ship.locks[i].title,
              day: aux
            };
            $scope.daysData.push(aux);
          }
        }
      };
      $scope.getDiscount = function () {
        $scope.discount = 0;
        $scope.discounts = [];
        $scope.acumulation = [];
        var i;
        for (i = 0; i < $scope.ship.discounts.length; i++) {
          var start = $scope.getUTCDate(new Date($scope.ship.discounts[i].start));
          var end = $scope.getUTCDate(new Date($scope.ship.discounts[i].end));

          if (start <= $scope.offer.bookDate && end >= $scope.offer.bookDate) {
            var success = true;
            if ($scope.ship.discounts[i].type === "0") {
              $scope.ship.discounts[i].name = "Especial";
            }
            var cd;
            var cont;
            if ($scope.ship.discounts[i].type === "2") {
              $scope.ship.discounts[i].name = "Last Minute";
              cd = new Date($scope.offer.createDate);
              cont = ($scope.requestBookDate - cd);
              if (cont > $scope.ship.discounts[i].max * constHour) {
                success = false;
              }
            }
            if ($scope.ship.discounts[i].type == "1") {
              $scope.ship.discounts[i].name = "Early Booking";
              cd = new Date($scope.offer.createDate);
              cont = ($scope.requestBookDate - cd);
              if (cont < $scope.ship.discounts[i].min * constHour) {
                success = false;
              }
            }

            // var tmp = 1;
            // if ($scope.ship.discounts[i].duration.unity == 1) {
            //     tmp = 24;
            // }
            // if ($scope.ship.discounts[i].duration.unity == 7) {
            //     tmp = 24 * 7;
            // }

            var tmp1 = 1;
            if ($scope.formDuration.unity == 1) {
              tmp1 = 24;
            }
            if ($scope.formDuration.unity == 7) {
              tmp1 = 24 * 7;
            }

            var minD1 = tmp1 * $scope.formDuration.quantity;
            if ((minD1 * constHour) < ($scope.ship.discounts[i].minDuration * constHour)) {
              success = false;
            }
            if (success) {
              if ($scope.ship.discounts[i].accumulation) {
                $scope.acumulation.push($scope.ship.discounts[i]);
              } else {
                $scope.discounts.push($scope.ship.discounts[i]);
              }

            }

          }
        }
        var name = "";
        var plus = 0;
        for (i = 0; i < $scope.acumulation.length; i++) {
          name = name + " + " + $scope.acumulation[i].name;
          plus += $scope.acumulation[i].discount;
        }
        if ($scope.acumulation.length) {
          name = name.replace(" + ", "");
          var aux = {
            name: name,
            discount: plus
          };
          $scope.discounts.push(aux);
        }


        if ($scope.discounts.length) {
          $scope.percentageOfDiscount = angular.copy($scope.discounts[0].discount).toString();
          $scope.selectTypeDiscount(0);
        } else {
          $scope.selectTypeDiscount(1);
        }
      };
      $scope.prepareLocks = function (ship) {
        var auxStart;
        var auxEnd;
        var i;
        for (i = 0; i < ship.locks.length; i++) {
          auxStart = new Date(ship.locks[i].start);
          ship.locks[i].start = new Date(auxStart.getUTCFullYear(), auxStart.getUTCMonth(), auxStart.getUTCDate());
          auxEnd = new Date(ship.locks[i].end);
          ship.locks[i].end = new Date(auxEnd.getUTCFullYear(), auxEnd.getUTCMonth(), auxEnd.getUTCDate());
        }

        for (i = 0; i < ship.seasons.length; i++) {
          auxStart = new Date(ship.seasons[i].start);
          ship.seasons[i].start = new Date(auxStart.getUTCFullYear(), auxStart.getUTCMonth(), auxStart.getUTCDate());
          auxEnd = new Date(ship.seasons[i].end);
          ship.seasons[i].end = new Date(auxEnd.getUTCFullYear(), auxEnd.getUTCMonth(), auxEnd.getUTCDate());
        }
        return ship;
      };
      $scope.getUTCDate = function (date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      };
      $scope.compareDate = function (date1, date2) {
        var response = false;
        if (!angular.isDate(date1)) date1 = new Date(date1);
        if (!angular.isDate(date2)) date2 = new Date(date2);


        if (date1 && date2) {
          var aux1 = {
            year: date1.getUTCFullYear(),
            month: date1.getUTCMonth(),
            day: date1.getUTCDate()
          };
          var aux2 = {
            year: date2.getUTCFullYear(),
            month: date2.getUTCMonth(),
            day: date2.getUTCDate()
          };
          if (aux1.year === aux2.year && aux1.month === aux2.month && aux1.day === aux2.day)
            response = true;
        }
        return response;
      };
      $scope.initializeDurations = function () {
        $scope.listDurations = [];
        var array = [];
        array.push({
          unity: 0,
          quantity: 2,
          text: 2 + " " + "Horas",
          cont: 1
        });
        array.push({
          unity: 0,
          quantity: 4,
          text: 4 + " " + "Horas",
          cont: 1
        });
        var i;
        for (i = 1; i < 14; i++) {
          array.push({
            unity: 1,
            quantity: i,
            text: i + " " + "Días",
            cont: i
          });
        }
        for (i = 2; i < 5; i++) {
          array.push({
            unity: 7,
            quantity: i,
            text: i + " " + "Semanas",
            cont: i * 7
          });
        }

        var auxDate = new Date($scope.request.bookDate);
        var date = angular.copy(new Date(auxDate.getUTCFullYear(), auxDate.getUTCMonth(), auxDate.getUTCDate()));


        for (i = 0; i < array.length; i++) {
          var aux = {
            start: date,
            end: new Date(date + (86400000 * array[i].cont))
          };
          var locks = [];
          for (var j = 0; j < $scope.ship.locks.length; j++) {
            var tmp = {
              start: new Date($scope.ship.locks[j].start),
              end: new Date($scope.ship.locks[j].end)
            };
            locks.push(tmp);
          }
          if ($scope.validateAddEvent(locks, aux)) {
            $scope.listDurations.push(array[i]);
          }
        }


      };
      $scope.differentDuration = function () {
        for (var i = 0; i < $scope.formDurations.length; i++) {
          if ($scope.formDurations[i].id == $scope.offer.duration) {
            if ($scope.formDurations[i].unity == $scope.request.duration.unity && $scope.formDurations[i].quantity == $scope.request.duration.quantity) {
              return true;
            }
          }
        }
        return false;
      };
      $scope.differentPatron = function () {
        if ($scope.request && $scope.request.patron) {
          if (JSON.parse($scope.offer.patron) == JSON.parse($scope.request.patron)) {
            return true;
          }
        }
        return false;
      };
      $scope.initializeOffer = function (pos) {
        $scope.posList = angular.copy(pos);

        var auxDate = new Date($scope.request.bookDate);
        $scope.offer.bookDate = angular.copy(new Date(auxDate.getUTCFullYear(), auxDate.getUTCMonth(), auxDate.getUTCDate()));

        $scope.date = $filter("date")(auxDate, "MM/dd/yyyy");

        $scope.ship = angular.copy($scope.availables[pos]);
        $scope.ship = angular.copy($scope.prepareLocks($scope.ship));
        var minDate = 0;
        if ($scope.ship.conditions.secondPayment === "3") {
          minDate = (2 * 7 * 86400000);
        }
        if ($scope.ship.conditions.secondPayment === "4") {
          minDate = (7 * 86400000);
        }
        var date = $scope.requestBookDate;

        var td = angular.copy($rootScope.globalToday);
        var dateA = td + minDate;

        if (dateA > date) {
          $scope.availableSecondPayment = false;
        } else {
          $scope.availableSecondPayment = true;
        }

        $scope.initializeDurations();
        $scope.disableDays();
        $scope.offer.ship = angular.copy($scope.ship);


        $scope.shipId = $scope.offer.ship._id;
        $scope.offer.patron = angular.copy($scope.request.patron.toString());

        $scope.xpAndDuration();
      };
      $scope.xpAndDuration = function () {
        $scope.xps = [];
        $scope.formXp = null;
        $scope.formDuration = null;
        $scope.lDurations = angular.copy($scope.listDurations);
        for (var j = 0; j < $scope.experiences.length; j++) {
          for (var k = 0; k < $scope.ship.season.experiences.length; k++) {
            if ($scope.ship.season.experiences[k].experience === $scope.experiences[j]._id) {
              for (var i = 0; i < $scope.durations.length; i++) {
                for (var l = 0; l < $scope.ship.season.experiences[k].durations.length; l++) {
                  if ($scope.durations[i]._id === $scope.ship.season.experiences[k].durations[l].duration) {
                    for (var m = 0; m < $scope.listDurations.length; m++) {
                      if ($scope.lDurations[m].unity === $scope.durations[i].unity && $scope.lDurations[m].quantity === $scope.durations[i].quantity) {
                        $scope.lDurations[m].price = parseFloat($scope.ship.season.experiences[k].durations[l].price);
                      } else if ($scope.lDurations[m].unity === $scope.durations[i].unity && $scope.durations[i].quantity === 1) {
                        $scope.lDurations[m].price = parseFloat($scope.ship.season.experiences[k].durations[l].price) * $scope.lDurations[m].quantity;
                      }
                    }
                  }
                }
              }
              var xp = {
                _id: $scope.experiences[j]._id,
                name: $scope.experiences[j].name,
                durations: angular.copy($scope.lDurations)
              };
              if ($scope.request.experience === $scope.experiences[j]._id) {
                $scope.formXp = angular.copy(xp);
              }
              $scope.xps.push(xp);
            }
          }

        }

        $scope.formXp = $scope.formXp || $scope.xps[0];
        $scope.offer.experience = $scope.formXp._id;
        $scope.formDurations = $scope.formXp.durations;
        for (var i = 0; i < $scope.formDurations.length; i++) {
          $scope.formDurations[i].id = i;
          if ($scope.formDurations[i].unity === $scope.request.duration.unity && $scope.formDurations[i].quantity === $scope.request.duration.quantity) {
            $scope.formDuration = angular.copy($scope.formDurations[i]);
          }
        }


        $scope.formDuration = angular.copy($scope.formDuration || $scope.formXp.durations[0] || {
            price: 0
          });
        $scope.offer.duration = angular.copy($scope.formDuration.id);
        // $scope.offer.valDur = angular.copy($scope.formDuration.duration);
        $scope.offer.oldPrice = angular.copy(parseFloat($scope.formDuration.price));
        $scope.offer.price = angular.copy($scope.offer.oldPrice - (($scope.offer.oldPrice * $scope.discount) / 100));
        $scope.changePatron();
        $scope.offer.price = angular.copy($scope.offer.oldPrice - (($scope.offer.oldPrice * $scope.discount) / 100));
        $scope.getDiscount();
        $scope.preparePercent();

      };
      $scope.posPercent = 0;
      $scope.preparePercent = function () {
        $scope.toPay = [];
        $scope.pdiscount = [];
        for (var i = 0; i <= 95; i++) {
          $scope.pdiscount.push(i);
        }

        var pos = 0;
        for (var i = 100; i >= 20; i = i - 10) {
          var aux = {
            position: pos,
            percentage: i,
            price: $filter("currency")(($scope.offer.price * i) / 100)
          };
          $scope.toPay.push(aux);
          pos++;

        }

        $scope.offer.percentage = $scope.offer.percentage || $scope.toPay[0].percentage;
      };
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.listRequests();
      };
      $scope.show = function (id) {
        Requests.get({
          id: id
        }, function (data) {
          if (!data.error) {
            $scope.showAlert = false;
            $scope.request = angular.copy(data.res);
            $scope.ship = angular.copy($scope.request.ship);
            $scope.shipId = $scope.ship._id;
            $scope.offer.request = angular.copy($scope.request._id);
            $scope.offer.email = angular.copy($scope.request.email);

            var auxDate = new Date($scope.request.bookDate);
            $scope.offer.bookDate = angular.copy(new Date(auxDate.getUTCFullYear(), auxDate.getUTCMonth(), auxDate.getUTCDate()));

            $scope.requestDate = angular.copy($scope.offer.bookDate);
            $scope.requestBookDate = angular.copy($scope.offer.bookDate);

            var auxDate1 = new Date($scope.request.createDate);
            $scope.offer.createDate = angular.copy(new Date(auxDate1.getUTCFullYear(), auxDate1.getUTCMonth(), auxDate1.getUTCDate()));

            delete auxDate;
            delete auxDate1;

            $scope.imgMedia = "/service/media/" + $scope.request.ship.photos[0].media;
            $scope.listOffers();
            $scope.listAvailables($scope.offer.bookDate);
            $scope.showRequest = 1;
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });

      };
      $scope.unavailable = function () {
        Requests.unavailable({
          request: $scope.request._id
        }, function (data) {
          if (!data.error) {
            if (data.res) {
              $scope.listRequests();
              $scope.listAccept();
              $scope.listReject();
              $scope.showRequest = 0;
              $scope.showAlert = true;
              $rootScope.showNotify("Acción Satisfactoria ", "Se le ha enviado la notificación al usuario satisfactoriamente", "success");
            }
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      if ($scope.requestId) {
        if ($scope.method == "get") {
          $scope.show($scope.requestId);
        }
        if ($scope.method == "delete") {
          $scope.request = {
            _id: $scope.requestId
          };
          $scope.unavailable();
        }

      }
      $scope.showAddOffer = function () {
        $scope.changeAvailable();
        $scope.showRequest = 2;
      };
      $scope.changeAvailable = function () {
        var pos = 0;
        $scope.availableSecondPayment = true;
        $scope.ship = angular.copy(false);
        for (var i = 0; i < $scope.availables.length; i++) {
          if ($scope.availables[i]._id == $scope.shipId) {
            pos = i;
          }
        }

        $scope.initializeOffer(pos);
      };
      $scope.changeXp = function () {
        var pos = 0;
        $scope.formDuration = null;
        for (var i = 0; i < $scope.xps.length; i++) {
          if ($scope.xps[i]._id == $scope.offer.experience) {
            pos = i;
            break;
          }
        }
        $scope.formXp = $scope.formXp || $scope.xps[0];
        $scope.offer.experience = $scope.formXp._id;
        $scope.formDurations = $scope.formXp.durations;

        for (var i = 0; i < $scope.formDurations.length; i++) {
          if ($scope.formDurations[i].id == $scope.offer.duration) {
            $scope.formDuration = angular.copy($scope.formDurations[i]);
            break;
          }
        }
        $scope.formDuration = angular.copy($scope.formDuration || $scope.formXp.durations[0] || {
            price: 0
          });
        $scope.offer.duration = angular.copy($scope.formDuration.id);
        // $scope.offer.valDur = angular.copy($scope.formDuration.duration);
        $scope.offer.oldPrice = angular.copy(parseFloat($scope.formDuration.price));
        $scope.changePatron();
        $scope.offer.price = angular.copy($scope.offer.oldPrice - (($scope.offer.oldPrice * $scope.discount) / 100));
        $scope.getDiscount();
        $scope.preparePercent();
      };
      $scope.changeDuration = function () {
        $scope.changePatron();
        $scope.preparePercent();

      };
      $scope.changePercentage = function () {
        $scope.restPrice = 0;
        for (var i = 0; i < $scope.toPay.length; i++) {
          if (i == parseInt($scope.posPercent)) {
            $scope.offer.percentage = $scope.toPay[i].percentage;
            break;
          }
        }

        if ($scope.discount) {
          var x = (($scope.patronPrice + $scope.formDuration.price) * $scope.discount) / 100;
          var y = $scope.patronPrice + $scope.formDuration.price - x;
        } else {
          var y = $scope.patronPrice + $scope.formDuration.price;
        }

        var z = ($scope.offer.percentage * y) / 100;
        $scope.restPrice = angular.copy(y - z);
      };
      $scope.validateOffer = function () {
        if ($scope.requestBookDate) {
          var date = angular.copy($scope.requestBookDate);
          if (angular.isDate(date)) {
            date = date.getTime();
          }
        } else {
          var date = angular.copy($scope.offer.bookDate);
          if (angular.isDate(date)) {
            date = date.getTime();
          }
        }

        var date1 = angular.copy($scope.minDate);
        if (angular.isDate(date)) {
          date1 = date.getTime();
        }

        if (date < date1) {
          return false;
        }
        if ($scope.offer.request == null) {
          return false;
        }
        if ($scope.offer.ship == null) {
          return false;
        }
        if ($scope.offer.experience == null) {
          return false;
        }
        if ($scope.offer.duration == null) {
          return false;
        }
        if (isNaN(parseFloat($scope.offer.price))) {
          return false;
        }
        if (parseFloat($scope.offer.price) < 1) {
          return false;
        }
        if (!$scope.offer.conditions.length) {
          return false;
        }

        return true;
      };

      $scope.offers = [];
      $scope.offersCurrentPage = 1;
      $scope.offersMaxSize = 50;
      $scope.offersSkip = 0;
      $scope.listOffers = function () {
        Offers.get({
          limit: $scope.offersMaxSize,
          skip: $scope.offersSkip,
          request: $scope.request._id || null,
          status: $scope.status
        }, function (data) {
          if (!data.error) {
            $scope.offersTotalItems = data.cont;
            $scope.offers = data.res;
            if ($scope.offersCurrentPage > 1 && !$scope.offers.length) {
              $scope.offersCurrentPage--;
              $scope.offersSkip = $scope.offersSkip - $scope.offersMaxSize;
            }
          }
        });
      };
      $scope.accepts = [];
      $scope.acceptsCurrentPage = 1;
      $scope.acceptsMaxSize = 50;
      $scope.acceptsSkip = 0;
      $scope.listAccept = function () {
        Requests.get({
          limit: $scope.maxSize,
          skip: $scope.skip,
          check: null,
          status: "accept",
          string: $scope.string_tab_content2,
          sortOptions: $scope.sortOptions.tab_content2
        }, function (data) {
          if (!data.error) {
            $scope.acceptsTotalItems = data.cont;
            $scope.accepts = data.res;
            if ($scope.acceptsCurrentPage > 1 && !$scope.accepts.length) {
              $scope.acceptsCurrentPage--;
              $scope.acceptsSkip = $scope.acceptsSkip - $scope.acceptsMaxSize;
              // $scope.listAccept();
            }
          }
        });
      };
      $scope.rejects = [];
      $scope.rejectsCurrentPage = 1;
      $scope.rejectsMaxSize = 50;
      $scope.rejectsSkip = 0;
      $scope.listReject = function () {
        Requests.get({
          limit: $scope.rejectsMaxSize,
          skip: $scope.rejectsSkip,
          check: null,
          status: "reject",
          string: $scope.string_tab_content3,
          sortOptions: $scope.sortOptions.tab_content3
        }, function (data) {
          if (!data.error) {
            $scope.rejectsTotalItems = data.cont;
            $scope.rejects = data.res;
            if ($scope.rejectsCurrentPage > 1 && !$scope.rejects.length) {
              $scope.rejectsCurrentPage--;
              $scope.rejectsSkip = $scope.rejectsSkip - $scope.rejectsMaxSize;
              // $scope.listReject();
            }
          }
        });
      };
      $scope.listAccept();
      $scope.listReject();
      $scope.offersPageChanged = function () {
        $scope.offersSkip = ($scope.offersCurrentPage - 1) * $scope.offersMaxSize;
        $scope.listOffers();
      };
      $scope.rejectsPageChanged = function () {
        $scope.rejectsRSkip = ($scope.rejectsCurrentPage - 1) * $scope.rejectsMaxSize;
        $scope.listReject();
      };
      $scope.acceptsPageChanged = function () {
        $scope.acceptsSkip = ($scope.acceptsCurrentPage - 1) * $scope.acceptsMaxSize;
        $scope.listAccept();
      };


      $scope.addOffer = function () {
        if ($scope.validateOffer()) {
          if (!angular.isDate($scope.requestBookDate)) $scope.requestBookDate = new Date($scope.requestBookDate);
          $scope.offer.ship = $scope.offer.ship._id;
          $scope.offer.conditions = replace_antipirate($scope.offer.conditions);
          var offer = {
            request: $scope.offer.request,
            email: $scope.offer.email,
            ship: $scope.offer.ship,
            experience: $scope.offer.experience,
            duration: {
              unity: $scope.formDuration.unity,
              quantity: $scope.formDuration.quantity
            },
            patron: $scope.offer.patron,
            discount: $scope.discount,
            pricePatron: $scope.patronPrice,
            priceRent: $scope.formDuration.price,
            price: ($scope.offer.price * $scope.offer.percentage) / 100,
            percentage: $scope.offer.percentage,
            conditions: $scope.offer.conditions,
            bookDate: {
              year: $scope.requestBookDate.getUTCFullYear(),
              month: $scope.requestBookDate.getUTCMonth(),
              day: $scope.requestBookDate.getUTCDate()
            },
            numPas: $scope.request.numPas
          };
          Offers.create({
            offer: offer
          }, function (data) {
            $scope.initializeOffer1();
            $scope.initializeOffer($scope.posList);
            $scope.showRequest = 1;
            if (!data.error) {
              $scope.offerForm.$setPristine(true);
              $scope.show($scope.request._id);
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha enviado la Oferta satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al enviar sus datos", "error");
            }
          });
        }
      };
      $scope.remove = function (id) {
        Offers.delete.delete({
          id: id
        }, function (data) {
          if (!data.error) {
            $scope.listOffers();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha cambiado el estado satisfactoriamente", "success");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", "error");
          }
        });
      };
      $scope.disabled = function (ship, date, mode) {
        if (ship) {
          var dis = false;
          var auxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          for (var i = 0; i < ship.disables.length; i++) {
            if (ship.disables[i] == auxDate.getTime()) {
              dis = true;
              break;
            }
          }
          return (mode === "day" && dis);
        } else {
          return false;
        }
      };
      $rootScope.SelectedDay = function () {
        var date = $scope.request.bookDate;
        if (angular.isDate($scope.request.bookDate)) {
          date = $scope.request.bookDate.getTime();
          $scope.requestBookDate = date;
        }
        $scope.listAvailables(date);

      };
      $scope.getPatronPrice = function (duration) {
        for (var i = 0; i < $scope.ship.conditions.patron.length; i++) {
          for (var j = 0; j < $scope.durations.length; j++) {
            if ($scope.ship.conditions.patron[i].duration == $scope.durations[j]._id) {
              if (duration.unity == $scope.durations[j].unity && duration.quantity == $scope.durations[j].quantity) {
                return parseFloat($scope.ship.conditions.patron[i].price);
              } else if (duration.unity == $scope.durations[j].unity && $scope.durations[j].quantity == 1) {
                return parseFloat($scope.ship.conditions.patron[i].price) * duration.quantity;
              }
            }
          }
        }
        return 0;
      };
      $scope.changePatron = function () {
        if (eval($scope.offer.patron)) {
          $scope.patronPrice = $scope.getPatronPrice($scope.formDuration);
          $scope.offer.oldPrice = parseFloat($scope.formDuration.price) + parseFloat($scope.patronPrice);
        } else {
          $scope.offer.oldPrice = parseFloat($scope.formDuration.price);
        }
        $scope.preparePrice();
      };
      $scope.validateAddEvent = function (array, event) {

        if (array.length) {
          for (var i = 0; i < array.length; i++) {
            var start = new Date(array[i].start);
            var end = new Date(array[i].end);
            if (array[i].end == null) {
              end = start;
            }
            if (array[i].allDay) {
              end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
              end = new Date(end.getTime() + 86399999);
            }

            var eventEnd = event.end;
            if (event.end == null) {
              eventEnd = event.start;
            }
            if (event.allDay) {
              eventEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
              eventEnd = new Date(eventEnd.getTime() + 86399999);
            }

            if ($scope.matchAssetBlock(start, end, event.start, eventEnd)) {
              return false;
            }
          }
          return true;
        } else {
          return true;
        }
      };
      $scope.matchAssetBlock = function (a, b, c, d) {
        if (c < a && a < d) {
          return true;
        }
        if (c < b && b < d) {
          return true;
        }
        if (a < c && c < b) {
          return true;
        }
        if (a < d && d < b) {
          return true;
        }
        if (a.getTime() == c.getTime() && b.getTime() == d.getTime()) {
          return true;
        }
        return false;
      };
      $scope.selectOffer = function (offer) {
        $scope.conditions = offer.conditions;
        $scope.conditionsDate = offer.createDate;
      };
      $scope.requestPrice = function (req) {
        var price = "";
        angular.forEach(req.ship.seasons, function (season) {
          if ((new Date(season.start).getTime() <= new Date().getTime() && new Date(season.end).getTime() >= new Date().getTime())) {
            angular.forEach(req.ship.seasons[0], function (xps) {
              angular.forEach(xps, function (xp) {
                if (xp.experience == req.experience) {
                  angular.forEach(xp.durations, function (duration) {
                    angular.forEach($scope.durations, function (objDuration) {
                      if (duration.duration == objDuration._id && objDuration.unity == req.duration.unity) {
                        if (req.duration.unity == 0 && req.duration.quantity == objDuration.quantity) {
                          price = parseFloat(duration.price.replace(".", "").replace(",", "."));
                        } else if (req.duration.unity == 1 || req.duration.unity == 7) {
                          price = req.duration.quantity * parseFloat(duration.price.replace(".", "").replace(",", "."));
                        }
                      }
                    });
                  });
                }
              });
            });
          }
        });
        return price;
      };
    }
  ]);