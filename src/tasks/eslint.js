var eslint = require('gulp-eslint');

class EslintTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('EslintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			return gulp.src(options.src)
				.pipe(eslint())
				.pipe(eslint.format())
		});
	}
}

module.exports = new EslintTask();
