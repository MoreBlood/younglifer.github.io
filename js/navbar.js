'use strict';

function NavBarController($scope, $state, Data) {
    $scope.current = $state.params.name;

    $scope.$on('$stateChangeSuccess', function () {
        $scope.current = $state.params.name;
    });
    $scope.$on('schoolsUpdated', function () {
        $scope.schools = Data.getSchools();
    });
    Data.getPromise().then(function () {
        if ($state.params.name === 'default') $scope.current = Data.getSchools()[0].url;
        $scope.schools = Data.getSchools();
    });
}

angular.module('timetableapp').component('navbar', {
    templateUrl: 'views/navbar.html',
    controller: NavBarController
});

