var gulp       = require('gulp');
var util       = require('gulp-util');
var connect    = require('gulp-connect');
var browserify = require('browserify');
var reactify   = require('reactify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var watchify   = require('watchify');
var sourcemaps = require('gulp-sourcemaps');

function errorHandler (err) {
  util.log(util.colors.red('Error'), err.message);
  this.end();
}

var bundler = watchify(browserify({ entries: './jsx/app.jsx', debug: true } , watchify.args));
bundler.transform(reactify);

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('reload', function () {
  gulp.src(['./public/**/*.*', '!./public/**/*.js.map'])
      .pipe(connect.reload());
});

gulp.task('build', function () {
  bundler.bundle()
      .on('error', errorHandler)
      .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true  }))
        .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js'));    
});

gulp.task('watch', function () {
  gulp.watch(['./jsx/**/*.jsx'], ['build']);
  gulp.watch(['./public/**/*.*', '!./public/**/*.js.map'], ['reload']);
});

gulp.task('default', ['build', 'connect', 'watch']);
