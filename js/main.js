'use strict';


angular.module("timetableapp", ['ngSanitize', 'ui.router', '720kb.datepicker', 'colorpicker-dr', 'oitozero.ngSweetAlert'])
    .controller("timeTableController", function ($scope, $rootScope, $state, Data) {
        Data.setContent(); //init data api and it's promise

        //анимация загрузки
        $rootScope.$on('$viewContentLoading', function () {
            $('.animate-show-hide').stop().fadeIn("fast");
            $('.pop-up-back').removeClass("visible-modal");
        });
        //скрытие загрузки
        $scope.$on('$viewContentLoaded', function () {
            $('.animate-show-hide').stop().fadeOut(300, function () {
                $(this).css({
                    "z-index": 7
                })
            });
        });
        //no params ex www.site.ru/
        $rootScope.$on('$stateChangeStart', function (evt, to) {
            if (to.redirectTo) {
                evt.preventDefault();
                Data.getPromise().then(function () {
                    $state.go(to.redirectTo, {'name': Data.getSchools()[0].url})
                });
            }
        });
        //какая-либо ошибка роутера
        $rootScope.$on('$stateChangeError', function (event) {
            event.preventDefault();
            $state.go('404');
        });
        //функция навигации для вызова из html
        $rootScope.go = function (where, params_obj) {
            $state.go(where, params_obj, {reload: true});
        };
        // чистим локальное хранилище
        $scope.ClearCache = function () {
            localStorage.clear();
            window.location.href = '';

        };

        function download(filename, text) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);

            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
        $scope.SaveData = function () {
            var JSONObject = [];
            var tags = ['schools', 'lectors', 'places', 'lections'];
            var out = "";
            JSONObject[0] = Data.getSchools();
            JSONObject[1] = Data.getLectors();
            JSONObject[2] = Data.getPlaces();
            JSONObject[3] = Data.getLections()().get();
            out+='[{';
            for (var i in JSONObject) {
                out += ('"' + tags[i] + '": ' + JSON.stringify(JSONObject[i], function (key, value) {
                    if (key === '___id' || key === '___s' || key === '$$hashKey') return undefined;
                    return value;
                }) + (i !==3 ? ',' : ''));
            }
            out+='}]';

            download('data_new.json', out);
        };

    })
    .service('Data', function ($http, $q, $rootScope, $filter) {

        var signal = $q.defer();

        var lectionList;
        var schoolsList;
        var lectorsList;
        var placesList;

        var setContent = function () {
            return $http.get('data_new.json').then(function (response){
                    var data = response.data[0];




                    if (localStorage.length !== 4) {//так себе проверка на локальное храгилище
                        var benchC = 'Creating Local Storage';
                        console.time(benchC);
                        localStorage.clear();

                        lectionList = TAFFY(data.lections).store('lectionLS');
                        schoolsList = TAFFY(data.schools).store('schoolLS');
                        lectorsList = TAFFY(data.lectors).store('lectorLS');
                        placesList = TAFFY(data.places).store('placenLS');

                        console.timeEnd(benchC);

                        TotalCount(); //подсчет всех студентов

                    }
                    else {
                        var bench = 'Loading from Local Storage';
                        console.time(bench);

                        lectionList = TAFFY().store('lectionLS');
                        schoolsList = TAFFY().store('schoolLS');
                        lectorsList = TAFFY().store('lectorLS');
                        placesList = TAFFY().store('placenLS');

                        console.timeEnd(bench);
                    }

                    signal.resolve();
                },
                function (response){
                    console.log("Cant' reach data " + response);
                    signal.reject();
                });
        };
        // получить promise, чтобы использовать сервис, после его инициализации
        var getPromise = function () {
            return signal.promise;
        };
        var getLections = function () {
            return lectionList;
        };
        //функции для работы с параметрами
        var getSchools = function (paramsObj) {
            if (!paramsObj) paramsObj = "";
            return schoolsList(paramsObj).get();
        };
        var getLectors = function (paramsObj) {
            if (!paramsObj) paramsObj = "";
            return lectorsList(paramsObj).order("name").get();
        };
        var getPlaces = function (paramsObj) {
            if (!paramsObj) paramsObj = "";
            return placesList(paramsObj).order("name").get();
        };

        /**
         * @return {boolean}
         */
        var CmpSchools = function (a) {
            var b = GetSchoolsBasedOnLectionPassedTimeRange(a);

            for (var i in b) {
                if (b.hasOwnProperty(i)) {
                    if ((a.lection_schools[0] === 1 || b[i].lection_schools[0] === 1) && (b[i].lection_id !== a.lection_id)) return true;
                    for (var u in b[i].lection_schools) {
                        if (a.lection_schools.indexOf(b[i].lection_schools[u]) !== -1 && (b[i].lection_id !== a.lection_id)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /**
         * @return {boolean}
         */
        var CmpPlaces = function (a) {


            var b = GetSchoolsBasedOnLectionPassedTimeRange(a);

            for (var i in b) {
                if (b.hasOwnProperty(i)) {
                    if (b[i].place_id === a.place_id && (b[i].lection_id !== a.lection_id)) {
                        return true;
                    }
                }
            }
            return false;

        };

        var GetSchoolsBasedOnLectionPassedTimeRange = function (a) {

            var b = [];

            var _a = [];
            _a.date = $filter('date')(Date.parseExact(a.date, 'MM-dd-yyyy HH:mm'), 'MM-dd-yyyy');
            _a.duration = Date.parseExact(a.duration, 'HH:mm');
            _a.start = Date.parseExact(a.date, 'MM-dd-yyyy HH:mm');
            _a.end = angular.copy(_a.start).add({hours : _a.duration.getHours(), minutes: _a.duration.getMinutes()});

            lectionList({'date': {regex: new RegExp('^' + _a.date  +'......$')}}).each(function (record) {
                var _b = [];
                _b.duration = Date.parseExact(record.duration, 'HH:mm');
                _b.start = Date.parseExact(record.date, 'MM-dd-yyyy HH:mm');
                _b.end = angular.copy(_b.start).add({hours : _b.duration.getHours(), minutes: _b.duration.getMinutes()});

                if (_a.start.between(_b.start, _b.end) || _a.end.between(_b.start, _b.end)) b.push(record);
            });

            return b;

        };

        /**
         * @return {boolean}
         */
        var CheckAvSeats = function (a) {
            var sum = 0;

           for (var i in  a.lection_schools) {
                sum += getSchools({'id': a.lection_schools[i]})[0].students_count;
                if ((sum - getPlaces({'id': a.place_id})[0].max) > 0) return true;
            }
        };

        var TotalCount = function () {
            schoolsList({'id': 1}).update({'students_count': get.schoolList()().start(2).sum("students_count")});
        };
        //гетеры бд
        var get = [];

        get.lectionList = function () {
            return lectionList;
        };
        get.schoolList = function () {
            return schoolsList;
        };
        get.lectorsList = function () {
            return lectorsList;
        };
        get.placesList = function () {
            return placesList;
        };
        //сетеры бд
        var set = [];

        set.lection = function (newLection) { // check for bad result of insert?
            if (CmpSchools(newLection)) return 1;
            if (CmpPlaces(newLection)) return 2;
            if (CheckAvSeats(newLection)) return 3;
            lectionList.insert(newLection);
            $rootScope.$broadcast('lectionsUpdated', null);
            return false;
        };
        set.school = function (newSchool) {
            schoolsList.insert(newSchool);
            $rootScope.$broadcast('schoolsUpdated', null);
            TotalCount();
        };
        set.lector = function (newLector) {
            lectorsList.insert(newLector);
            $rootScope.$broadcast('lectorsUpdated', null);
        };
        set.place = function (newPlace) {
            placesList.insert(newPlace);
            $rootScope.$broadcast('placesUpdated', null);
        };

        //изменение бд
        var put = [];

        put.lection = function (id, newLection) {
            if (CmpSchools(newLection)) return 1;
            if (CmpPlaces(newLection)) return 2;
            if (CheckAvSeats(newLection)) return 3;
            lectionList({'lection_id': id}).update(newLection);
            $rootScope.$broadcast('lectionsUpdated', newLection.id);
            return false;
        };
        put.school = function (id, newSchool) {
            schoolsList({'id': id}).update(newSchool);
            $rootScope.$broadcast('schoolsUpdated', newSchool.id);
            TotalCount();
        };
        put.lector = function (id, newLector) {
            lectorsList({'id': id}).update(newLector);
            $rootScope.$broadcast('lectorsUpdated', newLector.id);
        };
        put.place = function (id, newPlace) {
            placesList({'id': id}).update(newPlace);
            $rootScope.$broadcast('placesUpdated', newPlace.id);
        };

        return {
            getPromise: getPromise,
            setContent: setContent,
            getLections: getLections,
            getLectors: getLectors,
            getSchools: getSchools,
            getPlaces: getPlaces,
            get: get,
            set: set,
            put: put
        }

    })
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
        //любой адрес, если не соответсвует state редирект на стрницу с ошибкой
        $urlRouterProvider.otherwise("/404");
        //убираем префикс
        $locationProvider.hashPrefix('');

        $stateProvider.state('about_lection', {
            url: '/lection/id/:id',
            template: "<lectionabout></lectionabout>"
        }).state('all_lections', {
            url: '/school/',
            template: "<lection></lection>"
        }).state('school_lections', {
            url: '/school/:name',
            template: "<lection></lection>"
        }).state('lector_lections', {
            url: '/lector/:lector',
            template: "<lection></lection>"
        }).state('lections_date', {
            url: '/month/:month/day/:date/year/:year',
            template: "<lection></lection>"
        }).state('lections_date_month', {
            url: '/month/:month/year/:year',
            template: "<lection></lection>"
        }).state('lections_by_place', {
            url: '/place/id/:place',
            template: "<lection></lection>"
        }).state('edit_lection', {
            url: '/edit/lection/id/:id',
            template: "<editlection></editlection>"
        }).state('create_lection', {
            url: '/create/lection/:name',
            params: {
                date: null,
                place: null,
                lector: null
            },
            template: "<editlection></editlection>"
        }).state('edit_school', {
            url: '/edit/school/:name',
            template: "<editschool></editschool>"
        }).state('create_school', {
            url: '/create/school',
            template: "<editschool></editschool>"
        }).state('edit_place', {
            url: '/edit/place/id/:place',
            template: "<editplace></editplace>"
        }).state('create_place', {
            url: '/create/place',
            template: "<editplace></editplace>"
        }).state('default', {
            url: '',
            template: "<lection></lection>",
            redirectTo: 'school_lections'
        }).state('404', {
            url: '/404',
            template: "<notfound></notfound>"
        });
    })
    .directive('routeLoadingIndicator', function () {
        return {
            restrict: 'E',
            replace: true,
            template: "<div class='animate-show-hide visible'></div>"
        }
    })
    .filter('capitalize', function() {
        return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });

