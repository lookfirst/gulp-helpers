var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var replace = require('gulp-replace-task');

class CopyTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.src) {
      throw new Error('CopyTask: src is missing from configuration!');
    }

    if (!this.options.dest) {
      throw new Error('CopyTask: dest is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      let chain = gulp.src(options.src)
        .pipe(cache(options.taskName))
        .pipe(plumber());

      if (options.changed) {
        chain = chain.pipe(changed(options.dest, options.changed));
      }

      if (options.replace) {
        chain = chain.pipe(replace(options.replace));
      }

      if (options.rename) {
        chain = chain.pipe(rename(options.rename));
      }

      chain = chain.pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({ stream: true }));

      return chain;
    });
  }
}

module.exports = new CopyTask();
