# Задание №1-2
Расписание школ Мобилизации Яндекс
###Описание
Оба задания объеденены в один проект. Дизайн создан с нуля, верстка тоже. Для стартового отображения во всех браузерах используется файл стилей `vendor/normalize.css`. Проект выполнен с использованием фреймворка **Angular JS**, а также дополнительных модулей/библиотек:
* **UI-Router** - навигация в проекте
* **DateJS** - кроссбраузерная работа со временем
* **TaffyDB** - хранение информации в `localstorage` и удобные инструменты для получения данных
* **Angular Colorpicker Dr** - пикер цвета
* **Angular Datepicker** - пикер даты
* **SweetAlert & Angular wrapper** - вывод предупреждений и ошибок
### Подробнее о реализации
Приложение одностраничное, переход между состояниями происходит без перезагрузки страницы, если не существует запрошенного состояния - выводится страница **404**.
Данные организованы файлом `data_new.json` со следующей структурой: <br>
`[школы, лекторы, аудитории, лекции]`, с навигацией по **id**. При первой загрузке страницы - данные загружаются с сервера в `localstorage`, далее они загружаются и обновлятся только в `localstorage`.
Изменение/добавление информации выполняется с помощью сервиса `Data`. 
Реализованы все проверки по заданию (проверки форм `RegEX` выражениями), а также все предложенные фильтрации. 
### Встречаемые проблемы
- В браузерах, не поддерживаемых `input[time]` - время в форме не имеет формат
HH:mm, а имеет вид например `10:00:00.000`

###  Как запустить
* Просто перейдите по ссылке [younglifer.github.io](http://younglifer.github.io)
* Клонируйте или скачайте `*.zip` файл репозитория. Установите простой веб-сервер, например `npm install http-server`
или используйте встроенный веб-сервер, например  **PhpStorm**
### Как создать продакшн версию

* Установите gulp  `npm install gulp`
а затем все необходимые плагины:<br>
`gulp-clean`<br>
`gulp-html-replace`<br>
`gulp-concat`

* Затем запустите команду `gulp` из папки проекта, эта команда запустит **clean** и **default** задания
* Приложение появится  в папке `/build`