import jshint  from 'gulp-jshint';
import stylish from 'jshint-stylish';
import _isUndefined from 'lodash/lang/isUndefined';

class JshintTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('JshintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(jshint(options.jsHintOptions))
				.pipe(jshint.reporter(stylish))
		});
	}
}

module.exports = JshintTask;
