import del from 'del';
import path from 'path';
import gutil from 'gulp-util';
import _isUndefined from 'lodash/lang/isUndefined';

class WatchTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.src)) {
			throw new Error('WatchTask: src is missing from configuration!');
		}

		if (_isUndefined(this.options.tasks)) {
			throw new Error('WatchTask: Tasks is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		let that = this;
		gulp.task(options.taskName, options.taskDeps, () => {
			that.watch(gulp);
		});
	}

	watch(gulp) {
		let options = this.options;
		let watcher = gulp.watch(options.src, options.tasks);
		watcher.on('change', (event) => {
			gutil.log(gutil.colors.magenta(`File ${event.path} was ${event.type}, running tasks: ${options.tasks}`));

			// https://github.com/gulpjs/gulp/blob/master/docs/recipes/handling-the-delete-event-on-watch.md
			if (event.type === 'deleted' && !_isUndefined(options.dest)) {
				var filePathFromSrc = path.relative(path.resolve(options.src), event.path);
				var destFilePath = path.resolve(options.dest, filePathFromSrc);
				del.sync(destFilePath);
			}
		});
	}
}

module.exports = WatchTask;
