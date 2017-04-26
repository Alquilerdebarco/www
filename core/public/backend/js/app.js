/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */


angular.module("rentShipApp", [
  "ngSanitize",
  "ImageCropper",
  "ui.bootstrap",
  "ui.tinymce",
  "angularFileUpload",
  "ngValidateModule",
  "mdr.file",
  "rentShipApp.UserCtrl",
  "rentShipApp.OwnerCtrl",
  "rentShipApp.languageCtrl",
  "rentShipApp.localizationsCtrl",
  "rentShipApp.Services",
  "rentShipApp.shipCtrl",
  "rentShipApp.profileCtrl",
  "rentShipApp.textsCtrl",
  "rentShipApp.configurationCtrl",
  "rentShipApp.notificationCtrl",
  "rentShipApp.requestCtrl",
  "rentShipApp.indexCtrl",
  // 'rentShipApp.messagesCtrl',
  "rentShipApp.offersCtrl",
  "rentShipApp.invoiceCtrl",
  "rentShipApp.landingCtrl",
  "rentShipApp.particularCtrl",
  "rentShipApp.subscriptCtrl",
])
  .config([
    "$httpProvider", function ($httpProvider) {
      //initialize get if not there
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }

      //disable IE ajax request caching
      $httpProvider.defaults.headers.get["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";

      $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
      $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
    }
  ])
  .run([
    "$rootScope", "$http", "$interval", "$locale", "$templateCache", function ($rootScope, $http, $interval, $locale, $templateCache) {

      $rootScope.$on("$viewContentLoaded", function () {
        $templateCache.removeAll();
      });

      $rootScope.M_USER = M_USER;
      $rootScope.M_LANGUAGES = M_LANGUAGES;
      $rootScope.pageSelected = "index";
      $rootScope.timezone = TIMEZONE;
      $rootScope.globalToday = new Date(TODAY.year, TODAY.month, TODAY.day);
      $rootScope.globalTexts = TEXTS;
      $rootScope.newMessage = NEWMESSAGE;
      $rootScope.production = PRODUCTION;
      var aux = angular.copy($rootScope.globalToday);
      aux = moment(aux);
      $rootScope.verifyContract = function () {
        if ($rootScope.M_USER.permissions.isShipOwner && !$rootScope.M_USER.accept) {
          //$("#compose-modal-contract").modal("show");
        }
      }
      $locale.id = "es_es";
      if (!$rootScope.M_USER.complete && ($rootScope.M_USER.permissions.isShipOwner || $rootScope.M_USER.permissions.isAdmin)) {
        $("#compose-modal-contact").modal("show");
      }
      else {
        $rootScope.verifyContract();
      }

      $rootScope.tinymceOptions = {
        theme: "modern",
        plugins: [
          "advlist autolink lists link  charmap preview",
          "searchreplace wordcount   code fullscreen",
          "save table contextmenu directionality",
          "  paste textcolor colorpicker textpattern "
        ]
      };
      $rootScope.replaceAll = function (str, find, replace) {
        if(angular.isString(str)){
          var repeat = true;
          while (repeat) {
            var newStr = str.replace(find, replace);
            if (str == newStr) {
              repeat = false;
            } else {
              str = newStr;
            }
          }
        }
        return str;
      }
      $interval(function () {
        $http.post("/service/session").success(function (data) {
          if (!data.res) {
            window.location = "/backoffice/login";
          }
        });
      }, 5 * 1000 * 60);

    }
  ])
  .controller("contractController", [
    "$scope", "$rootScope", "Users",
    function ($scope, $rootScope, Users) {
      $scope.contract = "";
      $scope.accept = false;
      $scope.loadContract = function () {
        Users.contract.get(function (data) {
          if (!data.error) {
            $scope.contract = angular.copy(data.res);
          }
        })
      }

      $scope.loadContract();
    }
  ])
  .controller("MainCtrl", [
    "$scope", "$rootScope", "Languages", "Messages",
    function ($scope, $rootScope, Languages, Messages) {
      $rootScope.pageSelected = "index";
      $rootScope.showNotify = function (title, text, type) {
        new PNotify({
          title: title,
          text: text,
          type: type
        });
      };
      $rootScope.updateM_LANGUAGES = function () {
        Languages.active.get(function (data) {
          if (data.res) {
            $rootScope.M_LANGUAGES = data.res;
          } else {
            $rootScope.showNotify(data.err.name, data.err.message, "error");
          }
        });
      };
      $rootScope.prepareLanguagesTabs = function () {
        var array = [];
        for (var i = 0; i < $rootScope.M_LANGUAGES.length; i++) {
          var aux = {
            _id: $rootScope.M_LANGUAGES[i]._id,
            iso: $rootScope.M_LANGUAGES[i].iso,
            status: $rootScope.M_LANGUAGES[i].status,
            name: $rootScope.M_LANGUAGES[i].name,
            value: ""
          };
          array.push(aux);
        }
        return array;
      };
      $(function () {
        $(".right_col").css("min-height", $(window).height());
        var bodyHeight = $("body").height(),
          leftColHeight = $(".left_col").eq(1).height() + $(".sidebar-footer").height(),
          contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $(".nav_menu").height() + $("footer").height();
        $(".right_col").css("min-height", contentHeight);
      });
    }
  ]);
