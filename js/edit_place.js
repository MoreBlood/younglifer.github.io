function EditPlaceController($scope, $state, Data, $stateParams, $sce)
{
    Data.getPromise().then(function () {

        if ($state.current.name === 'edit_place' && $stateParams.place <= Data.getPlaces().length) {
            $scope.places = angular.copy(Data.getPlaces({'id' : parseInt($stateParams.place, 10)})[0]);
        }

        if ($state.current.name === 'create_place' || $stateParams.place > Data.getPlaces().length) {
            $scope.places = angular.copy(Data.getPlaces()[0]);

            for (var i in $scope.places) {
                $scope.places[i] = "";
                if (i[0] === "_") delete $scope.places[i];
            }
            $scope.saveBtn = true;
        }
        $scope.AddPlace = function () {
            if ($state.current.name === 'create_place') {
                $scope.places.id = Data.getPlaces().length + 1;

                Data.set.place($scope.places);
            }
            else {
                Data.put.place($scope.places.id, angular.copy($scope.places));
            }

            $state.go('lections_by_place', {'place' : $scope.places.id}, {reload: true});
        };

    });

}

angular.module('timetableapp').component('editplace',
    {
        templateUrl: 'editplace.html',
        controller: EditPlaceController
    });

