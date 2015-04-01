import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import plumber from 'gulp-plumber';
import _isUndefined from 'lodash/lang/isUndefined';

class MinifyTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('MinifyTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('MinifyTask: dest is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(plumber())
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(uglify({mangle: true}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
		});
	}
}

module.exports = MinifyTask;
