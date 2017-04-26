/**
 * Created by ernestomr87@gmail.com on1/14/2016.
 */
angular.module("rentShipApp.profileCtrl", [])
    .controller("profileCtrl", ["$scope", "$rootScope", "Users", "$upload", "Offers", "Engine", "ngValidateFactory",
      function ($scope, $rootScope, Users, $upload, Offers, Engine, ngValidateFactory) {

        $rootScope.pageSelected = "profile";
        $scope.contetShow = 1; //1-List   2- P.Information   3- Profile
        $scope.password = {
          new: "",
          repeat: ""
        };
        ngValidateFactory.passwordEqualTo = function (testVal, val) {
          return testVal === val;
        };
        ngValidateFactory.required = function (testVal) {
          $scope.checkMyForm();
          return !!testVal;
        };
        ngValidateFactory.strategies.defaultValidationStrategy = [{
          value: ngValidateFactory.required,
          message: "Este campo es requerido"
        }, {
          value: [ngValidateFactory.minLength, 3],
          message: "Al menos 3 carácteres"
        }];
        ngValidateFactory.strategies.requiredValidationStrategy = [{
          value: ngValidateFactory.required,
          message: "Este campo es requerido"
        }];
        ngValidateFactory.strategies.emailValidationStrategy = [{
          value: ngValidateFactory.required,
          message: "Este campo es requerido"
        }, {
          value: [ngValidateFactory.emailPattern],
          message: "Por favor entre un Email válido"
        }];
        ngValidateFactory.strategies.phoneVValidationStrategy = [{
          value: ngValidateFactory.required,
          message: "Este campo es requerido"
        }, {
          value: [ngValidateFactory.minLength, 6],
          message: "Al menos 6 cifra"
        }, {
          value: [ngValidateFactory.pattern, /^(0+)?\d+(\.\d+)?$/],
          message: "Solo números"
        }];
        ngValidateFactory.strategies.mobileValidationStrategy = [{
          value: [ngValidateFactory.pattern, /^((00)?\+?[\d\s]+)?$/i],
          message: "Por favor, entre un número telefónico válido"
        }];
        ngValidateFactory.strategies.urlValidationStrategy = [{
          value: [ngValidateFactory.pattern, /^((http(s)?\:\/{2})?(\w+(\.{1,2}|\/|\?|\%|\#|\&|\=|\-|\+|(\:\d+)))+(\w+(\.{1,2}|\/|\%|\#|\&|\=|\-|\+)+\w+\/?)+)?$/i],
          message: "Por favor, entre una dirección Web válida"
        }];
        $scope.user = angular.copy($rootScope.M_USER);
        $scope.user.permissions.typeShipOwner = $scope.user.permissions.typeShipOwner.toString();
        $scope.copyuser = angular.copy($scope.user);
        $scope.changePassword = function () {
          if ($scope.password.new.length >= 6 && $scope.password.new == $scope.password.repeat) {
            Users.password.update({
              id: $rootScope.M_USER._id,
              password: $scope.password.new,
              password2: $scope.password.repeat,
            }, function (data) {
              $scope.password = {
                new: "",
                repeat: ""
              };
              if (!data.error) {
                $rootScope.showNotify("Acción Satisfactoria ", "Contraseña salvada satisfactoriamente", "success");
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          }
        };
        $scope.goToEdit = function () {
          $scope.changeView(2);
          $scope.user = angular.copy($rootScope.M_USER);
          $scope.backStep = true;
        };
        $scope.changeView = function (view) {
          $scope.contetShow = view;
          $scope.backStep = false;
        };
        $scope.update = function () {
          var submit = true;
          $scope.$broadcast("ng-validate");
          if (!$scope.userForm2.$valid) {
            submit = false;
          }
          if (submit) {
            Users.profile.update({
              name: $scope.user.name,
              surname: $scope.user.surname,
              email: $scope.user.email,
                        // telephone: $scope.user.telephone,
              mobile: $scope.user.mobile,
              address: $scope.user.address,
              permissions: $scope.user.permissions,
              web: $scope.user.web
            }, function (data) {
              if (!data.error) {
                $scope.user = data.res;
                $scope.user.permissions.typeShipOwner = $scope.user.permissions.typeShipOwner.toString();
                $rootScope.showNotify("Acción Satisfactoria ", "Usuario guardado satisfactoriamente", "success");
                $scope.changeView(1);
              } else if (data.error.code) {
                if (data.error.code == "11000") {
                  if (!$rootScope.production) {
                    $rootScope.showNotify("Oh No! ", data.error.message, "error");
                  } else {
                    $rootScope.showNotify("Oh No! ", "Su email esta en uso", "error");
                  }
                } else {
                  $rootScope.showNotify("Oh No! ", data.error.message, "error");
                }
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }

            });
          }
          return false;
        };
        $scope.invoiceFunc = function (form) {
          var submit = true;
          var complete = angular.copy($scope.user.complete);
          $scope.showProfileEnterpise = $scope.user.permissions.isShipOwner && parseInt($scope.user.permissions.typeShipOwner);
          $scope.$broadcast("ng-validate");
          if (form == 1) {
            if (!$scope.invoiceForm1.$valid) {
              submit = false;
            }
          }
          if (form == 2) {
            if (!$scope.invoiceForm2.$valid) {
              submit = false;
            }
          }
          if (submit) {
            Users.invoice.update({
              fiscalName: $scope.user.invoice.fiscalName,
              nifCif: $scope.user.invoice.nifCif,
              dni: $scope.user.invoice.dni,
              swift: $scope.user.invoice.swift,
              iban: $scope.user.invoice.iban,
              email: $scope.user.invoice.email,
              mobile: $scope.user.invoice.mobile,
              address: $scope.user.invoice.address,
              postalCode: $scope.user.invoice.postalCode,
              city: $scope.user.invoice.city,
              country: $scope.user.invoice.country
            }, function (data) {
              if (!data.error) {
                $scope.user = angular.copy(data.res);
                $rootScope.showNotify("Acción Satisfactoria ", "Usuario guardado satisfactoriamente", "success");
                if (!complete) {
                  window.location = "/backoffice/boats";
                }
                else {
                  $rootScope.verifyContract();
                }
              } else if (data.error.code) {
                if (data.error.code == "11000") {
                  if (!$rootScope.production) {
                    $rootScope.showNotify("Oh No! ", data.error.message, "error");
                  } else {
                    $rootScope.showNotify("Oh No! ", "Su email esta en uso o su nif está duplicado", "error");
                  }
                } else {
                  $rootScope.showNotify("Oh No! ", data.error.message, "error");
                }
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }

            });
          } else {
            return false;
          }

        };
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
          $scope.user.urlAvatar = "/service/users/avatar/" + $scope.user._id;
          $upload.upload({
            url: $scope.user.urlAvatar, //upload.php script, node.js route, or servlet url
            method: "POST",
            headers: {
              "header-key": "multipart/form-data"
            },
            data: {
              data: $scope.result,
              contentType: $scope.files[0].type,
              fieldName: $scope.files[0].name,
              name: $scope.files[0].name,
            }
          }).success(function (data) {
            if (!data.error) {
              $scope.clear();
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el Avatar satisfactoriamente", "success");
              if ($rootScope.M_USER.permissions.isAdmin) {
                window.location = "/backoffice/profile";
              } else {
                window.location = "/backoffice/contact";
              }

            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        };
      
        if (!$rootScope.M_USER.permissions.isAdmin) {
          $scope.invoice = {
            books: {
              cont: 0,
              total: 0
            },
            refunds: {
              cont: 0,
              total: 0
            },
            total: 0
          };

          Engine.graphic.list(function (data) {
            if (!data.error) {
              var day_data = [{
                "period": "Jan",
              }, {
                "period": "Feb",
              }, {
                "period": "Mar",
              }, {
                "period": "Apr",
              }, {
                "period": "May",
              }, {
                "period": "Jun",
              }, {
                "period": "Jul",
              }, {
                "period": "Aug",
              }, {
                "period": "Sep",
              }, {
                "period": "Oct",
              }, {
                "period": "Nov",
              }, {
                "period": "Dic",
              }];
              for (var i = 0; i < data.res.length; i++) {
                day_data[i].Reservadas = data.res[i][0];
                day_data[i].Canceladas= data.res[i][1];
              }

              if ($rootScope.M_USER.permissions.isAdmin || $rootScope.M_USER.permissions.isShipOwner) {
                try {
                  Morris.Bar({
                    element: "graph_bar",
                    data: day_data,
                    xkey: "period",
                    hideHover: "auto",
                    barColors: ["#26B99A", "#E74C3C", "#ACADAC", "#3498DB"],
                    ykeys: ["Reservadas", "Canceladas"],
                    labels: ["Reservadas", "Canceladas"],
                    xLabelAngle: 60
                  });
                } catch (err) {
                }
              }
            }
          });

          $scope.status = "all";

          $scope.filter = function (status) {
            $scope.status = status;
            $scope.loadOffers();
          };

          $scope.offers = [];
          $scope.offer = null;
          $scope.currentPage = 1;
          $scope.maxSize = 10;
          $scope.skip = 0;

          $scope.loadOffers = function () {
            // Offers.list.list({
            //   limit: $scope.maxSize,
            //   skip: $scope.skip,
            //   status: $scope.status
            // }, function (data) {
            //   if (!data.error) {
            //     $scope.totalItems = data.cont;
            //     $scope.offers = data.res;
            //
            //     if ($scope.currentPage > 1 && !$scope.offers.length) {
            //       $scope.currentPage--;
            //       $scope.skip = $scope.skip - $scope.maxSize;
            //       $scope.loadOffers();
            //     }
            //   }
            // });
          };

          $scope.loadOffers();
          $scope.pageChanged = function () {
            $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
            $scope.loadOffers();
          };

          $scope.refund = function (offer) {
            $scope.offer = angular.copy(offer);
          };

          $scope.confirmRefund = function () {
            Engine.refund.execute({
              offer: $scope.offer._id
            }, function (data) {
              if (!data.error) {
                $scope.getInvoice();
                $scope.loadOffers();
                $rootScope.showNotify("Acción Satisfactoria ", "Reserva cancelada satisfactoriamente", "success");

              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          };

          $scope.getInvoice = function () {
            Engine.invoice.get(function (data) {
              if (!data.error) {
                $scope.invoice = data.res;
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al obtener sus datos", "error");
              }
            });
          };
        }
        if ($rootScope.M_USER.permissions.isShipOwner) {
          $scope.month = "-1";
          $scope.getOwnerInvoice = function () {

            Engine.invoice.list({
              month: $scope.month
            }, function (data) {
              if (!data.error) {
                $scope.invoices = data.res;
              } else if (!$rootScope.production) {
                $rootScope.showNotify("Oh No! ", data.error.message, "error");
              } else {
                $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
              }
            });
          };
        }
        $(".required-span").remove();
        $("#demo-form2 .required")
                .closest(".form-group")
                .children("div")
                .append(
                    "<span class=\"required-span\" style=\"\">" + "Obligatorio" + "</span>"
                );
        $scope.checkMyForm = function () {
          setTimeout(function () {
            $("#demo-form2 .form-group div span.hasError.ng-binding.ng-scope")
                        .each(function (index) {
                          var span_required = $(this).parent().children("span.required-span");
                          if ($(this).text()) {
                            span_required.hide();
                          } else {
                            span_required.show();
                          }
                        });
          }, 1);
        };
      }
    ]);