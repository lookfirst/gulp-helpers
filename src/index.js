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