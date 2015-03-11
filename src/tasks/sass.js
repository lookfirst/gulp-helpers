var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

class SassTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('SassTask: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('SassTask: dest is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			return gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.src, {extension: '.css'}))
				.pipe(sourcemaps.init())
				.pipe(sass(options.config))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.reload({stream: true}));
		});
	}
}

module.exports = new SassTask();
