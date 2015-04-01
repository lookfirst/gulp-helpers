import htmlMin from 'gulp-minify-html';
import plumber from 'gulp-plumber';
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';

class HtmlMinifyTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('HtmlMinifyTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('HtmlMinifyTask: dest is missing from configuration!');
		}

		this.options.minimize = _merge({
			empty: true,
			spare: true,
			quotes: true
		}, this.options.minimize);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(plumber())
				.pipe(htmlMin(options.minimize))
				.pipe(gulp.dest(options.dest))
		});
	}
}

module.exports = HtmlMinifyTask;
