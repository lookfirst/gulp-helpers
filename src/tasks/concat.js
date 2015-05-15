import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import _isUndefined from 'lodash/lang/isUndefined';

class ConcatTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('ConcatTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('ConcatTask: dest is missing from configuration!');
		}

		if (_isUndefined(this.options.concat)) {
			throw new Error('ConcatTask: concat is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber());

			if (options.sourcemaps) {
				chain.pipe(sourcemaps.init({loadMaps: true}));
			}
			chain.pipe(concat(options.concat));

			if (options.sourcemaps) {
				chain.pipe(sourcemaps.write());
			}

			chain.dest(options.dest);

			return chain;
		});
	}
}

module.exports = ConcatTask;
