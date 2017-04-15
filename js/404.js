function NotFoundController($rootScope, $scope, Data, $state, $stateParams, $document) {

    //if (!$scope.show) $document[0].title = '404';

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

