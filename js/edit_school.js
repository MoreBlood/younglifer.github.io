function EditSchoolController($scope, $state, Data, $stateParams, $sce) {

    Data.getPromise().then(function () {
            if ($state.current.name === 'edit_school') {

            $scope.schools = angular.copy(Data.getSchools({'url': $stateParams.name})[0]);
            $scope.colorValueInput = $scope.schools.color;
        }

        if (!$stateParams.name || $state.current.name === 'create_school') {
            $scope.schools = angular.copy(Data.getSchools()[0]);
            for (var i in $scope.schools) {
                $scope.schools[i] = "";
                if (i[0] === "_") delete $scope.schools[i];
            }
            $scope.saveBtn = true;
        }

        $scope.AddSchool = function () {
            if ($state.current.name === 'create_school') {
                $scope.schools.id = Data.getSchools().length + 1;

                Data.set.school($scope.schools);
            }
            else {
                Data.put.school($scope.schools.id, angular.copy($scope.schools));
            }

            $state.go('school_lections', {'name' : $scope.schools.url}, {reload: true});
        };


    });

}

angular.module('timetableapp').component('editschool',
    {
        templateUrl: 'editschool.html',
        controller: EditSchoolController
    });

