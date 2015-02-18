var gutil = require('gulp-util');

class TaskMaker {
  defineTask(name, options) {
    if (!options.taskDeps) {
      options.taskDeps = [];
    }
    try {
      return require('./tasks/' + name + '.js').setOptions(options).defineTask();
    } catch (e) {
      gutil.log(gutil.colors.red(e));
    }
  }
}

module.exports = new TaskMaker();