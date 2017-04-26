/**
 * Created by ernestomr87@gmail.com on 3/8/2016.
 */


angular.module('rentShipApp.messagesCtrl', [])
    .controller('messagesCtrl', ['$scope', '$rootScope', 'Messages',
        function ($scope, $rootScope, Messages) {
            $rootScope.pageSelected = 'messages';

            $scope.messages = [];
            $scope.message = null;
            $scope.userText = "";
            $scope.room = "";
            $scope.talkNow = false;

            $scope.loadMessages = function () {
                Messages.list(function (data) {
                    if (data.res) {
                        $scope.messages = data.res;
                        if ($scope.messages.length) {
                            $scope.message = $scope.messages[0];
                            $scope.room = $scope.message.user._id + $rootScope.M_USER._id;
                            if ($rootScope.M_USER._id > $scope.message.user._id) {
                                $scope.room = $rootScope.M_USER._id + $scope.message.user._id;
                            }
                            $scope.showMessage();
                        }
                    }
                });
            };

            $scope.showMessage = function () {
                Messages.get({
                    userOne: $rootScope.M_USER._id,
                    userTwo: $scope.message.user._id
                }, function (data) {
                    if (data.res) {
                        $rootScope.conversation = data.res;
                    }
                })
            };

            $scope.sendMsg = function () {
                Messages.create({
                    userOne: $rootScope.M_USER._id,
                    userTwo: $scope.message.user._id,
                    text: $scope.userText,
                    room: $scope.room
                }, function (data) {
                    if (data.res) {
                        $scope.getConversation();
                    }
                })
            };

            $scope.selectConversation = function ($index) {
                $scope.message = $scope.messages[$index];
                $scope.talkNow = true;
                $scope.showMessage();
            };

            $scope.loadMessages();


            io.on("message", function (data) {
                if (!data.error) {
                    if (data.room == $scope.room) {
                        $scope.userText = "";
                        $scope.loadMessages();
                        $scope.showMessage();
                    }
                } else {
                    $rootScope.showNotify("Oh No! ", data.error, 'error');
                }
            });

        }]);