import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';
import _isUndefined from 'lodash/isUndefined';
import _isBoolean from 'lodash/isBoolean';
import _merge from 'lodash/merge';
import expressHistoryApiFallback from 'express-history-api-fallback';
import connectHistoryApiFallback from 'connect-history-api-fallback';

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
			let useExpress = false;
			if (_isArray(this.options.historyApiFallback)) {
				historyApiFallbackConfig = this.options.historyApiFallback;
				useExpress = true;
			} else if (_isString(this.options.historyApiFallback)) {
				historyApiFallbackConfig = [this.options.historyApiFallback];
				useExpress = true;
			} else if (_isBoolean(this.options.historyApiFallback)) {
				historyApiFallbackConfig = _merge({}, this.options.historyApiFallback);
			} else {
				throw new Error('BrowserSyncTask: historyApiFallback must be an absolute file path string or an Express Response.sendFile arguments array');
			}
			if(useExpress) {
				this.options.config.server.middleware.push(expressHistoryApiFallback(...historyApiFallbackConfig));
			}
			else {
				this.options.config.server.middleware.push(connectHistoryApiFallback(historyApiFallbackConfig));
			}
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
