/**
 * Created by ernestomr87@gmail.com on 16/11/2015.
 */

angular.module("rentShipApp.indexCtrl", [])
    .controller("indexCtrl", ["$scope", "$rootScope", "Engine", "Users", "Offers", "$filter",
      function ($scope, $rootScope, Engine, Users, Offers, $filter) {

        $rootScope.pageSelected = "index";

        $scope.start = null;
        $scope.end = null;

        function gd(date) {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        }

        var chartColours = ["#96CA59", "#E74C3C"];
        $scope.loadGraphic = function () {
          Engine.graphic.get({
            start: $scope.start,
            end: $scope.end
          }, function (data) {
            if (!data.error) {
              var d1 = [];
              var d2 = [];
              var aux = data.res;
              for (var i = 0; i < aux.length; i++) {
                var date = new Date(aux[i][0]);
                d1.push([gd(date), aux[i][1]]);
              }
              for (var i = 0; i < aux.length; i++) {
                var date = new Date(aux[i][0]);
                d2.push([gd(date), aux[i][2]]);
              }
              var chartMinDate = d1[0][0]; //first day
              var chartMaxDate = d1[aux.length - 1][0]; //last day
              var tickSize = [1, "day"];
              var tformat = "%d/%m/%y";

              $scope.minDate = new Date(chartMinDate); //first day
              $scope.maxDate = new Date(chartMaxDate); //last day

              $("#reportrange").empty();
              var text = $filter("date")($scope.minDate, "MM/dd/yyyy") + " - " + $filter("date")($scope.maxDate, "MM/dd/yyyy");
              angular.element("#reportrange").val(text);


              $("#reportrange").daterangepicker({
                opens: "left",
                format: "MM/dd/yyyy",
              }, function (start, end) {
                $("#showNotyErrorSeason").hide();
                $scope.start = angular.copy(new Date(start).getTime());
                $scope.end = angular.copy(new Date(end).getTime());
                $scope.loadGraphic();
              });

                        //graph options
              var options = {
                grid: {
                  show: true,
                  aboveData: true,
                  color: "#3f3f3f",
                  labelMargin: 10,
                  axisMargin: 0,
                  borderWidth: 0,
                  borderColor: null,
                  minBorderMargin: 5,
                  clickable: true,
                  hoverable: true,
                  autoHighlight: true,
                  mouseActiveRadius: 100
                },
                series: {
                  lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                  },
                  points: {
                    show: true,
                    radius: 4.5,
                    symbol: "circle",
                    lineWidth: 3.0
                  }
                },
                legend: {
                  position: "ne",
                  margin: [0, -25],
                  noColumns: 0,
                  labelBoxBorderColor: null,
                  labelFormatter: function (label, series) {
                                    // just add some space to labes
                    return label + "&nbsp;&nbsp;";
                  },
                  width: 40,
                  height: 1
                },
                colors: chartColours,
                shadowSize: 0,
                tooltip: true, //activate tooltip
                tooltipOpts: {
                  content: "%s: %y.0",
                  xDateFormat: "%d/%m",
                  shifts: {
                    x: -30,
                    y: -50
                  },
                  defaultTheme: true
                },
                yaxis: {
                  min: 0
                },
                xaxis: {
                  mode: "time",
                  minTickSize: tickSize,
                  timeformat: tformat,
                  min: chartMinDate,
                  max: chartMaxDate
                }
              };
              $.plot($("#placeholder33x"), [{
                label: "Reservas",
                data: d1,
                lines: {
                  fillColor: "rgba(150, 202, 89, 0.12)"
                }, //#96CA59 rgba(150, 202, 89, 0.42)
                points: {
                  fillColor: "#fff"
                }
              }, {
                label: "Cancelaciones",
                data: d2,
                lines: {
                  fillColor: "rgba(150, 202, 89, 0.12)"
                }, //#96CA59 rgba(150, 202, 89, 0.42)
                points: {
                  fillColor: "#fff"
                }
              }], options);


            } else if (!$rootScope.production) {
              $rootScope.showNotify("Oh No! ", data.error.message, "error");
            } else {
              $rootScope.showNotify("Oh No! ", "Ha ocurrido un error al obtener sus datos", "error");
            }
          });
        };
        $scope.loadGraphic();

        // $scope.offers = [];
        // $scope.maxSizeAct = 10;
        // $scope.skipAct = 0;
        //
        // $scope.loadOffers = function () {
        //   Offers.list.list({
        //     limit: $scope.maxSizeAct,
        //     skip: $scope.skipAct,
        //     status: "accept"
        //   }, function (data) {
        //     if (!data.error) {
        //       $scope.offers = data.res;
        //     }
        //   });
        // };
        // //$scope.loadOffers();
        // $scope.refunds = [];
        // $scope.loadRefunds = function () {
        //   Offers.list.list({
        //     limit: $scope.maxSizeAct,
        //     skip: $scope.skipAct,
        //     status: "refund"
        //   }, function (data) {
        //     if (!data.error) {
        //       $scope.refunds = data.res;
        //     }
        //   });
        // };
        // //$scope.loadRefunds();

      }
    ]);