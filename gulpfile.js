'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const npmDist = require('gulp-npm-dist');
const sourcemaps = require('gulp-sourcemaps');
gulp.task('sass-css', function() {
    return gulp.src(['scss/custom.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('minify-css', function() {
    return gulp.src(['scss/custom.scss'])
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});



gulp.task('browserSync', function() {
    browserSync.init({
        server: true
    })
});


gulp.task('default', ['browserSync'], function() {
    gulp.watch([
        'scss/custom.scss'
    ], ['sass-css', 'minify-css']);

    gulp.watch([
        'scss/_variables.scss',
        'scss/bootstrap/_variables.scss'
    ], ['sass-css', 'sass-pages']);

    gulp.watch('*.html', browserSync.reload);
    gulp.watch('lib/**/*.js', browserSync.reload);
    gulp.watch('assets/js/*.js', browserSync.reload);
})

// Copy dependencies to lib/
gulp.task('npm-lib', function() {
    gulp.src(npmDist(), { base: './node_modules/' })
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(gulp.dest('lib'));
});

