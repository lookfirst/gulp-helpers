var gutil = require('gulp-util');

class TaskMaker {
  constructor(gulp) {
    this.gulp = gulp;
  }

  defineTask(name, options) {
    if (!options.taskName) {
      options.taskName = name;
    }
    if (!options.taskDeps) {
      options.taskDeps = [];
    }

    try {
      return require('./tasks/' + name + '.js').setOptions(options).defineTask(this.gulp);
    } catch (e) {
      gutil.log(gutil.colors.red(e));
      throw e;
    }
  }
}

class GulpHelpers {
  taskMaker(gulp) {
    if (! this.tm) {
      this.tm = new TaskMaker(gulp);
    }
    return this.tm;
  }
}

module.exports = new GulpHelpers();