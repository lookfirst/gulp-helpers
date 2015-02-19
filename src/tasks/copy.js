var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var replace = require('gulp-replace-task');

class CopyTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.path) {
      throw new Error('CopyTask: Path is missing from configuration!');
    }

    if (!this.options.output) {
      throw new Error('CopyTask: Output is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, function() {
      let chain = gulp.src(options.path)
        .pipe(cache(options.taskName))
        .pipe(plumber());

      if (options.changed) {
        chain = chain.pipe(changed(options.output, options.changed));
      }

      if (options.replace) {
        chain = chain.pipe(replace(options.replace));
      }

      if (options.rename) {
        chain = chain.pipe(rename(options.rename));
      }

      chain.pipe(gulp.dest(options.output))
        .pipe(browserSync.reload({ stream: true }));
    });
  }
}

module.exports = new CopyTask();
