'use strict';

function EditLectionController($scope, $state, Data, $stateParams, $document, SweetAlert, $filter) {
    Data.getPromise().then(function () {
        var data = Data.getLections();
        var selector = {};

        $scope.schools = Data.getSchools();
        $scope.lectors = Data.getLectors();
        $scope.places = Data.getPlaces();

        $document[0].title = 'Редактирование лекции';

        //проверка на id в строке если меньше чем в базе
        if (data().get().length  >= $stateParams.id && $stateParams.id) {
            selector["lection_id"] = parseInt($stateParams.id, 10);
        }

        $scope.Data = angular.copy(data(selector).get()[0]);

        if (data().get().length >= $stateParams.id && $stateParams.id) {
            $scope.selectedOptionId = Data.getLectors({'id': $scope.Data.lector_id})[0];
            $scope.selectedOptionPlace = Data.getPlaces({'id': $scope.Data.place_id})[0];

        }

        $scope.checks = [];
        $scope.Data.lection_schools.forEach(function (p1) {
            $scope.checks[p1-1] = true;
        });

        $scope.Data._time = Date.parseExact(angular.copy($scope.Data.date), 'MM-dd-yyyy HH:mm');
        $scope.Data._duration = Date.parseExact(angular.copy($scope.Data.duration), 'HH:mm');
        $scope.Data._date = $filter('date')(Date.parseExact(angular.copy($scope.Data.date), 'MM-dd-yyyy HH:mm'), 'MM-dd-yyyy');

        //чистим
        if ($state.current.name === 'create_lection' || $stateParams.id > data().get().length) {
            for (var i in $scope.Data) {
                if ($scope.Data.hasOwnProperty(i)){
                    $scope.Data[i] = undefined;
                    if (i[0] === "_") delete $scope.Data[i];
                }
            }

            $scope.Data.lection_schools = [];
            $scope.checks = [];

            if ($stateParams.name) {
                var id = Data.getSchools({'url' :$stateParams.name })[0].id ;
                $scope.Data.lection_schools.push(id);
                $scope.checks[id-1] =  true;
            }
            $document[0].title = 'Создание лекции';
            $scope.saveBtn = true;


            $scope.selectedOptionId = $scope.lectors[0];
            $scope.selectedOptionPlace = $scope.places[0];
            if ($stateParams.date) {
                $scope.Data._date = $filter('date')($stateParams.date, 'MM-dd-yyyy')//fix !!!!!!!!!
            }
            if ($stateParams.place) {
                $scope.selectedOptionPlace = Data.getPlaces({'id': $stateParams.place})[0];
            }
            if ($stateParams.lector) {
                $scope.selectedOptionId = Data.getLectors({'id': $stateParams.lector})[0];
            }
        }

        $scope.AddLection = function () {

            var type = null;

            $scope.Data.date =  $filter('date')($scope.Data._date, "MM-dd-yyy") + " " +  $filter('date')($scope.Data._time, "HH:mm");
            $scope.Data.duration =  $filter('date')($scope.Data._duration, "HH:mm");

            var errors = ['У выбранных школ в это время уже есть лекция',
                'В выбранной аудитории уже есть лекция в это время',
                'Аудитория слишком мала',
                'Вы не выбрали ни одной школы'];

            var display_er = function () {
                return SweetAlert.swal({
                    type: "warning",
                    title: "Проверьте правильность данных!",
                    text:  errors[type-1],
                    timer: 10000,
                    showConfirmButton: true
                });
            };

            if (!$scope.Data.lection_schools.length){
                type = 4;
                display_er();
                return;
            }

            if ($state.current.name === 'create_lection'){
                $scope.Data.lection_id = data().get().length + 1;

                type = Data.set.lection($scope.Data);
                if (type){
                    display_er();
                    return;
                }
            }
            else {
                type = Data.put.lection($scope.Data.lection_id, angular.copy($scope.Data));
                if (type){
                    display_er();
                    return;
                }
            }

            $state.go('about_lection', {'id' : $scope.Data.lection_id}, {reload: true});
        };

        //выбор школ
        $scope.$watch('Data.lection_schools', function () {
            if ($scope.Data.lection_schools.indexOf(1) !== -1) {
                    $scope.checks = [true];
                $scope.Data.lection_schools = [1];
            }
        }, true);

        //сразу же меняем в основной базе
        $scope.$watch('selectedOptionId', function () {
            $scope.Data['lector_id'] = $scope.selectedOptionId.id;
        }, true);
        $scope.$watch('selectedOptionPlace', function () {
            $scope.Data['place_id'] = $scope.selectedOptionPlace.id;
        }, true);
    });
    $scope.AddToSchoolList = function (sc) {
        if ($scope.Data.lection_schools.indexOf(sc) === -1) {
            $scope.Data.lection_schools.push(sc);
        }
        else {
            var index = $scope.Data.lection_schools.indexOf(sc);
            $scope.Data.lection_schools.splice(index, 1);
        }
    };

    $scope.hasSchool = function (sc, list) {
        return list.indexOf(sc) !== -1;
    };

    //перевод в объект даты
    $scope.Date = function (date) {
        return new Date(date);
    };

}

angular.module('timetableapp').component('editlection',
    {
        templateUrl: 'views/editlection.html',
        controller: EditLectionController
    });

