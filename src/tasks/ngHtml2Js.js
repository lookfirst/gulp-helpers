import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import browserSync from 'browser-sync';
import to5 from 'gulp-babel';
import htmlMin from 'gulp-minify-html';
import ngHtml2Js from 'gulp-ng-html2js';
import insert from 'gulp-insert';
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';

import babel from './babel';

class NgHtml2JsTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('NgHtml2JsTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('NgHtml2JsTask: dest is missing from configuration!');
		}

		if (_isUndefined(this.options.prepend)) {
			this.options.prepend = "import angular from 'angular';\n";
		}

		this.options.ngHtml2Js = _merge({}, {export: 'system'}, this.options.ngHtml2Js);
		this.options.compilerOptions = _merge({}, babel.compilerOptions, this.options.compilerOptions);

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
				.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.html'}))
				.pipe(htmlMin(options.minimize))
				.pipe(ngHtml2Js(options.ngHtml2Js))
				.pipe(insert.prepend(options.prepend))
				.pipe(to5(options.compilerOptions))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.reload({stream: true}))
		});
	}
}

module.exports = NgHtml2JsTask;
