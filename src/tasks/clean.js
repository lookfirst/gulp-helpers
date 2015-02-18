var gulp = require('gulp');
var gutil = require('gulp-util');

var vinylPaths = require('vinyl-paths');
var del = require('del');

class CleanTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.taskDeps) {
      gutil.log('taskDeps is missing');
      throw new Exception()
    }
    if (!this.options.path) {
      gutil.log('Path is missing');
      throw new Exception()
    }

    return this;
  }

  defineTask() {
    gulp.task('clean', this.options.taskDeps, function() {
      return gulp.src([ this.options.path ]).pipe(vinylPaths(del));
    });
  }
}

module.exports = new CleanTask();
