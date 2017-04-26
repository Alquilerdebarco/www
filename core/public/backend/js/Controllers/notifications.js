/**
 * Created by ernestomr87@gmail.com on 1/29/2016.
 */

angular.module('rentShipApp.notificationCtrl', [])
    .controller('notificationCtrl', ['$scope', '$rootScope', 'Notifications',
        function ($scope, $rootScope, Notifications) {

            $rootScope.pageSelected = 'notification';

            $scope.selectTab = 0;
            $scope.showNoty = 0;
            $scope.selectedTab = function (index) {
                $scope.selectTab = index;
            };

            $scope.prepareLanguages = function (obj) {
                var aux = $rootScope.prepareLanguagesTabs();
                if (obj.length) {
                    if (obj.length < aux.length) {
                        for (var k = 0; k < aux.length; k++) {
                            var exist = false;
                            for (var l = 0; l < obj.length; l++) {
                                if (aux[k]._id == obj[l].language) {
                                    exist = true;
                                    break;
                                }
                            }
                            if (!exist) {
                                obj.push({
                                    language: aux[k]._id,
                                    value: aux[k].name
                                });
                            }
                        }
                    }
                    return obj;
                }
                return aux;
            };

            $scope.loadData = function () {
                Notifications.get(function (data) {
                    if (!data.error) {
                        $scope.notifications = data.res;

                        $scope.notifications.userRegister.subject = $scope.prepareLanguages($scope.notifications.userRegister.subject);
                        $scope.notifications.userRegister.body = $scope.prepareLanguages($scope.notifications.userRegister.body);

                        $scope.notifications.userParticular.subject = $scope.prepareLanguages($scope.notifications.userParticular.subject);
                        $scope.notifications.userParticular.body = $scope.prepareLanguages($scope.notifications.userParticular.body);


                        $scope.notifications.bulletin.subject = $scope.prepareLanguages($scope.notifications.bulletin.subject);
                        $scope.notifications.bulletin.body = $scope.prepareLanguages($scope.notifications.bulletin.body);

                        $scope.notifications.recoveryPassword.subject = $scope.prepareLanguages($scope.notifications.recoveryPassword.subject);
                        $scope.notifications.recoveryPassword.body = $scope.prepareLanguages($scope.notifications.recoveryPassword.body);
                        $scope.notifications.publicationBoat.subject = $scope.prepareLanguages($scope.notifications.publicationBoat.subject);
                        $scope.notifications.publicationBoat.body = $scope.prepareLanguages($scope.notifications.publicationBoat.body);

                        $scope.notifications.userRequest.subject = $scope.prepareLanguages($scope.notifications.userRequest.subject);
                        $scope.notifications.userRequest.body = $scope.prepareLanguages($scope.notifications.userRequest.body);
                        $scope.notifications.ownerRequest.subject = $scope.prepareLanguages($scope.notifications.ownerRequest.subject);
                        $scope.notifications.ownerRequest.body = $scope.prepareLanguages($scope.notifications.ownerRequest.body);

                        $scope.notifications.userOffer.subject = $scope.prepareLanguages($scope.notifications.userOffer.subject);
                        $scope.notifications.userOffer.body = $scope.prepareLanguages($scope.notifications.userOffer.body);
                        $scope.notifications.ownerOffer.subject = $scope.prepareLanguages($scope.notifications.ownerOffer.subject);
                        $scope.notifications.ownerOffer.body = $scope.prepareLanguages($scope.notifications.ownerOffer.body);

                        $scope.notifications.userBuyConfirmation.subject = $scope.prepareLanguages($scope.notifications.userBuyConfirmation.subject);
                        $scope.notifications.userBuyConfirmation.body = $scope.prepareLanguages($scope.notifications.userBuyConfirmation.body);
                        $scope.notifications.ownerBuyConfirmation.subject = $scope.prepareLanguages($scope.notifications.ownerBuyConfirmation.subject);
                        $scope.notifications.ownerBuyConfirmation.body = $scope.prepareLanguages($scope.notifications.ownerBuyConfirmation.body);

                        $scope.notifications.userRefundConfirmation.subject = $scope.prepareLanguages($scope.notifications.userRefundConfirmation.subject);
                        $scope.notifications.userRefundConfirmation.body = $scope.prepareLanguages($scope.notifications.userRefundConfirmation.body);
                        $scope.notifications.ownerRefundConfirmation.subject = $scope.prepareLanguages($scope.notifications.ownerRefundConfirmation.subject);
                        $scope.notifications.ownerRefundConfirmation.body = $scope.prepareLanguages($scope.notifications.ownerRefundConfirmation.body);

                        $scope.notifications.userExpireTime.subject = $scope.prepareLanguages($scope.notifications.userExpireTime.subject);
                        $scope.notifications.userExpireTime.body = $scope.prepareLanguages($scope.notifications.userExpireTime.body);

                        $scope.notifications.rejectRequest.subject = $scope.prepareLanguages($scope.notifications.rejectRequest.subject);
                        $scope.notifications.rejectRequest.body = $scope.prepareLanguages($scope.notifications.rejectRequest.body);

                    } else {
                        $rootScope.showNotify("Oh No! ", data.error, 'error');
                    }
                });
            };
            $scope.loadData();


            $scope.validateNotification = function (data) {
                if (!data) {
                    return false;
                }
                var aux = $rootScope.prepareLanguagesTabs();

                if (data.subject.length != aux.length) {
                    return false;
                }
                if (data.subject.length != aux.length) {
                    return false;
                }

                for (var i = 0; i < aux.length; i++) {
                    if (!data.subject[i].value || !data.subject[i].value.length) {
                        return false;
                    }
                    if (!data.body[i].value || !data.body[i].value.length) {
                        return false;
                    }
                }
                return true;
            };
            $scope.formatNotifications = function (data) {
                var subject = data;
                for (var i = 0; i < subject.length; i++) {
                    if (subject[i].language) {
                        var aux = {
                            _id: subject[i].language,
                            value: subject[i].value
                        };
                        subject[i] = aux;
                    }
                }
                return subject;
            };

            $('.activateUserRegister .iradio_flat-green').click(function () {
                $scope.notifications.userRegister.active = true;
            });
            $('.deactivateUserRegister .iradio_flat-green').click(function () {
                $scope.notifications.userRegister.active = false;
            });

            $scope.saveNotificationUserRegister = function () {
                if ($scope.validateNotification($scope.notifications.userRegister)) {
                    $scope.notifications.userRegister.subject = angular.copy($scope.formatNotifications($scope.notifications.userRegister.subject));
                    $scope.notifications.userRegister.body = angular.copy($scope.formatNotifications($scope.notifications.userRegister.body));
                    Notifications.register.save({
                        data: $scope.notifications.userRegister
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };

            $scope.saveNotificationUserParticular = function () {
                if ($scope.validateNotification($scope.notifications.userParticular)) {
                    $scope.notifications.userParticular.subject = angular.copy($scope.formatNotifications($scope.notifications.userParticular.subject));
                    $scope.notifications.userParticular.body = angular.copy($scope.formatNotifications($scope.notifications.userParticular.body));
                    Notifications.particular.save({
                        data: $scope.notifications.userParticular
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };

            $scope.saveNotificationBulletin = function () {
                if ($scope.validateNotification($scope.notifications.bulletin)) {
                    $scope.notifications.bulletin.subject = angular.copy($scope.formatNotifications($scope.notifications.bulletin.subject));
                    $scope.notifications.bulletin.body = angular.copy($scope.formatNotifications($scope.notifications.bulletin.body));
                    Notifications.bulletin.save({
                        data: $scope.notifications.bulletin
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            // $scope.sendNotificationBulletin = function () {
            //     Notifications.bulletin.send(function (data) {
            //         if (data.res) {
            //             $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
            //         }
            //         else {
            //             $rootScope.showNotify("Oh No! ", data.error, 'error');
            //         }
            //     });
            // };

            $scope.saveNotificationRecoveryPassword = function () {
                if ($scope.validateNotification($scope.notifications.recoveryPassword)) {
                    $scope.notifications.recoveryPassword.subject = angular.copy($scope.formatNotifications($scope.notifications.recoveryPassword.subject));
                    $scope.notifications.recoveryPassword.body = angular.copy($scope.formatNotifications($scope.notifications.recoveryPassword.body));
                    Notifications.password.save({
                        data: $scope.notifications.recoveryPassword
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationPublicationBoat = function () {
                if ($scope.validateNotification($scope.notifications.publicationBoat)) {
                    $scope.notifications.publicationBoat.subject = angular.copy($scope.formatNotifications($scope.notifications.publicationBoat.subject));
                    $scope.notifications.publicationBoat.body = angular.copy($scope.formatNotifications($scope.notifications.publicationBoat.body));
                    Notifications.publication.save({
                        data: $scope.notifications.publicationBoat
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationUserRequest = function () {
                if ($scope.validateNotification($scope.notifications.userRequest)) {
                    $scope.notifications.userRequest.subject = angular.copy($scope.formatNotifications($scope.notifications.userRequest.subject));
                    $scope.notifications.userRequest.body = angular.copy($scope.formatNotifications($scope.notifications.userRequest.body));
                    Notifications.userRequest.save({
                        data: $scope.notifications.userRequest
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationOwnerRequest = function () {
                if ($scope.validateNotification($scope.notifications.ownerRequest)) {
                    $scope.notifications.ownerRequest.subject = angular.copy($scope.formatNotifications($scope.notifications.ownerRequest.subject));
                    $scope.notifications.ownerRequest.body = angular.copy($scope.formatNotifications($scope.notifications.ownerRequest.body));
                    Notifications.ownerRequest.save({
                        data: $scope.notifications.ownerRequest
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationUserOffer = function () {
                if ($scope.validateNotification($scope.notifications.userOffer)) {
                    $scope.notifications.userOffer.subject = angular.copy($scope.formatNotifications($scope.notifications.userOffer.subject));
                    $scope.notifications.userOffer.body = angular.copy($scope.formatNotifications($scope.notifications.userOffer.body));
                    Notifications.userOffer.save({
                        data: $scope.notifications.userOffer
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationOwnerOffer = function () {
                if ($scope.validateNotification($scope.notifications.ownerOffer)) {
                    $scope.notifications.ownerOffer.subject = angular.copy($scope.formatNotifications($scope.notifications.ownerOffer.subject));
                    $scope.notifications.ownerOffer.body = angular.copy($scope.formatNotifications($scope.notifications.ownerOffer.body));
                    Notifications.ownerOffer.save({
                        data: $scope.notifications.ownerOffer
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationUserBuyConfirmation = function () {
                if ($scope.validateNotification($scope.notifications.userBuyConfirmation)) {
                    $scope.notifications.userBuyConfirmation.subject = angular.copy($scope.formatNotifications($scope.notifications.userBuyConfirmation.subject));
                    $scope.notifications.userBuyConfirmation.body = angular.copy($scope.formatNotifications($scope.notifications.userBuyConfirmation.body));
                    Notifications.userBuy.save({
                        data: $scope.notifications.userBuyConfirmation
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationOwnerBuyConfirmation = function () {
                if ($scope.validateNotification($scope.notifications.ownerBuyConfirmation)) {
                    $scope.notifications.ownerBuyConfirmation.subject = angular.copy($scope.formatNotifications($scope.notifications.ownerBuyConfirmation.subject));
                    $scope.notifications.ownerBuyConfirmation.body = angular.copy($scope.formatNotifications($scope.notifications.ownerBuyConfirmation.body));
                    Notifications.ownerBuy.save({
                        data: $scope.notifications.ownerBuyConfirmation
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };

            $scope.saveNotificationUserRefundConfirmation = function () {
                if ($scope.validateNotification($scope.notifications.userRefundConfirmation)) {
                    $scope.notifications.userRefundConfirmation.subject = angular.copy($scope.formatNotifications($scope.notifications.userRefundConfirmation.subject));
                    $scope.notifications.userRefundConfirmation.body = angular.copy($scope.formatNotifications($scope.notifications.userRefundConfirmation.body));
                    Notifications.userRefund.save({
                        data: $scope.notifications.userRefundConfirmation
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };
            $scope.saveNotificationOwnerRefundConfirmation = function () {
                if ($scope.validateNotification($scope.notifications.ownerRefundConfirmation)) {
                    $scope.notifications.ownerRefundConfirmation.subject = angular.copy($scope.formatNotifications($scope.notifications.ownerRefundConfirmation.subject));
                    $scope.notifications.ownerRefundConfirmation.body = angular.copy($scope.formatNotifications($scope.notifications.ownerRefundConfirmation.body));
                    Notifications.ownerRefund.save({
                        data: $scope.notifications.ownerRefundConfirmation
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };

            $scope.saveNotificationUserExpireTime = function () {
                if ($scope.validateNotification($scope.notifications.userExpireTime)) {
                    $scope.notifications.userExpireTime.subject = angular.copy($scope.formatNotifications($scope.notifications.userExpireTime.subject));
                    $scope.notifications.userExpireTime.body = angular.copy($scope.formatNotifications($scope.notifications.userExpireTime.body));
                    Notifications.userExpireTime.save({
                        data: $scope.notifications.userExpireTime
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };

            $scope.saveNotificationRejectRequest = function () {
                if ($scope.validateNotification($scope.notifications.rejectRequest)) {
                    $scope.notifications.rejectRequest.subject = angular.copy($scope.formatNotifications($scope.notifications.rejectRequest.subject));
                    $scope.notifications.rejectRequest.body = angular.copy($scope.formatNotifications($scope.notifications.rejectRequest.body));
                    Notifications.rejectRequest.save({
                        data: $scope.notifications.rejectRequest
                    }, function (data) {
                        if (data.res) {
                            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", 'success');
                            $scope.loadData();
                        }
                        else {
                            $rootScope.showNotify("Oh No! ", data.error, 'error');
                        }
                    });
                }
            };


        }]);
