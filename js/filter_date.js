'use strict';

function FilterDateController($scope, $state, Data, $stateParams, $document, $filter)
{
    Data.getPromise().then(function () {

        var school = Data.getSchools({"url": $stateParams.name})[0];
        var place = Data.getPlaces({"id": parseInt($stateParams.place, 10)})[0];
        if ($stateParams.name || $stateParams.place) {
            if (school) {

                $scope.schoolName = school.name;
                $scope.current = $stateParams.name;
            }
            else if (place){
                $scope.place = place.name;
                $scope.place_id = $stateParams.place;
            }
            else {
                $state.go('404');
                return;
            }
        }

        $document[0].title = 'Временной промежуток';

        $scope.range_s_t = Date.parseExact("10:20", 'HH:mm');
        $scope.range_e_t = Date.parseExact("18:20", 'HH:mm');
        $scope.range_s_d = "10-01-2016";
        $scope.range_e_d = "12-31-2016";

        $scope.Filter = function () {
            if (school) {
                $state.go('school_lections_range_name', {
                    'name': $scope.current,
                    'range_s': $scope.range_s_d + " " + $filter('date')($scope.range_s_t, "HH:mm"),
                    'range_e': $scope.range_e_d + " " + $filter('date')($scope.range_e_t, "HH:mm")
                });
            }
            else {
                $state.go('school_lections_range_place', {
                    'place': $scope.place_id,
                    'range_s': $scope.range_s_d + " " + $filter('date')($scope.range_s_t, "HH:mm"),
                    'range_e': $scope.range_e_d + " " + $filter('date')($scope.range_e_t, "HH:mm")
                });
            }
            };

    });

}

angular.module('timetableapp').component('filterdate',
    {
        templateUrl: 'views/filterdate.html',
        controller: FilterDateController
    });

