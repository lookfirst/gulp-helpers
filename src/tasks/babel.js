import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import coffee from 'gulp-coffee';
import to5 from 'gulp-babel';
import ngAnnotate from 'gulp-ng-annotate';
import rename from 'gulp-rename';
import _ from 'lodash';

let defaultCompilerOptions = {
	filename: '',
	filenameRelative: '',
	blacklist: [],
	whitelist: [],
	sourceRoot: '',
	moduleRoot: '',
	moduleIds: false,
	externalHelpers: true,
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

class BabelTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.src)) {
			throw new Error('BabelTask: src is missing from configuration!');
		}

		if (_.isUndefined(this.options.dest)) {
			throw new Error('BabelTask: dest is missing from configuration!');
		}

		// Handle defaults
		this.options.compilerOptions = _.merge({}, defaultCompilerOptions, this.options.compilerOptions);
		this.options.coffeeOptions = _.merge({bare: true}, this.options.coffeeOptions);
		this.options.ngAnnotateOptions = _.merge({sourceMap: true}, this.options.ngAnnotateOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;

		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src);

			chain = chain.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.js'}))
				.pipe(rename(function(path) {
					if (path.extname === '.jsx') {
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

module.exports = BabelTask;
module.exports.compilerOptions = defaultCompilerOptions;
