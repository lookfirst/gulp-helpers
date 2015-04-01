import vinylPaths from 'vinyl-paths';
import del from 'del';
import _isUndefined from 'lodash/lang/isUndefined';

class CleanTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('CleanTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src([options.src]).pipe(vinylPaths(del));
		});
	}
}

module.exports = CleanTask;
