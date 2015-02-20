var vinylPaths = require('vinyl-paths');
var del = require('del');

class CleanTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.src) {
      throw new Error('CleanTask: src is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      return gulp.src([ options.src ]).pipe(vinylPaths(del));
    });
  }
}

module.exports = new CleanTask();
