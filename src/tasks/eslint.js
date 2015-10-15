import eslint from 'gulp-eslint';
import _isUndefined from 'lodash/lang/isUndefined';

class EslintTask {
	setOptions(options) {
		this.options = options;

		if (this.options.failOnError && this.options.failAfterError) {
			throw new Error('EslintTask: Please choose either failOnError or failAfterError option!');
		}

		if (_isUndefined(this.options.src)) {
			throw new Error('EslintTask: src is missing from configuration!');
		}

		return this;
	}

	defineTask(gulp) {
		let options = this.options;
		gulp.task(options.taskName, options.taskDeps, () => {

			var chain = gulp.src(options.src).pipe(eslint());

			if (options.quiet) {
				chain = chain.pipe(eslint.format((reports) => {
					reports.forEach((report) => {
						report.messages = report.messages.filter((message) => {
							return message.fatal || message.severity > 1;
						});
					});
					return '( *** Eslint runs in quite mode *** )';
				}));
			}

			chain = chain.pipe(eslint.format());

			if (options.failOnError) {
				chain = chain.pipe(eslint.failOnError());
			} else if (options.failAfterError) {
				chain = chain.pipe(eslint.failAfterError());
			}

			return chain;
		});
	}
}

module.exports = EslintTask;
