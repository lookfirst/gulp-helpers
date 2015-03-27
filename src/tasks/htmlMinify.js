import htmlMin from 'gulp-minify-html';
import plumber from 'gulp-plumber';
import _ from 'lodash';

class HtmlMinifyTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.src)) {
			throw new Error('HtmlMinifyTask: src is missing from configuration!');
		}

		if (_.isUndefined(this.options.dest)) {
			throw new Error('HtmlMinifyTask: dest is missing from configuration!');
		}

		this.options.minimize = _.merge({
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
