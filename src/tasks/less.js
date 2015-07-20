/*jshint esnext: true*/
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import _forEach from 'lodash/collection/forEach';

import filter from 'gulp-filter';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import lessDependents from 'gulp-less-dependents';
import cache from 'gulp-cached';
import sourcemaps from 'gulp-sourcemaps';
import lessPluginCleanCSS from 'less-plugin-clean-css';

let cleancss = new lessPluginCleanCSS({advanced: true});

class LessTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('LessTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('LessTask: dest is missing from configuration!');
		}

		if (_isUndefined(this.options.sourcemaps)) {
			this.options.sourcemaps = true;
		}

		if (this.options.notify) {
			this.options.plumberOptions = this.options.defaultErrorHandler;
		}

		this.options.sourcemapOptions = _merge({}, this.options.sourcemapOptions);
		this.options.plumberOptions = _merge({}, this.options.plumberOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src)
				.pipe(lessDependents())
				.pipe(plumber(options.plumberOptions));

			if (options.sourcemaps) {
				chain = chain.pipe(sourcemaps.init());
			}

			// enable cleancss if we have sourcemaps which will make them readable
			let plugins = options.sourcemaps ? [cleancss] : [];
			chain = chain.pipe(less({plugins: plugins}));

			if (options.sourcemaps) {
				chain = chain.pipe(sourcemaps.write('.', options.sourcemapOptions));
			}

			chain = chain
					.pipe(gulp.dest(options.dest))
					.pipe(filter(['*', '!*.css.map']));

			_forEach(options.globalBrowserSyncs, (bs) => {
				chain = chain.pipe(bs.stream());
			});

			return chain;
		});
	}
}

module.exports = LessTask;
