/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

angular.module('rentShipApp.particularCtrl', [])
    .controller('particularCtrl', ['$scope', '$rootScope', 'Particulars',
        function ($scope, $rootScope, Particulars) {
            $rootScope.pageSelected = 'landing';

            $scope.initializeVars = function () {
                $scope.particulars = [];
                $scope.currentPage = 1;
                $scope.maxSize = 10;
                $scope.skip = 0;
                $scope.filter_email = "";
            }
            $scope.sortOptions = {
                field: 'registerDate',
                sort: -1
            }

            $scope.initializeVars();


            $scope.listParticulars = function () {
                Particulars.get({
                    limit: $scope.maxSize,
                    skip: $scope.skip,
                    string: $scope.filter_email,
                    sortOptions: $scope.sortOptions
                }, function (data) {
                    if (!data.error) {
                        $scope.totalItems = data.cont;
                        $scope.particulars = data.res;
                        if ($scope.currentPage > 1 && !$scope.landigs.length) {
                            $scope.currentPage--;
                            $scope.skip = $scope.skip - $scope.maxSize;
                            $scope.listParticulars();
                        }
                    }
                });
            };
            $scope.listParticulars();

            $scope.changeSortOptions = function (field) {
                if ($scope.sortOptions.field != field) {
                    $scope.sortOptions.field = field;
                    $scope.sortOptions.sort = -1;
                } else {
                    if ($scope.sortOptions.sort == -1) $scope.sortOptions.sort = 1;
                    else if ($scope.sortOptions.sort == 1) $scope.sortOptions.sort = -1;
                }
                $scope.listParticulars();
            }
            $scope.pageChanged = function () {
                $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
                $scope.listParticulars();
            };

            $scope.status = function (part) {
                Particulars.status.update({id: part._id}, function (data) {
                    if (!data.error) {
                        if (!data.error) {
                            $scope.listParticulars();
                        } else if (!$rootScope.production) {
                            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                        } else {
                            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al procesar sus datos", 'error');
                        }
                    }
                })
            };
            $scope.select = function (part) {
                $scope.partSelected = angular.copy(part);
            };
            $scope.remove = function () {
                Particulars.remove({id: $scope.partSelected._id}, function (data) {
                    if (data.res) {
                        $scope.partSelected = null;
                        $scope.listParticulars();
                        $rootScope.showNotify("Acción Satisfactoria", 'Particular eliminado con éxito', 'success');

                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", 'error');
                    }
                })
            }
        }])
;
