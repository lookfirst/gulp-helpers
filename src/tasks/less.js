var plumber = require('gulp-plumber');
var less = require('gulp-less');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var lessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new lessPluginCleanCSS({advanced: true});
var browserSync = require('browser-sync');

class LessTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.path) {
      throw new Error('LessTask: Path is missing from configuration!');
    }

    if (!this.options.output) {
      throw new Error('LessTask: Output is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      return gulp.src(options.path)
        .pipe(cache(options.taskName))
        .pipe(plumber())
        .pipe(changed(options.output, {extension: '.less'}))
        .pipe(sourcemaps.init())
        .pipe(less({plugins: [ cleancss ]}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(options.output))
        .pipe(browserSync.reload({ stream: true }));
    });
  }
}

module.exports = new LessTask();
