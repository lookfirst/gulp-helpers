var routeBundler = require('systemjs-route-bundler');

class RouteBundlerTask {
  setOptions(options) {
    this.options = options;

    if (!this.options.config) {
      throw new Error('RouteBundlerTask: Config is missing from configuration!');
    }

    return this;
  }

  defineTask(gulp) {
    let options = this.options;
    gulp.task(options.taskName, options.taskDeps, function() {
      return routeBundler.build(options.config)
    });
  }
}

module.exports = new RouteBundlerTask();
