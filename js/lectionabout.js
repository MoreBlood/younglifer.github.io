function LectionAboutController($rootScope, $scope, Data, $state, $stateParams, $sce, $document) {
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
        $document[0].title = $scope.Data.lection_name;
        $scope.ytUrl = $sce.trustAsResourceUrl($scope.Data.video_link);

        $scope.dateParsed = Date.parseExact($scope.Data.date, "MM-dd-yyyy HH:mm");
        lector["id"] = parseInt($scope.Data.lector_id);
        $scope.Lector = Data.getLectors(lector)[0];
    });

    $scope.GetPlace = function (id) {
        return Data.getPlaces({'id': id})[0].name.toString();
    };

    $scope.hasSchool = function (sc, list) {
        return list.indexOf(sc) !== -1;
    };
    $scope.GetEndTime = function (st, dur) {
        var duration =  Date.parseExact(dur, 'HH:mm');
        var date = angular.copy(Date.parse(st));
        return date.add({hours : duration.getHours(), minutes: duration.getMinutes()});
    }
}

angular.module('timetableapp').component('lectionabout', {
        templateUrl: 'lectionabout.html',
        controller: LectionAboutController
    });

