import jshint  from 'gulp-jshint';
import stylish from 'jshint-stylish';
import _ from 'lodash';

class JshintTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.src)) {
			throw new Error('JshintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(jshint())
				.pipe(jshint.reporter(stylish))
		});
	}
}

module.exports = JshintTask;
