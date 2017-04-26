/**
 * Created by ernestomr87@gmail.com on 12/3/2015.
 */

angular.module('rentShipApp.localizationsCtrl', [])
    .controller('localizationsCtrl', ['$scope', '$rootScope', 'Localizations',
        function ($scope, $rootScope, Localizations) {

            $rootScope.pageSelected = 'localizations';

            $scope.initializeVars = function () {
                var aux = $rootScope.prepareLanguagesTabs();
                $scope.country = {
                    _id: "",
                    name: angular.copy(aux)
                };
                $scope.city = {
                    _id: "",
                    name: angular.copy(aux)
                };
                $scope.area = {
                    _id: "",
                    name: angular.copy(aux)
                };
                $scope.port = {
                    _id: "",
                    name: angular.copy(aux),
                    latitude: null,
                    longitude: null
                };
                $scope.selectTab = 0;
                $scope.selectForm = 0;
                $scope.showEdit = false;
                $scope.filter = {
                    country_id: null,
                    city_id: null,
                    area_id: null
                }
                $scope.countryChecked = null;
                $scope.cityChecked = null;
                $scope.areaChecked = null;
            };
            $scope.selectedTab = function (index) {
                $scope.selectTab = index;
            };
            $scope.isos = ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "BQ", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CT", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK"
                , "CR"
                , "HR"
                , "CU"
                , "CY"
                , "CZ"
                , "CI"
                , "DK"
                , "DJ"
                , "DM"
                , "DO"
                , "NQ"
                , "DD"
                , "EC"
                , "EG"
                , "SV"
                , "GQ"
                , "ER"
                , "EE"
                , "ET"
                , "FK"
                , "FO"
                , "FJ"
                , "FI"
                , "FR"
                , "GF"
                , "PF"
                , "TF"
                , "FQ"
                , "GA"
                , "GM"
                , "GE"
                , "DE"
                , "GH"
                , "GI"
                , "GR"
                , "GL"
                , "GD"
                , "GP"
                , "GU"
                , "GT"
                , "GG"
                , "GN"
                , "GW"
                , "GY"
                , "HT"
                , "HM"
                , "HN"
                , "HK"
                , "HU"
                , "IS"
                , "IT"
                , "IN"
                , "ID"
                , "IR"
                , "IQ"
                , "IE"
                , "IM"
                , "IL"
                , "JM"
                , "JP"
                , "JE"
                , "JT"
                , "JO"
                , "KZ"
                , "KE"
                , "KI"
                , "KW"
                , "KG"
                , "LA"
                , "LV"
                , "LB"
                , "LS"
                , "LR"
                , "LY"
                , "LI"
                , "LT"
                , "LU"
                , "MO"
                , "MK"
                , "MG"
                , "MW"
                , "MY"
                , "MV"
                , "ML"
                , "MT"
                , "MH"
                , "MQ"
                , "MR"
                , "MU"
                , "YT"
                , "FX"
                , "MX"
                , "FM"
                , "MI"
                , "MD"
                , "MC"
                , "MN"
                , "ME"
                , "MS"
                , "MA"
                , "MZ"
                , "MM"
                , "NA"
                , "NR"
                , "NP"
                , "NL"
                , "AN"
                , "NT"
                , "NC"
                , "NZ"
                , "NI"
                , "NE"
                , "NG"
                , "NU"
                , "NF"
                , "KP"
                , "VD"
                , "MP"
                , "NO"
                , "OM"
                , "PC"
                , "PK"
                , "PW"
                , "PS"
                , "PA"
                , "PZ"
                , "PG"
                , "PY"
                , "YD"
                , "PE"
                , "PH"
                , "PN"
                , "PL"
                , "PT"
                , "PR"
                , "QA"
                , "RO"
                , "RU"
                , "RW"
                , "RE"
                , "BL"
                , "SH"
                , "KN"
                , "LC"
                , "MF"
                , "PM"
                , "VC"
                , "WS"
                , "SM"
                , "SA"
                , "SN"
                , "RS"
                , "CS"
                , "SC"
                , "SL"
                , "SG"
                , "SK"
                , "SI"
                , "SB"
                , "SO"
                , "ZA"
                , "GS"
                , "KR"
                , "ES"
                , "LK"
                , "SD"
                , "SR"
                , "SJ"
                , "SZ"
                , "SE"
                , "CH"
                , "SY"
                , "ST"
                , "TW"
                , "TJ"
                , "TZ"
                , "TH"
                , "TL"
                , "TG"
                , "TK"
                , "TO"
                , "TT"
                , "TN"
                , "TR"
                , "TM"
                , "TC"
                , "TV"
                , "UM"
                , "PU"
                , "VI"
                , "UG"
                , "UA"
                , "SU"
                , "AE"
                , "GB"
                , "US"
                , "ZZ"
                , "UY"
                , "UZ"
                , "VU"
                , "VA"
                , "VE"
                , "VN"
                , "WK"
                , "WF"
                , "EH"
                , "YE"
                , "ZM"
                , "ZW"
                , "AX"
            ];

            $scope.checkCountry = function (country) {
                var flag = true;

                $scope.cityChecked = null;
                $scope.filter.city_id = null;

                $scope.areaChecked = null;
                $scope.filter.area_id = null;

                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == country._id) {
                        if ($scope.countryChecked == i) {
                            $scope.countryChecked = null;
                            flag = false;
                        }
                        else {
                            $scope.countryChecked = i;
                        }
                        break;
                    }
                }
                if (flag) {
                    $scope.filter.country_id = country._id;
                    $scope.listCities();
                    $scope.listAreas();
                    $scope.listPorts();
                }
                else {
                    $scope.filter.country_id = null;
                    $scope.listCities();
                    $scope.listAreas();
                    $scope.listPorts();
                }
            };

            $scope.checkCity = function (city) {
                var flag = true;
                $scope.areaChecked = null;
                $scope.filter.area_id = null;
                for (var i = 0; i < $scope.cities.length; i++) {
                    if ($scope.cities[i]._id == city._id) {
                        if ($scope.cityChecked == i) {
                            $scope.cityChecked = null;
                            flag = false;
                        }
                        else {
                            $scope.cityChecked = i;
                        }
                        break;
                    }
                }
                if (flag) {
                    $scope.filter.city_id = city._id;
                    $scope.listAreas();
                    $scope.listPorts();
                }
                else {
                    $scope.filter.city_id = null;
                    $scope.listAreas();
                    $scope.listPorts();
                }
            };

            $scope.checkArea = function (area) {
                var flag = true;
                for (var i = 0; i < $scope.areas.length; i++) {
                    if ($scope.areas[i]._id == area._id) {
                        if ($scope.areaChecked == i) {
                            $scope.areaChecked = null;
                            flag = false;
                        }
                        else {
                            $scope.areaChecked = i;
                        }
                        break;
                    }
                }
                if (flag) {
                    $scope.filter.area_id = area._id;
                    $scope.listPorts();
                }
                else {
                    $scope.filter.area_id = null;
                    $scope.listPorts();
                }
            };


            /*COUTRIES*/
            $scope.countries = [];
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.skip = 0;

            $scope.pageChanged = function () {
                $scope.skip = ($scope.currentPage - 1) * $scope.maxSize;
                $scope.list();
            };
            $scope.initializeVars();

            $scope.prepareLanguages = function (list) {
                var aux = $rootScope.prepareLanguagesTabs();
                for (var i = 0; i < list.length; i++) {
                    if (list[i].name.length < aux.length) {
                        for (var k = 0; k < aux.length; k++) {
                            var exist = false;
                            for (var l = 0; l < list[i].name.length; l++) {
                                if (aux[k]._id == list[i].name[l].language) {
                                    exist = true;
                                    break;
                                }
                            }
                            if (!exist) {
                                list[i].name.push({
                                    language: aux[k]._id,
                                    value: ""
                                });
                            }
                        }

                    }
                }
                return list;
            };

            $scope.formatCountries = function () {
                for (var i = 0; i < $scope.country.name.length; i++) {
                    var aux = {
                        _id: $scope.country.name[i].language,
                        value: $scope.country.name[i].value
                    }
                    $scope.country.name[i] = aux;
                }
            };

            $scope.formatCities = function () {
                for (var i = 0; i < $scope.city.name.length; i++) {
                    var aux = {
                        _id: $scope.city.name[i].language,
                        value: $scope.city.name[i].value
                    }
                    $scope.city.name[i] = aux;
                }
            };

            $scope.formatPorts = function () {
                for (var i = 0; i < $scope.port.name.length; i++) {
                    var aux = {
                        _id: $scope.port.name[i].language,
                        value: $scope.port.name[i].value
                    }
                    $scope.port.name[i] = aux;
                }
            };

            $scope.formatAreas = function () {
                for (var i = 0; i < $scope.area.name.length; i++) {
                    var aux = {
                        _id: $scope.area.name[i].language,
                        value: $scope.area.name[i].value
                    }
                    $scope.area.name[i] = aux;
                }
            };

            $scope.list = function () {
                Localizations.country.get({limit: $scope.maxSize, skip: $scope.skip}, function (data) {
                    if (!data.error) {
                        $scope.totalItems = data.cont;
                        for (var i = 0; i < data.res.length; i++) {
                            if (data.res[i].iso)
                                data.res[i].iso = data.res[i].iso.toUpperCase()

                        }
                        $scope.countries = $scope.prepareLanguages(data.res);
                        if ($scope.currentPage > 1 && !$scope.countries.length) {
                            $scope.currentPage--;
                            $scope.skip = $scope.skip - $scope.maxSize;
                            $scope.list();
                        }
                    }
                });
            };
            $scope.createCountry = function () {
                Localizations.country.create({
                    country: $scope.country,
                    iso: $scope.country.iso.toLowerCase()
                }, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Lenguaje Creado satisfactoriamente", 'success');
                    } else if (data.error.code) {
                        if (data.error.code == "11000")
                            $rootScope.showNotify("Oh No! ", "El iso utilizado debe ser único", 'error');
                    }
                    else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al crear sus datos", 'error');
                    }
                });
            };
            $scope.updateCountry = function () {
                $scope.formatCountries();
                Localizations.country.update({
                    country: $scope.country,
                    iso: $scope.country.iso.toLowerCase()
                }, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.removeCountry = function () {
                Localizations.country.remove({country: $scope.country}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.selectCountry = function (country) {
                $scope.showEdit = true;
                $scope.country = angular.copy(country)
                $scope.selectForm = 1;
            };
            $scope.selectDelCountry = function (country) {
                $scope.country = angular.copy(country);
            };
            $scope.list();

            /*CITIES*/
            $scope.cities = [];
            $scope.cityCurrentPage = 1;
            $scope.cityMaxSize = 10;
            $scope.citySkip = 0;

            $scope.cityPageChanged = function () {
                $scope.citySkip = ($scope.cityCurrentPage - 1) * $scope.cityMaxSize;
                $scope.listCities();
            };
            $scope.selectAddCity = function (country) {
                $scope.country = angular.copy(country)
                $scope.selectForm = 2;
            };
            $scope.listCities = function () {
                Localizations.city.get({
                    limit: $scope.cityMaxSize,
                    skip: $scope.citySkip,
                    filter: $scope.filter
                }, function (data) {
                    if (!data.error) {
                        $scope.cityTotalItems = data.cont;

                        $scope.cities = $scope.prepareLanguages(data.res);
                        if ($scope.cityCurrentPage > 1 && !$scope.cities.length) {
                            $scope.cityCurrentPage--;
                            $scope.citySkip = $scope.citySkip - $scope.cityMaxSize;
                            $scope.listCities();
                        }
                    }
                });
            };
            $scope.createCity = function () {
                Localizations.city.create({country_id: $scope.country._id, city: $scope.city}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Ciudad Creada satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.updateCity = function () {
                $scope.formatCities();
                Localizations.city.update({city: $scope.city}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.removeCity = function () {
                Localizations.city.remove({city: $scope.city}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.selectCity = function (city) {
                $scope.showEdit = true;
                $scope.city = angular.copy(city);
                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == $scope.city.country._id) {
                        $scope.country = $scope.countries[i];
                    }
                }

                $scope.selectForm = 2;
            };

            $scope.selectDelCity = function (city) {
                $scope.city = angular.copy(city);
            };
            $scope.listCities();

            /*AREAS*/
            $scope.areas = [];
            $scope.areaCurrentPage = 1;
            $scope.areaMaxSize = 10;
            $scope.areaSkip = 0;

            $scope.areaPageChanged = function () {
                $scope.areaSkip = ($scope.areaCurrentPage - 1) * $scope.areaMaxSize;
                $scope.listAreas();
            };
            $scope.selectAddArea = function (city) {
                $scope.city = angular.copy(city)
                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == $scope.city.country._id) {
                        $scope.country = $scope.countries[i];
                    }
                }
                $scope.selectForm = 3;
            };
            $scope.listAreas = function () {
                Localizations.area.get({
                    limit: $scope.areaMaxSize,
                    skip: $scope.areaSkip,
                    filter: $scope.filter
                }, function (data) {
                    if (!data.error) {
                        $scope.areaTotalItems = data.cont;
                        $scope.areas = $scope.prepareLanguages(data.res);
                        if ($scope.areaCurrentPage > 1 && !$scope.areas.length) {
                            $scope.areaCurrentPage--;
                            $scope.areaSkip = $scope.areaSkip - $scope.areaMaxSize;
                            $scope.listAreas();
                        }
                    }
                });
            };
            $scope.createArea = function () {
                Localizations.area.create({
                    country_id: $scope.city.country._id,
                    city_id: $scope.city._id,
                    area: $scope.area
                }, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Puerto Creado satisfactoriamente", 'success');
                    } else if ($rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.updateArea = function () {
                $scope.formatAreas();
                Localizations.area.update({area: $scope.area}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.removeArea = function () {
                Localizations.area.remove({area: $scope.area}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.selectArea = function (area) {
                $scope.showEdit = true;
                $scope.area = angular.copy(area);
                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == $scope.area.country._id) {
                        $scope.country = $scope.countries[i];
                    }
                }
                for (var i = 0; i < $scope.cities.length; i++) {
                    if ($scope.cities[i]._id == $scope.area.city._id) {
                        $scope.city = $scope.cities[i];
                    }
                }
                $scope.selectForm = 3;
            };
            $scope.selectDelArea = function (area) {
                $scope.area = angular.copy(area);
            };
            $scope.listAreas();

            /*PORTS*/

            $scope.ports = [];
            $scope.portCurrentPage = 1;
            $scope.portMaxSize = 10;
            $scope.portSkip = 0;

            $scope.portPageChanged = function () {
                $scope.portSkip = ($scope.portCurrentPage - 1) * $scope.portMaxSize;
                $scope.listPorts();
            };
            $scope.selectAddPort = function (area) {

                $scope.area = angular.copy(area);
                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == $scope.area.country._id) {
                        $scope.country = $scope.countries[i];
                    }
                }
                for (var i = 0; i < $scope.cities.length; i++) {
                    if ($scope.cities[i]._id == $scope.area.city._id) {
                        $scope.city = $scope.cities[i];
                    }
                }
                $scope.selectForm = 3;
            };
            $scope.listPorts = function () {
                Localizations.port.get({
                    limit: $scope.portMaxSize,
                    skip: $scope.portSkip,
                    filter: $scope.filter
                }, function (data) {
                    if (!data.error) {
                        $scope.portTotalItems = data.cont;
                        $scope.ports = $scope.prepareLanguages(data.res);
                        if ($scope.portCurrentPage > 1 && !$scope.ports.length) {
                            $scope.portCurrentPage--;
                            $scope.portSkip = $scope.portSkip - $scope.portMaxSize;
                            $scope.listPorts();
                        }
                    }
                });
            };
            $scope.createPort = function () {
                Localizations.port.create({
                    country_id: $scope.city.country._id,
                    city_id: $scope.city._id,
                    area_id: $scope.area._id,
                    port: $scope.port
                }, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Puerto Creado satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.updatePort = function () {
                $scope.formatPorts();
                Localizations.port.update({port: $scope.port}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.removePort = function () {
                Localizations.port.remove({port: $scope.port}, function (data) {
                    if (!data.error) {
                        $scope.initializeVars();
                        $scope.reloadLocalization();
                        $rootScope.showNotify("Acción Satisfactoria ", "Cambios realizados satisfactoriamente", 'success');
                    } else if (!$rootScope.production) {
                        $rootScope.showNotify("Oh No! ", data.error.message, 'error');
                    } else {
                        $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al salvar sus datos", 'error');
                    }
                });
            };
            $scope.selectPort = function (port) {
                $scope.showEdit = true;
                $scope.port = angular.copy(port);
                for (var i = 0; i < $scope.countries.length; i++) {
                    if ($scope.countries[i]._id == $scope.port.country._id) {
                        $scope.country = $scope.countries[i];
                    }
                }
                for (var i = 0; i < $scope.cities.length; i++) {
                    if ($scope.cities[i]._id == $scope.port.city._id) {
                        $scope.city = $scope.cities[i];
                    }
                }
                for (var i = 0; i < $scope.areas.length; i++) {
                    if ($scope.areas[i]._id == $scope.port.area._id) {
                        $scope.area = $scope.areas[i];
                    }
                }
                $scope.selectForm = 3;
            };
            $scope.selectDelPort = function (port) {
                $scope.port = angular.copy(port);
            };
            $scope.listPorts();

            /*SOCKETS*/

            $scope.reloadLocalization = function () {
                $scope.list();
                $scope.listCities();
                $scope.listAreas();
                $scope.listPorts();
            }


        }])
;

