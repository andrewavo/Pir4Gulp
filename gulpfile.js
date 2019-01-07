'use strict';

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const injectSvg = require('gulp-inject-svg');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cssimport = require('gulp-cssimport');
const debug = require('gulp-debug');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');

/* Test Gulp is running */
gulp.task('message', function () {
   return console.log('Gulp is running...');
});

/* Clean before build */
gulp.task('clean', function () {
    return del('dist');
});

/* Inject svg images into html <img> and copy html files into dist*/
gulp.task('inject-svg', function () {
   return gulp.src('src/*.html')
       .pipe(injectSvg({ base: '/src/' }))
       .pipe(gulp.dest('dist'));
});

/* Optimize images */
gulp.task('imagemin', function () {
   return gulp.src(['src/img/**/*.png', 'src/img/*.jpg', "src/img/*.jpeg"])
       .pipe(imagemin())
       .pipe(gulp.dest('dist/img'));
});

/* Minify & concatenate js files ****** no uglify! ******/
gulp.task('minifyjs', function () {
   return gulp.src('src/js/**/*.js')
       .pipe(concat('main.js'))
       .pipe(gulp.dest('dist/js'));
});

/* Assemble css - resolve imports, build sourcemap */
gulp.task('styles', function () {
    return gulp.src('src/css/main.css')
        .pipe(sourcemap.init())
        .pipe(cssimport())
        .pipe(sourcemap.write())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('build', gulp.series(
       'clean',
       gulp.parallel('inject-svg', 'imagemin', 'minifyjs', 'styles')));