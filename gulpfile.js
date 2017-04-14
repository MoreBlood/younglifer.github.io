var gulp = require('gulp'),
    clean = require('gulp-clean'), //clean before build
    htmlreplace = require('gulp-html-replace'), //delete unused scripts
    concat = require('gulp-concat'); //unite files


gulp.task('default', ['clean'], function () {

    gulp.src(['./js/main.js', './js/modalwindow.js', './js/navbar.js',
        './js/lection.js', './js/lectionabout.js', './js/edit_lection.js',
        './js/edit_school.js', './js/edit_place.js', './js/404.js',   '!./js/vendor/*.js']) //unite all scripts except libs
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/js'));

    gulp.src(['./js/vendor/*.js', './js/vendor/*.map']) // copy libs
        .pipe(gulp.dest('build/js/vendor'));

    gulp.src(['./css/*.css', '!./css/vendor/*.css']) // unite css
        .pipe(concat('style.css'))
        .pipe(gulp.dest('build/css'));

    gulp.src(['./css/fonts/*']) // copy fonts
        .pipe(gulp.dest('build/css/fonts'));

    gulp.src(['./css/vendor/*.css']) // copy css
        .pipe(gulp.dest('build/css/vendor'));

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

});


gulp.task('clean', function () { //perform clean
    return gulp.src('build', {read: true})
        .pipe(clean());
});



