/**
 * Created by ernestomr87@gmail.com on 3/12/2016.
 */

angular.module('rentShipApp.offersCtrl', [])
    .controller('offersCtrl', ['$scope', '$rootScope', 'Offers', 'Engine',
        function ($scope, $rootScope, Offers, Engine) {
            $rootScope.pageSelected = 'offers';

            $scope.durations = DurationsDatas;
            $scope.experiences = ExperiencesDatas;


            $scope.showDetails = false;

            $scope.offers = [];
            $scope.offer = null;
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.skip = 0;

            $scope.medias = [];
            $scope.media = null;
            $scope.status = null;

            $scope.filter = function (status) {
                $scope.status = status;
                $scope.loadOffers();
            }

            $scope.loadOffers = function () {
                // Offers.list.list({
                //     limit: $scope.maxSize,
                //     skip: $scope.skip,
                //     status: $scope.status
                // }, function (data) {
                //     if (!data.error) {
                //         $scope.totalItems = data.cont;
                //         $scope.offers = data.res;
                //
                //         if ($scope.currentPage > 1 && !$scope.offers.length) {
                //             $scope.currentPage--;
                //             $scope.skip = $scope.skip - $scope.maxSize;
                //             $scope.loadOffers();
                //         }
                //     }
                // });
            };

            $scope.getXp = function (id) {
                for (var i = 0; i < $scope.experiences.length; i++) {
                    if ($scope.experiences[i]._id == id) {
                        return $scope.experiences[i].name[0].value;
                    }
                }
                return false;
            };

            $scope.pageChanged = function () {
                $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
                $scope.loadOffers();
            };

            $scope.loadOffers();

            $scope.getPatronPrice = function () {
                for (var i = 0; i < $scope.ship.conditions.patron.length; i++) {
                    if ($scope.ship.conditions.patron[i].duration == $scope.offer.duration._id) {
                        for (var j = 0; j < $scope.durations.length; j++) {
                            if ($scope.offer.duration._id == $scope.durations[j]._id) {
                                $scope.ship.conditions.patron[i].duration == $scope.durations[j];
                                var aux = {
                                    duration: $scope.durations[j],
                                    price: $scope.ship.conditions.patron[i].price
                                }
                                return aux;
                            }
                        }
                    }
                }
                return false;
            };

            $scope.show = function (offer) {
                $scope.offer = angular.copy(offer);
                $scope.ship = $scope.offer.ship;
                $scope.patron = $scope.getPatronPrice();
                $scope.medias = [];
                $scope.media = null;
                $scope.prepareMedia();
                $scope.showDetails = true;
            };

            $scope.prepareMedia = function () {
                var max = $scope.ship.photos.length;
                if (max > 4) {
                    max = 4;
                }
                for (var i = 0; i < max; i++) {
                    $scope.medias.push($scope.ship.photos[i]);
                }
                $scope.media = $scope.medias[0];
            };

            $scope.changePhoto = function (index) {
                $scope.media = $scope.medias[index];
            };

            $scope.SendConfirm = function (type) {
                var token = {
                    method: type ? 'redsys' : 'paypal',
                    offer: $scope.offer._id
                }
                var token = JSON.stringify(token);

                if ($rootScope.M_USER.complete) {
                    if (type == 0) {
                       // window.location = "/service/engine/book/" + token;
                        window.location = "/service/engine/book/" + token;
                    }
                    else {
                        angular.element('#tpvForm').submit();
                    }
                }
                else {
                    window.location = '/backoffice/profile';
                }
            };

            $scope.reject = function () {
                Offers.reject.update({id: $scope.offer._id}, function (data) {
                    if (!data.error) {
                        $scope.loadOffers();
                        $scope.showDetails = false;
                        $rootScope.showNotify("Acción Satisfactoria ", "Se ha rechazado la Oferta satisfactoriamente", 'success');
                    } else if(!$rootScope.production){
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    }else{
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al rechazar la oferta", 'error');
                    }
                });
            }
        }]);