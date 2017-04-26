/**
 * Created by ernestomr87@gmail.com on1/15/2016.
 */

angular.module("rentShipApp.textsCtrl", [])
  .controller("textsCtrl", ["$scope", "$rootScope", "Texts", "$upload", "$location",
    function ($scope, $rootScope, Texts, $upload, $location) {

      $rootScope.pageSelected = "texts";

      $scope.currentPage = 1;
      $scope.maxSize = 10;
      $scope.skip = 0;
      $scope.listType = null;
      $scope.selectTab = 0;
      $scope.showUpdate = false;
      $scope.showEditButton = false;
      $scope.indexCmp = 0;
      $scope.searchText = "";
      $scope.initializeVars = function () {
        $scope.text = {
          _id: null,
          group: "",
          components: [],
          view: false
        };
        $scope.selectTab = 0;
        $scope.showUpdate = false;
        $scope.viewPhotos = false;
      };
      $scope.selectedTab = function (index) {
        $scope.selectTab = index;
      };
      $scope.showForm = 1;
      $scope.clickShowForm = function (index) {
        if (index == 1) {
          $scope.list();
        }
        if (index == 2) {
          $scope.initializeVars();
        }
        $scope.showForm = index;
      };
      $scope.cancelFormCmp = function () {
        $scope.showFormCmp = false;
      };
      $scope.showFormCmp = false;
      $scope.initializeText = function () {
        $scope.showEditButton = false;
        var aux = $rootScope.prepareLanguagesTabs();
        $scope.cmpTxt = {
          id: "",
          type: "text",
          text: angular.copy(aux)
        };
        $scope.myStyle = {};
        $scope.showFormCmp = true;
      };
      $scope.addCmp = function () {
        $scope.text.components.push($scope.cmpTxt);
        $scope.showFormCmp = false;
      };
      $scope.initializeParagraph = function () {
        $scope.showEditButton = false;
        var aux = $rootScope.prepareLanguagesTabs();
        $scope.cmpTxt = {
          id: "",
          type: "paragraph",
          paragraph: angular.copy(aux)
        };

        $scope.myStyle = {
          margin: "10px 55px 0px 1px"
        };
        $scope.showFormCmp = true;
      };
      $scope.delCmp = function (index) {
        var array = [];
        for (var i = 0; i < $scope.text.components.length; i++) {
          if (i != index) {
            array.push($scope.text.components[i]);
          }
        }
        $scope.text.components = array;
      };
      $scope.validateForm = function () {
        if ($scope.text) {
          if (!$scope.text.group.length) {
            return false;
          }
          for (var i = 0; i < $scope.text.components.length; i++) {
            if (!$scope.text.components[i].id.length) {
              return false;
            }
            if ($scope.text.components[i].type == "text") {
              for (var j = 0; j < $scope.text.components[i].text.length; j++) {
                if (!$scope.text.components[i].text[j].value.length) {
                  return false;
                }
              }
            } else if ($scope.text.components[i].type == "paragraph") {
              for (var j = 0; j < $scope.text.components[i].paragraph.length; j++) {
                if (!$scope.text.components[i].paragraph[j].value.length) {
                  return false;
                }
              }
            }
          }
        }
        return true;
      };
      $scope.validateFormCmp = function () {
        if (!$scope.cmpTxt) {
          return false;
        }
        if (!$scope.cmpTxt.id || !$scope.cmpTxt.id.length) {
          return false;
        }
        if ($scope.cmpTxt.type == "text") {
          for (var j = 0; j < $scope.cmpTxt.text.length; j++) {
            if (!$scope.cmpTxt.text[j].value || !$scope.cmpTxt.text[j].value.length) {
              return false;
            }
          }
        } else if ($scope.cmpTxt.type == "paragraph") {
          for (var j = 0; j < $scope.cmpTxt.paragraph.length; j++) {
            if (!$scope.cmpTxt.paragraph[j].value.length) {
              return false;
            }
          }
        }
        return true;
      };
      $scope.editCmp = function (cmp) {
        $scope.indexCmp = -1;
        for (var i = 0; i < $scope.text.components.length; i++) {
          if (cmp._id == $scope.text.components[i]._id) {
            $scope.indexCmp = i;
            break;
          }
        }

        if ($scope.indexCmp >= 0) {
          $scope.cmpTxt = angular.copy($scope.text.components[$scope.indexCmp]);
          if ($scope.cmpTxt.type == "paragraph")
            $scope.myStyle = {
              margin: "10px 55px 0px 1px"
            };
          $scope.showFormCmp = true;
          $scope.showEditButton = true;

          $location.hash("componentForm");
          // $anchorScroll();
          $location.hash("");
        }


      };
      $scope.saveCmp = function () {
        $scope.text.components[$scope.indexCmp] = angular.copy($scope.cmpTxt);
        $scope.showFormCmp = false;
        $scope.showEditButton = false;
      };
      $scope.formatComponents = function () {
        if ($scope.text) {
          for (var i = 0; i < $scope.text.components.length; i++) {
            if ($scope.text.components[i].type == "text") {
              for (var j = 0; j < $scope.text.components[i].text.length; j++) {
                if ($scope.text.components[i].text[j].name) {
                  var aux = {
                    _id: $scope.text.components[i].text[j]._id,
                    value: $scope.text.components[i].text[j].value
                  };
                } else {
                  var aux = {
                    _id: $scope.text.components[i].text[j].language,
                    value: $scope.text.components[i].text[j].value
                  };
                }

                $scope.text.components[i].text[j] = aux;
              }
            } else if ($scope.text.components[i].type == "paragraph") {
              for (var j = 0; j < $scope.text.components[i].paragraph.length; j++) {
                if ($scope.text.components[i].paragraph[j].name) {
                  var aux = {
                    _id: $scope.text.components[i].paragraph[j]._id,
                    value: $scope.text.components[i].paragraph[j].value
                  };
                } else {
                  var aux = {
                    _id: $scope.text.components[i].paragraph[j].language,
                    value: $scope.text.components[i].paragraph[j].value
                  };
                }
                $scope.text.components[i].paragraph[j] = aux;
              }
            }
          }
        }

      };
      $scope.validateComponents = function (list) {
        var aux = $rootScope.prepareLanguagesTabs();


        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < list[i].components.length; j++) {
            if (list[i].components[j].type == "text") {
              if (list[i].components[j].text.length < aux.length) {
                for (var k = 0; k < aux.length; k++) {
                  var exist = false;
                  for (var l = 0; l < list[i].components[j].text.length; l++) {
                    if (aux[k]._id == list[i].components[j].text[l].language) {
                      exist = true;
                      break;
                    }
                  }
                  if (!exist) {
                    list[i].components[j].text.push({
                      language: aux[k]._id,
                      value: ""
                    });
                  }
                }

              }
            } else if (list[i].components[j].type == "paragraph") {
              if (list[i].components[j].paragraph.length < aux.length) {
                for (var k = 0; k < aux.length; k++) {
                  var exist = false;
                  for (var l = 0; l < list[i].components[j].paragraph.length; l++) {
                    if (aux[k]._id == list[i].components[j].paragraph[l].language) {
                      exist = true;
                      break;
                    }
                  }
                  if (!exist) {
                    list[i].components[j].paragraph.push({
                      language: aux[k]._id,
                      value: ""
                    });
                  }
                }

              }
            }

          }
        }
        return list;

      };
      $scope.create = function () {
        if ($scope.validateForm()) {
          Texts.create({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.showForm = 1;
              $scope.list();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto creado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }

      };
      $scope.update = function () {
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.showForm = 1;
              $scope.list();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }

      };
      $scope.list = function () {
        Texts.get({
          limit: $scope.maxSize,
          skip: $scope.skip,
          list: $scope.listType
        }, function (data) {
          if (!data.error) {
            $scope.totalItems = data.cont;
            var list = $scope.validateComponents(data.res);
            $scope.texts = list;

            if ($scope.currentPage > 1 && !$scope.texts.length) {
              $scope.currentPage--;
              $scope.skip = $scope.skip - $scope.maxSize;
              $scope.list();
            }
          }
        });
      };
      $scope.list();
      $scope.loadText = function (type) {
        $scope.listType = type;
        $scope.list();
      };
      $scope.pageChanged = function () {
        $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
        $scope.list();
      };
      $scope.selectForEdit = function (text) {
        $scope.text = angular.copy(text);
        $scope.showForm = 2;
        $scope.initializeText();
        $scope.showFormCmp = false;
        $scope.showUpdate = true;
        $scope.viewPhotos = false;
        $scope.searchText = "";
      };
      $scope.selectForRemove = function (text) {
        $scope.text = angular.copy(text);
      };
      $scope.selectViewPhotos = function (text) {
        $scope.text = angular.copy(text);
        $scope.viewPhotos = true;
        $scope.showForm = 2;
        $scope.showUpdate = true;

      };
      $scope.remove = function () {
        Texts.remove({
          text: $scope.text
        }, function (data) {
          if (!data.error) {
            $scope.showForm = 1;
            $scope.list();
            $rootScope.showNotify("Acción Satisfactoria ", "Texto eliminado satisfactoriamente", "success");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
          }
        });
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
      $scope.addPhotos = function () {
        var file = {
          data: $scope.result,
          contentType: $scope.files[0].type,
          fieldName: $scope.files[0].name,
          name: $scope.files[0].name,
        };
        $upload.upload({
          url: "/service/text/photos", //upload.php script, node.js route, or servlet url
          method: "POST",
          headers: {
            "header-key": "multipart/form-data"
          },
          data: {
            id: $scope.text._id,
            identification: $scope.identification,
            file: file
          }
        }).success(function (data) {
          if (!data.error) {
            $scope.text = angular.copy(data.res);
            $scope.$digest();
            $scope.clear();
            $rootScope.showNotify("Acción Satisfactoria ", "Se ha guardado la Foto satisfactoriamente", "success");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.delPhotos = function (photo) {
        if (photo) {
          Texts.pagePhotos.delete({
            id: photo
          }, function (data) {
            if (!data.error) {
              $scope.clear();
              $scope.loadPagePhotos($scope.selectedPage);
              $rootScope.showNotify("Acción Satisfactoria ", "Se ha eliminado la  Foto satisfactoriamente", "success");
              //$scope.changeView(1);
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al eliminar sus datos", "error");
            }
          });
        }

      };
      $scope.photos = [];
      $scope.loadPagePhotos = function (page) {
        $scope.selectedPage = angular.copy(page);
        Texts.pagePhotos.get({
          page: $scope.selectedPage
        }, function (data) {
          if (data.res && data.res.photos) {
            $scope.photos = data.res.photos;
          } else {
            $scope.photos = [];
          }
        });
      };
      $scope.delPagePhotos = function (page, photo) {
        Texts.pagePhotos.delete({
          page: page,
          id: photo
        }, function (data) {
          if (!data.err)
            $scope.loadPagePhotos(page);
        });
      };
      $scope.viewPhoto = null;
      $scope.selectPhotos = function (photo) {
        var viewPhoto = angular.copy(photo);
        $scope.picture = null;
        if (viewPhoto.media) {
          $scope.picture = "/service/media/" + viewPhoto.media;
        }
      };
      /**********************************************/
      $scope.initializeUserGuide = function () {
        Texts.get({
          group: "user-guide"
        }, function (data) {
          if (!data.error) {
            $scope.user_guide = data.res;
            $scope.menuText.push($scope.user_guide);
            $scope.loadPagePhotos("user-guide");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.saveUserGuide = function () {
        $scope.text = $scope.user_guide;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializeUserGuide();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializeSailorGuide = function () {
        Texts.get({
          group: "sailor-guide"
        }, function (data) {
          if (!data.error) {
            $scope.sailor_guide = data.res;
            $scope.menuText.push($scope.sailor_guide);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.saveSailorGuide = function () {
        $scope.text = $scope.sailor_guide;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializeSailorGuide();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al actualizar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializeAboutUs = function () {
        Texts.get({
          group: "about-us"
        }, function (data) {
          if (!data.error) {
            $scope.about_us = data.res;
            $scope.menuText.push($scope.about_us);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });

       
      };
      $scope.saveAboutUs = function () {
        $scope.text = $scope.about_us;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializeAboutUs();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializeServiceConditions = function () {

        Texts.get({
          group: "service-conditions"
        }, function (data) {
          if (!data.error) {
            $scope.service_conditions = data.res;
            $scope.menuText.push($scope.service_conditions);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.saveServiceConditions = function () {
        $scope.text = $scope.service_conditions;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializeServiceConditions();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializePrivacyPolitics = function () {

        Texts.get({
          group: "privacy-politics"
        }, function (data) {
          if (!data.error) {
            $scope.privacy_politics = data.res;
            $scope.menuText.push($scope.privacy_politics);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.savePrivacyPolitics = function () {
        $scope.text = $scope.privacy_politics;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializePrivacyPolitics();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializeFrequentlyQuestions = function () {
        Texts.get({
          group: "frequently-questions"
        }, function (data) {
          if (!data.error) {
            $scope.frequently_questions = data.res;
            $scope.menuText.push($scope.frequently_questions);
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al cargar sus datos", "error");
          }
        });
      };
      $scope.saveFrequentlyQuestions = function () {
        $scope.text = $scope.frequently_questions;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializePrivacyPolitics();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.initializeSlogans = function () {
        Texts.get({
          group: "slogans"
        }, function (data) {
          if (!data.error) {
            $scope.slogans = data.res;
            $scope.sortMenuText();
          } else if (!$rootScope.production) {
            $rootScope.showNotify("Oh No! ", data.error.message, "error");
          } else {
            $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
          }
        });
      };
      $scope.saveSlogans = function () {
        $scope.text = $scope.slogans;
        if ($scope.validateForm()) {
          $scope.formatComponents();
          Texts.update({
            text: $scope.text
          }, function (data) {
            if (!data.error) {
              $scope.initializePrivacyPolitics();
              $rootScope.showNotify("Acción Satisfactoria ", "Texto salvado satisfactoriamente", "success");
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", "error");
            }
          });
        } else {
          $rootScope.showNotify("Oh No! ", "Formulario Incorrecto", "error");
        }
      };
      /**********************************************/
      $scope.sortMenuText = function () {
        for (var i = 0; i < $scope.menuText.length - 1; i++) {
          for (var j = i + 1; j < $scope.menuText.length; j++) {
            if ($scope.menuText[i].pos !== null) {
              if ($scope.menuText[j].pos === null || ($scope.menuText[i].pos > $scope.menuText[j].pos)) {
                var aux = $scope.menuText[i];
                $scope.menuText[i] = $scope.menuText[j];
                $scope.menuText[j] = aux;
              }
            }
          }
        }
      };
      $scope.initializeTabs = function () {
        $scope.menuText = [];
        $scope.initializeUserGuide();
        $scope.initializeSailorGuide();
        $scope.initializeAboutUs();
        $scope.initializeServiceConditions();
        $scope.initializePrivacyPolitics();
        $scope.initializeFrequentlyQuestions();
        $scope.initializeSlogans();
      };
      $scope.initializeTabs();
      $scope.getNameText = function (group) {
        var response = null;
        switch (group) {
        case "user-guide":
          response = "Guía del Usuario";
          break;
        case "sailor-guide":
          response = "Guía del Navegante";
          break;
        case "about-us":
          response = "Sobre Alquilerdebarco.com";
          break;
        case "service-conditions":
          response = "Condiciones del Servicio";
          break;
        case "frequently-questions":
          response = "Preguntas Frecuentes";
          break;
        default:
          response = "Política de Privacidad y Cookies";
          break;
        }
        return response;
      };
      $scope.menu = function (text, action) {
        Texts.menu.menu({
          id: text._id,
          action: action
        }, function (data) {
          if (!data.error) {
            if (!data.error) {
              $scope.initializeTabs();
            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al guardar el metadato", "error");
            }
          }
        });
      };
      $scope.modelPhoto = {
        res: null,
        error: null
      };
      $scope.imgsAper = function () {
        // $(".fix-imgc").attr("style", "height:" + $("div."+ $scope.selectedPage +" .fix-imgc img").width() / 2.17 + "px"); //3.05;
      };
      $scope.$watch("modelPhoto", function (newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue.res) {
            $scope.loadPagePhotos($scope.selectedPage);
            setTimeout(function () {
              $scope.imgsAper();
            }, 100);

          }
        }
      });
      angular.element(window).on("scroll", function (e, c) {
        angular.element(".scrolling").css("top", window.scrollY);
      });

      $scope.isPage = function (text) {
        var response = false;
        switch (text.group) {
        case "user-guide":
          response = true;
          break;
        case "sailor-guide":
          response = true;
          break;
        case "about-us":
          response = true;
          break;
        case "service-conditions":
          response = true;
          break;
        case "frequently-questions":
          response = true;
          break;
        case "privacy-politics":
          response = true;
          break;
        case "newsletter":
          response = true;
          break;
        case "rent_private":
          response = true;
          break;
        case "ship-details":
          response = true;
          break;
        case "rent_enterprise":
          response = true;
          break;
        default:
          response = false;
          break;
        }
        return response;
      };
      $scope.NamePage = function (text) {
        var response = false;
        switch (text.group) {
        case "user-guide":
          response = "Guia de Usuario";
          break;
        case "sailor-guide":
          response = "Guía del Navegante";
          break;
        case "about-us":
          response = "Quiénes somos";
          break;
        case "service-conditions":
          response = "Condiciones del Servicio";
          break;
        case "frequently-questions":
          response = "Preguntas Frecuentes";
          break;
        case "privacy-politics":
          response = "Política de Privacidad y Cookies";
          break;
        case "newsletter":
          response = "Boletín";
          break;
        case "rent_private":
          response = "Particulares";
          break;
        case "ship-details":
          response = "Detalle de Barco";
          break;
        case "rent_enterprise":
          response = "Empresas";
          break;
        default:
          response = false;
          break;
        }
        return response;
      };

      $scope.isGeneral = function (text) {
        var response = false;
        switch (text.group) {
        case "index":
          response = true;
          break;
        case "our-ships":
          response = true;
          break;
        case "answer_booking":
          response = true;
          break;
        case "rent-ship":
          response = true;
          break;
        case "slogans":
          response = true;
          break;
        case "general":
          response = true;
          break;
        default:
          response = false;
          break;
        }
        return response;
      };
      $scope.NameGeneral = function (text) {
        var response = false;
        switch (text.group) {
        case "index":
          response = "Guia de Usuario";
          break;
        case "our-ships":
          response = "Alquiler de ...";
          break;
        case "answer_booking":
          response = "Respuestas de la Reservación";
          break;
        case "rent-ship":
          response = "Botón sobre el Slider";
          break;
        case "slogans":
          response = "Textos del Slider";
          break;
        case "general":
          response = "Términos Generales";
          break;
        default:
          response = false;
          break;
        }
        return response;
      };

      $scope.isSlug = function (text) {
        var response = false;
        switch (text.group) {
        case "slugs":
          response = true;
          break;
        default:
          response = false;
          break;
        }
        return response;
      };
    }
  ]);