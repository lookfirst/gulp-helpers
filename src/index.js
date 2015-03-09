import Situation from './Situation';
import TaskMaker from './TaskMaker';

import _ from 'lodash';

class GulpHelpers {
	constructor() {
		this.sit = new Situation();

		this.frameworks = {};
		this.frameworks._ = _;
	}

	taskMaker(gulp) {
		if (!this.tm) {
			this.tm = new TaskMaker(gulp);
		}
		return this.tm;
	}

	situation() {
		return this.sit;
	}

	framework(name) {
		return this.frameworks[name];
	}
}

module.exports = new GulpHelpers();
