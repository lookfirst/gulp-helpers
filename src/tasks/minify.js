import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import plumber from 'gulp-plumber';
import chmod from 'gulp-chmod';
import _isUndefined from 'lodash/isUndefined';
import _merge from 'lodash/merge';

let defaultUglifyOptions = {
	mangle: true
};

class MinifyTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('MinifyTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('MinifyTask: dest is missing from configuration!');
		}

		this.options.uglifyOptions = _merge({}, defaultUglifyOptions, this.options.uglifyOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(plumber())
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(uglify(options.uglifyOptions))
				.pipe(sourcemaps.write('.'));
			if (!_isUndefined(options.chmod)) {
				chain = chain.pipe(chmod(options.chmod));
			}

			chain = chain.pipe(gulp.dest(options.dest));

			return chain;
		});
	}
}

module.exports = MinifyTask;
