var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

class JshintTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.path) {
      throw new Error('JshintTask: Path is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      gulp.src(options.path)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
    });
  }
}

module.exports = new JshintTask();
