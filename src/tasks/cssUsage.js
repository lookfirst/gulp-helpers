import plumber from 'gulp-plumber';
import cssUsage from 'gulp-css-usage';
import _isUndefined from 'lodash/lang/isUndefined';

class CssUsageTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('CssUsageTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.css)) {
			throw new Error('CssUsageTask: css is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let {taskName, taskDeps, src, css, babylon} = this.options;
		gulp.task(taskName, taskDeps, () => {
			return gulp.src(src).pipe(plumber()).pipe(cssUsage({css, babylon}));
		});
	}
}

module.exports = CssUsageTask;
