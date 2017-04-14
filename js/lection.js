function LectionController($rootScope, $scope, $state, Data, $stateParams, $filter) {
    $scope.current = $stateParams.name;
    Data.getPromise().then(function () {
        var params = {};

        var school = Data.getSchools({"url": $stateParams.name})[0];
        if ($stateParams.name) {
            if (school) {
                $scope.schoolName = school.name;
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

        if (month) {
            if (month.length === 1) month = "0" + month;
            params['date'] = {regex: new RegExp('^' + month + '........$')};
            $scope.month = new Date(2007, month, 1);
        }
        if (date && month) {
            if (date.length === 1) date = "0" + date;
            params['date'] = {regex: new RegExp('^' + month + '.' + date + '.....$')};
            $scope.date = new Date(2007, 1, date);
        }
        if (lector) {
            params['lector_id'] = parseInt(lector, 10);
            if (!Data.getLectors({id: params['lector_id']})[0]){
                $state.go('404');
                return;
            }
            $scope.lector = params['lector_id'];
        }
        if (place) {
            params['place_id'] = parseInt(place, 10);
            if (!Data.getPlaces({id: params['place_id']})[0]){
                $state.go('404');
                return;
            }
            $scope.place = params['place_id'];
        }

        $scope.Data = [];

        Data.get.lectionList()(params).each(function (record) {
            if ((record.lection_schools !== undefined) &&
                ($scope.hasSchool((Data.getSchools({'url' : $stateParams.name})[0]  ?  Data.getSchools({'url' : $stateParams.name})[0].id : 0),  record.lection_schools) ||
                $scope.hasSchool(1,  record.lection_schools) ||
                $stateParams.name === $scope.schools[0].url ||
                $stateParams.name === undefined)) {
                $scope.Data.push(record);// track by in ng repeat should fix it
            }
        });

        $scope.Data.sort(function (a, b) {
            return  Date.parseExact(a.date, "MM-dd-yyyy") -  Date.parseExact(b.date, "MM-dd-yyyy");
        });
    });

    $scope.hasSchool = function (sc, list) {
       return list.indexOf(sc) !== -1;
    };

    var checkForSchools = function (schools) {
        return schools.forEach(function (sc) {
            if (sc){
                return true;
            }
        });
    };

    $scope.toDate = function (date) {
        return Date.parseExact(date, "MM-dd-yyyy");
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

    /**
     * @return {string}
     */
    $scope.GetPlaceMax = function (id) {
        return Data.getPlaces({'id': id})[0].max.toString();
    };
}

angular.module('timetableapp').component('lection', {
        templateUrl: 'lection.html',
        controller: LectionController
    });
