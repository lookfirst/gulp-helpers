import {expect} from 'chai';
import TaskMaker from '../dist/TaskMaker';

describe('taskMaker', function() {
	describe('defineTask', function() {
		var tm;
		beforeEach(function() {
			tm = new TaskMaker();
		});

		it('should fail when task cannot be found', function() {
			var error = false;
			try {
				tm.defineTask('alsdkfja');
			} catch (e) {
				error = true;
			}
			expect(error).to.equal(true);
		});
	});
});
