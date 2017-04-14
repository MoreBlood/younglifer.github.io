function LectionAboutController($rootScope, $scope, Data, $state, $stateParams, $sce) {
    Data.getPromise().then(function () {
        var schools = {};
        var lector = {};
        schools["lection_id"] = parseInt($stateParams.id, 10);

        $scope.schools = Data.getSchools();

        $scope.Data = Data.getLections()(schools).get()[0];
        if (!$scope.Data){
            $state.go('404');
            return;
        }

        $scope.ytUrl = $sce.trustAsResourceUrl($scope.Data.video_link);

        $scope.dateParsed = Date.parseExact($scope.Data.date, "MM-dd-yyyy");
        lector["id"] = parseInt($scope.Data.lector_id);
        $scope.Lector = Data.getLectors(lector)[0];
    });

    $scope.GetPlace = function (id) {
        return Data.getPlaces({'id': id})[0].name.toString();
    };

    $scope.hasSchool = function (sc, list) {
        return list.indexOf(sc) !== -1;
    };
}

angular.module('timetableapp').component('lectionabout', {
        templateUrl: 'lectionabout.html',
        controller: LectionAboutController
    });

