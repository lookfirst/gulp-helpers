import Situation from './Situation';
import TaskMaker from './TaskMaker';

import _ from 'lodash';
import runSequence from 'run-sequence';

class GulpHelpers {
	constructor() {
		this.sit = new Situation();

		this.frameworks = {};
		this.frameworks._ = _;
		this.frameworks['run-sequence'] = runSequence;
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
