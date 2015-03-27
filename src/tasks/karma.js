import {server} from 'karma';
import _ from 'lodash';

class KarmaTask {
	setOptions(options) {
		this.options = options;

		if (_.isUndefined(this.options.configFile)) {
			throw new Error('KarmaTask: configFile is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {
			new Promise((resolve) =>
				server.start({configFile: options.configFile}, resolve)
			);
		});
	}
}

module.exports = new KarmaTask();
