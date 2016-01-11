import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import to5 from 'gulp-babel';
import uglify from 'gulp-uglify';
import htmlMin from 'gulp-htmlmin';
import ngHtml2Js from 'gulp-ng-html2js';
import insert from 'gulp-insert';
import chmod from 'gulp-chmod';
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import _forEach from 'lodash/collection/forEach';

import babel from './babel';

let defaultUglifyOptions = {
	mangle: true
};

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
		this.options.uglifyOptions = _merge({}, defaultUglifyOptions, this.options.uglifyOptions);

		this.options.minimize = _merge({
			keepClosingSlash: true
		}, this.options.minimize);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			let chain;

			if (this.options.ngHtml2Js && this.options.ngHtml2Js.extension === '.ts') {
				chain = gulp.src(options.src)
					.pipe(cache(options.taskName))
					.pipe(plumber())
					.pipe(htmlMin(options.minimize))
					.pipe(ngHtml2Js(options.ngHtml2Js))
					.pipe(insert.prepend(options.prepend))
			} else {
				chain = gulp.src(options.src)
					.pipe(cache(options.taskName))
					.pipe(plumber())
					.pipe(changed(options.dest, {extension: '.html'}))
					.pipe(htmlMin(options.minimize))
					.pipe(ngHtml2Js(options.ngHtml2Js))
					.pipe(insert.prepend(options.prepend))
					.pipe(to5(options.compilerOptions));
			}

			if (chain) {
				if (options.uglify) {
					chain = chain.pipe(uglify(options.uglifyOptions));
				}

				if (!_isUndefined(options.chmod)) {
					chain = chain.pipe(chmod(options.chmod));
				}

				chain = chain.pipe(gulp.dest(options.dest));

				_forEach(options.globalBrowserSyncs, (bs) => {
					chain = chain.pipe(bs.stream());
				});
			}

			return chain;
		});
	}
}

module.exports = NgHtml2JsTask;
