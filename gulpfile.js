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
const gulpIf = require('gulp-if');
const changed = require('gulp-changed');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

/* Check if the current build is development */
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

/* Clean before build */
gulp.task('clean', function () {
    return del('dist');
});

/* Inject svg images into html <img> and copy html files into dist*/
gulp.task('inject-svg', function () {
   return gulp.src('src/*.html', {since: gulp.lastRun('inject-svg')})
       .pipe(changed('dist'))
       .pipe(injectSvg({ base: '/src/' }))
       .pipe(gulp.dest('dist'));
});

/* Optimize images */
gulp.task('imagemin', function () {
   return gulp.src(['src/img/**/*.png', 'src/img/*.jpg', "src/img/*.jpeg"])
       .pipe(changed('dist/img'))
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
        .pipe(gulpIf(isDevelopment, sourcemap.init()))
        .pipe(cssimport())
        .pipe(autoprefixer())
        .pipe(gulpIf(isDevelopment, sourcemap.write()))
        .pipe(gulp.dest('dist/css/'));
});

/* Delete dest and build*/
gulp.task('build', gulp.series(
       'clean',
       gulp.parallel('inject-svg', 'imagemin', 'minifyjs', 'styles')));

/* Watch changes */
gulp.task('watch', function () {
    gulp.watch(['src/**/*.html', 'src/img/**/*.svg'], gulp.series('inject-svg'));
    gulp.watch('src/img/**/*.{jpg,jpeg,png}', gulp.series('imagemin'));
    gulp.watch('src/css/**/*.css', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('minifyjs'));
});

/* Browser-sync starts... */
gulp.task('serve', function () {
    browserSync.init({
        server: 'dist',
        startPath: 'corp-actions.html',
    });

    browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

/* Build, watch & serve */
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));