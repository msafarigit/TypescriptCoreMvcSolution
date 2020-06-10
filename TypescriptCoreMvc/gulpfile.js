/// <binding AfterBuild='default' Clean='clean' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var del = require('del');

var paths = {
    scripts: ['Scripts/**/*.js', 'Scripts/**/*.map'],
    views: ['Views/**/*.js', 'Views/**/*.map']
};

gulp.task('clean', function () {
    return del(['wwwroot/tsc/Scripts/**/*', 'wwwroot/tsc/Views/**/*']);
});

gulp.task('default', async function () {
    gulp.src(paths.scripts).pipe(gulp.dest('wwwroot/tsc/Scripts'));
    gulp.src(paths.views).pipe(gulp.dest('wwwroot/tsc/Views'));
});