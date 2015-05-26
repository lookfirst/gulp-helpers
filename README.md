[![npm version](https://badge.fury.io/js/gulp-helpers.svg)](https://badge.fury.io/js/gulp-helpers)
[![npm dependencies](https://david-dm.org/lookfirst/gulp-helpers.svg)](https://david-dm.org/lookfirst/gulp-helpers)
[![Build Status](https://travis-ci.org/lookfirst/gulp-helpers.svg)](https://travis-ci.org/lookfirst/gulp-helpers)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lookfirst/gulp-helpers)

# gulp-helpers

A set of tasks and helpers for gulp 3.x 

When gulp 4 is released, gulp-helpers will be rewritten to support [custom registries](https://github.com/phated/undertaker#custom-registries).

# Don't repeat yourself (DRY) gulpfiles

When writing gulpfiles, I often find myself copying entire blocks of code between files. I make mistakes and forget things. I improve one gulpfile and have a hard time upgrading old gulpfiles in other projects. 

In other words, _gulpfiles are not DRY between projects_. 

One way to solve this issue is by moving common task functionality into a set of external tasks that can be re-used across projects. The '[Split tasks across multiple files](split-tasks-across-multiple-files.md)' recipe breaks up your gulpfile into little files. The problem is that it doesn't solve the larger DRY issues that I've run into.

## Example less task

I might have a task to process my [less](http://lesscss.org/) CSS files. It is many lines tall and does a whole bunch of stuff. I've forgotten half of what it does (wtf is [plumber()](https://github.com/floatdrop/gulp-plumber))? It also necessitates adding `devDependencies` to my projects `package.json` and all the `require` lines at the top of the gulpfile. _What a mess_.

```
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var lessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new lessPluginCleanCSS({advanced: true});
var browserSync = require('browser-sync');

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(cache('less'))
    .pipe(plumber())
    .pipe(changed(path.output, {extension: '.css'}))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [ cleancss ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});
```

## gulp-helpers to the rescue

[gulp-helpers](https://github.com/lookfirst/gulp-helpers/) reduces [the less CSS task](https://github.com/lookfirst/gulp-helpers/blob/master/src/tasks/less.js) down to a single line in your gulpfile.

```
npm install gulp-helpers --save-dev
```

```
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);

taskMaker.defineTask('less', { src: 'src/**/*.less', dest: 'dist' });
```

A more complete example that uses [babel](http://babeljs.io/) to transpile our code on save looks like this:

```
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);

var path = {
	source: 'src/**/*.js',
	output: 'dist',
	watch: 'src/**'
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('babel', {taskName: 'babel', src: path.source, dest: path.output, compilerOptions: {externalHelpers: false, optional: ['runtime']}});
taskMaker.defineTask('watch', {taskName: 'watch', src: path.watch, tasks: ['babel'], taskDeps: ['babel']});

gulp.task('default', ['clean', 'watch']);
```

* There is little code and a lot of configuration. It makes setting up new gulpfiles trivial because now I don't have to re-learn gulp and all of its plugins every time I want to start a new project. 

* The `package.json` `devDependencies` section is so clean! Just a dependency on gulp and gulp-helpers.

* Take advantage of bug fixes and improvements in gulp-helpers automatically and more importantly, across projects.

* When the next version of gulp is available, this gulpfile will work without changes.

## Examples

* [systemjs-seed project](https://github.com/lookfirst/systemjs-seed/)

## API

### defineTask

```
taskMaker.defineTask(NAME_OF_GULPHELPERS_TASK, OPTIONS);
```

The named gulp-helper task will be loaded via `require` and you pass options into it. There is a whole bunch of tasks already defined, [take a look](https://github.com/lookfirst/gulp-helpers/tree/master/src/tasks) at the ones you need in order to figure out the options you can pass in. I've tried to keep the naming pretty consistent between tasks. For example, `src` and `dest` will always map to the arguments to `gulp.src()` and `gulp.dest()`.

There are a couple options which are default across all tasks:
* `taskName` - the name of the `gulp.task()` task, defaults to the first argument of `defineTask` (String)
* `taskDeps` - passed into `gulp.task()` as the dependent tasks (Array)

### situation

```
export SITUATION=production
```

```
var situation = gulpHelpers.situation();
if (situation.isProduction()) {
  // do production stuff
} else if (situation.isDevelopment()) {
  // do development stuff
}
```

This returns a `Situation` object, which is good for determining if we are running in `development`, `sandbox` or `production` mode based on the SITUATION environment variable.

Sandbox and Production mode generally means that the project is bundled and minified and [browserSync](http://browsersync.io) is running without reloading turned on.

This makes it easy to build gulpfiles which can be deployed to PaaS solutions like Heroku, yet still allow you to test your app in production mode locally.

### framework

```
var _ = gulpHelpers.framework('lodash'); // '_' also works
var runSequence = gulpHelpers.framework('run-sequence');
```

The idea behind `framework` is that the dependency chain is in gulp-helpers instead of being in your own project's `package.json`. 

* [lodash](https://lodash.com/)
* [run-sequence](https://github.com/OverZealous/run-sequence)

## Development

gulp-helpers is written in ES6 and transpiled to ES5 using [babel](https://babeljs.io/). This allows us to take advantage of ES6 features while maintaining backwards compatibility. In my research, it seems like this is one of the first public [NPM projects](https://www.npmjs.com/package/gulp-helpers) to do this. Fun!

Pull requests to add more tasks or improve on existing ones are welcome. I'd like this to become a useful repository for lots of projects.
