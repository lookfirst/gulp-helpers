import _isArray from 'lodash/lang/isArray';
import _isString from 'lodash/lang/isString';
import _isUndefined from 'lodash/lang/isUndefined';
import _merge from 'lodash/object/merge';
import historyApiFallback from 'express-history-api-fallback';

class BrowserSyncTask {
	setOptions(options) {
		this.options = options;

		if (_isUndefined(this.options.config)) {
			throw new Error('BrowserSyncTask: config is missing from configuration!');
		}

		if (!_isUndefined(this.options.historyApiFallback) && this.options.historyApiFallback !== false) {
			this.options.config.server = _merge({}, this.options.config.server);
			this.options.config.server.middleware = _merge([], this.options.config.server.middleware);

			let historyApiFallbackConfig;
			if (_isArray(this.options.historyApiFallback)) {
				historyApiFallbackConfig = this.options.historyApiFallback;
			} else if (_isString(this.options.historyApiFallback)) {
				historyApiFallbackConfig = [this.options.historyApiFallback];
			} else {
				throw new Error('BrowserSyncTask: historyApiFallback must be an absolute file path string or an Express Response.sendFile arguments array');
			}
			this.options.config.server.middleware.push(historyApiFallback(...historyApiFallbackConfig));
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			return new Promise((resolve) => {
				let bs = options.taskMaker.createBrowserSync(options.taskName);
				return bs.init(options.config, resolve);
			});
		});
	}
}

module.exports = BrowserSyncTask;
