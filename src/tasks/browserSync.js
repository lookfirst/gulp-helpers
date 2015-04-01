import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';

class BrowserSyncTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.config)) {
			throw new Error('BrowserSyncTask: config is missing from configuration!');
		}

		if (!_isUndefined(this.options.historyApiFallback)) {
			this.options.config.server = _merge({}, this.options.config.server);
			this.options.config.server.middleware = _merge([], this.options.config.server.middleware);
			this.options.config.server.middleware.push(historyApiFallback);
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			new Promise((resolve) => {
				browserSync(options.config, resolve);
			})
		});
	}
}

module.exports = BrowserSyncTask;
