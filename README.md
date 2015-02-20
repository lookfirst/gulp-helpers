# gulp-helpers
A set of tasks and helpers for gulp

## Reasoning
When writing gulpfiles, I often found myself copying entire blocks of code between files. I would make mistakes, forget things and as projects progress, I would improve one gulpfile and not be able to easily extend the changes to other projects without a lot of copy/paste. In other words, gulpfiles are not DRY between projects. So, this project aims to help move common functionality into a set of external tasks.

## Usage
I might have a task which processes my less files. It is many lines tall and does a whole bunch of stuff, which I can't even remember half of it. (wtf is plumber)? It also necessitates adding dependencies to my projects `package.json` and all the `require` lines at the top of the gulpfile. What a mess.

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
    .pipe(changed(path.output, {extension: '.less'}))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [ cleancss ]
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});
```

Using gulp helpers, we end up with this single line in the gulpfile to define the task.

```
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);

taskMaker.defineTask('less', { src: path.less, dest: path.output });
```
