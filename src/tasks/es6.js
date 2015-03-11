var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var coffee = require('gulp-coffee');
var to5 = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');

var compilerOptions = {
	filename: '',
	filenameRelative: '',
	blacklist: [],
	whitelist: [],
	sourceRoot: '',
	moduleRoot: '',
	moduleIds: false,
	externalHelpers: false,
	experimental: false,
	format: {
		comments: false,
		compact: false,
		indent: {
			parentheses: true,
			adjustMultilineComment: true,
			style: '  ',
			base: 0
		}
	}
};

class ES6Task {
	setOptions(options) {
		this.options = options;

		if (!this.options.src) {
			throw new Error('ES6Task: src is missing from configuration!');
		}

		if (!this.options.dest) {
			throw new Error('ES6Task: dest is missing from configuration!');
		}

		if (!this.options.compilerOptions) {
			this.options.compilerOptions = compilerOptions;
		}

		if (!this.options.coffeeOptions) {
			this.options.coffeeOptions = {bare: true};
		}

		if (!this.options.ngAnnotateOptions) {
			this.options.ngAnnotateOptions = {sourceMap: true};
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;

		gulp.task(options.taskName, options.taskDeps, function() {
			let chain = gulp.src(options.src);

			chain = chain.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.js'}))
				.pipe(rename(function(path) {
					if (path.extname == '.jsx') {
						path.extname = '.js';
					}
				}))
				.pipe(sourcemaps.init());

			if (options.coffee) {
				chain = chain.pipe(coffee(options.coffeeOptions).on('error', gutil.log));
			}

			chain = chain.pipe(to5(options.compilerOptions));

			if (options.ngAnnotate) {
				chain = chain.pipe(ngAnnotate(options.ngAnnotateOptions));
			}

			chain = chain.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest))
				.pipe(browserSync.reload({stream: true}));

			return chain;
		});
	}
}

module.exports = new ES6Task();
module.exports.compilerOptions = compilerOptions;
