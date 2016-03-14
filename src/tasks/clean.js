import vinylPaths from 'vinyl-paths';
import del from 'del';
import _isUndefined from 'lodash/isUndefined';
import _isArray from 'lodash/isArray';

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
			if (!_isArray(options.src)) {
				options.src = [options.src];
			}
			return gulp.src(options.src).pipe(vinylPaths(del));
		});
	}
}

module.exports = CleanTask;
