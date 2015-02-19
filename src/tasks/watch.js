var gutil = require('gulp-util');

class WatchTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.path) {
      throw new Error('WatchTask: Path is missing from configuration!');
    }

    if (!this.options.tasks) {
      throw new Error('WatchTask: Tasks is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, function() {
      let watcher = gulp.watch(options.path, options.tasks);
      watcher.on('change', (event) =>
          gutil.log(`File ${event.path} was ${event.type}, running tasks...`)
      );
    });
  }
}

module.exports = new WatchTask();
