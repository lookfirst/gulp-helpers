import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import sourcemaps from 'gulp-sourcemaps';
import _isUndefined from 'lodash/lang/isUndefined';

class SassTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('SassTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('SassTask: dest is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.css'}))
				.pipe(sourcemaps.init())
				.pipe(sass(options.config))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
				.pipe(options.globalBrowserSync.reload({stream: true}));
		});
	}
}

module.exports = SassTask;
