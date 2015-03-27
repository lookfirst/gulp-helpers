import {expect} from 'chai';
import TaskMaker from '../dist/TaskMaker';
import gulp from 'gulp';

describe('taskMaker', () => {
	describe('defineTask', () => {
		let tm;
		beforeEach(() => {
			tm = new TaskMaker(gulp);
		});

		it('should fail when task cannot be found', () => {
			let error = false;
			try {
				tm.defineTask('unknowntask');
			} catch (e) {
				error = true;
			}
			expect(error).to.equal(true);
		});

		it('should not fail when looking for the renamed es6 task', () => {
			let error = false;
			try {
				tm.defineTask('es6', {src: '', dest: ''});
			} catch (e) {
				error = true;
			}

			expect(error).to.equal(false);
		});
	});
});
