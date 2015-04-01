import routeBundler from 'systemjs-route-bundler';
import _isUndefined from 'lodash/lang/isUndefined';

class RouteBundlerTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.config)) {
			throw new Error('RouteBundlerTask: Config is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return routeBundler.build(options.config)
		});
	}
}

module.exports = RouteBundlerTask;
