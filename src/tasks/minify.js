var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

class MinifyTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('MinifyTask: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('MinifyTask: dest is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			return gulp.src(options.src)
				.pipe(plumber())
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(uglify({mangle: true}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
		});
	}
}

module.exports = new MinifyTask();
