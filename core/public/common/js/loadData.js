/**
 * Created by erernestomr87@gmail.commr87@gmail.com on 14/08/2014.
 */


var bojeoLoadData = angular.module("rentShipApp", []);

bojeoLoadData.controller("LoadData", [
  "$scope", "$http", function ($scope, $http) {
    $scope.initialize = function () {
      $http({method: "GET", url: "/load/getDataInfo"}).success(function (data) {
        if (data.res) {
          $scope.bar = 0;
          $scope.msgLoad = new Array();
          $scope.showlog = true;
          $scope.lcomplete = false;
          $scope.collections = data.res;

          $scope.collectionSave = new Array();
          for (var i = 0; i < $scope.collections.length; i++) {
            var aux = {
              name: $scope.collections[i].name,
              cant: $scope.collections[i].cant,
              active: true
            };
            $scope.collectionSave.push(aux);
          }

        }
      });
    };
    $scope.initialize();

    $scope.contCollection = function () {
      var cont = 0;
      for (var i = 0; i < $scope.collectionSave.length; i++) {
        if ($scope.collectionSave[i].active) {
          cont++;
        }
      }
      return cont;
    };
    $scope.percent = 0;
    $scope.calcPercent = function (cont) {
      var coll = $scope.contCollection();

      return (cont * 100) / (coll * 2);
    };
    $scope.loadDataCollection = function (cb) {
      $http({method: "POST", url: "/load/removeSession"}).success(function (data) {
        if (data.res) {
          var contr = 0;
          $scope.removeDataCollection(function (data) {
            contr++;
            if (data && contr == 1) {
              var cont = 0;
              async.map($scope.collectionSave, function (collection, cbm) {
                if (collection.active) {
                  $http({
                    method: "POST",
                    url: "/load/loadDataByCollection",
                    data: {
                      collection: collection
                    }
                  }).success(function (data) {
                    cont++;
                    var msg;
                    if (data.res) {
                      msg = {
                        coll: data.coll,
                        accion: "insert",
                        type: 1
                      };
                      $scope.msgLoad.push(msg);
                    } else {
                      msg = {
                        coll: data.coll,
                        accion: "insert",
                        type: 0
                      };
                      $scope.msgLoad.push(msg);
                    }
                    $scope.bar++;
                    $scope.percent = $scope.calcPercent($scope.bar);
                    if (cont === $scope.collectionSave.length) {
                      $scope.lcomplete = true;
                      cbm(true, null);
                    }

                  });
                } else {
                  cbm(true, null);
                }
              }, function (err, response) {
                console.log(err, response);
                return true;
              });
            }
            else{
              return true;
            }
          });
        }
      });
    };
    $scope.removeDataCollection = function (cb) {
      $scope.showlog = false;

      async.map($scope.collectionSave, function (collection, cbm) {
        if (collection.active) {
          $http({
            method: "POST",
            url: "/load/removeDataByCollection",
            data: {
              collection: collection
            }
          }).success(function (data) {
            var msg;
            if (data.res) {
              msg = {
                coll: data.coll,
                accion: "delete",
                type: 1
              };
              $scope.msgLoad.push(msg);
            } else {
              msg = {
                coll: data.coll,
                accion: "delete",
                type: 0
              };
              $scope.msgLoad.push(msg);
            }

            $scope.bar++;
            $scope.percent = $scope.calcPercent($scope.bar);
            if ($scope.percent >= 50) {
              cbm(true, null);
            }
          });
        } else {
          cbm(true, null);
        }
      }, function (err, response) {
        cb(true);
      });
    };
    $scope.loadData = function () {
      $http({
        method: "POST",
        url: "/load/loadData",
        data: {
          dbInfo: $scope.collectionSave
        }
      }).success(function (data) {
        if (data.res) {
        }
      });
    };
    $scope.allSelected = function () {
      for (var i = 0; i < $scope.collectionSave.length; i++) {
        if (!$scope.collectionSave[i].active) return false;
      }
      return true;
    };
    $scope.selectAll = function () {
      var value = !$scope.allSelected();
      for (var i = 0; i < $scope.collectionSave.length; i++) {
        $scope.collectionSave[i].active = value;
      }
    };
  }
]);