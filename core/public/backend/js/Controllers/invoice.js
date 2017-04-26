/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */
angular.module('rentShipApp.invoiceCtrl', [])
  .controller('invoiceCtrl', ['$scope', '$rootScope', 'Engine', 'Users', 'Offers', '$filter',
    function ($scope, $rootScope, Engine, Users, Offers, $filter) {
      $rootScope.pageSelected = 'invoice';
      $scope.iva = IVA || 21;

      $scope.initializeVars = function () {
        $scope.email = $rootScope.M_USER.permissions.isAdmin ? "" : $rootScope.M_USER.email;
        $scope.month = "-1";
        $scope.year = "2017";
        $scope.sort = -1;
        $scope.sortBy = {field: 'createDate', sort: -1};
        $scope.type = null;
        $scope.currentPage = 1;
        $scope.maxSize = 50;
        $scope.skip = 0;
        $scope.showinvoice = false;


      };
      $scope.changeSort = function (field, sort) {
        $scope.sortBy.field = field;
        $scope.sortBy.sort = $scope.sortBy.sort === 1 ? -1 : 1;
        $scope.getInvoice();
      };
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.getInvoice();
      };
      $scope.today = new Date();
      $scope.initializeVars();
      $scope.filterUser = function (type) {
        $scope.type = type;
        $scope.getInvoice();
      };
      $scope.changeSortOptions = function () {
        $scope.sort = $scope.sort === 1 ? -1 : 1;
        $scope.getInvoice();
      };

      $scope.getInvoice = function () {
        Engine.invoice.admin({
          email: $scope.email,
          month: $scope.month,
          year: $scope.year,
          limit: $scope.maxSize,
          skip: $scope.skip,
          type: $scope.type,
          order: $scope.sortBy
        }, function (data) {
          if (!data.error) {
            $scope.invoices = data.res;
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
          }
        });
      };
      $scope.getInvoice();
      $scope.prepareDescription = function (inv) {
        var string = "";

        $scope.discountA = ((inv.price * inv.discount) / 100);
        var date = $filter('date')(inv.bookDate, "MM/dd/yyyy", $rootScope.timezone);
        var address = inv.ship.localization.country.name[0].value + " - " + inv.ship.localization.city.name[0].value + " - " + inv.ship.localization.port.name[0].value;
        var patron = inv.patron ? "con patrón" : "sin patrón";
        var duration = inv.duration.quantity;
        if (inv.duration.unity === 0) {
          inv.duration.quantity > 1 ? duration += " Horas" : duration += " Hora";
        }
        if (inv.duration.unity === 1) {
          inv.duration.quantity > 1 ? duration += " Días" : duration += " Día";
        }

        string += date + " - " + inv.experience.name[0].value + " - " + inv.ship.manufacturer + " " + inv.ship.model + " - " + duration + " - " + inv.ship.st.name[0].value + " - " + patron + " - " + address;
        return string;

        //fecha del servicio, experiencia, marca y modelo barco, duración, tipo de barco, ¿necesitas patrón? país, ciudad/zona, puerto
      };
      $scope.prepareInvoice = function (invoice) {
        $scope.invoice = angular.copy(invoice);
        console.log($scope.invoice);
        $scope.discountA = (($scope.invoice.price * 100) / (100 - $scope.invoice.discount));
        var patron = $scope.invoice.patron ? "con patrón" : "sin patrón";
        var date = $filter('date')($scope.invoice.bookDate, "MM/dd/yyyy", $rootScope.timezone);
        var duration = $scope.invoice.duration.quantity;
        var address = $scope.invoice.ship.localization.country.name[0].value + " - " + $scope.invoice.ship.localization.city.name[0].value + " - " + $scope.invoice.ship.localization.port.name[0].value;
        if ($scope.invoice.duration.unity === 0) {
          $scope.invoice.duration.quantity > 1 ? duration += " Horas" : duration += " Hora";
        }
        if ($scope.invoice.duration.unity === 1) {
          $scope.invoice.duration.quantity > 1 ? duration += " Días" : duration += " Día";
        }

        $scope.concept = date + " - " + $scope.invoice.experience.name[0].value + " - " + $scope.invoice.ship.manufacturer + " " + $scope.invoice.ship.model + " - " + duration + " - " + $scope.invoice.ship.st.name[0].value + " - " + patron + " - " + address;
        $scope.showinvoice = true;
        setTimeout(function () {
          $(window).resize();
        }, 500);
      };


      $scope.calculateImport = function (price, discount) {
        return ((price * 100) / (100 - discount));
      }
      $scope.calculateTotalInvoice = function (price, commission) {
        return price - ((price * commission) / 100);
      }
    }]);
