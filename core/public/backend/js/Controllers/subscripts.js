/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

angular.module('rentShipApp.subscriptCtrl', [])
  .controller('subscriptCtrl', ['$scope', '$rootScope', 'Subscriptions',
    function ($scope, $rootScope, Subscriptions) {
      $rootScope.pageSelected = 'landing';

      $scope.initializeVars = function () {
        $scope.subscriptions = [];
        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.skip = 0;
        $scope.string = "";
        $scope.status = false;
      };
      $scope.initializeVars();
      $scope.sortOptions = {
        field: 'registerDate',
        sort: -1
      };

      $scope.listSubscriptions = function () {
        var params = {
          limit: $scope.maxSize,
          skip: $scope.skip,
          string: $scope.string,
          sortOptions: $scope.sortOptions
        };
        if ($scope.status !== null) {
          params['remove'] = $scope.status;
        }
        Subscriptions.get(params, function (data) {
          if (!data.error) {
            $scope.totalItems = data.cont;
            $scope.subscriptions = data.res;
            for (var i = 0; i < $scope.subscriptions.length; i++) {
              if ($scope.subscriptions[i].email.indexOf(",") != -1) {
                var aux = $scope.subscriptions[i].email.split(",");
                $scope.subscriptions[i].email = aux[0];
              }

            }
            if ($scope.currentPage > 1 && ($scope.landigs && $scope.landigs.length)) {
              $scope.currentPage--;
              $scope.skip = $scope.skip - $scope.maxSize;
              $scope.listSubscriptions();
            }
          }
        });
      };
      $scope.listSubscriptions();

      $scope.changeSortOptions = function (field) {
        if ($scope.sortOptions.field != field) {
          $scope.sortOptions.field = field;
          $scope.sortOptions.sort = -1;
        } else {
          if ($scope.sortOptions.sort == -1) $scope.sortOptions.sort = 1;
          else if ($scope.sortOptions.sort == 1) $scope.sortOptions.sort = -1;
        }
        $scope.listSubscriptions();
      };
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.listSubscriptions();
      };
      $scope.filterSusc = function (status) {
        var tmp = angular.copy(status);
        if (tmp === $scope.status) {
          $scope.status = null;
        } else {
          $scope.status = tmp;
        }
        $scope.listSubscriptions();
      };
      $scope.select = function (susc) {
        Subscriptions.toggle.complete({
          id: susc._id,
          reason: 6,
          email: susc.email,
          remove: susc.remove
        }, function (data) {
          if (data.res) {
            $scope.suscriptSelect = null;
            $scope.listSubscriptions();
            $rootScope.showNotify("Acción Satisfactoria ", susc.remove ? "Se ha habilitado el suscriptor" : "Se ha deshabilitado el suscriptor", 'success');
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al intentar deshabilitar el suscriptor", 'error');
          }
        })
      };
      $scope.selectR = function (susc) {
        $scope.suscriptSelect = angular.copy(susc);
      };

      $scope.removeI = function () {
        Subscriptions.delete.complete({
          id: $scope.suscriptSelect._id
        }, function (data) {
          if (data.res) {
            $scope.suscriptSelect = null;
            $scope.listSubscriptions();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado el suscriptor", 'success');
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", 'error');
          }
        })
      };
      $scope.remove = function () {
        Subscriptions.remove({
          id: $scope.suscriptSelect._id,
          reason: 6,
          email: $scope.suscriptSelect.email
        }, function (data) {
          if (data.res) {
            $scope.suscriptSelect = null;
            $scope.listSubscriptions();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado el suscriptor", 'success');
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", 'error');
          }
        })
      };


    }
  ]);