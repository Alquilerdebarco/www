/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */
angular.module('rentShipApp.OwnerCtrl', [])
  .controller('OwnerCtrl', ['$scope', '$rootScope', "Users", '$upload', 'ngValidateFactory',
    function ($scope, $rootScope, Users, $upload, ngValidateFactory) {
      $rootScope.pageSelected = 'users';
      $('#alerts').change(function () {
        validator.defaults.alerts = (this.checked) ? false : true;
        if (this.checked)
          $('form .alert').remove();
      }).prop('checked', false);
      $(":input").inputmask();

      $scope.sortOptions = {
        field: 'registerDate',
        sort: -1
      }

      $scope.initializeVars = function () {
        $scope.user = {
          _id: '',
          name: '',
          surname: '',
          email: '',
          password: '',
          password2: '',
          // telephone: null,
          mobile: null,
          address: '',
          permissions: {
            typeShipOwner: '0',
            isShipOwner: true
          }
        };
        $scope.string = "";
        $scope.status = null;
      };
      $scope.initializeVars();
      ngValidateFactory.passwordEqualTo = function (testVal, val) {
        return testVal === val;
      };
      ngValidateFactory.formatMobile = function (val) {
        if (!angular.isNumber(val)) return false;
        if (val.length < 6) return false;
        return true;
      };

      ngValidateFactory.strategies.defaultValidationStrategy = [{
        value: ngValidateFactory.required,
        message: "Este campo es requerido"
      }, {
        value: [ngValidateFactory.minLength, 3],
        message: "Al menos 3 carácteres"
      }]

      ngValidateFactory.strategies.percentValidationStrategy = [{
        value: ngValidateFactory.required,
        message: "Este campo es requerido"
      }, {
        value: [ngValidateFactory.minLength, 1],
        message: "Al menos una cifra"
      }, {
        value: [ngValidateFactory.pattern, /^(0+)?\d+(\.\d+)?$/],
        message: "Solo números"
      }, {
        value: [ngValidateFactory.pattern, /^(0+)?\d{1,2}(\.\d+)?$/],
        message: "Entre 0 y 99"
      }]

      ngValidateFactory.strategies.requiredValidationStrategy = [{
        value: ngValidateFactory.required,
        message: "Este campo es requerido"
      }]

      ngValidateFactory.strategies.emailValidationStrategy = [{
        value: ngValidateFactory.required,
        message: "Este campo es requerido"
      }, {
        value: [ngValidateFactory.emailPattern],
        message: "Por favor entre un Email válido"
      }];

      // ngValidateFactory.strategies.phoneValidationStrategy = [{
      //   value: ngValidateFactory.required,
      //   message: "Este campo es requerido"
      // }, {
      //   value: [ngValidateFactory.minLength, 7],
      //   message: "Al menos 6 cifras"
      // }, {
      //   value: [ngValidateFactory.pattern, /^(00)?\+?[\d\s]+$/i],
      //   message: "Por favor, entre un número telefónico válido"
      // }];

      ngValidateFactory.strategies.mobilePValidationStrategy = [{
        value: ngValidateFactory.required,
        message: "Este campo es requerido"
      }, {
        value: [ngValidateFactory.minLength, 6],
        message: "Al menos 6 cifra"
      }, {
        value: [ngValidateFactory.pattern, /^(0+)?\d+(\.\d+)?$/],
        message: "Solo números"
      }
      ];

      ngValidateFactory.strategies.urlValidationStrategy = [{
        value: [ngValidateFactory.pattern, /^((http(s)?\:\/{2})?(\w+(\.{1,2}|\/|\?|\%|\#|\&|\=|\-|\+|(\:\d+)))+(\w+(\.{1,2}|\/|\%|\#|\&|\=|\-|\+)+\w+\/?)+)?$/i],
        message: "Por favor, entre una dirección Web válida"
      }];

      $scope.changePass = function () {
        ngValidateFactory.strategies.passwordValidationStrategy = [{
          value: ngValidateFactory.required,
          message: "Este campo es requerido"
        }, {
          value: [ngValidateFactory.passwordEqualTo, $scope.user.password],
          message: "No coinciden las contraseñas"
        }]
      }
      $scope.changePass();
      $scope.users = [];
      $scope.currentPage = 1;
      $scope.maxSize = 10;
      $scope.skip = 0;
      $scope.contetShow = 1; //1-List   2- P.Information   3- Profile
      $scope.backStep = false;
      $scope.password = {
        new: '',
        repeat: ''
      }
      $scope.create = function () {
        $scope.$broadcast('ng-validate');
        var submit = true;
        if (!$scope.userForm.$valid) {
          submit = false;
        }
        if (submit) {
          Users.add({
            name: $scope.user.name,
            surname: $scope.user.surname,
            email: $scope.user.email,
            password: $scope.user.password,
            password2: $scope.user.password2,
            // telephone: $scope.user.telephone,
            mobile: $scope.user.mobile,
            address: $scope.user.address,
            permissions: $scope.user.permissions
          }, function (data) {
            $scope.user = data.res;
            if (!data.error) {
              $scope.list();
              $rootScope.showNotify("Acción Satisfactoria ", "Usuario Creado satisfactoriamente", 'success');
              $scope.changeView(1);
            } else if (data.error.code) {
              if (data.error.code == "11000") {
                if (!$rootScope.production) {
                  $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                } else {
                  $rootScope.showNotify("Oh No! ", "El email esta en uso", 'error');
                }
              } else {
                $rootScope.showNotify("Oh No! ", data.error.message, 'error');
              }
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
            }

          });
        }
        return false;
      };

      $scope.update = function () {
        var submit = true;
        $scope.$broadcast('ng-validate');
        if (!$scope.userForm2.$valid) {
          submit = false;
        }
        if (submit) {
          Users.change({
            id: $scope.user._id,
            name: $scope.user.name,
            surname: $scope.user.surname,
            email: $scope.user.email,
            // telephone: $scope.user.telephone,
            mobile: $scope.user.mobile,
            address: $scope.user.address,
            permissions: $scope.user.permissions,
            commission: $scope.user.commission,
            web: $scope.user.web
          }, function (data) {
            $scope.user = angular.copy(data.res);
            if (!data.error) {
              $scope.updateUsersList(data.res);
              $scope.showProfile(data.res);
              $scope.userForm.$setPristine(true);
              $rootScope.showNotify("Acción Satisfactoria ", "Usuario guardado satisfactoriamente", 'success');

            } else if (data.error.code) {
              if (data.error.code == "11000") {
                if (!$rootScope.production) {
                  $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                } else {
                  $rootScope.showNotify("Oh No! ", "El email esta en uso", 'error');
                }
              } else {
                $rootScope.showNotify("Oh No! ", data.error.message, 'error');
              }
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
            }

          });
        }
        return false;
      };
      $scope.filterUser = function (status) {
        $scope.status = angular.copy(status);
        $scope.list();
      }

      $scope.list = function () {
        Users.get({
          limit: $scope.maxSize,
          skip: $scope.skip,
          string: $scope.string,
          status: $scope.status,
          permissions: true,
          sortOptions: $scope.sortOptions
        }, function (data) {
          if (!data.error) {
            $scope.totalItems = data.cont;
            $scope.users = data.res;
            if ($scope.currentPage > 1 && !$scope.users.length) {
              $scope.currentPage--;
              $scope.skip = $scope.skip - $scope.maxSize;
              $scope.list();
            }


          }
        });
      };

      $scope.changeSortOptions = function (field) {
        if ($scope.sortOptions.field != field) {
          $scope.sortOptions.field = field;
          $scope.sortOptions.sort = -1;
        } else {
          if ($scope.sortOptions.sort == -1) $scope.sortOptions.sort = 1;
          else if ($scope.sortOptions.sort == 1) $scope.sortOptions.sort = -1;
        }
        $scope.list();
      }

      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.list();
      };

      $scope.list();

      $scope.listPermissions = function (permission) {
        $scope.permissions = permission;
        $scope.list();
      }

      $scope.changePassword = function () {
        if ($scope.password.new.length >= 6 && $scope.password.new == $scope.password.repeat) {
          Users.password.update({
            id: $scope.user._id,
            password: $scope.password.new,
            password2: $scope.password.repeat,
          }, function (data) {
            $scope.password = {
              new: '',
              repeat: ''
            }
            if (!data.error) {
              $rootScope.showNotify("Acción Satisfactoria ", "Contraseña salvada satisfactoriamente", 'success');
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
            }
          });
        }
      }


      /*AVATAR*/


      $scope.fileChanged = function (e) {

        $scope.files = e.target.files;

        var fileReader = new FileReader();
        fileReader.readAsDataURL($scope.files[0]);

        fileReader.onload = function (e) {
          $scope.imgSrc = this.result;
          $scope.$apply();
        };

      };

      $scope.clear = function () {
        $scope.imageCropStep = 1;
        delete $scope.imgSrc;
        delete $scope.result;
        delete $scope.resultBlob;
      };

      $scope.uploadAvatar = function () {
        $upload.upload({
          url: $scope.copyuser.urlAvatar, //upload.php script, node.js route, or servlet url
          method: 'POST',
          headers: {
            'header-key': 'multipart/form-data'
          },
          data: {
            data: $scope.result,
            contentType: $scope.files[0].type,
            fieldName: $scope.files[0].name,
            name: $scope.files[0].name,
          }
        }).success(function (data) {
          if (!data.error) {
            $scope.updateUsersList(data.res);
            $scope.showProfile(data.res);
            $scope.clear();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el Avatar satisfactoriamente", 'success');
            //$scope.changeView(1);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, 'error');
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
          }
        });
      };


      $scope.showProfile = function (user) {

        $scope.changeView(3)
        $scope.copyuser = angular.copy(user);
        $scope.user = angular.copy(user);
        $scope.copyuser.urlAvatar = "/service/users/avatar/" + $scope.copyuser._id;
      };

      $scope.changeStatus = function (user) {
        Users.status.update({
          id: user._id
        }, function (data) {
          if (data.error) {
            if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
            }
          } else {
            $scope.updateUsersList(data.res);
          }
        });
      };

      $scope.goToEdit = function (user) {
        $scope.changeView(2);
        $scope.user = angular.copy(user);
        $scope.backStep = true;
      };
      $scope.changeView = function (view) {
        $scope.contetShow = view;
        $scope.backStep = false;
        $scope.userForm.$setPristine(true);
        $scope.initializeVars();
      };

      $scope.updateUsersList = function (user) {
        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i]._id == user._id) {
            $scope.users[i] = user;
            break;
          }
        }
        $scope.$apply();
      };


      $scope.select = function (user) {
        $scope.user = angular.copy(user);
      };

      $scope.remove = function () {
        Users.remove({
          id: $scope.user._id,
          email: $scope.user.email
        }, function (data) {
          if (data.error) {
            if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", 'error');
            }
          } else {
            var array = [];
            for (var i = 0; i < $scope.users.length; i++) {
              if ($scope.users[i]._id != data.res._id) {
                array.push($scope.users[i]);
              }
            }
            $scope.users = angular.copy(array);
          }
        });
      };

//changePermissionAdmin
//changePermissionOwner

      $scope.changePermissionOwner = function () {
        Users.permissions.owner({
          id: $scope.user._id
        }, function (data) {
          if (data.error) {
            if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", 'error');
            }
          } else {
            $scope.updateUsersList(data.res);
            $scope.showProfile(data.res);
          }
        });
      };
      $scope.changePermissionAdmin = function () {
        Users.permissions.admin({
          id: $scope.user._id
        }, function (data) {
          if (data.error) {
            if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, 'error');
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cambiar sus datos", 'error');
            }
          } else {
            $scope.updateUsersList(data.res);
            $scope.showProfile(data.res);
          }
        });
      };


    }
  ])
;