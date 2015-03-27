import vinylPaths from 'vinyl-paths';
import del from 'del';
import _ from 'lodash';

class CleanTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.src)) {
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

module.exports = new CleanTask();
