import {expect} from 'chai';
import gulpHelpers from '../dist/index';

describe('index', () => {
	describe('#framework', () => {
		it('has _ (lodash)', () => {
			expect(gulpHelpers.framework('_').merge).to.exist;
		});

		it('has runSequence', () => {
			expect(gulpHelpers.framework('run-sequence')).to.exist;
		});
	});

	describe('#situation', () => {
		it('exists', () => {
			expect(gulpHelpers.situation).to.exist;
		});
	});

	describe('#taskMaker', () => {
		it('exists', () => {
			expect(gulpHelpers.taskMaker).to.exist;
		});
	});
});
