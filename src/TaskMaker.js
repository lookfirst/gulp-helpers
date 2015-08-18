import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import _merge from 'lodash/object/merge';
import notify from 'gulp-notify';

class TaskMaker {
	constructor(gulp) {
		this.gulp = gulp;
		this.globalBrowserSyncs = {};
	}

	createBrowserSync(name) {
		let bs = browserSync.create(name);
		this.globalBrowserSyncs[name] = bs;
		return bs;
	}

	defineTask(name, options = {}) {
		name = this._resolveAliases(name);

		if (!options.taskMaker) {
			options.taskMaker = this;
		}
		if (!options.taskName) {
			options.taskName = name;
		}
		if (!options.taskDeps) {
			options.taskDeps = [];
		}
		if (!options.globalBrowserSyncs) {
			options.globalBrowserSyncs = this.globalBrowserSyncs;
		}
		if (!options.defaultErrorHandler) {
			options.defaultErrorHandler = {
				errorHandler: notify.onError('<%= error.message %>')
			};
		}

		try {
			let taskClass = require(`./tasks/${name}.js`);
			new taskClass().setOptions(options).defineTask(this.gulp);

			if (options.watchTask && options.src) {
				let newOptions = _merge({tasks: [options.taskName]}, options);
				newOptions.taskName = `watch-${options.taskName}`;
				let watchTask = require('./tasks/watch.js');
				new watchTask().setOptions(newOptions).defineTask(this.gulp);
				gutil.log(`Created watch task: ${newOptions.taskName}`);
			}
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

export default TaskMaker;
