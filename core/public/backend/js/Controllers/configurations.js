/**
 * Created by ernestomr87@gmail.com on 1/25/2016.
 */

angular.module("rentShipApp.configurationCtrl", []).controller("configurationCtrl", ["$scope", "$rootScope", "$upload", "Configurations",
  function ($scope, $rootScope, $upload, Configurations) {
    $rootScope.pageSelected = "configuration";
    $scope.selectTab = 0;
    $scope.editMail = false;
    $scope.showUpload = false;
    $scope.timezones = timezones || [];
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
    $scope.prepareLanguagesExperiences = function (list) {
      var aux = $rootScope.prepareLanguagesTabs();
      for (var j = 0; j < list.length; j++) {
        if (list[j].name.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].name.length; l++) {
              if (aux[k]._id == list[j].name[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].name.push({
                language: angular.copy(aux[k]._id),
                value: angular.copy(aux[k].name)
              });
            }
          }
        }
        if (list[j].description == null) {
          list[j].description = [];
        }
        if (list[j].description.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].description.length; l++) {
              if (aux[k]._id == list[j].description[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].description.push({
                language: angular.copy(aux[k]._id),
                value: angular.copy(aux[k].name)
              });
            }
          }
        }
      }
      return list;
    };

    function sortDuration() {
      var durations = $scope.configurations.shipSettings.durations;
      for (var i = 0; i < durations.length - 1; i++) {
        for (var j = i + 1; j < durations.length; j++) {
          var c, d;
          if (durations[i].unity == 0) {
            c = 1;
          } else if (durations[i].unity == 1) {
            c = 24;
          } else {
            c = 24 * 7;
          }

          if (durations[j].unity == 0) {
            d = 1;
          } else if (durations[j].unity == 1) {
            d = 24;
          } else {
            d = 24 * 7;
          }

          var a = (c * durations[i].quantity);
          var b = (d * durations[j].quantity);

          if (a > b) {
            var aux = durations[i];
            durations[i] = durations[j];
            durations[j] = aux;
          }
        }
      }
      $scope.configurations.shipSettings.durations = durations;
    }

    function sortExperiences() {
      var experiences = $scope.configurations.shipSettings.experiences;
      for (var i = 0; i < experiences.length - 1; i++) {
        for (var j = i + 1; j < experiences.length; j++) {
          if (experiences[i].name.length) {
            var a = experiences[i].name[0].value;
            var b = experiences[j].name[0].value;
            if (a > b) {
              var aux = experiences[i];
              experiences[i] = experiences[j];
              experiences[j] = aux;
            }
          }

        }
      }
      $scope.configurations.shipSettings.experiences = experiences;
    }
    $scope.loadData = function () {
      Configurations.get(function (data) {
        if (!data.error) {
          $scope.configurations = angular.copy(data.res);
          sortDuration();
          sortExperiences();
          $scope.configurations.metaData.siteMetaDescription = angular.copy($scope.prepareLanguages($scope.configurations.metaData.siteMetaDescription));
          $scope.configurations.metaData.siteMetaKeywords = angular.copy($scope.prepareLanguages($scope.configurations.metaData.siteMetaKeywords));
          $scope.configurations.shipSettings.experiences = angular.copy($scope.prepareLanguagesExperiences($scope.configurations.shipSettings.experiences));
          $scope.configurations.contract.particular = angular.copy($scope.prepareLanguages($scope.configurations.contract.particular));
          $scope.configurations.contract.enterprise = angular.copy($scope.prepareLanguages($scope.configurations.contract.enterprise));
          if (!$scope.configurations.iva) $scope.configurations.iva = 21;


        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al obtener sus datos", "error");
        }
      });
    };
    $scope.loadData();
    $scope.validateGeneralData = function () {
      try {
        if (!$scope.configurations.general.siteName.length) {
          return false;
        } else if (!$scope.configurations.general.offlineMessage.length) {
          return false;
        } else if (!$scope.configurations.general.domain.length) {
          return false;
        } else if (!($scope.configurations.general.domain.indexOf("http://") >= 0 || $scope.configurations.general.domain.indexOf("https://") >= 0)) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    };
    $scope.validateMetaDescriptionData = function () {
      try {
        for (var i = 0; i < $scope.configurations.metaData.siteMetaDescription.length; i++) {
          if (!$scope.configurations.metaData.siteMetaDescription[i].value.length) {
            return false;
          }
        }
        for (var i = 0; i < $scope.configurations.metaData.siteMetaKeywords.length; i++) {
          if (!$scope.configurations.metaData.siteMetaKeywords[i].value.length) {
            return false;
          }
        }
        return true;
      } catch (e) {
        return false;
      }
    };
    $scope.validateMailSettingsData = function () {
      try {
        if (!$scope.configurations.mailSettings.mailServer.length) {
          return false;
        }
        var port = parseInt($scope.configurations.mailSettings.mailPort);
        if (!port) {
          return false;
        }
        if (!$scope.configurations.mailSettings.name.length) {
          return false;
        }
        if (!$scope.configurations.mailSettings.email.length) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }

    };
    $scope.formatConfigurations = function () {

      var smd = $scope.configurations.metaData.siteMetaDescription;
      var smk = $scope.configurations.metaData.siteMetaKeywords;


      for (var i = 0; i < smd.length; i++) {
        if (smd[i].language) {
          var aux = {
            _id: smd[i].language,
            value: smd[i].value
          };
          smd[i] = aux;
        }
      }

      for (var i = 0; i < smk.length; i++) {
        if (smk[i].language) {
          var aux = {
            _id: smk[i].language,
            value: smk[i].value
          };
          smk[i] = aux;
        }

      }

      $scope.configurations.metaData.siteMetaDescription = smd;
      $scope.configurations.metaData.siteMetaKeywords = smk;

    };
    $scope.saveGeneral = function () {
      if ($scope.validateGeneralData) {
        Configurations.general.save({
          general: $scope.configurations.general
        }, function (data) {
          if (data.res) {
            $scope.configurations = data.res;
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar los datos", "error");
          }
        });
      }
    };
    $scope.saveMetaDescription = function () {
      if ($scope.validateMetaDescriptionData) {
        $scope.formatConfigurations();
        Configurations.metaData.save({
          meta: $scope.configurations.metaData
        }, function (data) {
          if (data.res) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar los datos", "error");
          }
        });
      }
    };
    $scope.saveMailSettings = function () {
      if ($scope.validateMailSettingsData()) {
        Configurations.mailSettings.save({
          mailSettings: $scope.configurations.mailSettings
        }, function (data) {
          if (data.res) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Se ha producido un error al salvar los datos", "error");
          }
          $scope.editMail = false;
        });
      }
    };
    $scope.validatePaypal = function () {
      try {
        if (!$scope.configurations.paypal.client_id.length) {
          return false;
        }
        if (!$scope.configurations.paypal.client_secret.length) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    };
    $scope.savePaypal = function () {
      if ($scope.validatePaypal()) {
        Configurations.paypal.save({
          data: $scope.configurations.paypal
        }, function (data) {
          if (data.res) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      }
    };
    $scope.validateIva = function () {
      if ($scope.configurations) {
        if (!angular.isDefined($scope.configurations.iva)) return true;
        if (!angular.isNumber($scope.configurations.iva)) return true;
        if ($scope.configurations.iva < 0) return true;
        if ($scope.configurations.iva > 100) return true;
      }
      return false;
    }
    $scope.saveIva = function () {
      if (!$scope.validateIva()) {
        Configurations.iva.save({
          iva: $scope.configurations.iva
        }, function (data) {
          if (data.res) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      }
    };
    $scope.validateRedsys = function () {
      if ($scope.configurations) {
        if (!$scope.configurations.redsys || !$scope.configurations.redsys.commerce || !$scope.configurations.redsys.commerce.length) {
          return false;
        }
        if (!$scope.configurations.redsys || !$scope.configurations.redsys.key || !$scope.configurations.redsys.key.length) {
          return false;
        }
        return true;
      }
    };
    $scope.saveRedsys = function () {
      if ($scope.validateRedsys()) {
        Configurations.redsys.save({
          data: $scope.configurations.redsys
        }, function (data) {
          if (data.res) {
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
            $scope.loadData();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      }
    };
    /*Boats*/
    $scope.hours = [];
    for (var i = 2; i <= 12; i++) {
      $scope.hours.push(i);
    }
    $scope.days = [];
    for (var i = 1; i <= 13; i++) {
      if (i != 7) {
        $scope.days.push(i);
      }
    }
    $scope.weeks = [];
    for (var i = 1; i <= 52; i++) {
      $scope.weeks.push(i);
    }
    $scope.showFormDuration = false;
    $scope.initializeDuration = function () {
      $scope.duration = {
        unity: "",
        quantity: "",
        name: $rootScope.prepareLanguagesTabs()
      };
    };
    $scope.initializeDuration();
    $scope.changeUnity = function () {
      $scope.duration.quantity = "";
    };
    $scope.validateAddDuration = function () {
      if (parseInt($scope.duration.unity) == 0 || parseInt($scope.duration.unity) == 1 || parseInt($scope.duration.unity) == 7) {
        if (parseInt($scope.duration.unity) == 0) {
          if (parseInt($scope.duration.quantity) >= 2 && parseInt($scope.duration.quantity) <= 12) {
            return true;
          } else {
            return false;
          }
        } else if (parseInt($scope.duration.unity) == 1) {
          if (parseInt($scope.duration.quantity) >= 1 && parseInt($scope.duration.quantity) <= 13 && parseInt($scope.duration.quantity) != 7) {
            return true;
          } else {
            return false;
          }
        } else {
          if (parseInt($scope.duration.quantity) >= 1 && parseInt($scope.duration.quantity) <= 52) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    };
    $scope.addDuration = function () {
      Configurations.duration.create({
        duration: $scope.duration
      }, function (data) {
        if (data.res) {
          $scope.showFormDuration = false;
          $scope.configurations = data.res;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.delDuration = function (duration) {
      Configurations.duration.delete({
        duration: duration
      }, function (data) {
        if (data.res) {
          $scope.configurations = data.res;
          $scope.showFormDuration = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
        }
      });
    };
    $scope.changeShowFormDuration = function (val) {
      if (val) {
        $scope.initializeDuration();
      }
      $scope.showFormDuration = val;
    };
    /*Experience*/
    $scope.initializeExperience = function () {
      var aux = $rootScope.prepareLanguagesTabs();
      $scope.experience = {
        name: angular.copy(aux),
        description: angular.copy(aux)
      };
    };
    $scope.initializeExperience();
    $scope.validateAddExperience = function () {
      for (var i = 0; i < $scope.experience.name.length; i++) {
        if (!$scope.experience.name[i].value || !$scope.experience.name[i].value.length) {
          return false;
        }
      }

      // for (var i = 0; i < $scope.experience.description.length; i++) {
      //   if (!$scope.experience.description[i].value || !$scope.experience.description[i].value.length) {
      //     return false;
      //   }
      // }
      return true;
    };
    $scope.showFormExperience = false;
    $scope.editExperience = false;
    $scope.formatExperiences = function () {
      for (var i = 0; i < $scope.experience.name.length; i++) {
        if ($scope.experience.name[i].language) {
          var aux = {
            _id: $scope.experience.name[i].language,
            value: $scope.experience.name[i].value
          };
          $scope.experience.name[i] = aux;
        }

      }

      for (var i = 0; i < $scope.experience.description.length; i++) {
        if ($scope.experience.description[i].language) {
          var aux = {
            _id: $scope.experience.description[i].language,
            value: $scope.experience.description[i].value
          };
          $scope.experience.description[i] = aux;
        }
      }
    };
    $scope.changeShowFormExperience = function (val) {
      if (val) {
        $scope.initializeExperience();
      }
      $scope.showFormExperience = val;
      $scope.editExperience = false;
    };
    $scope.addExperience = function () {
      Configurations.experience.create({
        experience: $scope.experience
      }, function (data) {
        if (data.res) {
          $scope.configurations = data.res;
          $scope.showFormExperience = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.saveExperience = function () {
      $scope.formatExperiences();
      Configurations.experience.save({
        experience: $scope.experience
      }, function (data) {
        if (data.res) {
          $scope.configurations = data.res;
          $scope.showFormExperience = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.delExperience = function (experience) {
      Configurations.experience.delete({
        experience: experience
      }, function (data) {
        if (data.res) {
          $scope.configurations = data.res;
          $scope.showFormExperience = false;
          $scope.showFormDuration = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
          $scope.loadData();
        } else {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        }
      });
    };
    $scope.selExperience = function (experience) {
      $scope.experience = angular.copy(experience);
      $scope.showFormExperience = true;
      $scope.editExperience = true;
    };
    $scope.defaultExperience = function (id) {
      Configurations.experience.default({
        id: id
      }, function (data) {
        if (data.res) {
          $scope.showFormExperience = false;
          $scope.showFormDuration = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.unCheckExperience = function (id) {
      Configurations.unCheckXp.exec({
        id: id
      }, function (data) {
        if (data.res) {
          $scope.showFormExperience = false;
          $scope.showFormDuration = false;
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
          $scope.loadData();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    }
    /*Media*/
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
    $scope.addPhotos = function () {
      var file = {
        data: $scope.result,
        contentType: $scope.files[0].type,
        fieldName: $scope.files[0].name,
        name: $scope.files[0].name,
      };
      $upload.upload({
        url: "/service/configurations/photos", //upload.php script, node.js route, or servlet url
        method: "POST",
        headers: {
          "header-key": "multipart/form-data"
        },
        data: {
          file: file
        }
      }).success(function (data) {
        if (!data.error) {
          $scope.configurations = data.res;
          $scope.clear();
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado la Foto satisfactoriamente", "success");
          //$scope.changeView(1);
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.delPhotos = function (photo) {
      if (photo) {
        Configurations.photos.remove({
          photo: photo
        }, function (data) {
          if (!data.error) {
            $scope.configurations = data.res;
            $scope.clear();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado la  Foto satisfactoriamente", "success");
          } else {
            $rootScope.showNotify("Oh No! ", data.error.message.message, "error");
          }
        });
      }

    };
    $scope.setStatusPhotos = function (photo) {
      Ships.photos.status({
        id: $scope.ship._id,
        photo: photo._id
      }, function (data) {
        if (!data.error) {
          $scope.clear();
          $rootScope.showNotify("Acción Satisfactoria ", "Se han guardado los cambios satisfactoriamente", "success");
          //$scope.changeView(1);
        } else {
          $rootScope.showNotify("Oh No! ", data.error.message.message, "error");
        }
      });
    };
    $scope.viewPhoto = null;
    $scope.selectPhotos = function (photo) {
      var viewPhoto = angular.copy(photo);
      $scope.picture = null;
      if (viewPhoto) {
        $scope.picture = "/service/media/" + viewPhoto;
      }
    };
    /*Types*/
    $scope.listTypes = function () {
      Configurations.types.list(function (data) {
        if (!data.error) {
          $scope.types = data.res;
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
        }
      });
    };
    $scope.initializeType = function () {
      var aux = $rootScope.prepareLanguagesTabs();
      $scope.types = [];
      $scope.type = {
        name: angular.copy(aux),
        description: angular.copy(aux)
      };
      $scope.showFormType = false;
      $scope.disabledFormType = false;
      $scope.listTypes();
    };
    $scope.initializeType();
    $scope.addTypes = function () {
      Configurations.types.create({
        data: $scope.type
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado satisfactoriamente", "success");
          $scope.initializeType();
          $scope.listTypes();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al crear sus datos", "error");
        }
      });
    };
    $scope.saveTypes = function () {
      Configurations.types.save({
        data: $scope.type
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado satisfactoriamente", "success");
          $scope.initializeType();
          $scope.listTypes();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al crear sus datos", "error");
        }
      });
    };
    $scope.selectType = function (type) {
      $scope.type = angular.copy(type);
      $scope.addForm = false;
    };
    $scope.showAddType = function (type) {
      $scope.showFormType = true;
      $scope.addForm = true;
    };
    $scope.removeType = function () {
      Configurations.types.remove({
        id: $scope.type._id
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
          $scope.listTypes();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.validateTypes = function () {
      var aux = $rootScope.prepareLanguagesTabs();

      if (aux.length == $scope.type.name.length) {
        for (var i = 0; i < $scope.type.name.length; i++) {
          if (!$scope.type.name[i].value || !$scope.type.name[i].value.length) {
            return false;
          }
        }
      } else {
        return false;
      }

      // if (aux.length == $scope.type.description.length) {
      //   for (var i = 0; i < $scope.type.description.length; i++) {
      //     if (!$scope.type.description[i].value || !$scope.type.description[i].value.length) {
      //       return false;
      //     }
      //   }
      // } else {
      //   return false;
      // }

      return true;
    };
    $scope.showType = function (type) {
      $scope.type = angular.copy(type);
      $scope.showFormType = true;
      // $scope.disabledFormType = true;
    };
    /*Tags*/
    $scope.prepareLanguagesTag = function (list) {
      var aux = $rootScope.prepareLanguagesTabs();
      for (var j = 0; j < list.length; j++) {
        if (list[j].name.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].name.length; l++) {
              if (aux[k]._id == list[j].name[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].name.push({
                language: angular.copy(aux[k]._id),
                value: angular.copy(aux[k].name)
              });
            }
          }
        }
        if (list[j].description == null) {
          list[j].description = [];
        }
        if (list[j].description.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].description.length; l++) {
              if (aux[k]._id == list[j].description[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].description.push({
                language: angular.copy(aux[k]._id),
                value: angular.copy(aux[k].name)
              });
            }
          }
        }
        if (list[j].title == null) {
          list[j].title = [];
        }
        if (list[j].title.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].title.length; l++) {
              if (aux[k]._id == list[j].title[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].title.push({
                language: angular.copy(aux[k]._id),
                value: angular.copy(aux[k].name)
              });
            }
          }
        }
      }
      return list;
    };
    $scope.formatTag = function () {
      for (var i = 0; i < $scope.tag.name.length; i++) {
        if ($scope.tag.name[i].language) {
          var aux = {
            _id: $scope.tag.name[i].language,
            value: $scope.tag.name[i].value
          };
          $scope.tag.name[i] = aux;
        }

      }

      for (var i = 0; i < $scope.tag.title.length; i++) {
        if ($scope.tag.title[i].language) {
          var aux = {
            _id: $scope.tag.title[i].language,
            value: $scope.tag.title[i].value
          };
          $scope.tag.title[i] = aux;
        }
      }

      for (var i = 0; i < $scope.tag.description.length; i++) {
        if ($scope.tag.description[i].language) {
          var aux = {
            _id: $scope.tag.description[i].language,
            value: $scope.tag.description[i].value
          };
          $scope.tag.description[i] = aux;
        }
      }
    };
    $scope.listTags = function () {
      Configurations.tags.list(function (data) {
        if (!data.error) {
          $scope.tags = $scope.prepareLanguagesTag(data.res);
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.initializeTags = function () {
      var aux = $rootScope.prepareLanguagesTabs();
      $scope.tags = [];
      $scope.tag = {
        name: angular.copy(aux),
        title: angular.copy(aux),
        description: angular.copy(aux)
      };
      $scope.showFormTag = false;
      $scope.disabledFormTag = false;
      $scope.listTags();
    };
    $scope.initializeTags();
    $scope.addTags = function () {
      Configurations.tags.create({
        tag: $scope.tag
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado satisfactoriamente", "success");
          $scope.initializeTags();
          $scope.listTags();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.saveTags = function () {
      $scope.formatTag();
      Configurations.tags.save({
        tag: $scope.tag
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha salvado satisfactoriamente", "success");
          $scope.initializeTags();
          $scope.listTags();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.selectTag = function (tag) {
      $scope.tag = angular.copy(tag);
    };
    $scope.removeTag = function () {
      Configurations.tags.remove({
        id: $scope.tag._id
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
          $scope.listTags();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
        }
      });
    };
    $scope.validateTags = function () {
      var aux = $rootScope.prepareLanguagesTabs();

      if (aux.length == $scope.tag.name.length) {
        for (var i = 0; i < $scope.tag.name.length; i++) {
          if (!$scope.tag.name[i].value.length) {
            return false;
          }
        }
      } else {
        return false;
      }

      if (aux.length == $scope.tag.title.length) {
        for (var i = 0; i < $scope.tag.title.length; i++) {
          if (!$scope.tag.title[i].value.length) {
            return false;
          }
        }
      } else {
        return false;
      }

      if (aux.length == $scope.tag.description.length) {
        for (var i = 0; i < $scope.tag.description.length; i++) {
          if (!$scope.tag.description[i].value.length) {
            return false;
          }
        }
      } else {
        return false;
      }

      return true;
    };
    $scope.showTag = function (tag) {
      $scope.tag = angular.copy(tag);
      $scope.showFormTag = true;
      $scope.disabledFormTag = true;
    };
    /*Equipments*/
    $scope.prepareLanguagesEquipment = function (list) {
      var aux = $rootScope.prepareLanguagesTabs();
      for (var j = 0; j < list.length; j++) {
        if (list[j].name.length < aux.length) {
          for (var k = 0; k < aux.length; k++) {
            var exist = false;
            for (var l = 0; l < list[j].name.length; l++) {
              if (aux[k]._id == list[j].name[l].language) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              list[j].name.push({
                language: aux[k]._id,
                value: aux[k].name
              });
            }
          }
        }
      }
      return list;
    };
    $scope.equipments = [];
    $scope.showAddEquipment = false;
    $scope.loadEquipments = function () {
      Configurations.equipments.get(function (data) {
        if (!data.error) {
          $scope.equipments = data.res;
          $scope.equipments = angular.copy($scope.prepareLanguagesEquipment($scope.equipments));

          if ($scope.tmpEquipment) {
            var flag = false;
            for (var i = 0; i < $scope.equipments.length; i++) {
              if ($scope.equipments[i]._id == $scope.tmpEquipment._id) {
                $scope.equipment = angular.copy($scope.equipments[i]);
                $scope.tmpEquipment = null;
                flag = true;
                break;
              }
            }
            if (!flag) {
              $scope.equipment = $scope.equipments.length ? angular.copy($scope.equipments[0]) : null;
            }

          } else {
            $scope.equipment = $scope.equipments.length ? angular.copy($scope.equipments[0]) : null;
          }

          if ($scope.equipment) {
            $scope.equipment.items = $scope.equipment.items ? angular.copy($scope.prepareLanguagesEquipment($scope.equipment.items)) : null;
          }
        }
      });
    };
    $scope.loadEquipments();
    $scope.changeShowAddEquipment = function (val) {
      $scope.showAddEquipment = val;
      if (val == false) {
        $scope.showEdit = false;
      }
      $scope.equipment = $scope.equipments.length ? angular.copy($scope.equipments[0]) : null;
    };
    $scope.selectAddEquipment = function () {
      $scope.showAddEquipment = true;
      $scope.showAddEquip = false;
      $scope.equipment = {
        name: $rootScope.prepareLanguagesTabs()
      };
    };
    $scope.selectEquipment = function (e) {
      if (e) {
        $scope.equipment = angular.copy(e);
        $scope.equipment.items = angular.copy($scope.prepareLanguagesEquipment($scope.equipment.items));
      }

    };
    $scope.goToEditEquipment = function (e) {
      $scope.showEdit = true;
      $scope.selectEquipment(e);
      $scope.changeShowAddEquipment(true);
    };
    $scope.addEquipment = function () {
      Configurations.equipments.create({
        name: $scope.equipment
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado el Equipo satisfactoriamente", "success");
          $scope.showAddEquipment = false;
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.formatEquipment = function () {
      for (var i = 0; i < $scope.equipment.name.length; i++) {
        var aux = {
          _id: $scope.equipment.name[i].language,
          value: $scope.equipment.name[i].value
        };
        $scope.equipment.name[i] = aux;
      }
    };
    $scope.updateEquipment = function () {
      $scope.formatEquipment();
      Configurations.equipments.update({
        equipment: $scope.equipment
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado satisfactoriamente", "success");
          $scope.showAddEquipment = false;
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");

        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.removeEquipment = function () {
      Configurations.equipments.remove({
        equipment: $scope.equipment
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado el Equipamiento satisfactoriamente", "success");
          $scope.showAddEquipment = false;
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.validateAddEquipment = function () {
      if ($scope.equipment) {
        for (var i = 0; i < $scope.equipment.name.length; i++) {
          if (!$scope.equipment.name[i].value || !$scope.equipment.name[i].value.length) {
            return false;
          }
        }
      }
      return true;
    };
    /*Equip*/
    $scope.showAddEquip = false;
    $scope.changeShowAddEquip = function (val) {
      $scope.showAddEquip = val;
      if (val == false) {
        $scope.showEdit = false;
      }
      $scope.equipment = $scope.equipments.length ? angular.copy($scope.equipments[0]) : null;
    };
    $scope.selectAddEquip = function () {

      $scope.showAddEquipment = false;
      $scope.showAddEquip = true;

      $scope.equip = {
        name: $rootScope.prepareLanguagesTabs()
      };
    };
    $scope.selectEquip = function (e) {
      $scope.equip = angular.copy(e);
    };
    $scope.goToEditEquip = function (e) {
      $scope.showEdit = true;
      $scope.selectEquip(e);
      //$scope.changeShowAddEquip(true);
      val = true;
      $scope.showAddEquip = val;
      if (val == false) {
        $scope.showEdit = false;
      }

    };
    $scope.validateAddEquip = function () {
      if ($scope.equip) {
        for (var i = 0; i < $scope.equip.name.length; i++) {
          if (!$scope.equip.name[i].value || !$scope.equip.name[i].value.length) {
            return false;
          }
        }
      }
      return true;
    };
    $scope.addEquip = function () {
      Configurations.equip.create({
        equipment: $scope.equipment,
        equip: $scope.equip
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado el Equipo satisfactoriamente", "success");
          $scope.tmpEquipment = angular.copy($scope.equipment);
          $scope.showAddEquipment = false;
          $scope.showAddEquip = false;
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.formatEquip = function () {
      for (var i = 0; i < $scope.equip.name.length; i++) {
        var aux = {
          _id: $scope.equip.name[i].language,
          value: $scope.equip.name[i].value
        };
        $scope.equip.name[i] = aux;
      }
    };
    $scope.updateEquip = function () {
      $scope.formatEquip();
      Configurations.equip.update({
        equipment: $scope.equipment,
        equip: $scope.equip
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el Equipo satisfactoriamente", "success");
          $scope.tmpEquipment = angular.copy($scope.equipment);
          $scope.showAddEquipment = false;
          $scope.showAddEquip = false;
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");

        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.statusEquip = function (item) {
      Ships.equipStatus.status({
        id: $scope.ship._id,
        equipment: $scope.equipment,
        equip: item
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado el Equipo satisfactoriamente", "success");
          //$scope.changeView(1);
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.removeEquip = function () {
      $scope.formatEquip();
      Configurations.equip.remove({
        equipment: $scope.equipment,
        equip: $scope.equip
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado el Equipo satisfactoriamente", "success");
          $scope.tmpEquipment = angular.copy($scope.equipment);
          $scope.loadEquipments();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.saveContract = function () {
      Configurations.contract.save({
        contract: $scope.configurations.contract
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado satisfactoriamente", "success");
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.imgsAper = function () {
      $(".fix-imgc").attr("style", "height:" + $(".fix-imgc img").width() / 2.17 + "px"); //3.05;
    };
    $("#media-tab").on("click", function () {
      setTimeout(function () {
        $scope.imgsAper();
      }, 300);

    });
    $scope.sendTest = function () {
      Configurations.test.send(function (data) {
        if (data.res) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha enviado el correo de prueba", "success");
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al enviar sus datos", "error");
        }
      });
    };
    $(".nav.toggle").on("click", function () {
      setTimeout(function () {
        $scope.imgsAper();
      }, 100);
    });
    $scope.goBack = function () {
      $scope.showUpload = false;
      setTimeout(function () {
        $scope.imgsAper();
      }, 300);
    };
    $scope.modelPhoto = {
      res: null,
      error: null
    };
    $scope.$watch("modelPhoto", function (newValue, oldValue) {
      if (!(newValue === oldValue)) {
        if (newValue.res) {
          $scope.configurations = newValue.res;
          setTimeout(function () {
            $scope.imgsAper();
          }, 100);

        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al enviar sus datos", "error");
        }
      }
    });
    $scope.updateSEO = function (key, updateNoIndex) {
      $scope.configurations.seo[key] = {
        noindex: updateNoIndex == true ? !$scope.configurations.seo[key].noindex : $scope.configurations.seo[key].noindex,
        nofollow: updateNoIndex == false ? !$scope.configurations.seo[key].nofollow : $scope.configurations.seo[key].nofollow
      };
      Configurations.updateSEO.seo({
        seo: $scope.configurations.seo
      }, function (data) {
        if (data.res) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el metadato", "success");
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
        }
      });
    };
    $scope.seoKeyByPage = function (key) {
      var text = "";
      switch (key) {
        case "page_cookies_privacy":
          text = "Política de Privacidad y Cookies";
          break;
        case "page_service_conditions":
          text = "Condiciones del Servicio";
          break;
        case "page_site_map":
          text = "Mapa del Sitio";
          break;
        case "page_our_ships":
          text = "Nuestros Barcos";
          break;
        case "page_about":
          text = "Quiénes Somos";
          break;
        case "page_register_owner":
          text = "Registro de Propietarios";
          break;
        case "page_register_private":
          text = "Registro de Particulares";
          break;
        case "page_announce":
          text = "Anuncia tu Barco";
          break;
        case "page_access_owner":
          text = "Acceso de Propietarios";
          break;
        case "page_access_user":
          text = "Acceso de Usuarios";
          break;
        case "page_sailor_guide":
          text = "Guía del Navegante";
          break;
        case "page_user_guide":
          text = "Guía de Usuario";
          break;
        case "page_index":
          text = "Página de Inicio";
          break;
        case "page_frequently_questions":
          text = "Preguntas Frecuentes";
          break;
        default:
          text = key;
      }
      return text;
    };

    $scope.listCurrencies = function () {
      Configurations.currencies.list(function (data) {
        if (!data.error) {
          $scope.currencies = data.res;
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.initializeCurrencies = function () {
      $scope.currencies = [];
      $scope.currency = {
        text: "",
        symbol: ""
      };
      $scope.editCurrency = false;
      $scope.listCurrencies();
    };
    $scope.delCurrency = function () {
      Configurations.currencies.delete({
        currency: $scope.currency
      }, function (data) {
        if (data.res) {
          $scope.initializeCurrencies();
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado satisfactoriamente", "success");
          $scope.loadData();
        } else {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        }
      });
    };
    $scope.selCurrency = function (currency) {
      $scope.currency = angular.copy(currency);
      $scope.editCurrency = true;
    };
    $scope.selDelCurrency = function (currency) {
      $scope.currency = angular.copy(currency);
    };
    $scope.addCurrency = function () {
      Configurations.currencies.create({
        currency: $scope.currency
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha creado el Equipo satisfactoriamente", "success");
          $scope.initializeCurrencies();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.updateCurrency = function () {
      Configurations.currencies.update({
        currency: $scope.currency
      }, function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado el Equipo satisfactoriamente", "success");
          $scope.initializeCurrencies();
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
        }
      });
    };
    $scope.menu = function (currency, action) {
      Configurations.currenciesMenu.menu({
        id: currency._id,
        action: action
      }, function (data) {
        if (!data.error) {
          if (!data.error) {
            $scope.initializeCurrencies();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
          }
        }
      });
    };
    $scope.initializeCurrencies();
    $scope.capitalizeText = function () {
      $scope.currency.text = $scope.currency.text.toUpperCase()
    };
    $scope.export = function () {
      Configurations.backup.export(function (data) {
        if (!data.error) {
          $rootScope.showNotify("Acción Satisfactoria ", "", "success");
        } else if (!$rootScope.production) {
          $rootScope.showNotify("Oh No! ", data.error.message, "error");
        } else {
          $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
        }
      });
    };
  }
]);