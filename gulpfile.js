var gulp = require('gulp'),
    clean = require('gulp-clean'),
    htmlToJs = require('gulp-html-to-js'),//clean before build
    htmlreplace = require('gulp-html-replace'),
    replace = require('gulp-replace'),//delete unused scripts
    concat = require('gulp-concat'); //unite files


gulp.task('default', ['clean','unite_ng_sc'], function () {


    gulp.src(['./js/vendor/*.js', './js/vendor/*.map']) // copy libs
        .pipe(gulp.dest('build/js/vendor'));

    gulp.src(['./css/*.css', '!./css/vendor/*.css']) // unite css
        .pipe(concat('style.css'))
        .pipe(gulp.dest('build/css'));

    gulp.src(['./css/fonts/*']) // copy fonts
        .pipe(gulp.dest('build/css/fonts'));

    gulp.src(['./css/vendor/*.css']) // copy css
        .pipe(gulp.dest('build/css/vendor'));
    gulp.src(['./views/*']) // copy css
        .pipe(gulp.dest('build/views/'));

    gulp.src(['./*.html', './*.json', '!./index.html']) //copy all html files
        .pipe(gulp.dest('build/'));

    gulp.src('./img/**') //copy all image files
        .pipe(gulp.dest('build/img'));

    gulp.src('./index.html') // edit index.html
        .pipe(htmlreplace({
            'css': 'css/style.css',
            'js': 'js/main.js'
        }))
        .pipe(gulp.dest('build/'));
    /*gulp.src('./build/js/main.js')
        .pipe(replace(/templateUrl:.*,/g, function (match) {
            var file = match.match(/\/.*.html/) + "";
            return "templateUrl: window.templates['" +file.substring(1) +"'],"
            
        }))
        .pipe(gulp.dest('build/js/'));*/


});

gulp.task('unite_ng_sc',['clean'], function () {
    return gulp.src(['./js/main.js', './js/modalwindow.js', './js/navbar.js',
        './js/lection.js', './js/lectionabout.js', './js/edit_lection.js',
        './js/edit_school.js', './js/edit_place.js', './js/404.js',   '!./js/vendor/*.js'])  //unite all scripts except libs
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));
});

/*gulp.task('unite_ng_vw',['clean'], function () {
    return gulp.src('views/*')
        .pipe(htmlToJs({concat: 'vw.js', global: 'window.templates'}))
        .pipe(gulp.dest('build/js'))
});

gulp.task('concat_sc_vw', ['clean', 'unite_ng_vw','unite_ng_sc'], function () {
    return gulp.src(['./build/js/vw.js', './build/js/sc.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'))
});*/



gulp.task('clean', function () { //perform clean
    return gulp.src('build', {read: true})
        .pipe(clean());
});



