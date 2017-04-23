'use strict';

function LectionController($rootScope, $scope, $state, Data, $stateParams, $filter, $document) {
    $scope.current = $stateParams.name;
    Data.getPromise().then(function () {
        var params = {};

        var school = Data.getSchools({"url": $stateParams.name})[0];
        if ($stateParams.name) {
            if (school) {
                $scope.schoolName = school.name;
                $document[0].title = school.name;
                $scope.countOfStudents = school.students_count;
            }
            else {
                $state.go('404');
                return;
            }
        }

        $scope.schools = Data.getSchools();
        $scope.places = Data.getPlaces();
        $scope.lectors = Data.getLectors();

        var month = $stateParams.month;
        var date  = $stateParams.date;
        var lector = $stateParams.lector;
        var place = $stateParams.place;
        var year = $stateParams.year;
        var range_s = $stateParams.range_s;
        var range_e = $stateParams.range_e;

        if (month && year) {//дописать год!!!!!!!
            if (month.length === 1) month = "0" + month;
            params['date'] = {regex: new RegExp('^' + month + '....' + year + '......$')};
            $scope.month = new Date(year, month - 1, 1);
            $document[0].title = $filter('capitalize')($filter('date')($scope.month, 'MMMM'));
        }
        if (date && month && year) {
            if (date.length === 1) date = "0" + date;
            params['date'] = {regex: new RegExp('^' + month + '.' + date + '.' + year + '......$')};
            $scope.date = new Date(year, month - 1, date);

            $document[0].title = $filter('capitalize')($filter('date')($scope.date, 'MMMM d'));
        }
        if (lector) {
            params['lector_id'] = parseInt(lector, 10);
            if (!Data.getLectors({id: params['lector_id']})[0]){
                $state.go('404');
                return;
            }
            $scope.lector = params['lector_id'];

            $document[0].title = $scope.GetLector($scope.lector);
        }
        if (place) {
            params['place_id'] = parseInt(place, 10);
            if (!Data.getPlaces({id: params['place_id']})[0]){
                $state.go('404');
                return;
            }
            $scope.place = params['place_id'];

            $document[0].title = $scope.GetPlace($scope.place);
        }

        if (range_s && range_e){
            range_s = Date.parseExact(range_s, 'MM-dd-yyyy HH:mm');
            range_e = Date.parseExact(range_e, 'MM-dd-yyyy HH:mm');
            $scope.range =  $filter('capitalize')($filter('date')(range_s, 'MMMM d, yyyy')) + " - " + $filter('date')(range_e, 'MMMM d, yyyy');
        }
        $scope.Data = [];

        Data.get.lectionList()(params).each(function (record) {
            var recordStart =  Date.parseExact(record.date, 'MM-dd-yyyy HH:mm');
            if ((record.lection_schools !== undefined) &&  ((range_e || range_s) ? recordStart.between(range_s, range_e) : true) &&
                ($scope.hasSchool((Data.getSchools({'url' : $stateParams.name})[0]  ?  Data.getSchools({'url' : $stateParams.name})[0].id : 0),  record.lection_schools) ||
                $scope.hasSchool(1,  record.lection_schools) ||
                $stateParams.name === $scope.schools[0].url ||
                $stateParams.name === undefined)) {
                $scope.Data.push(record);
            }
        });
        $scope.Data.sort(function (a, b) {
            return  $scope.toDate(a.date) -  $scope.toDate(b.date);
        });
    });

    $scope.hasSchool = function (sc, list) {
       return list.indexOf(sc) !== -1;
    };
    $scope.toDate = function (date, type) {
        var format = "MM-dd-yyyy HH:mm";
        if (type) return $filter('date')(Date.parseExact(date, format), type);
        return Date.parseExact(date, format);
    };
    $scope.ShowLector = function ($event, element) {
        $rootScope.$broadcast('showLector', $event, element);
    };
    $scope.GetLector = function (id) {
        return Data.getLectors({'id': id})[0].name.toString();
    };
    $scope.GetPlace = function (id) {
        return Data.getPlaces({'id': id})[0].name.toString();
    };
    $scope.GetEndTime = function (st, dur) {
        var duration =  Date.parseExact(dur, 'HH:mm');
        var date = angular.copy(Date.parse(st));
        return date.add({hours : duration.getHours(), minutes: duration.getMinutes()});
    };
    /**
     * @return {string}
     */
    $scope.GetPlaceMax = function (id) {
        return Data.getPlaces({'id': id})[0].max.toString();
    };
}

angular.module('timetableapp').component('lection', {
        templateUrl: 'views/lection.html',
        controller: LectionController
    });
