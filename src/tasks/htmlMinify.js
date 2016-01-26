import htmlMin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import chmod from 'gulp-chmod';
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
			keepClosingSlash: true
		}, this.options.minimize);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(plumber())
				.pipe(htmlMin(options.minimize));

			if (!_isUndefined(options.chmod)) {
				chain = chain.pipe(chmod(options.chmod));
			}

			chain = chain.pipe(gulp.dest(options.dest));

			return chain;
		});
	}
}

module.exports = HtmlMinifyTask;
