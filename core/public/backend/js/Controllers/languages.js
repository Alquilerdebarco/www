/**
 * Created by ernestomr87@gmail.com on 12/3/2015.
 */

angular.module("rentShipApp.languageCtrl", [])
    .controller("languageCtrl", ["$scope", "$rootScope", "Languages",
      function ($scope, $rootScope, Languages) {
        $rootScope.pageSelected = "language";
        $scope.initializeVars = function () {
          $scope.language = {
            iso: "",
            name: ""
          };
          $scope.showUpdate = false;
          $scope.chartData = [];
          $scope.showRemove = false;

        };
        $scope.initializeVars();
        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.skip = 0;
        $scope.loadLanguages = function (remove) {
          Languages.get({limit: $scope.maxSize, skip: $scope.skip, remove: remove}, function (data) {
            if (data.res) {
              $scope.showRemove = remove;
              $scope.totalItems = data.contT;
              $scope.totalItemsR = data.contR;
              $scope.languages = data.res;
              if ($scope.currentPage > 1 && $scope.languages.length === 0) {
                $scope.currentPage--;
                $scope.skip = $scope.skip - $scope.maxSize;
                $scope.loadLanguages(remove);
              }

            } else {
              $rootScope.showNotify(data.err.name, data.error.message, "error");
            }
                    //$scope.showChart();
          });
        };
        $scope.loadLanguages(false);
        $scope.status = function (lang) {
          if (!lang.remove) {
            Languages.status.update({id: lang._id}, function (data) {
              if (data.res) {
                $scope.loadLanguages(false);
                $rootScope.showNotify("Acción Satisfactoria", "Cambios Realizados.", "success");
                $rootScope.updateM_LANGUAGES();
              }
              else {
                $rootScope.showNotify(data.err.name, data.error.message, "error");
              }
            });
          }
          else {
            $rootScope.showNotify("Atención", "Este lenguaje o puede ser cambiado ", "notice");
          }

        };
        $scope.edit = function (lang) {
          $scope.language = angular.copy(lang);
          $scope.showUpdate = true;
        };
        $scope.select = function (lang) {
          $scope.langSelected = angular.copy(lang);
        };
        $scope.remove = function () {
          Languages.remove({id: $scope.langSelected._id}, function (data) {
            if (data.res) {
              $scope.langSelected = null;
                        //angular.element('.remove-item').hide();
              $scope.loadLanguages(false);
              $rootScope.updateM_LANGUAGES();
              $rootScope.showNotify("Acción Satisfactoria", "Lenguaje enviado a la papelera con éxito.", "success");
            }
            else {
              $rootScope.showNotify(data.err.name, data.error.message, "error");
            }
          });
        };
        $scope.removeComplete = function () {
          Languages.removed.remove({id: $scope.langSelected._id}, function (data) {
            if (data.res) {
              $scope.langSelected = null;
                        //angular.element('.remove-item').hide();
              $scope.loadLanguages(true);

              $rootScope.showNotify("Acción Satisfactoria", "Lenguaje eliminado.", "success");
            }
            else {
              $rootScope.showNotify(data.err.name, data.error.message, "error");
            }
          });
        };
        $scope.restore = function () {
          Languages.removed.restore({id: $scope.langSelected._id}, function (data) {
            if (data.res) {
              $scope.langSelected = null;
              $scope.loadLanguages(true);
              $rootScope.showNotify("Acción Satisfactoria", "Lenguaje restaurado", "success");
            }
            else {
              $rootScope.showNotify(data.err.name, data.error.message, "error");
            }
          });
        };
        $scope.lang_isos = languages.getAllLanguageCode();

            // validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
        $("form")
                .on("blur", "input[required], input.optional, select.required", validator.checkField)
                .on("change", "select.required", validator.checkField)
                .on("keypress", "input[required][pattern]", validator.keypress);

        $(".multi.required")
                .on("keyup blur", "input", function () {
                  validator.checkField.apply($(this).siblings().last()[0]);
                });

            // bind the validation to the form submit event
            //$('#send').click('submit');//.prop('disabled', true);


        $("form").submit(function (e) {
          e.preventDefault();
          var submit = true;
                // evaluate the form using generic validaing
          if (!validator.checkAll($(this))) {
            submit = false;
          }
          if (submit) {

            if ($scope.showUpdate) {
              Languages.change({language: $scope.language}, function (data) {
                if (data.res) {
                  $scope.language = data.res;
                  $scope.initializeVars();
                  $rootScope.updateM_LANGUAGES();
                  $rootScope.showNotify("Acción Satisfactoria", "Lenguaje creado con éxito", "success");
                }
                else {
                  $rootScope.showNotify(data.err.name, data.error.message, "error");

                }
                $scope.loadLanguages(false);
              });
            }
            else {
              Languages.add({language: $scope.language}, function (data) {

                if (data.res) {
                  $scope.language = data.res;
                  $scope.initializeVars();
                  $rootScope.showNotify("Acción Satisfactoria", "Lenguaje creado.", "success");
                }
                else {
                  $rootScope.showNotify(data.err.name, data.error.message, "error");

                }
                $scope.loadLanguages(false);
              });
            }

          }

          return false;
        });


            /* FOR DEMO ONLY */
        $("#vfields").change(function () {
          $("form").toggleClass("mode2");
        }).prop("checked", false);
        $("#alerts").change(function () {
          validator.defaults.alerts = (this.checked) ? false : true;
          if (this.checked)
            $("form .alert").remove();
        }).prop("checked", false);
        $scope.showChart = function () {
          var colors = ["#3498DB", "#E74C3C", "#9B59B6", "#BDC3C7", "#26B99A"];
          for (var i = 0; i < $scope.languages.length; i++) {
            var value = 100 / $scope.languages.length;
            $scope.chartData.push({
              name: $scope.languages[i].name,
              value: value,
              color: colors[i]
            }
                    );
          }
        };
        $scope.menu = function (language,action) {
          Languages.menu.menu({
            id: language._id,
            action:action
          }, function (data) {
            if (!data.error) {
              if (!data.error) {
                $scope.loadLanguages(false);
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
              }
            }
          });
        };

      }]);

