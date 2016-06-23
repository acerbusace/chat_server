/* jshint esversion: 6 */

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');

gulp.task('watch', ['sync'], function() {
    // watch for SCSS files
    gulp.watch('./public/stylesheets/**/*.scss', ['scss']);
    gulp.watch('./views/**/*.jade', browserSync.reload);
});

gulp.task('scss', function() {
    return gulp.src('./public/stylesheets/app.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('error', sass.logError)
        .pipe(gulp.dest('./public/stylesheets/min'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('sync', ['nodemon'], function() {
    browserSync.init({
        proxy: 'http://localhost:8000',
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;

    return nodemon({
        env: {
            'NODE_ENV': 'development'
        },
        script: 'server.js'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});
