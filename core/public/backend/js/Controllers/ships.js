angular.module("rentShipApp.shipCtrl", [])
  .controller("shipCtrl", [
    "$scope", "$rootScope", "$anchorScroll", "Ships", "Users", "Localizations", "$filter", "$upload", "Configurations", "$locale", "$interval",
    function ($scope, $rootScope, $anchorScroll, Ships, Users, Localizations, $filter, $upload, Configurations, $locale, $interval) {

      $scope.activate = function () {
        $rootScope.pageSelected = "ships";
        $locale.id = "es_es";
        $scope.experiences = ExperiencesDatas;
        $scope.durations = DurationsDatas;
        $scope.equipmentsData = EquipmentsDatas;
        $scope.wizard = false;
        $scope.stepNow = 0;
        $scope.stepEditNow = 0;
        $scope.permissions = true;
        $scope.user = null;
        $scope.responsive_wizard = [];
        $scope.responsive_wizard.push({
          desc: "Info"
        }, {
          desc: "Datos técnicos"
        }, {
          desc: "Equipamiento"
        }, {
          desc: "Ubicación"
        }, {
          desc: "Calendarios"
        }, {
          desc: "Condiciones"
        }, {
          desc: "Fotos"
        }, {
          desc: "Descuentos"
        });
        $scope.yearsArray = [];
        $scope.tempLastRedecorate = null;
        $scope.hours = [];
        $scope.ships = [];
        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.skip = 0;
        $scope.contetShow = 1; //1-List   2- P.Information   3- Profile
        $scope.backStep = false;
        $scope.avatarStyle = {};
        $scope.status = null;
        $scope.today = new Date($rootScope.globalToday);
        $scope.tomorrow = new Date($scope.today.getTime() + 86400000);
        $scope.year = $scope.today.getFullYear();
        $scope.seasonPriceValidate = [0, 0];
        $scope.whileLoadCalendar = false;
        var stop;
        $scope.sizeImg = 0;
        $scope.users = [];
        $scope.currentPageUsers = 1;
        $scope.maxSizeUsers = 10;
        $scope.skipUsers = 0;
        $scope.permissions = true;
        $scope.shfilter2 = false;

        var year = new Date($rootScope.globalToday).getUTCFullYear();
        for (var i = 8; i < 24; i++) {
          $scope.hours.push(i);
        }
        for (var i = year; i > 1900; i--) {
          $scope.yearsArray.push(i);
        }
        for (var i = 0; i < $scope.equipmentsData.length; i++) {
          $scope.equipmentsData[i].text = angular.copy($rootScope.prepareLanguagesTabs());
        }
        $.listen("parsley:field:validate", function () {
          validateForm();
        });
        window.onresize = fixPics;
        $("#fotos-tab").on("click", function () {
          fixPics();
        });
        $(".daterangepicker.dropdown-menu.picker_4.single.opensright.show-calendar i").removeClass("icon icon-arrow-right icon-arrow-left");

        $(".form-control.dollar-mask").inputmask("999.999.999,99", {
          numericInput: true,
          rightAlignNumerics: false
        });


        $scope.initializeVars();
        $scope.list();
      };

      $scope.prepareWizard = function (ship) {
        $scope.wizard = true;
        if (ship)
          $scope.ship = angular.copy(ship);
        if ($scope.ship.step != 8) {
          $scope.stepNow = $scope.ship.step;
          $scope.contetShow = 3;
          $("#ui-tinymce-4_ifr body").attr("data-id", "ui-tinymce-0");
          $("#ui-tinymce-4_ifr body").attr("spellcheck", false);
          $("#ui-tinymce-4_ifr body").attr("contenteditable", true);
          $("#ui-tinymce-4_ifr body").addClass("mce-content-body");
          for (var i = 0; i < 8; i++) {
            var id = "#wz" + i;
            if (i != $scope.ship.step) {
              if (i < $scope.ship.step) {
                angular.element(id).removeAttr("isdone");
                angular.element(id).removeClass("disabled done selected");
                angular.element(id).addClass("done");
                angular.element(id).attr("isdone", 1);
              } else {
                angular.element(id).removeAttr("isdone");
                angular.element(id).removeClass("disabled done selected");
                angular.element(id).addClass("disabled");
                angular.element(id).attr("isdone", 0);
              }
            } else {
              angular.element(id).removeAttr("isdone");
              angular.element(id).removeClass("disabled done selected");
              angular.element(id).addClass("selected");
              angular.element(id).attr("isdone", 0);

              if (i == 3)
                $scope.showLocation();
              if (i == 4)
                $scope.calendarsShow();
              if (i == 5)
                $scope.conditionsShow();
              if (i == 6)
                $scope.photosShow();
              if (i == 7)
                $scope.discountShow();
            }

          }
        } else {
          $scope.wizard = false;
          $scope.contetShow = 1;
        }
      };
      $scope.nextStep = function () {
        $scope.prepareWizard($scope.ship);
        $scope.list();
      };
      $scope.changeStepEditNow = function (step) {
        $scope.stepEditNow = step;
      };
      $scope.goToStep = function (step) {
        if ($scope.stepNow > step) {
          var id = "#wz" + step;
          var idd = "#wz" + $scope.stepNow;


          angular.element(id).removeClass("disabled done selected");
          angular.element(id).addClass("selected");


          angular.element(idd).removeClass("disabled done selected");
          angular.element(idd).addClass("done");

          if (step == 3)
            $scope.showLocation();
          if (step == 4)
            $scope.calendarsShow();
          if (step == 5)
            $scope.conditionsShow();
          if (step == 6)
            $scope.photosShow();
          if (step == 7)
            $scope.discountShow();
          $scope.stepNow = angular.copy(step);
        } else if ($scope.stepNow != step && $scope.ship.step >= step) {
          id = "#wz" + step;
          idd = "#wz" + $scope.stepNow;


          angular.element(id).removeClass("disabled done selected");
          angular.element(id).addClass("selected");


          angular.element(idd).removeClass("disabled done selected");
          angular.element(idd).addClass("done");
          if (step == 3)
            $scope.showLocation();
          if (step == 4)
            $scope.calendarsShow();
          if (step == 5)
            $scope.conditionsShow();
          if (step == 6)
            $scope.photosShow();
          if (step == 7)
            $scope.discountShow();
          $scope.stepNow = angular.copy(step);
        }

      };
      $scope.changeLastRedecorate = function () {
        if (!$scope.ship.lastRedecorate) {
          if ($scope.tempLastRedecorate) {
            $scope.ship.lastRedecorate = angular.copy($scope.tempLastRedecorate);
          } else {
            $scope.ship.lastRedecorate = parseInt(new Date().getFullYear());
          }

        } else {
          if ($scope.contetShow == 2) {
            $scope.tempLastRedecorate = angular.copy($scope.ship.lastRedecorate);
          }
          $scope.ship.lastRedecorate = null;
        }

      };
      $scope.getXpByID = function (id) {
        for (var i = 0; i < $scope.experiences.length; i++) {
          if (id == $scope.experiences[i]._id) {
            return $scope.experiences[i].name[0].value;
          }
        }
        return;
      };
      $scope.prepareEquipments = function () {
        for (var i = 0; i < $scope.equipmentsData.length; i++) {
          for (var j = 0; j < $scope.ship.equipments.length; j++) {
            if ($scope.equipmentsData[i]._id == $scope.ship.equipments[j].equipment) {
              for (var k = 0; k < $scope.equipmentsData[i].text.length; k++) {
                for (var l = 0; l < $scope.ship.equipments[j].text.length; l++) {
                  if ($scope.equipmentsData[i].text[k].iso == $scope.ship.equipments[j].text[l].iso) {
                    $scope.equipmentsData[i].text[k].value = $scope.ship.equipments[j].text[l].value;
                  }
                }
              }
            }
          }
        }
      };

      function sortDuration() {
        var durations = $scope.durations;
        for (var i = 0; i < durations.length - 1; i++) {
          for (var j = i + 1; j < durations.length; j++) {
            var c, d;
            if (durations[i].unity === 0) {
              c = 1;
            } else if (durations[i].unity == 1) {
              c = 24;
            } else {
              c = 24 * 7;
            }

            if (durations[j].unity === 0) {
              d = 1;
            } else if (durations[j].unity == 1) {
              d = 24;
            } else {
              d = 24 * 7;
            }

            var a = (c * durations[i].quantity);
            var b = (d * durations[j].quantity);

            if (a > b) {
              var aux = durations[i];
              durations[i] = durations[j];
              durations[j] = aux;
            }
          }
        }
        $scope.durations = durations;
      }

      var validateForm = function () {
        if (true === $("#shipInfoData").parsley().isValid()) {
          $(".bs-callout-info").removeClass("hidden");
          $(".bs-callout-warning").addClass("hidden");
          return true;
        } else {
          $(".bs-callout-info").addClass("hidden");
          $(".bs-callout-warning").removeClass("hidden");
          return false;
        }
      };
      $scope.validateBoat = function () {
        try {
          if (!$scope.ship.name.length) {
            return false;
          }
          if (!$scope.ship.model.length) {
            return false;
          }
          if ($scope.lastRedecorate) {
            $scope.lastRedecorate = parseInt($scope.lastRedecorate);
            var year = new Date($rootScope.globalToday).getUTCFullYear();
            if ($scope.ship.lastRedecorate < 1000 && $scope.ship.lastRedecorate > year) {
              return false;
            }
          }

          var aux = $rootScope.prepareLanguagesTabs();
          for (var i = 0; i < aux.length; i++) {
            if (!$scope.ship.title[i].value.length) {
              return false;
            }
          }
          for (var i = 0; i < aux.length; i++) {
            if (!$scope.ship.description[i].value.length) {
              return false;
            }
          }

          return true;
        } catch (err) {


          return false;
        }

      };
      $scope.listTypes = function () {
        Configurations.types.list(function (data) {
          if (!data.error) {
            $scope.types = data.res;
            $scope.ship.shipType = $scope.types[0]._id;

          } else if (!$rootScope.production) {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.listTags = function () {
        Configurations.tags.list(function (data) {
          if (!data.error) {
            $scope.tags = data.res;
          } else if (!$rootScope.production) {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.initializeVars = function () {
        var aux = $rootScope.prepareLanguagesTabs();
        $scope.country = null;
        $scope.city = null;
        $scope.area = null;
        $scope.port = null;
        $scope.types = [];
        $scope.ship = {
          user: null,
          tags: [],
          name: "",
          title: angular.copy(aux),
          description: angular.copy(aux),
          manufacturer: "Beneteau",
          model: "",
          year: new Date().getFullYear(),
          lastRedecorate: null,
          shipType: null,
          rentType: "0",
          technicalDetails: {
            habitability: {
              persons: {
                day: 0,
                night: 0
              },
              cabins: 0, //camarotes
              baths: 0 //baños
            },
            measurements: {
              dimension: 0, //Eslora
              draught: 0, //Calado
              sleeve: 0 //Manga

            },
            engine: {
              combustible: "",
              power: 0, //Potencia
              speed: {
                max: 0,
                cruising: 0 //Crucero
              },
              consume: 0 //Consumo medio
            },
            deposits: {
              freshwater: 0,
              combustible: 0
            }
          },
          equipments: [],
          step: 0
        };
        $scope.selectMainTab = 0;
        $scope.selectTab = 0;
        $scope.selectForm = 0;
        $scope.showEdit = false;
        $scope.listTypes();
        //$scope.listTags();
        $scope.string = "";

      };
      $scope.checkTag = function (tag) {
        var exist = false;
        var pos = 0;
        for (var i = 0; i < $scope.ship.tags.length; i++) {
          if ($scope.ship.tags[i] == tag) {
            pos = i;
            exist = true;
            break;
          }
        }

        if (!exist) {
          $scope.ship.tags.push(tag);
        } else {
          var array = [];
          for (var i = 0; i < $scope.ship.tags.length; i++) {
            if (i != pos) {
              array.push($scope.ship.tags[i]);
            }
          }
          $scope.ship.tags = angular.copy(array);
        }
      };
      $scope.existTag = function (tag) {
        var exist = false;
        for (var i = 0; i < $scope.ship.tags.length; i++) {
          if ($scope.ship.tags[i] == tag) {
            exist = true;
            break;

          }
        }
        return exist;
      };

      $scope.selectedTab = function (index) {
        $scope.selectTab = index;
      };

      /*Information*/
      $scope.changeView = function (view) {
        $scope.contetShow = view;
        $scope.backStep = false;
        $scope.shipInfoData.$setPristine(true);
        $anchorScroll();
        $scope.initializeVars();
        $scope.initializeTabs();
        if (view == 1) {
          $scope.activate();
        }
        if (view == 2) {
          $scope.prepareWizard();
          //loadAsper();
        }
      };
      $scope.prepareLanguages = function (list) {
        var aux = $rootScope.prepareLanguagesTabs();
        for (var i = 0; i < list.length; i++) {
          if (list[i].title.length < aux.length) {
            for (var k = 0; k < aux.length; k++) {
              var exist = false;
              for (var l = 0; l < list[i].title.length; l++) {
                if (aux[k]._id == list[i].title[l].language) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                list[i].title.push({
                  language: aux[k]._id,
                  value: aux[k].name
                });
              }
            }
          }
          if (list[i].description.length < aux.length) {
            for (var k = 0; k < aux.length; k++) {
              var exist = false;
              for (var l = 0; l < list[i].description.length; l++) {
                if (aux[k]._id == list[i].description[l].language) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                list[i].description.push({
                  language: aux[k]._id,
                  value: aux[k].name
                });
              }
            }
          }
        }
        return list;
      };
      $scope.formatShips = function () {
        for (var i = 0; i < $scope.ship.title.length; i++) {
          var aux = {
            _id: $scope.ship.title[i].language,
            value: $scope.ship.title[i].value
          };
          $scope.ship.title[i] = aux;

          var tmp = {
            _id: $scope.ship.description[i].language,
            value: $scope.ship.description[i].value
          };
          $scope.ship.description[i] = tmp;
        }
      };
      $scope.list = function () {
        Ships.get({
          limit: $scope.maxSize,
          skip: $scope.skip,
          status: $scope.status,
          string: $scope.string,
          permissions: $scope.permissions,
          userid: $scope.user ? $scope.user._id : null,
          countryid: $scope.country ? $scope.country._id : null,
          cityid: $scope.city ? $scope.city._id : null,
          areaid: $scope.area ? $scope.area._id : null,
          portid: $scope.port ? $scope.port._id : null,
        }, function (data) {
          if (!data.error) {
            $scope.totalItems = angular.copy(data.cont);
            $scope.ships = angular.copy($scope.prepareLanguages(data.res));
            for (var i = 0; i < $scope.ships.length; i++) {
              for (var j = 0; j < $scope.ships[i].locks.length; j++) {
                $scope.ships[i].locks[j].end = new Date($scope.ships[i].locks[j].end.year, $scope.ships[i].locks[j].end.month, $scope.ships[i].locks[j].end.day).getTime();
                $scope.ships[i].locks[j].start = new Date($scope.ships[i].locks[j].start.year, $scope.ships[i].locks[j].start.month, $scope.ships[i].locks[j].start.day).getTime();
              }
              for (var j = 0; j < $scope.ships[i].seasons.length; j++) {
                $scope.ships[i].seasons[j].end = new Date($scope.ships[i].seasons[j].end.year, $scope.ships[i].seasons[j].end.month, $scope.ships[i].seasons[j].end.day).getTime();
                $scope.ships[i].seasons[j].start = new Date($scope.ships[i].seasons[j].start.year, $scope.ships[i].seasons[j].start.month, $scope.ships[i].seasons[j].start.day).getTime();
              }

            }
            if (data.cont === 0 && $rootScope.M_USER.permissions.isShipOwner) {
              $scope.contetShow = 3;
            }
            if ($scope.currentPage > 1 && !$scope.ships.length) {
              $scope.currentPage--;
              $scope.skip = angular.copy($scope.skip - $scope.maxSize);
              $scope.list();
            }
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
          }
        });
      };

      $scope.listPermissions = function (permission) {
        $scope.permissions = permission;
        $scope.list();
      };
      $scope.loadBoats = function (status) {
        $scope.status = status;
        $scope.list();
      };
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.list();
      };
      $scope.changeStatus = function (ship) {
        $scope.ship = angular.copy(ship);
        Ships.status.update({
          id: $scope.ship._id
        }, function (data) {
          if (data.error) {

            if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", "error");
            }
          } else {
            if ($scope.ship._id == data.res._id) {
              if (data.res.step == 8) {
                $scope.ship = data.res;
                for (var i = 0; i < $scope.ships.length; i++) {
                  if ($scope.ships[i]._id == data.res._id) {
                    $scope.ships[i] = data.res;
                  }
                }
              } else {
                $scope.prepareWizard(data.res);
                $scope.list();
              }
            }
          }
        });
      };
      $scope.changePublish = function (ship) {
        $scope.ship = angular.copy(ship);
        Ships.publish.update({
          id: $scope.ship._id
        }, function (data) {
          if (data.error) {
            if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", "error");
            }
          } else {
            if ($scope.ship._id == data.res._id) {
              if (data.res.step == 8) {
                $scope.ship = data.res;
                for (var i = 0; i < $scope.ships.length; i++) {
                  if ($scope.ships[i]._id == data.res._id) {
                    $scope.ships[i] = data.res;
                  }
                }
              } else {
                $scope.prepareWizard(data.res);
                $scope.list();
              }
            }
          }
        });
      };
      $scope.selectShip = function (ship) {
        $scope.ship = angular.copy(ship);
      };
      $scope.remove = function () {
        Ships.remove({
          id: $scope.ship._id
        }, function (data) {
          if (!data.error) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
            $scope.changeView(1);
          } else if (!$rootScope.production) {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
          }
        });
      };
      $scope.initializeTabs = function () {
        $("#myTabShip li").removeClass("active");
        $("#myTabShipContent div").removeClass("active");

        $("#myTabShip li:first-child").addClass("active");
        $("#myTabShipContent div:first-child").addClass("active");
      };


      $scope.preview = function (ship) {
        if (ship.publish) {
          var xp = $scope.experiences[0].slug[0].value;
          for (var i = 0; i < ship.seasons.length; i++) {
            if ($scope.today.getTime() > ship.seasons[i].start && $scope.today.getTime() < ship.seasons[i].end) {
              var found = false;
              for (var j = 0; j < $scope.experiences.length && !found; j++) {
                if ($scope.experiences[j]._id == ship.seasons[i].experiences[0].experience) {
                  xp = $scope.experiences[j].slug[0].value;
                  found = true;
                }

              }
              if (found) {
                break;
              }
            }
          }
          // for (var i = 0; i < $scope.experiences.length; i++) {
          //     if ($scope.experiences[i].default) {
          //         xp = $scope.experiences[i].slug[0].value;
          //         break;
          //     }
          // }

          //angular.element("#mapGoogle").append(frame);
          var url = "/es/detalle-de-barco/" + ship.slug + "/" + xp;
          window.location = url;
        }
      };
      $scope.goToEdit = function (ship) {

        $scope.shipInfoData.$setPristine(true);
        $scope.initializeTabs();
        $scope.ship = angular.copy(ship);
        $scope.ship.tags = $scope.ship.tags || [];
        $scope.ship.equipments = angular.copy($scope.ship.equipments);
        $scope.prepareEquipments();

        $scope.contetShow = 2;
        $scope.backStep = true;

        if ($scope.ship.step != 8) {
          $scope.prepareWizard();
        }
        var auxStart, auxEnd;
        for (var i = 0; i < $scope.ship.locks.length; i++) {
          auxStart = moment($scope.ship.locks[i].start).utcOffset($rootScope.timezone);
          $scope.ship.locks[i].start = auxStart.toDate();

          auxEnd = moment($scope.ship.locks[i].end).utcOffset($rootScope.timezone);
          $scope.ship.locks[i].end = auxEnd.toDate();
        }

        for (var i = 0; i < $scope.ship.seasons.length; i++) {
          auxStart = moment($scope.ship.seasons[i].start).utcOffset($rootScope.timezone);
          $scope.ship.seasons[i].start = auxStart.toDate();

          auxEnd = moment($scope.ship.seasons[i].end).utcOffset($rootScope.timezone);
          $scope.ship.seasons[i].end = auxEnd.toDate();
        }
      };
      $scope.create = function () {
        $("#shipInfoData").parsley().validate();
        if (validateForm()) {
          Ships.add({
            name: $scope.ship.name,
            tags: $scope.ship.tags,
            title: $scope.ship.title,
            description: $scope.ship.description,
            manufacturer: $scope.ship.manufacturer,
            model: $scope.ship.model,
            year: $scope.ship.year,
            lastRedecorate: $scope.ship.lastRedecorate,
            shipType: $scope.ship.shipType,
            rentType: $scope.ship.rentType
          }, function (data) {
            if (!data.error) {
              $scope.prepareWizard(data.res);
              $scope.list();
              $rootScope.showNotify("Acción Satisfactoria ", "Barco creado satisfactoriamente", "success");

            } else if (data.error.code) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              if (data.error.code == "11000") {
                if (!$rootScope.production) {
                  $rootScope.showNotify("Oh No! ", data.error.message, "error");
                } else {
                  $rootScope.showNotify("Oh No! ", "El nombre del barco esta en uso", "error");
                }
              } else {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              }
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        }
      };
      $scope.update = function () {
        $("#shipInfoData").parsley().validate();
        if (validateForm()) {
          $scope.formatShips();
          Ships.change({
            id: $scope.ship._id,
            tags: $scope.ship.tags,
            name: $scope.ship.name,
            title: $scope.ship.title,
            description: $scope.ship.description,
            manufacturer: $scope.ship.manufacturer,
            model: $scope.ship.model,
            year: $scope.ship.year,
            lastRedecorate: $scope.ship.lastRedecorate,
            shipType: $scope.ship.shipType,
            rentType: $scope.ship.rentType,
            finder: $scope.ship.finder,
            noindex: $scope.ship.noindex,
            nofollow: $scope.ship.nofollow
          }, function (data) {
            if (!data.error) {
              if ($scope.ship._id === data.res._id) {
                if (data.res.step === 8) {
                  $scope.ship = data.res;
                  for (var i = 0; i < $scope.ships.length; i++) {
                    if ($scope.ships[i]._id == data.res._id) {
                      $scope.ships[i] = data.res;
                    }
                  }
                } else {
                  $scope.prepareWizard(data.res);
                  $scope.list();
                }
              }
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
              //$scope.changeView(1);
            } else if (data.error.code) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              if (data.error.code == "11000") {
                if (!$rootScope.production) {
                  $rootScope.showNotify("Oh No! ", data.error.message, "error");
                } else {
                  $rootScope.showNotify("Oh No! ", "El nombre del barco esta en uso", "error");
                }
              } else {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              }
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        }
      };

      $scope.validateTechnicalDetails = function () {
        if (isNaN(parseInt($scope.ship.technicalDetails.habitability.persons.day)) || parseInt($scope.ship.technicalDetails.habitability.persons.day) < 0) {
          return 1;
        }
        if (isNaN(parseInt($scope.ship.technicalDetails.habitability.persons.night)) || parseInt($scope.ship.technicalDetails.habitability.persons.night) < 0) {
          return 2;
        }
        if (isNaN(parseInt($scope.ship.technicalDetails.habitability.cabins)) || parseInt($scope.ship.technicalDetails.habitability.cabins) < 0) {
          return 3;
        }
        if (isNaN(parseInt($scope.ship.technicalDetails.habitability.baths)) || parseInt($scope.ship.technicalDetails.habitability.baths) < 0) {
          return 4;
        }

        if (isNaN(parseFloat($scope.ship.technicalDetails.measurements.dimension)) || parseInt($scope.ship.technicalDetails.measurements.dimension) < 0) {
          return 5;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.measurements.sleeve)) || parseInt($scope.ship.technicalDetails.measurements.sleeve) < 0) {
          return 6;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.measurements.draught)) || parseInt($scope.ship.technicalDetails.measurements.draught) < 0) {
          return 7;
        }

        if (isNaN(parseFloat($scope.ship.technicalDetails.engine.speed.max)) || parseInt($scope.ship.technicalDetails.engine.speed.max) < 0) {
          return 8;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.engine.speed.cruising)) || parseInt($scope.ship.technicalDetails.engine.speed.cruising) < 0) {
          return 9;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.engine.power)) || parseInt($scope.ship.technicalDetails.engine.power) < 0) {
          return 10;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.engine.consume)) || parseInt($scope.ship.technicalDetails.engine.consume) < 0) {
          return 11;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.deposits.freshwater)) || parseInt($scope.ship.technicalDetails.deposits.freshwater) < 0) {
          return 12;
        }
        if (isNaN(parseFloat($scope.ship.technicalDetails.deposits.combustible)) || parseInt($scope.ship.technicalDetails.deposits.combustible) < 0) {
          return 13;
        }
        return 0;
      };
      $scope.updateTechnicalDetails = function () {
        Ships.technicalDetails.update({
          id: $scope.ship._id,
          habitability: $scope.ship.technicalDetails.habitability,
          measurements: $scope.ship.technicalDetails.measurements,
          engine: $scope.ship.technicalDetails.engine,
          deposits: $scope.ship.technicalDetails.deposits
        }, function (data) {
          if (!data.error) {
            if ($scope.ship._id == data.res._id) {
              if (data.res.step == 8) {
                $scope.ship = data.res;
                for (var i = 0; i < $scope.ships.length; i++) {
                  if ($scope.ships[i]._id == data.res._id) {
                    $scope.ships[i] = data.res;
                  }
                }
              } else {
                $scope.prepareWizard(data.res);
                $scope.list();
              }
            }
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            //$scope.changeView(1);
          } else if (!$rootScope.production) {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.updateEquipments = function () {
        Ships.equipments.update({
          id: $scope.ship._id,
          equipments: $scope.ship.equipments
        }, function (data) {
          if (!data.error) {
            if ($scope.ship._id == data.res._id) {
              if (data.res.step == 8) {
                $scope.ship = data.res;
                for (var i = 0; i < $scope.ships.length; i++) {
                  if ($scope.ships[i]._id == data.res._id) {
                    $scope.ships[i] = data.res;
                  }
                }
              } else {
                $scope.prepareWizard(data.res);
                $scope.list();
              }
            }
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
          } else if (!$rootScope.production) {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      /*Equipments*/
      $scope.selectEquip = function (equipment, equip) {
        if ($scope.ship.equipments.length) {
          var flag = false;
          var flag1 = false;

          for (var i = 0; i < $scope.ship.equipments.length; i++) {
            if ($scope.ship.equipments[i].equipment == equipment) {
              flag = true;
              for (var j = 0; j < $scope.ship.equipments[i].items.length; j++) {
                if ($scope.ship.equipments[i].items[j] == equip) {
                  var flag1 = true;
                  break;
                }
              }
            }
          }

          if (flag) {
            if (flag1) {
              for (var i = 0; i < $scope.ship.equipments.length; i++) {
                if ($scope.ship.equipments[i].equipment == equipment) {
                  var array = [];
                  for (var j = 0; j < $scope.ship.equipments[i].items.length; j++) {
                    if ($scope.ship.equipments[i].items[j] != equip) {
                      array.push($scope.ship.equipments[i].items[j]);
                    }
                  }
                  $scope.ship.equipments[i].items = angular.copy(array);
                  break;
                }
              }
              return;
            } else {
              for (var i = 0; i < $scope.ship.equipments.length; i++) {
                if ($scope.ship.equipments[i].equipment == equipment) {
                  $scope.ship.equipments[i].items.push(equip);
                }
              }
              return;
            }
          }

        }
        var aux = {
          equipment: equipment,
          items: [equip],
          text: angular.copy($rootScope.prepareLanguagesTabs())
        };
        $scope.ship.equipments.push(aux);
        return;
      };
      $scope.existEquip = function (equipment, equip) {
        try {
          if ($scope.ship.equipments.length) {
            var flag = false;
            for (var i = 0; i < $scope.ship.equipments.length; i++) {
              if ($scope.ship.equipments[i].equipment == equipment) {
                for (var j = 0; j < $scope.ship.equipments[i].items.length; j++) {
                  if ($scope.ship.equipments[i].items[j] == equip) {
                    flag = true;
                    break;
                  }
                }
                if (flag) break;
              }
            }
            return flag;
          } else {
            return false;
          }
        } catch (err) {
          return false;
        }
      };
      $scope.updateEquipmentsTxt = function (equipment) {
        if ($scope.ship.equipments.length) {
          for (var i = 0; i < $scope.ship.equipments.length; i++) {
            if ($scope.ship.equipments[i].equipment == equipment._id) {
              $scope.ship.equipments[i].text = angular.copy(equipment.text);
            }
          }

        } else {
          var aux = {
            equipment: equipment._id,
            items: [],
            text: angular.copy(equipment.text)
          };
          $scope.ship.equipments.push(aux);
        }

      };
      /*Localization*/
      $scope.listLocalizations = function () {
        Localizations.get(function (data) {
          if (!data.error) {
            $scope.localizations = data.res;
            $scope.country = null;
            $scope.city = null;
            $scope.area = null;
            $scope.port = null;
          } else {
            if (data.error.code == 666) window.location = "/backoffice/login";
            $rootScope.showNotify("Oh No! ", data.error, "error");
          }
        });
      };
      $scope.showLocation = function () {
        $scope.stepEditNow = 3;
        $scope.map = false;
        $scope.showMap = false;
        $scope.showSelectLocation = $scope.ship.localization === null ? false : true;
        var myOptions, map, marker, infowindow;
        $scope.init_map = function () {
          myOptions = {
            zoom: 10,
            center: new google.maps.LatLng($scope.ship.localization.port.latitude, $scope.ship.localization.port.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          map = new google.maps.Map(document.getElementById("gmap_canvas"), myOptions);
          marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng($scope.ship.localization.port.latitude, $scope.ship.localization.port.longitude)
          });
          infowindow = new google.maps.InfoWindow({
            content: "<strong>" + $scope.ship.localization.port.name[0].value + "</strong><br>" + $scope.ship.localization.city.name[0].value + ", " + $scope.ship.localization.country.name[0].value + "<br>"
          });
          google.maps.event.addListener(marker, "click", function () {
            infowindow.open(map, marker);
          });
          infowindow.open(map, marker);
        };
        $scope.listLocalizations();
        $scope.portList = [];
        $scope.listPorts = function () {
          $scope.portList = [];
          if ($scope.city) {
            for (var i = 0; i < $scope.city.areas.length; i++) {
              for (var j = 0; j < $scope.city.areas[i].ports.length; j++) {
                $scope.portList.push($scope.city.areas[i].ports[j]);
              }
            }
          }
        };
        $scope.selectPort = function () {
          var aux = {
            country: {
              _id: $scope.country._id,
              name: $scope.country.name
            },
            city: {
              _id: $scope.city._id,
              name: $scope.city.name
            },
            area: {
              _id: $scope.area ? $scope.area._id : null,
              name: $scope.area ? $scope.area.name : null
            },
            port: {
              _id: $scope.port._id,
              name: $scope.port.name,
              latitude: $scope.port.latitude,
              longitude: $scope.port.longitude
            }
          };
          Ships.updateLocation.update({
            id: $scope.ship._id,
            localization: aux
          }, function (data) {
            if (!data.error) {
              if ($scope.ship._id == data.res._id) {
                if (data.res.step == 8) {
                  $scope.ship = data.res;
                  $scope.showSelectLocation = $scope.ship.localization === null ? false : true;
                  setTimeout(function () {
                    $("#gmap_canvas").empty();
                    setTimeout(function () {
                      $scope.init_map();
                    }, 500);
                  }, 500);
                } else {
                  $scope.prepareWizard(data.res);
                  $scope.list();
                }

              }
              $rootScope.showNotify("Acción Satisfactoria ", "Se han guardado los datos satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        };
        setTimeout(function () {
          $("#gmap_canvas").empty();
          setTimeout(function () {
            $scope.init_map();
          }, 500);
        }, 500);
      };
      /*Calendars*/

      $scope.nextYear = function () {
        $scope.year++;
        $scope.calendarsShow();
      };
      $scope.prevYear = function () {
        $scope.year--;
        $scope.calendarsShow();
      };

      $scope.fight = function () {
        $("#loadFont").empty();
        $("#loadFont").append("<i class=\"fa fa-spinner fa-spin\"></i>");
        // Don't start a new fight if we are already fighting
        // if (angular.isDefined(stop)) return;
        $interval(function () {
          if ($scope.whileLoadCalendar) {
            $scope.stopFight();
          }
        }, 100);
      };
      $scope.stopFight = function () {
        $("#loadFont").empty();
        $interval.cancel(stop);
        stop = undefined;
      };
      $scope.calendarsShow = function () {
        $scope.whileLoadCalendar = false;
        $scope.fight();

        $(".datepicker-list").empty();
        $scope.stepEditNow = 4;
        $scope.disables = [];
        $scope.daysData = [];
        $scope.seasonsDaysData = [];
        $scope.daysSeasonsClass = [];
        $scope.validateAddEvent = function (array, event) {
          var response = true;
          if (array.length) {
            for (var i = 0; i < array.length; i++) {
              var tmp = event._id || event.id;
              if (tmp != array[i]._id) {
                var start = new Date(array[i].start);
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate());

                var end = array[i].end ? new Date(array[i].end) : new Date(array[i].start);
                end = new Date(end.getFullYear(), end.getMonth(), end.getDate());

                if (array[i].allDay) {
                  end = new Date(end.getTime() + 86399999);
                }
                var eventEnd = event.end ? event.end : event.start;
                eventEnd = new Date(eventEnd);
                eventEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());

                if (event.allDay) {
                  eventEnd = new Date(eventEnd.getTime() + 86399999);
                  eventEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
                }

                var eventStart = event.start;
                eventStart = new Date(eventStart);
                eventStart = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
                if ($scope.matchAssetBlock(start, end, eventStart, eventEnd)) {
                  response = false;
                  break;
                }
              }
            }
          }
          return response;
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
        $scope.disableDays = function () {
          $scope.disableDaysR($scope.ship.locks);
        };
        $scope.disableDaysR = function (locks) {
          if (locks.length) {
            if (locks.length === 2) {
              left = locks.slice(0, 1);
              rigth = locks.slice(1, 2);
              $scope.disableDaysR(left);
              $scope.disableDaysR(rigth);
            }
            else {
              var pos = (parseInt(locks.length / 2) + locks.length % 2) - 1;
              if (pos) {
                var left = locks.slice(0, pos);
                var rigth = locks.slice(pos, locks.length - 1);
                return ($scope.disableDaysR(left) && $scope.disableDaysR(rigth));
              } else {
                var start = moment(locks[pos].start);
                var end = moment(locks[pos].end);
                var iter = angular.copy(start);
                while (iter <= end) {
                  var aux = new Date(iter);
                  var tmp = aux.getDate() + "/" + (aux.getMonth() + 1) + "/" + aux.getFullYear();
                  $scope.disables.push(tmp);
                  aux = {
                    title: locks[pos].title,
                    day: aux,
                    type: locks[pos].type
                  };
                  $scope.daysData.push(aux);
                  iter = iter.add(1, 'days');
                  iter = iter.hour(0);
                }
              }
            }
          }
        };
        $scope.seasonsDays = function () {
          $scope.seasonsDaysR($scope.ship.seasons);
          $scope.finishD = true;

        };
        $scope.seasonsDaysR = function (seasons) {
          var left, rigth, start, end;
          if (seasons.length) {
            if (seasons.length == 2) {
              left = seasons.slice(0, 1);
              rigth = seasons.slice(1, 2);
              $scope.seasonsDaysR(left);
              $scope.seasonsDaysR(rigth);
              return;
            } else {
              var pos = (parseInt(seasons.length / 2) + seasons.length % 2) - 1;
              if (pos) {
                left = seasons.slice(0, pos);
                rigth = seasons.slice(pos, seasons.length - 1);
                return ($scope.seasonsDaysR(left) && $scope.seasonsDaysR(rigth));
              } else {
                start = moment(seasons[pos].start).utcOffset($rootScope.timezone).unix() * 1000;
                end = moment(seasons[pos].end).utcOffset($rootScope.timezone).unix() * 1000;
                for (var j = start; j <= end; j += 86400000) {
                  var aux = {
                    title: seasons[pos].title,
                    day: new Date(j),
                    color: seasons[pos].color
                  };
                  $scope.seasonsDaysData.push(aux);
                }
              }
            }
          } else {
            return true;
          }
        };
        $scope.prepareDatePickers = function () {
          for (var i = 1; i <= 12; i++) {
            $(".datepicker-list").append(" <div class=\"col-xs-12 col-sm-6 col-lg-4\" id=\"sandbox-container-" + i + "\"><div></div></div>");
            var old_month = i + 1;
            var old_day = 0;
            if (i == 12) {
              old_month = i;
              old_day = 31;
            }

            angular.element("#sandbox-container-" + i + " div").datepicker({
              language: "es",
              daysOfWeekHighlighted: "0,6",
              todayHighlight: true,
              defaultViewDate: {
                year: $scope.year,
                month: i,
                day: 0
              },
              maxViewMode: 0,
              keyboardNavigation: false,
              startDate: "01/" + i + "/" + $scope.year, //day/month/year
              endDate: old_day + "/" + old_month + "/" + $scope.year,
              datesDisabled: $scope.disables,
              beforeShowDay: function (date) {
                date = new Date(date).getTime();
                var res = {
                  tooltip: "",
                  classes: "block"
                };
                for (var i = 0; i < $scope.seasonsDaysData.length; i++) {
                  var aux = new Date($scope.seasonsDaysData[i].day);
                  aux = new Date(aux.getFullYear(), aux.getMonth(), aux.getDate());
                  if (date == aux.getTime()) {
                    var color = $scope.seasonsDaysData[i].color.replace("#", "");
                    $scope.daysSeasonsClass.push({
                      color: $scope.seasonsDaysData[i].color,
                      className: "." + color
                    });
                    res.tooltip = "Temporada : " + $scope.seasonsDaysData[i].title;
                    res.classes = color;
                    break;
                  }
                }
                for (var i = 0; i < $scope.daysData.length; i++) {
                  var aux = new Date($scope.daysData[i].day);
                  if (date === aux.getTime()) {
                    var type = $scope.daysData[i].type === 'booked' ? "Reservado" : "Bloqueado";
                    res.tooltip = type +": "+ $scope.daysData[i].title;
                    res.classes += " " + $scope.daysData[i].type;
                    break;
                  }
                }


                return res;
              }
            });
          }
        };
        $scope.paintDays = function () {
          for (var i = 0; i < $scope.daysSeasonsClass.length; i++) {
            angular.element($scope.daysSeasonsClass[i].className).css("background", $scope.daysSeasonsClass[i].color);
            angular.element($scope.daysSeasonsClass[i].className).css("color", "#FFFFFF");
          }

        };
        $scope.initializeEvent = function () {
          $scope.showAddEvent = false;
          var auxDate = new Date($rootScope.globalToday);
          $scope.event = {
            title: "",
            start: auxDate,
            end: new Date(auxDate.getTime() + 86400000)
          };
          $(".reservation").empty();
          var text = $filter("date")($scope.event.start, "MM/dd/yyyy", $rootScope.timezone) + " - " + $filter("date")($scope.event.end, "MM/dd/yyyy", $rootScope.timezone);
          angular.element(".reservation").val(text);
        };
        $scope.showAddForm = function (type) {
          if (type == "event") {
            $scope.showAddEvent = true;
            $scope.showAddSeason = false;
          } else if (type == "season") {
            $scope.initializeSeason();
            $scope.flagEditSeason = false;
            $scope.showAddEvent = false;
            $scope.showAddSeason = true;
          } else {
            $scope.showAddEvent = false;
            $scope.showAddSeason = false;
          }
        };
        $scope.initializeSeason = function () {
          $scope.showAddSeason = false;

          $scope.experiencesTariff = [];
          for (var i = 0; i < $scope.experiences.length; i++) {
            var experience = {
              _id: $scope.experiences[i]._id,
              active: false,
              name: $scope.experiences[i].name,
              description: $scope.experiences[i].description,
              durations: []
            };
            for (var j = 0; j < $scope.durations.length; j++) {
              var t = {
                name: $scope.durations[j].name[0].value,
                duration: $scope.durations[j]._id,
                price: 0,
                disable: true
              };
              experience.durations.push(t);
            }
            $scope.experiencesTariff.push(experience);
          }

          var auxDate = new Date($rootScope.globalToday);

          $scope.season = {
            title: "",
            color: "#e01ab5",
            start: auxDate,
            end: new Date(auxDate.getTime() + 86400000),
            experiences: []
          };

          $(".from-to").empty();
          var text = $filter("date")($scope.season.start, "MM/dd/yyyy", $rootScope.timezone) + " - " + $filter("date")($scope.season.end, "MM/dd/yyyy", $rootScope.timezone);
          angular.element(".from-to").val(text);

          $scope.finishS = true;

        };
        $scope.removePrice = function (xp, dur) {
          for (var i = 0; i < $scope.experiencesTariff.length; i++) {
            if ($scope.experiencesTariff[i]._id === xp._id) {
              for (var j = 0; j < $scope.experiencesTariff[i].durations.length; j++) {
                if ($scope.experiencesTariff[i].durations[j].duration === dur.duration) {
                  $scope.experiencesTariff[i].durations[j].disable = true;
                }
              }
              if ($scope.flagEditSeason) {
                for (var k = 0; k < $scope.season.experiences.length; k++) {
                  if ($scope.season.experiences[k]._id === xp._id) {
                    $scope.season.experiences[k] = angular.copy($scope.experiencesTariff[i]);
                    break;
                  }
                }
              }
            }
          }
        };
        $scope.addPrice = function (xp, dur) {
          for (var i = 0; i < $scope.experiencesTariff.length; i++) {
            if ($scope.experiencesTariff[i]._id === xp._id) {
              for (var j = 0; j < $scope.experiencesTariff[i].durations.length; j++) {
                if ($scope.experiencesTariff[i].durations[j].duration === dur.duration) {
                  $scope.experiencesTariff[i].durations[j].disable = false;
                }
              }
              if ($scope.flagEditSeason) {
                for (var k = 0; k < $scope.season.experiences.length; k++) {
                  if ($scope.season.experiences[k]._id === xp._id) {
                    $scope.season.experiences[k] = angular.copy($scope.experiencesTariff[i]);
                    break;
                  }
                }
              }
            }


          }
        };
        $scope.delExperiencesTariff = function (experience) {
          for (var i = 0; i < $scope.experiencesTariff.length; i++) {
            if ($scope.experiencesTariff[i]._id == experience._id) {
              $scope.experiencesTariff[i].active = false;
              break;
            }
          }
          var aux = [];
          for (var i = 0; i < $scope.season.experiences.length; i++) {
            if ($scope.season.experiences[i]._id != experience._id) {
              aux.push($scope.season.experiences[i]);
            }
          }
          $scope.season.experiences = angular.copy(aux);
        };
        $scope.addExperiencesTariff = function (experience) {
          for (var i = 0; i < $scope.experiencesTariff.length; i++) {
            if ($scope.experiencesTariff[i]._id == experience._id) {
              $scope.experiencesTariff[i].active = true;
              break;
            }
          }
          $scope.season.experiences.push(experience);
        };
        $scope.selExperience = function (experience) {
          $scope.experience = angular.copy(experience);
        };
        $(".from-to").daterangepicker({
          opens: "left",
          format: "MM/dd/yyyy"
        }, function (start, end, label) {
          $("#showNotyErrorSeason").hide();
          var aux = {
            start: new Date(start),
            end: new Date(end)
          };
          var seasons = [];
          for (var i = 0; i < $scope.ship.seasons.length; i++) {
            var tmp = {
              start: new Date($scope.ship.seasons[i].start),
              end: new Date($scope.ship.seasons[i].end)
            };
            seasons.push(tmp);
          }


          if ($scope.validateAddEvent(seasons, aux) || $scope.flagEditSeason) {
            $scope.$apply(function () {
              $scope.season.start = start.toISOString();
              $scope.season.end = end.toISOString();
            });
            $scope.showNotyErrorSeason = false;
          } else {
            $("#showNotyErrorSeason").show();
          }
        });
        angular.element(".demo2").colorpicker({
          align: "right"
        }).on('changeColor', function (e) {
          $scope.season.color = angular.element(".iso-sc1").val();
        });


        angular.element(".demo21").colorpicker({
          align: "right"
        }).on('changeColor', function (e) {
          $scope.season.color = angular.element(".iso-sc2").val();
        });


        // angular.element(".demo2").click(function () {
        //   $scope.$apply(function () {
        //     $scope.season.color = angular.element(".iso-sc1").val();
        //   });
        // });


        $scope.showNotyErrorEvent = false;
        //locks
        function startLocks(begin, final) {
          $(".start-lock").daterangepicker({
              singleDatePicker: true,
              startDate: begin,
              calender_style: "picker_4",
              locale: {
                "format": "MM/DD/YYYY",
                "daysOfWeek": [
                  "Do",
                  "Lu",
                  "Ma",
                  "Mi",
                  "Ju",
                  "Vi",
                  "Sa",
                ],
                "monthNames": [
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic"
                ],
                "firstDay": 1
              }
            },
            function (start) {
              $("#showNotyErrorEvent").hide();
              $scope.event.start = start.toDate();
              if ($scope.event.start > $scope.event.end) {
                $("#showNotyErrorEvent").show();
              }
            });
          $(".end-lock").daterangepicker({
              singleDatePicker: true,
              startDate: final,
              calender_style: "picker_4",
              locale: {
                "format": "MM/DD/YYYY",
                "daysOfWeek": [
                  "Do",
                  "Lu",
                  "Ma",
                  "Mi",
                  "Ju",
                  "Vi",
                  "Sa",
                ],
                "monthNames": [
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic"
                ],
                "firstDay": 1
              }
            },
            function (start) {
              $("#showNotyErrorEvent").hide();
              $scope.event.end = start.toDate();
              if ($scope.event.start > $scope.event.end) {
                $("#showNotyErrorEvent").show();
              }
            }
          );
        }

        //seasons
        function startSeasons(begin, final) {
          $(".start-season").daterangepicker({
              singleDatePicker: true,
              //format: "MM/dd/yyyy",
              startDate: begin,
              calender_style: "picker_4",
              locale: {
                "format": "MM/DD/YYYY",
                "daysOfWeek": [
                  "Do",
                  "Lu",
                  "Ma",
                  "Mi",
                  "Ju",
                  "Vi",
                  "Sa",
                ],
                "monthNames": [
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic"
                ],
                "firstDay": 1
              }
            },
            function (start) {
              $("#showNotyErrorSeason").hide();
              $scope.season.start = start.toDate();
              if ($scope.season.start > $scope.season.end) {
                $("#showNotyErrorSeason").show();
              }
            });
          $(".end-season").daterangepicker({
              singleDatePicker: true,
              startDate: final,
              calender_style: "picker_4",
              locale: {
                "format": "MM/DD/YYYY",
                "daysOfWeek": [
                  "Do",
                  "Lu",
                  "Ma",
                  "Mi",
                  "Ju",
                  "Vi",
                  "Sa",
                ],
                "monthNames": [
                  "Ene",
                  "Feb",
                  "Mar",
                  "Abr",
                  "May",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dic"
                ],
                "firstDay": 1
              }
            },
            function (start) {
              $("#showNotyErrorSeason").hide();
              $scope.season.end = start.toDate();
              if ($scope.season.start > $scope.season.end) {
                $("#showNotyErrorSeason").show();
              }
            }
          );
        }

        $scope.prepareCalendar = function () {
          var temp1 = $filter("date")($scope.today, "MM/dd/yyyy", $rootScope.timezone);
          var temp2 = $filter("date")($scope.tomorrow, "MM/dd/yyyy", $rootScope.timezone);
          angular.element(".start-lock").val(temp1);
          angular.element(".end-lock").val(temp2);
          angular.element(".start-season").val(temp1);
          angular.element(".end-season").val(temp2);
          $scope.start_lock = $scope.today, $scope.start_season = $scope.today;
          $scope.end_lock = $scope.tomorrow, $scope.end_season = $scope.tomorrow;
          startLocks($scope.start_lock, $scope.tomorrow);
          startSeasons($scope.start_season, $scope.end_season);
        };
        $scope.prepareCalendar();
        $scope.flagEditEvent = false;
        $scope.addEvent = function () {
          if ($scope.ship.locks.length && !$scope.validateAddEvent($scope.ship.locks, $scope.event)) {
            $("#showNotyErrorEvent").show();
          } else if (!$scope.event.title || ($scope.event.start === null) || ($scope.event.end === null)) {
            $("#showNotyErrorEvent").show();
          } else if ($scope.event.start > $scope.event.end) {
            $("#showNotyErrorEvent").show();
          } else {
            var event = {
              title: $scope.event.title,
              start: {
                year: (new Date($scope.event.start)).getFullYear(),
                month: (new Date($scope.event.start)).getMonth(),
                day: (new Date($scope.event.start)).getDate()
              },
              end: {
                year: (new Date($scope.event.end)).getFullYear(),
                month: (new Date($scope.event.end)).getMonth(),
                day: (new Date($scope.event.end)).getDate()
              }
            };
            Ships.event.create({
              id: $scope.ship._id,
              event: event
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  if (data.res.step == 8) {
                    $scope.ship = data.res;
                    $scope.today = new Date($rootScope.globalToday);
                    $scope.year = $scope.today.getFullYear();
                    $scope.calendarsShow();
                    $scope.showAddForm("event");
                  } else {
                    $scope.prepareWizard(data.res);
                    $scope.list();
                  }
                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado el Evento satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al crear sus datos", "error");
              }
            });
          }
        };
        $scope.selectEvent = function (event) {
          $scope.event = angular.copy(event);
          var aux;
          if ($scope.event.type == "booked") {
            if (!$scope.event.offer.finish) {
              var secondPayment = $scope.event.offer.secondPayment;
              if (secondPayment == "3") {
                aux = 2 * 7 * 86400000;
              }
              if (secondPayment == "4") {
                aux = 7 * 86400000;
              }
              var tmp = new Date($scope.event.offer.bookDate).getTime();
              $scope.point = new Date(tmp - aux);
              var today = new Date($rootScope.globalToday);
              $scope.countPayment = ($scope.point.getTime() - today.getTime()) / 86400000;
            }

            $scope.event.motive = "0";
          }


        };
        $scope.showEditEvent = function (event) {
          $scope.event = angular.copy(event);
          var temp1 = $filter("date")(event.start, "MM/dd/yyyy", $rootScope.timezone);
          var temp2 = $filter("date")(event.end, "MM/dd/yyyy", $rootScope.timezone);
          angular.element(".start-lock").val(temp1);
          angular.element(".end-lock").val(temp2);
          startLocks(new Date(event.start), new Date(event.end));
          $scope.flagEditEvent = true;
        };
        $scope.updateEvent = function () {
          if ($scope.ship.locks.length && !$scope.validateAddEvent($scope.ship.locks, $scope.event)) {
            $("#showNotyErrorEvent").show();
          } else if ($scope.event.start > $scope.event.end) {
            $("#showNotyErrorEvent").show();
          } else if (!$scope.event.title || ($scope.event.start === null) || ($scope.event.end === null)) {
            $("#showNotyErrorEvent").show();
          } else {
            var event = {
              id: $scope.event._id,
              title: $scope.event.title,
              start: {
                year: (new Date($scope.event.start)).getFullYear(),
                month: (new Date($scope.event.start)).getMonth(),
                day: (new Date($scope.event.start)).getDate()
              },
              end: {
                year: (new Date($scope.event.end)).getFullYear(),
                month: (new Date($scope.event.end)).getMonth(),
                day: (new Date($scope.event.end)).getDate()
              }
            };
            Ships.event.update({
              id: $scope.ship._id,
              event: event
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id === data.res._id) {
                  if (data.res.step === 8) {
                    $scope.ship = data.res;
                    $scope.today = new Date($rootScope.globalToday);
                    $scope.year = $scope.today.getFullYear();


                    $scope.event.title = data.event.title;
                    $scope.event.start = data.event.start;
                    $scope.event.end = data.event.end;

                    $scope.calendarsShow();
                    $scope.showAddForm("event");
                  } else {
                    $scope.prepareWizard(data.res);
                    $scope.list();
                  }


                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el Evento satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al crear sus datos", "error");
              }
            });
          }

        };
        $scope.removeEvent = function () {
          if (!$scope.event.title || ($scope.event.start === null) || ($scope.event.end === null)) {
            $("#showNotyErrorEvent").show();
          } else {
            Ships.event.remove({
              id: $scope.ship._id,
              event: $scope.event
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  if (data.res.step == 8) {
                    $scope.ship = data.res;
                    $scope.today = new Date($rootScope.globalToday);
                    $scope.year = $scope.today.getFullYear();
                    $scope.calendarsShow();
                    $scope.showAddForm("event");
                  } else {
                    $scope.prepareWizard(data.res);
                    $scope.list();
                  }


                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado el Evento satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          }
        };
        $scope.flagEditSeason = false;
        $scope.validateSeasonPriceValidate = function (i, j) {
          if (isNaN(parseFloat($scope.season.experiences[i].durations[j].price)) || parseFloat($scope.season.experiences[i].durations[j].price) < 1) {
            return false;
          }
          return true;
        };
        $scope.validateSeason = function () {
          if (!$scope.season || !$scope.season.title.length) {
            return false;
          }
          if (!$scope.season.color.length) {
            return false;
          }
          var aux = {
            start: new Date($scope.season.start),
            end: new Date($scope.season.end)
          };

          if ($scope.flagEditSeason) {
            aux.id = $scope.season._id;
          }

          if (!$scope.validateAddEvent($scope.ship.seasons, aux)) {
            return false;
          }
          if (!$scope.season.experiences.length) {
            return false;
          }
          for (var i = 0; i < $scope.season.experiences.length; i++) {
            var cont = 0;
            for (var j = 0; j < $scope.season.experiences[i].durations.length; j++) {

              if (!$scope.season.experiences[i].durations[j].disable) {
                if (isNaN(parseFloat($scope.season.experiences[i].durations[j].price)) || parseFloat($scope.season.experiences[i].durations[j].price) < 1) {
                  $scope.seasonPriceValidate[i, j] = false;
                  return false;
                }
                $scope.seasonPriceValidate[i, j] = true;
              } else {
                cont++;
              }
              if (cont >= $scope.season.experiences[i].durations.length) {
                return false;
              }
            }
          }
          return true;
        };
        $scope.showEditSeason = function (season) {
          $scope.season = angular.copy(season);
          var temp1 = $filter("date")(season.start, "MM/dd/yyyy", $rootScope.timezone);
          var temp2 = $filter("date")(season.end, "MM/dd/yyyy", $rootScope.timezone);
          angular.element(".start-season").val(temp1);
          angular.element(".end-season").val(temp2);
          // var text = $filter("date")(season.start, "MM/dd/yyyy") + " - " + $filter("date")(season.end, "MM/dd/yyyy");
          // angular.element(".from-to").val(text);
          startSeasons(new Date(season.start), new Date(season.end));

          for (var j = 0; j < $scope.season.experiences.length; j++) {
            for (var i = 0; i < $scope.experiencesTariff.length; i++) {
              if ($scope.experiencesTariff[i]._id === $scope.season.experiences[j].experience) {
                $scope.experiencesTariff[i].active = true;
                //$scope.experiencesTariff[i].durations = $scope.season.experiences[j].durations;

                for (var k = 0; k < $scope.experiencesTariff[i].durations.length; k++) {
                  for (var l = 0; l < $scope.durations.length; l++) {
                    if ($scope.durations[l]._id === $scope.experiencesTariff[i].durations[k].duration) {
                      $scope.experiencesTariff[i].durations[k].name = $scope.durations[l].name;
                    }
                  }
                }

                for (var k = 0; k < $scope.experiencesTariff[i].durations.length; k++) {
                  for (var l = 0; l < $scope.durations.length; l++) {
                    if ($scope.durations[l]._id === $scope.experiencesTariff[i].durations[k].duration) {
                      $scope.experiencesTariff[i].durations[k].name = $scope.durations[l].name;
                    }
                  }
                }

                for (var k = 0; k < $scope.experiencesTariff[i].durations.length; k++) {
                  for (var l = 0; l < $scope.season.experiences[j].durations.length; l++) {
                    if ($scope.experiencesTariff[i].durations[k].duration == $scope.season.experiences[j].durations[l].duration) {
                      $scope.experiencesTariff[i].durations[k].price = $scope.season.experiences[j].durations[l].price;
                      $scope.experiencesTariff[i].durations[k].disable = false;
                    }
                  }
                }
                $scope.season.experiences[j] = angular.copy($scope.experiencesTariff[i]);
              }
            }
          }
          $scope.flagEditSeason = true;
        };
        $scope.addSeason = function () {
          if (!$scope.validateSeason()) {
            $("#showNotyErrorSeason").show();
          } else if ($scope.season.start > $scope.season.end) {
            $("#showNotyErrorSeason").show();
          } else {
            $scope.season.start = {
              year: new Date($scope.season.start).getFullYear(),
              month: new Date($scope.season.start).getMonth(),
              day: new Date($scope.season.start).getDate()
            };
            $scope.season.end = {
              year: new Date($scope.season.end).getFullYear(),
              month: new Date($scope.season.end).getMonth(),
              day: new Date($scope.season.end).getDate()
            };
            Ships.season.create({
              id: $scope.ship._id,
              season: $scope.season
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  $scope.ship = data.res;
                  $scope.today = new Date($rootScope.globalToday);
                  $scope.year = $scope.today.getFullYear();
                  $scope.calendarsShow();
                  $scope.showAddForm("season");
                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado la Temporada satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          }
        };
        $scope.updateSeason = function () {
          if (!$scope.validateSeason()) {
            $("#showNotyErrorSeason").show();
          } else if ($scope.season.start > $scope.season.end) {
            $("#showNotyErrorSeason").show();
          } else {
            $scope.season.start = {
              year: new Date($scope.season.start).getFullYear(),
              month: new Date($scope.season.start).getMonth(),
              day: new Date($scope.season.start).getDate()
            };
            $scope.season.end = {
              year: new Date($scope.season.end).getFullYear(),
              month: new Date($scope.season.end).getMonth(),
              day: new Date($scope.season.end).getDate()
            };
            Ships.season.update({
              id: $scope.ship._id,
              season: $scope.season
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  $scope.ship = data.res;
                  $scope.today = new Date($rootScope.globalToday);
                  $scope.year = $scope.today.getFullYear();
                  $scope.calendarsShow();
                  $scope.showAddForm("season");
                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado la Temporada satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          }
        };
        $scope.selectSeason = function (sea) {
          $scope.season = angular.copy(sea);
        };
        $scope.removeSeason = function () {
          Ships.season.remove({
            id: $scope.ship._id,
            season: $scope.season
          }, function (data) {
            if (!data.error) {
              if ($scope.ship._id == data.res._id) {
                $scope.ship = data.res;
                $scope.today = new Date($rootScope.globalToday);
                $scope.year = $scope.today.getFullYear();
                $scope.calendarsShow();
                $scope.showAddForm("season");
              }
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado la Temporada satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
            }
          });
        };
        $scope.flagEditSeason = false;
        $scope.showAddEvent = false;
        $scope.showAddSeason = true;
        setTimeout(function () {
          $scope.disableDays();
          $scope.seasonsDays();
          $scope.prepareDatePickers();
          $scope.paintDays();
          $scope.initializeSeason();
          $scope.initializeEvent();
          $scope.showAddSeason = true;
          $scope.whileLoadCalendar = true;
        }, 200);
      };

      $scope.conditionsShow = function () {


        $scope.stepEditNow = 5;
        $scope.editCon = false;
        $scope.prepareLanguagesConditions = function (list) {
          var aux = $rootScope.prepareLanguagesTabs();
          for (var i = 0; i < list.length; i++) {
            if (list[i].text.length < aux.length) {
              for (var k = 0; k < aux.length; k++) {
                var exist = false;
                for (var l = 0; l < list[i].text.length; l++) {
                  if (aux[k]._id == list[i].text[l].language) {
                    exist = true;
                    break;
                  }
                }
                if (!exist) {
                  list[i].text.push({
                    language: aux[k]._id,
                    value: aux[k].name
                  });
                }
              }
            }

          }
          return list;
        };
        sortDuration();
        $scope.validateConditions = function () {
          if (!angular.isNumber(parseFloat($scope.conditions.bail)) || parseFloat($scope.conditions.bail) < 0) {
            return false;
          }
          $scope.conditionsPatronError = [];
          // for (var x = 0; x < $scope.conditions.patron.length; x++) {
          //   $scope.conditionsPatronError.push({show:false,error:false});
          // }
          // for (var i = 0; i < $scope.conditions.patron.length; i++) {
          //   for (var j = 0; j < $scope.ship.seasons.length; j++) {
          //     for (var k = 0; k < $scope.ship.seasons[j].experiences.length; k++) {
          //       for (var l = 0; l < $scope.ship.seasons[j].experiences[k].durations.length; l++) {
          //         if ($scope.ship.seasons[j].experiences[k].durations[l].duration == $scope.conditions.patron[i].duration) {
          //           $scope.conditionsPatronError[i].show = true;
          //
          //           var priceNum = parseFloat($scope.conditions.patron[i].price);
          //           if (!angular.isNumber(parseFloat($scope.conditions.patron[i].price)) || parseFloat($scope.conditions.patron[i].price) < 0) {
          //             $scope.conditionsPatronError[i].error = true;
          //             return false;
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          for (var i = 0; i < $scope.conditions.text.length; i++) {
            if (!$scope.conditions.text[i].value.length) {
              return false;
            }
          }
          if (isNaN(parseInt($scope.conditions.weekRentals.checkIn.day)) || parseInt($scope.conditions.weekRentals.checkIn.day) < 0) {
            return false;
          }
          if (isNaN(parseInt($scope.conditions.weekRentals.checkIn.hour)) || parseInt($scope.conditions.weekRentals.checkIn.hour) < 0) {
            return false;
          }
          if (isNaN(parseInt($scope.conditions.weekRentals.checkOut.day)) || parseInt($scope.conditions.weekRentals.checkOut.day) < 0) {
            return false;
          }
          if (isNaN(parseInt($scope.conditions.weekRentals.checkOut.hour)) || parseInt($scope.conditions.weekRentals.checkOut.hour) < 0) {
            return false;
          }
          if (isNaN(parseInt($scope.conditions.dayRentals.checkIn.hour)) || parseInt($scope.conditions.dayRentals.checkIn.hour) < 0) {
            return false;
          }
          if (isNaN(parseInt($scope.conditions.dayRentals.checkOut.hour)) || parseInt($scope.conditions.dayRentals.checkOut.hour) < 0) {
            return false;
          }
          return true;
        };
        $scope.initializeConditions = function () {
          $scope.extra = {
            extra: "",
            import: null,
            period: "",
            calculationBase: "",
            obligatory: "1",
            included: "0",
            payAt: ""
          };
          var aux = $rootScope.prepareLanguagesTabs();
          var tmp = [];
          for (var i = 0; i < $scope.durations.length; i++) {
            var k = {
              name: $scope.durations[i].name[0].value,
              duration: $scope.durations[i]._id,
              price: $filter("number")(0, 2)
            };
            tmp.push(k);
          }
          if (!$scope.ship.conditions.bail) {
            $scope.conditions = {
              bail: $filter("number")(0, 2),
              bailOptions: {
                transfer: false,
                visa: false,
                cash: false,
                masterCard: false,
                cheque: false,
                americanExpress: false,
                euroCard: false,
              },
              patron: tmp,
              secondPayment: "0",
              refund: "0",
              basePort: "0",
              sleepBasePort: "0",
              weekRentals: {
                checkIn: {
                  day: "",
                  hour: ""
                },
                checkOut: {
                  day: "",
                  hour: ""
                }
              },
              dayRentals: {
                checkIn: {
                  hour: ""
                },
                checkOut: {
                  hour: ""
                }
              },
              text: "" //angular.copy(aux)
            };
          } else {
            $scope.editCon = true;
            for (var i = 0; i < tmp.length; i++) {
              for (var j = 0; j < $scope.ship.conditions.patron.length; j++) {
                if (tmp[i].duration == $scope.ship.conditions.patron[j].duration) {
                  $scope.ship.conditions.patron[j].name = tmp[i].name;
                  break;
                }
              }
            }
            $scope.conditions = $scope.prepareLanguagesConditions($scope.ship.conditions);
            $scope.conditions.extras = $scope.conditions.extras || [];
          }
          if ($scope.ship.conditions.text.length < aux.length) {
            for (var k = 0; k < aux.length; k++) {
              var exist = false;
              for (var l = 0; l < $scope.ship.conditions.text.length; l++) {
                if (aux[k]._id == $scope.ship.conditions.text[l].language) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                $scope.ship.conditions.text.push({
                  language: aux[k]._id,
                  value: aux[k].name
                });
              }
            }
          }
          if (tmp.length == $scope.conditions.patron.length) {
            var change = false;
            for (var i = 0; i < tmp.length; i++) {

              if (tmp[i].duration != $scope.conditions.patron[i].duration) {
                change = true;
                break;
              }
            }
            if (change) {
              $scope.conditions.patron = tmp;
            }
          } else {
            var auxArray = angular.copy($scope.conditions.patron);
            for (var i = 0; i < tmp.length; i++) {
              var change = true;
              for (var j = 0; j < $scope.conditions.patron.length; j++) {
                if (tmp[i].duration == $scope.conditions.patron[i].duration) {
                  change = false;
                  break;
                }
              }
              if (change) {
                auxArray.push(tmp[i]);
              }
            }

            $scope.conditions.patron = angular.copy(auxArray);
          }
          $scope.days = [];
          for (var i = 1; i <= 6; i++) {
            $scope.days.push(i);
          }
          $scope.weeks = [];
          for (var i = 1; i <= 52; i++) {
            $scope.weeks.push(i);
          }
          $scope.months = [];
          for (var i = 1; i <= 12; i++) {
            $scope.months.push(i);
          }

        };
        $scope.initializeConditions();

        $scope.formatNumber = function (number) {
          number = $rootScope.replaceAll(number, " ", "");
          number = $rootScope.replaceAll(number, "€", "");
          number = $rootScope.replaceAll(number, "_", "");
          number = $rootScope.replaceAll(number, ".", "");
          number = $rootScope.replaceAll(number, ",", ".");
          number = $filter("number")(parseFloat(number), 2);
          return number;
        };
        $scope.saveConditions = function () {
          $scope.conditions.bail = $scope.formatNumber($scope.conditions.bail);
          angular.forEach($scope.conditions.patron, function (patron) {
            patron.price = $scope.formatNumber(patron.price);
          });

          if ($scope.validateConditions()) {
            if ($scope.editCon) {
              for (var i = 0; i < $scope.conditions.text.length; i++) {
                var aux = {
                  _id: $scope.conditions.text[i].language,
                  value: $scope.conditions.text[i].value
                };
                $scope.conditions.text[i] = aux;
              }
            }


            Ships.conditions.create({
              id: $scope.ship._id,
              conditions: $scope.conditions
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  if (data.res.step == 8) {
                    $scope.ship = data.res;
                    $scope.conditionsShow();
                  } else {
                    $scope.prepareWizard(data.res);
                    $scope.list();
                  }
                }
                $rootScope.showNotify("Acción Satisfactoria ", "Se han realizados los cambios satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          }
        };

        $scope.addExtra = function () {
          if ($scope.validateExtra($scope.extra)) {
            $scope.extra.import = angular.copy(parseFloat($scope.extra.import));
            $scope.ship.conditions.extras.push($scope.extra);
            $scope.extra = {
              extra: "",
              name: "",
              import: null,
              period: "",
              calculationBase: "",
              obligatory: "1",
              included: "0",
              payAt: ""
            };
          }


        };
        $scope.delExtra = function (index) {
          var array = [];
          for (var i = 0; i < $scope.ship.conditions.extras.length; i++) {
            if (i != index) {
              array.push($scope.ship.conditions.extras[i]);
            }
          }
          $scope.ship.conditions.extras = angular.copy(array);
        };
        $scope.validateAddExtra = function () {
          return $scope.validateExtra($scope.extra);
        };
        $scope.validateExtra = function (ex) {
          var extra = angular.copy(ex);
          if (extra.extra != "1") {
            if (extra.extra = "") {
              return false;
            }
            if (isNaN(parseInt(extra.import)) || parseInt(extra.import) < 0) {
              return false;
            }
            if (extra.calculationBase = "") {
              return false;
            }
            if (extra.period = "") {
              return false;
            }
            if (extra.payAt = "") {
              return false;
            }
          }
          return true;
        };
      };
      $scope.photosShow = function () {
        $scope.stepEditNow = 6;
        $scope.fileChanged = function (e) {

          $scope.files = e.target.files;

          var fileReader = new FileReader();
          fileReader.readAsDataURL($scope.files[0]);

          fileReader.onload = function (e) {
            $scope.imgSrc = this.result;
            $scope.$apply();
          };

        };
        $scope.clear = function () {
          $scope.imageCropStep = 1;
          delete $scope.imgSrc;
          delete $scope.result;
          delete $scope.resultBlob;
        };


        $scope.modelPhoto = {
          res: null,
          error: null
        };
        $scope.imgsWizzard();
        $scope.$watch("modelPhoto", function (newValue, oldValue) {
          if (!(newValue === oldValue)) {
            if (!newValue.error && newValue.res) {
              if ($scope.ship._id == newValue.res._id) {
                $scope.ship = angular.copy(newValue.res);
                fixPics();
                $scope.photosShow();
              }
              $scope.clear();
            }
            // else if (!$rootScope.production) {
            //   if (newValue.error) {
            //     if (newValue.error && newValue.error.code) {
            //       if (newValue.error && newValue.error.code == 666) window.location = "/backoffice/login";
            //     }
            //     $rootScope.showNotify("Oh No! ", newValue.error.message, "error");
            //   }
            //
            // } else {
            //   if (newValue.error && newValue.error.code == 666) window.location = "/backoffice/login";
            //   $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            // }
          }
        });

        $scope.addPhotos = function () {
          var file = {
            data: $scope.result,
            contentType: $scope.files[0].type,
            fieldName: $scope.files[0].name,
            name: $scope.files[0].name,
          };
          $upload.upload({
            url: "/service/ships/photos", //upload.php script, node.js route, or servlet url
            method: "POST",
            headers: {
              "header-key": "multipart/form-data"
            },
            data: {
              id: $scope.ship._id,
              file: file
            }
          }).success(function (data) {
            if (!data.error) {
              if ($scope.ship._id == data.res._id) {
                if (data.res.step == 8) {
                  $scope.ship = angular.copy(data.res);
                  $scope.$digest();
                  fixPics();
                  $scope.photosShow();
                } else {
                  $scope.prepareWizard(data.res);
                  $scope.list();
                  if ($scope.contetShow == 3)
                    $scope.imgsWizzard();
                }

              }
              $scope.clear();
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado la Foto satisfactoriamente", "success");
              //$scope.changeView(1);
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        };
        $scope.delPhotos = function (photo) {
          if ($scope.ship._id && photo) {
            Ships.photos.remove({
              id: $scope.ship._id,
              photo: photo
            }, function (data) {
              if (!data.error) {
                if ($scope.ship._id == data.res._id) {
                  $scope.ship = angular.copy(data.res);
                  fixPics();
                  $scope.photosShow();

                }
                $scope.clear();
                $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado la  Foto satisfactoriamente", "success");
                //$scope.changeView(1);
              } else if (!$rootScope.production) {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                if (data.error.code == 666) window.location = "/backoffice/login";
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
              }
            });
          }

        };
        $scope.setStatusPhotos = function (photo) {
          Ships.photos.status({
            id: $scope.ship._id,
            photo: photo._id
          }, function (data) {
            if (!data.error) {
              if ($scope.ship._id == data.res._id) {
                if (data.res.step == 8) {
                  $scope.ship = angular.copy(data.res);
                  //$scope.$digest();
                  fixPics();
                  $scope.photosShow();
                } else {
                  $scope.prepareWizard(data.res);
                  $scope.list();
                }

              }
              $scope.clear();
              $rootScope.showNotify("Acción Satisfactoria ", "Se han guardado los cambios satisfactoriamente", "success");
              //$scope.changeView(1);
              //loadAsper();
            } else if (!$rootScope.production) {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              if (data.error.code == 666) window.location = "/backoffice/login";
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", "error");
            }
          });
        };
        $scope.viewPhoto = null;
        $scope.selectPhotos = function (photo) {
          var viewPhoto = angular.copy(photo);
          $scope.picture = null;
          if (viewPhoto.media) {
            $scope.picture = "/service/media/" + viewPhoto.media;
          }
        };
      };
      $scope.discountShow = function () {
        $scope.stepEditNow = 7;
        $scope.datepickerPrepare = function () {
          $(".iso-dp").daterangepicker({
            singleDatePicker: true,
            calender_style: "picker_4",
            locale: {
              "format": "MM/DD/YYYY",
              "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa",
              ],
              "monthNames": [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
              ],
              "firstDay": 1
            }
          }, function (start, end) {
            var auxId = $(this)[0].element[0].id;

            var id = parseInt(auxId.replace("dp", ""));
            if (isNaN(id)) {
              id = parseInt(auxId.replace("dpp", ""));
            }
            if (id == 0) {
              start = new Date(start);
              $scope.discount.start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
              $scope.$digest();
            } else if (id == 1) {
              end = new Date(end);
              $scope.discount.end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
              $scope.$digest();
            } else {
              var pos = parseInt(id / 2);
              var tmp = parseInt(id % 2);

              if (tmp) {
                end = new Date(end);
                $scope.ship.discounts[pos - 1].end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                $scope.$digest();
              } else {
                start = new Date(start);
                $scope.ship.discounts[pos - 1].start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                $scope.$digest();
              }
            }

          });
          $(".daterangepicker.dropdown-menu.picker_4.single.opensright.show-calendar i").removeClass("icon icon-arrow-left");
          $(".daterangepicker.dropdown-menu.picker_4.single.opensright.show-calendar i").removeClass("icon icon-arrow-right");
        };
        $scope.datepickerPrepare();

        $scope.showDate = function (i) {
          // for (var i = 0; i < $scope.ship.discounts.length; i++) {
          var id1 = ".dp" + ((i + 1) * 2);
          var id2 = ".dp" + (((i + 1) * 2) + 1);

          var start = new Date($scope.ship.discounts[i].start);
          start = $filter("date")(start, "MM/dd/yyyy", $rootScope.timezone);

          var end = new Date($scope.ship.discounts[i].end);
          end = $filter("date")(end, "MM/dd/yyyy", $rootScope.timezone);

          angular.element(id1).empty();
          angular.element(id1).val(start);

          angular.element(id2).empty();
          angular.element(id2).val(end);
          // }
        };
        $scope.initializeDiscount = function () {
          $(".dp0").val("");
          $(".dp1").val("");

          $scope.discount = {
            type: "0",
            discount: 0,
            max: "",
            min: "",
            start: null,
            end: null,
            minDuration: null,
            accumulation: false
          };
        };
        // $scope.showDate();
        $scope.initializeDiscount();
        $scope.validateAddDiscount = function () {
          return $scope.validateDiscount($scope.discount);
        };
        $scope.validateDiscount = function (discount) {

          if (!discount.start) {
            return false;
          } else {
            if (!angular.isDate(discount.start)) {
              try {
                discount.start = new Date(discount.start);
              } catch (err) {
                return false;
              }
            }
          }
          if (!discount.end) {
            return false;
          } else {
            if (!angular.isDate(discount.end)) {
              try {
                discount.end = new Date(discount.end);
              } catch (err) {
                return false;
              }
            }
          }
          if (discount.start >= discount.end) {
            return false;
          }
          if (isNaN(parseInt(discount.discount)) || parseInt(discount.discount) < 0 || parseInt(discount.discount) > 100) {
            return false;
          }
          if (isNaN(parseInt(discount.minDuration)) || parseInt(discount.minDuration) < 0) {
            return false;
          }

          if (discount.type == "1") {
            if (isNaN(parseInt(discount.min)) || parseInt(discount.min) < 1) {
              return false;
            }
          }
          if (discount.type == "2") {
            if (isNaN(parseInt(discount.max)) || parseInt(discount.max) < 1) {
              return false;
            }
          }
          return true;
        };
        $scope.addDiscount = function () {
          if ($scope.validateAddDiscount()) {
            $scope.ship.discounts.push($scope.discount);
            $scope.initializeDiscount();
            $scope.datepickerPrepare();
          }
        };
        $scope.delDiscount = function (index) {
          var array = [];
          for (var i = 0; i < $scope.ship.discounts.length; i++) {
            if (i != index) {
              array.push($scope.ship.discounts[i]);
            }
          }
          $scope.ship.discounts = angular.copy(array);

        };
        $scope.saveDiscounts = function () {
          var success = true;
          for (var i = 0; i < $scope.ship.discounts.length; i++) {
            if (!$scope.validateDiscount($scope.ship.discounts[i])) {
              success = false;
              break;
            } else {
              var start = new Date($scope.ship.discounts[i].start),
                end = new Date($scope.ship.discounts[i].end);
              $scope.ship.discounts[i].start = {
                day: start.getUTCDate(),
                month: start.getUTCMonth(),
                year: start.getUTCFullYear()
              };
              $scope.ship.discounts[i].end = {
                day: end.getUTCDate(),
                month: end.getUTCMonth(),
                year: end.getUTCFullYear()
              };
            }
          }
          if (success) {
            Ships.discounts.save({
                id: $scope.ship._id,
                discounts: $scope.ship.discounts
              },
              function (data) {
                if (!data.error) {
                  if ($scope.ship._id == data.res._id) {
                    if (data.res.step == 8 && !$scope.wizard) {
                      $scope.ship = data.res;
                      $scope.discountShow();
                    } else {
                      $scope.prepareWizard(data.res);
                      $scope.activate();
                    }

                  }
                  $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado los datos satisfactoriamente", "success");
                } else if (!$rootScope.production) {
                  if (data.error.code == 666) window.location = "/backoffice/login";
                  $rootScope.showNotify("Oh No! ", data.error.message, "error");
                } else {
                  if (data.error.code == 666) window.location = "/backoffice/login";
                  $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
                }
              });
          }
        };
      };
      $scope.defaultPhotos = function (shi) {
        for (var i = 0; i < shi.photos.length; i++) {
          if (shi.photos[i].default) {
            return i;
          }
        }
        return -1;
      };

      $scope.imgsAper = function () {
        $(".fix-img").attr("style", "height:" + $(".fix-img img").width() / 1.77 + "px"); //1.77
        $scope.sizeImg = $scope.sizeImg == 0 ? $(".fix-img img").width() / 1.77 : $scope.sizeImg; //1.77

      };

      function fixPics() {
        setTimeout(function () {
          $scope.imgsAper();
          if ($(".fix-pics img").width() > 100) {
            $(".fix-pics").attr("style", "height:" + $(".fix-pics img").width() / 1.77 + "px");
          }
        }, 200);
      }


      $scope.imgsWizzard = function () {
        // if ($scope.sizeImg < 60) {
        $scope.sizeImg = 0;
        setTimeout(function () {
          $("#wizard .fix-pics").attr("style", "height:" + $("#wizard .fix-pics img").width() / 1.77 + "px");
          $scope.sizeImg = $("#wizard .fix-pics img").width() == 100 ? $scope.sizeImg : $("#wizard .fix-pics img").width() / 1.77;
        }, 300);

        // }

      };

      /*Filtro par propietarios*/

      $scope.listUsers = function () {
        Users.get({
          limit: $scope.maxSizeUsers,
          skip: $scope.skipUsers,
          string: $scope.stringUsers,
          status: true,
          permissions: $scope.permissions
        }, function (data) {
          if (!data.error) {
            $scope.totalItemsUsers = data.cont;
            $scope.users = data.res;
            if ($scope.currentPageUsers > 1 && !$scope.users.length) {
              $scope.currentPageUsers--;
              $scope.skipUsers = $scope.skipUsers - $scope.maxSizeUsers;
              $scope.listUsers();
            }


          }
        });
      };
      $scope.pageChangedUsers = function () {
        $scope.skipUsers = ($scope.currentPageUsers - 1) * $scope.maxSizeUsers;
        $scope.listUsers();
      };
      $scope.showFilter = function () {
        $scope.stringUsers = "";
        $scope.listUsers();
        $(".filter-modal-lg").modal("toggle");
      };
      $scope.selectUser = function (user) {
        $scope.user = angular.copy(user);
        $scope.list();
        $(".filter-modal-lg").modal("toggle");
      };
      $scope.unselectUser = function () {
        $scope.user = null;
        $scope.list();
      };
      /*Filtro por paises,ciudades o puertos*/

      $scope.showFilter2 = function () {
        $scope.listLocalizations();
        $(".filter2-modal-lg").modal("toggle");
      };
      $scope.selectFilter2 = function () {
        $scope.shfilter2 = true;
        $scope.list();
        $(".filter2-modal-lg").modal("toggle");
      };
      $scope.unSelectCountry = function (aux) {
        if (aux == 0) {
          $scope.shfilter2 = false;
          $scope.country = null;
        }
        if (aux == 0 || aux == 1) {
          $scope.city = null;
        }
        if (aux == 0 || aux == 1 || aux == 2) {
          $scope.area = null;
        }
        if (aux == 0 || aux == 1 || aux == 2 || aux == 3) {
          $scope.port = null;
        }
        $scope.list();
      };

      $scope.activate();
    }
  ]);