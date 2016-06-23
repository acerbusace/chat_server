/* jshint esversion: 6 */

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('scss', function() {
    return gulp.src('./public/stylesheets/app.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        })).on('error', sass.logError)
        .pipe(gulp.dest('./public/stylesheets/min'));
});
