import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import sourcemaps from 'gulp-sourcemaps';
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import _forEach from 'lodash/collection/forEach';

class SassTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('SassTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('SassTask: dest is missing from configuration!');
		}

		if (this.options.notify) {
			this.options.plumberOptions = this.options.defaultErrorHandler;
		}

		this.options.plumberOptions = _merge({}, this.options.plumberOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber(options.plumberOptions))
				.pipe(changed(options.dest, {extension: '.css'}))
				.pipe(sourcemaps.init())
				.pipe(sass(options.config))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest));

			_forEach(options.globalBrowserSyncs, (bs) => {
				chain = chain.pipe(bs.stream());
			});

			return chain;
		});
	}
}

module.exports = SassTask;
