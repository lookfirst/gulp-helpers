var karma = require('karma').server;

class KarmaTask {
	setOptions(options) {
		this.options = options;

		if (!this.options.configFile) {
			throw new Error('KarmaTask: configFile is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, function() {
			new Promise((resolve) =>
					karma.start({configFile: options.configFile}, resolve)
			);
		});
	}
}

module.exports = new KarmaTask();
