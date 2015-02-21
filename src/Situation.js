import gutil from 'gulp-util';

class Situation {
	constructor() {
		this.sit = process.env.SITUATION || 'development';
		gutil.log(gutil.colors.blue(`Running as: ${this.sit}`));
	}

	isProduction() {
		return this.sit === 'production';
	}

	isDevelopment() {
		return this.sit === 'development';
	}

	value() {
		return this.sit;
	}
}

module.exports = Situation;
