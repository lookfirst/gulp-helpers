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

		if (!this.options.src) {
			throw new Error('LessTask: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('LessTask: dest is missing from configuration!');
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
				.pipe(less({plugins: [cleancss]}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.reload({stream: true}));
		});
	}
}

module.exports = new LessTask();
