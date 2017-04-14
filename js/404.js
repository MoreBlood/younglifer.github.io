function NotFoundController($rootScope, $scope, Data, $state, $stateParams, $sce) {


    Data.getPromise().then(function () {
        $scope.Revert = function () {
            $state.go('school_lections', {'name' : Data.getSchools()[0].url})
        }
    });

}

angular.module('timetableapp').component('notfound',
    {
        templateUrl: '404.html',
        controller: NotFoundController
    });

