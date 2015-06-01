import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import historyApiFallback from 'connect-history-api-fallback';

class BrowserSyncTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.config)) {
			throw new Error('BrowserSyncTask: config is missing from configuration!');
		}

		if (!_isUndefined(this.options.historyApiFallback) && this.options.historyApiFallback !== false) {
			this.options.config.server = _merge({}, this.options.config.server);
			this.options.config.server.middleware = _merge([], this.options.config.server.middleware);

			var historyApiFallbackConfig = _merge({}, this.options.historyApiFallback);
			this.options.config.server.middleware.push(historyApiFallback(historyApiFallbackConfig));
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return new Promise((resolve) => {
				return options.globalBrowserSync.init(options.config, resolve);
			});
		});
	}
}

module.exports = BrowserSyncTask;
