import Situation from './Situation';
import TaskMaker from './TaskMaker';

class GulpHelpers {
  constructor() {
    this.sit = new Situation();
  }

  taskMaker(gulp) {
    if (! this.tm) {
      this.tm = new TaskMaker(gulp);
    }
    return this.tm;
  };

  situation() {
    return this.sit;
  };
}

module.exports = new GulpHelpers();