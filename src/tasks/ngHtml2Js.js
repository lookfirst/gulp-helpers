var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var browserSync = require('browser-sync');
var to5 = require('gulp-babel');
var htmlMin = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var insert = require('gulp-insert');

var es6 = require('./es6');

class NgHtml2JsTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('NgHtml2JsTask: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('NgHtml2JsTask: dest is missing from configuration!');
		}

		if (!this.options.prepend) {
			this.options.prepend = "import angular from 'angular';\n";
		}

		if (!this.options.compilerOptions) {
			this.options.compilerOptions = es6.compilerOptions;
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
				.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.html'}))
				.pipe(htmlMin(options.minimize))
				.pipe(ngHtml2Js({export: 'commonjs'}))
				.pipe(insert.prepend(options.prepend))
				.pipe(to5(options.compilerOptions))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.reload({stream: true}))
		});
	}
}

module.exports = new NgHtml2JsTask();
