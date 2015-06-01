import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import cache from 'gulp-cached';
import changed from 'gulp-changed';
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

		this.options.sourcemapOptions = _merge({}, this.options.sourcemapOptions);

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return gulp.src(options.src)
				.pipe(cache(options.taskName))
				.pipe(plumber())
				.pipe(changed(options.dest, {extension: '.css'}))
				.pipe(sourcemaps.init())
				.pipe(less({plugins: [cleancss]}))
				.pipe(sourcemaps.write('.', options.sourcemapOptions))
				.pipe(gulp.dest(options.dest))
				.pipe(options.globalBrowserSync.stream({match: '**/*.css'}));
		});
	}
}

module.exports = LessTask;
