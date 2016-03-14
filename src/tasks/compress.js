import plumber from 'gulp-plumber';
import zip from 'gulp-zip';
import chmod from 'gulp-chmod';
import _isUndefined from 'lodash/isUndefined';

class CompressTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('CompressTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('CompressTask: dest is missing from configuration!');
		}

		if (_isUndefined(this.options.filename)) {
			throw new Error('CompressTask: filename is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(plumber())
				.pipe(zip(options.filename, options.zipOptions));

			if(!_isUndefined(options.chmod)){
				chain = chain.pipe(chmod(options.chmod));
			}

			chain = chain.pipe(gulp.dest(options.dest));

			return chain;
		});
	}
}

module.exports = CompressTask;
