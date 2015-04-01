import eslint from 'gulp-eslint';
import _isUndefined from 'lodash/lang/isUndefined';

class EslintTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('EslintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(eslint())
				.pipe(eslint.format())
		});
	}
}

module.exports = EslintTask;
