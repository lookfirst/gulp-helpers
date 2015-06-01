import gutil from 'gulp-util';
import browserSync from 'browser-sync';

class TaskMaker {
	constructor(gulp) {
		this.gulp = gulp;
	}

	defineTask(name, options = {}) {
		name = this._resolveAliases(name);

		if (!options.taskName) {
			options.taskName = name;
		}
		if (!options.taskDeps) {
			options.taskDeps = [];
		}

		options.globalBrowserSync = browserSync.create();

		try {
			let taskClass = require('./tasks/' + name + '.js');
			new taskClass().setOptions(options).defineTask(this.gulp);
		} catch (e) {
			gutil.log(gutil.colors.red(e));
			throw e;
		}
	}

	/**
	 * The author was stupid and made a bad naming decision.
	 *
	 * @private
	 */
	_resolveAliases(name) {
		if (name === 'es6') {
			gutil.log(gutil.colors.magenta('Please rename the es6 task to babel'));
			return 'babel';
		}
		return name;
	}
}

module.exports = TaskMaker;
