/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

angular.module("rentShipApp.landingCtrl", [])
  .controller("landingCtrl", ["$scope", "$rootScope", "Landings", "Localizations", "Configurations",
    function ($scope, $rootScope, Landings, Localizations, Configurations) {
      $rootScope.pageSelected = "landing";
      $scope.initializeVars = function () {
        $scope.showForm = false;
        $scope.editForm = false;
        $scope.landings = [];
        $scope.selectTab = 0;
        $scope.shMenu = false;
        $scope.landing = {
          name: angular.copy($rootScope.prepareLanguagesTabs()),
          title: angular.copy($rootScope.prepareLanguagesTabs()),
          description: angular.copy($rootScope.prepareLanguagesTabs()),
          text1: angular.copy($rootScope.prepareLanguagesTabs()),
          text2: angular.copy($rootScope.prepareLanguagesTabs()),
          country: $scope.country ? $scope.country._id : 0,
          city: $scope.city ? $scope.city._id : 0,
          area: $scope.area ? $scope.area._id : 0,
          port: $scope.port ? $scope.port._id : 0,
          shipType: $scope.shipType ? $scope.shipType : 0,
          experience: $scope.experiences ? $scope.experiences[0]._id : 0
        };

        $scope.country = null;
        $scope.city = null;
        $scope.area = null;
        $scope.port = null;

        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.skip = 0;
        $scope.types = [];
      };
      $scope.initializeVars();
      $scope.selectedTab = function (index) {
        $scope.selectTab = index;
      };
      $scope.listLandings = function () {
        Landings.list({
          limit: $scope.maxSize,
          skip: $scope.skip,
          menu: $scope.shMenu
        }, function (data) {
          if (!data.error) {
            $scope.totalItems = data.cont;
            $scope.landings = data.res;
            if ($scope.currentPage > 1 && !$scope.landings.length) {
              $scope.currentPage--;
              $scope.skip = $scope.skip - $scope.maxSize;
              $scope.listLandings();
            }
          }
        });
      };
      $scope.listLandings();
      $scope.filterLand = function (val) {
        $scope.shMenu = val;
        $scope.listLandings();
      }
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.listLandings();
      };
      $scope.listLocalizations = function () {
        Localizations.get(function (data) {
          if (!data.error) {
            $scope.localizations = data.res;
            $scope.country = null;
            $scope.city = null;
            $scope.area = null;
            $scope.port = null;
            $scope.shipType = null;
          } else {
            $rootScope.showNotify("Oh No! ", data.error, "error");
          }
        });
      };
      $scope.listLocalizations();
      $scope.validateForm = function () {
        for (var i = 0; i < $scope.landing.name.length; i++) {
          if (!$scope.landing.name[i].value.length) {
            return false;
          }
        }
        for (var i = 0; i < $scope.landing.title.length; i++) {
          if (!$scope.landing.title[i].value.length) {
            return false;
          }
        }
        for (var i = 0; i < $scope.landing.description.length; i++) {
          if (!$scope.landing.description[i].value.length) {
            return false;
          }
        }
        var auxT1 = 0;
        for (var i = 0; i < $scope.landing.text1.length; i++) {
          if ($scope.landing.text1[i].value && $scope.landing.text1[i].value.length) {
            auxT1++;
          }
        }
        if (!(auxT1 === 0 || auxT1 == $scope.landing.text1.length)) {
          return false;
        }

        var auxT2 = 0;
        for (var i = 0; i < $scope.landing.text2.length; i++) {
          if ($scope.landing.text2[i].value && $scope.landing.text2[i].value.length) {
            auxT2++;
          }
        }

        if (!(auxT2 === 0 || auxT2 == $scope.landing.text2.length)) {
          return false;
        }
        return true;
      };
      $scope.listTypes = function () {
        Configurations.types.list(function (data) {
          if (!data.error) {
            $scope.types = data.res;
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.listTypes();
      $scope.listExperiences = function () {
        Configurations.experience.default(function (data) {
          if (!data.error) {
            $scope.experiences = data.res.shipSettings.experiences || [];
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.listExperiences();
      $scope.showXp = function (xp) {
        for (var i = 0; i < $scope.experiences.length; i++) {
          if (xp == $scope.experiences[i]._id) {
            return $scope.experiences[i].name[0].value
          }
        }
        return "------------";
      };
      $scope.showEditForm = function (landing) {
        $scope.showForm = true;
        $scope.editForm = true;
        $scope.landing = angular.copy(landing);
        $scope.landing.shipType = $scope.landing.shipType ? $scope.landing.shipType._id : null;
        if (!$scope.landing.text1.length) {
          $scope.landing.text1 = angular.copy($rootScope.prepareLanguagesTabs());
        }
        if (!$scope.landing.text2.length) {
          $scope.landing.text2 = angular.copy($rootScope.prepareLanguagesTabs());
        }
        $scope.checkCountry($scope.landing);
      };
      $scope.checkCountry = function (landing) {
        for (var i = 0; i < $scope.localizations.length; i++) {
          if ($scope.localizations[i]._id == landing.country._id) {
            $scope.country = angular.copy($scope.localizations[i]);
            break;
          }
        }
        if ($scope.country && $scope.country.cities.length) {
          for (var i = 0; i < $scope.country.cities.length; i++) {
            if ($scope.country.cities[i]._id == landing.city._id) {
              $scope.city = angular.copy($scope.country.cities[i]);
              //$scope.landing.city = angular.copy($scope.country.cities[i]);
              break;
            }

          }
        }

        if ($scope.city && $scope.city.areas.length) {
          for (var i = 0; i < $scope.city.areas.length; i++) {
            if ($scope.city.areas[i]._id == landing.area._id) {
              $scope.area = angular.copy($scope.city.areas[i]);
              //$scope.landing.area = angular.copy($scope.city.areas[i]);
              break;
            }

          }
        }

      };
      $scope.goBack = function () {
        $scope.initializeVars();
        $scope.listLandings();
      };
      $scope.formatLandings = function () {
        for (var i = 0; i < $scope.landing.name.length; i++) {
          $scope.landing.name[i] = {
            _id: $scope.landing.name[i].language,
            value: $scope.landing.name[i].value
          };
          $scope.landing.title[i] = {
            _id: $scope.landing.title[i].language,
            value: $scope.landing.title[i].value
          };
          $scope.landing.description[i] = {
            _id: $scope.landing.description[i].language,
            value: $scope.landing.description[i].value
          };

          $scope.landing.text1[i] = {
            _id: $scope.landing.text1[i].language || $scope.landing.text1[i]._id,
            value: $scope.landing.text1[i].value
          };
          $scope.landing.text2[i] = {
            _id: $scope.landing.text2[i].language || $scope.landing.text2[i]._id,
            value: $scope.landing.text2[i].value
          };
        }
      };
      $scope.editLanding = function () {
        $scope.formatLandings();
        Landings.update({
          landing: $scope.landing
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.landings = data.res;
              $scope.initializeVars();
              $scope.listLandings();
              $scope.listTypes();
              $rootScope.showNotify("Acción satisfactoria ", "Landing creado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          }
        });
      };
      $scope.addLanding = function () {
        var filter = {
          name: $scope.landing.name,
          title: $scope.landing.title,
          description: $scope.landing.description,
          text1: $scope.landing.text1,
          text2: $scope.landing.text2,
          country: $scope.landing.country ? $scope.landing.country._id : 0,
          city: $scope.landing.city ? $scope.landing.city._id : 0,
          area: $scope.landing.area ? $scope.landing.area._id : 0,
          port: $scope.landing.port ? $scope.landing.port._id : 0,
          shipType: $scope.landing.shipType || 0,
          experience: $scope.landing.experience || 0
        };
        Landings.create({
          filter: filter
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.initializeVars();
              $scope.listLandings();
              $scope.listTypes();
              $rootScope.showNotify("Acción satisfactoria ", "Landing creado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          }
        });
      };
      $scope.select = function (lan) {
        $scope.landing = angular.copy(lan);
      };
      $scope.remove = function () {
        Landings.remove({
          id: $scope.landing._id
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.landings = data.res;
              $scope.initializeVars();
              $scope.listLandings();
              $scope.listTypes();
              $rootScope.showNotify("Acción satisfactoria ", "Landing eliminado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
            }
          }
        });
      };
      $scope.publish = function (land) {
        Landings.publish.publish({
          id: land._id
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.listLandings();
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al publicar sus datos", "error");
            }
          }
        });
      };
      $scope.noindex = function (land) {
        Landings.noindex.noindex({
          id: land._id
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.listLandings();
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
            }
          }
        });
      };
      $scope.nofollow = function (land) {
        Landings.nofollow.nofollow({
          id: land._id
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.listLandings();
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
            }
          }
        });
      };
      $scope.menu = function (land, action) {
        Landings.menu.menu({
          id: land._id,
          action: action
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.listLandings();
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
            }
          }
        });
      };

      $scope.changeCountry = function () {
        $scope.country = null;
        angular.forEach($scope.localizations, function (value) {
          if (value._id == $scope.landing.country._id) {
            $scope.country = angular.copy(value);
          }
        });
      }
      $scope.changeCity = function () {
        $scope.city = null;
        angular.forEach($scope.country.cities, function (value) {
          if (value._id == $scope.landing.city._id) {
            $scope.city = angular.copy(value);
          }
        });
      }
      $scope.changeArea = function () {
        $scope.area = null;
        angular.forEach($scope.city.areas, function (value) {
          if (value._id == $scope.landing.area._id) {
            $scope.area = angular.copy(value);
          }
        });
      }
    }
  ]);