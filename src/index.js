class TaskMaker {
  defineTask(name, options) {
    return require('tasks/' + name + '.js').setOptions(options).defineTask();
  }
}

export var TaskMaker = new TaskMaker();