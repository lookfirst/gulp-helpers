import eslint from 'gulp-eslint';
import _ from 'lodash';

class EslintTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.src)) {
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
