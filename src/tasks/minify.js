var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

class MinifyTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.path) {
      throw new Error('MinifyTask: Path is missing from configuration!');
    }

    if (!this.options.output) {
      throw new Error('MinifyTask: Tasks is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      gulp.src(options.path)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({ mangle: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(options.output))
    });
  }
}

module.exports = new MinifyTask();
