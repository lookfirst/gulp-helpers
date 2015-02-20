var gutil = require('gulp-util');

class WatchTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.src) {
      throw new Error('WatchTask: src is missing from configuration!');
    }

    if (!this.options.tasks) {
      throw new Error('WatchTask: Tasks is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      let watcher = gulp.watch(options.src, options.tasks);
      watcher.on('change', (event) =>
          gutil.log(gutil.colors.purple(`File ${event.path} was ${event.type}, running tasks...`))
      );
    });
  }
}

module.exports = new WatchTask();
