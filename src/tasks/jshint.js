var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

class JshintTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('JshintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			return gulp.src(options.src)
				.pipe(jshint())
				.pipe(jshint.reporter(stylish))
		});
	}
}

module.exports = new JshintTask();
