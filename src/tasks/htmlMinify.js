var htmlMin = require('gulp-minify-html');
var plumber = require('gulp-plumber');

class HtmlMinifyTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('HtmlMinifyTask: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('HtmlMinifyTask: dest is missing from configuration!');
		}

		if (!this.options.minimize) {
			this.options.minimize = {
				empty: true,
				spare: true,
				quotes: true
			};
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			return gulp.src(options.src)
				.pipe(plumber())
				.pipe(htmlMin(options.minimize))
				.pipe(gulp.dest(options.dest))
		});
	}
}

module.exports = new HtmlMinifyTask();
