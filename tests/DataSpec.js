describe("Тестирование сервиса Data", function () {

    function testController(Data) {
        for (var u in localStorage) {
            if (localStorage.hasOwnProperty(u)) {
                if (u.split("_")[2] === 'test') delete localStorage[u];
            }
        }
        Data.setContent("_test");

        describe("Тесты лекций, которые зависят друг от друга", function () {
            it("Создание лекции и получение по ее id", function (done) {
                Data.getPromise().then(function () {
                    Data.set.lection(
                        {
                            "date": "11-06-2017 09:00",
                            "duration": "02:45",
                            "passed": false,
                            "lection_name": "Тестовая лекция",
                            "lection_id": 13,
                            "lector_id": 3,
                            "place_id": 3,
                            "lection_schools": [
                                2,
                                5
                            ],
                            "about": "Описание"
                        }
                    );
                    expect(Data.get.lectionList()({'lection_id': 13}).get()[0].lection_name).toEqual("Тестовая лекция");
                    done();
                });
            });

            it("Создание лекции с id которое уже в базе", function (done) {
                Data.getPromise().then(function () {
                    Data.set.lection(
                        {
                            "date": "11-06-2017 09:00",
                            "duration": "02:45",
                            "passed": false,
                            "lection_name": "Тестовая лекция 2",
                            "lection_id": 13,
                            "lector_id": 3,
                            "place_id": 3,
                            "lection_schools": [
                                2,
                                5
                            ],
                            "about": "Описание"
                        }
                    );
                    expect(Data.get.lectionList()({'lection_id': 13}).get()[0].lection_name).not.toEqual("Тестовая лекция 2");
                    done();
                });
            });

            it("Создание лецкии, для одинаковых школ в одно время", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.set.lection(
                        {
                            "date": "11-06-2017 09:00",
                            "duration": "02:45",
                            "passed": false,
                            "lection_name": "Тестовая лекция 2",
                            "lection_id": 14,
                            "lector_id": 3,
                            "place_id": 3,
                            "lection_schools": [
                                2,
                                5
                            ],
                            "about": "Описание"
                        }
                    )).toEqual(1);// 1 error
                    done();
                });
            });

            it("Создание лекции в одно время для разных школ, но в одной аудитории", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.set.lection(
                        {
                            "date": "11-06-2017 09:00",
                            "duration": "02:45",
                            "passed": false,
                            "lection_name": "Тестовая лекция 2",
                            "lection_id": 15,
                            "lector_id": 3,
                            "place_id": 3,
                            "lection_schools": [
                                3
                            ],
                            "about": "Описание"
                        }
                    )).toEqual(2);// 1 error
                    done();
                });
            });
        })
        describe("Тесты лекций, которые НЕ зависят друг от друга", function () {
            it("Создание лекции в маленькой аудитории", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.set.lection(
                        {
                            "date": "12-06-2017 09:00",
                            "duration": "02:45",
                            "passed": false,
                            "lection_name": "Тестовая лекция 2",
                            "lection_id": 15,
                            "lector_id": 3,
                            "place_id": 3,
                            "lection_schools": [
                                1
                            ],
                            "about": "Описание"
                        }
                    )).toEqual(3);// 1 error
                    done();
                });
            });
        });
        describe("Общие тесты API, зависящие друг от друга", function () {
            it("Проверка set", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.set.place({
                        "name": "Яндекс 329",
                        "id": 17,
                        "max": 200,
                        "description": "about"
                    })).toEqual(false);
                    expect(Data.set.school({
                        "name": "Тестовая разработка",
                        "short": "МР",
                        "color": "#FFA700",
                        "description": "description",
                        "students_count": 27,
                        "url": "mobile",
                        "id": 19
                    })).toEqual(false);
                    expect(Data.set.lector({
                        "id": 29,
                        "about": "Веб-разработчик в Яндексе с 2005 года. Успел поработать над Поиском, Почтой, Поиском по блогам, Я.ру, Картинками, Видео. Помимо этого, активно занимается развитием внутренних инструментов для создания сайтов.",
                        "workplace": "Яндекс",
                        "name": "Кирилл Бережной"
                    })).toEqual(false);
                    expect(Data.set.lection({
                        "date": "12-06-2018 09:00",
                        "duration": "02:45",
                        "passed": false,
                        "lection_name": "Тестовая лекция 3",
                        "lection_id": 15,
                        "lector_id": 29,
                        "place_id": 17,
                        "lection_schools": [
                            1
                        ],
                        "about": "Описание"
                    })).toEqual(false);
                    done();
                });
            });

            it("Проверка get", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.getSchools({id: 19})[0].name).toEqual("Тестовая разработка");
                    expect(Data.getPlaces({id: 17})[0].name).toEqual("Яндекс 329");
                    expect(Data.getLectors({id: 29})[0].name).toEqual("Кирилл Бережной");
                    expect(Data.getLections()({lection_id: 15}).get()[0].place_id).toEqual(17);
                    done();
                });
            });

            it("Проверка put", function (done) {
                Data.getPromise().then(function () {
                    expect(Data.put.place(17, {
                        "name": "Яндекс 329 1",
                        "id": 17,
                        "max": 200,
                        "description": "about"
                    })).toEqual(false);
                    expect(Data.put.school(19, {
                        "name": "Тестовая разработка 1",
                        "short": "МР",
                        "color": "#FFA700",
                        "description": "description",
                        "students_count": 10,
                        "url": "mobile",
                        "id": 19
                    })).toEqual(false);
                    expect(Data.put.lector(29, {
                        "id": 29,
                        "about": "Веб-разработчик в Яндексе с 2005 года. Успел поработать над Поиском, Почтой, Поиском по блогам, Я.ру, Картинками, Видео. Помимо этого, активно занимается развитием внутренних инструментов для создания сайтов.",
                        "workplace": "Яндекс",
                        "name": "Кирилл Бережной 1"
                    })).toEqual(false);
                    expect(Data.put.lection(15, {
                        "date": "12-06-2018 09:00",
                        "duration": "02:45",
                        "passed": false,
                        "lection_name": "Тестовая лекция 3",
                        "lection_id": 15,
                        "lector_id": 29,
                        "place_id": 2,
                        "lection_schools": [
                            19
                        ],
                        "about": "Описание"
                    })).toEqual(false);
                    done();
                });
                it("Проверка get после put", function (done) {
                    Data.getPromise().then(function () {
                        expect(Data.getSchools({id: 19})[0].name).toEqual("Тестовая разработка 1");
                        expect(Data.getPlaces({id: 17})[0].name).toEqual("Яндекс 329 1");
                        expect(Data.getLectors({id: 29})[0].name).toEqual("Кирилл Бережной 1");
                        expect(Data.getLections()({lection_id: 15}).get()[0].place_id).toEqual(2);
                        done();
                    });
                });
            });
        })

    }

    angular.module('timetableapp').component('tests', {
        template: '<div></div>',
        controller: testController
    });
});
