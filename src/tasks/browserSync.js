var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');

class BrowserSyncTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.config) {
			throw new Error('BrowserSyncTask: config is missing from configuration!');
		}

		if (this.options.historyApiFallback) {
			if (!this.options.config.server) {
				this.options.config.server = {};
			}
			if (!this.options.config.server.middleware) {
				this.options.config.server.middleware = [];
			}
			this.options.config.server.middleware.push(historyApiFallback);
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			new Promise((resolve) => {
				browserSync(options.config, resolve);
			})
		});
	}
}

module.exports = new BrowserSyncTask();
