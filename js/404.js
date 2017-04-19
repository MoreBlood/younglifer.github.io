'use strict';

function NotFoundController($scope, Data, $state) {
    Data.getPromise().then(function () {
        $scope.Revert = function () {
            $state.go('school_lections', {'name': Data.getSchools()[0].url})
        }
    });
}

angular.module('timetableapp').component('notfound',
    {
        templateUrl: 'views/404.html',
        controller: NotFoundController
    });

