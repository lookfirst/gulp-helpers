var gulp = require('gulp');
var gutil = require('gulp-util');

var vinylPaths = require('vinyl-paths');
var del = require('del');

var cleanTask = function(taskDeps, path) {
  if (!taskDeps) {
    gutil.log('taskDeps is missing');
    return
  }
  if (!path) {
    gutil.log('Path is missing');
    return
  }

  gulp.task('clean', taskDeps, function() {
    return gulp.src([ path ]).pipe(vinylPaths(del));
  });
};

module.exports = cleanTask;
