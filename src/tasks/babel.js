import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
import sourcemaps from 'gulp-sourcemaps';
import coffee from 'gulp-coffee';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import ngAnnotate from 'gulp-ng-annotate';
import rename from 'gulp-rename';
import chmod from 'gulp-chmod';
import _isUndefined from 'lodash/isUndefined';
import _merge from 'lodash/merge';
import _forEach from 'lodash/forEach';

let defaultCompilerOptions = {
	comments: false,
	compact: false,
	presets: ['es2015'],
	plugins: ['transform-runtime']
};

let defaultUglifyOptions = {
	mangle: true
};

class BabelTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('BabelTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.dest)) {
			throw new Error('BabelTask: dest is missing from configuration!');
		}

		if (this.options.notify) {
			this.options.plumberOptions = this.options.defaultErrorHandler;
		}

		// Handle defaults
		this.options.compilerOptions = _merge({}, defaultCompilerOptions, this.options.compilerOptions);
		this.options.coffeeOptions = _merge({bare: true}, this.options.coffeeOptions);
		this.options.ngAnnotateOptions = _merge({sourceMap: true}, this.options.ngAnnotateOptions);
		this.options.plumberOptions = _merge({}, this.options.plumberOptions);
		this.options.uglifyOptions = _merge({}, defaultUglifyOptions, this.options.uglifyOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;

		gulp.task(options.taskName, options.taskDeps, () => {
			let chain = gulp.src(options.src);

			chain = chain
				.pipe(cache(options.taskName))
				.pipe(plumber(options.plumberOptions))
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

			chain = chain.pipe(babel(options.compilerOptions));

			if (options.ngAnnotate) {
				chain = chain.pipe(ngAnnotate(options.ngAnnotateOptions));
			}

			if (options.uglify) {
				chain = chain.pipe(uglify(options.uglifyOptions));
			}

			if (!_isUndefined(options.chmod)) {
				chain = chain.pipe(chmod(options.chmod));
			}

			chain = chain.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(options.dest));

			_forEach(options.globalBrowserSyncs, (bs) => {
				chain = chain.pipe(bs.stream({match: '**/*.js'}));
			});

			return chain;
		});
	}
}

module.exports = BabelTask;
module.exports.compilerOptions = defaultCompilerOptions;
