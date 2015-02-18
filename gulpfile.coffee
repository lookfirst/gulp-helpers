gulp = require('gulp')
babel = require('gulp-babel')

vinylPaths = require('vinyl-paths')
del = require('del')

path =
	output: 'dist'
	src: 'src/**/*.js'

# The sad irony of not being able to use our own code
gulp.task 'clean', ->
	gulp.src([ path.output ]).pipe(vinylPaths(del))

gulp.task 'prepublish', ['clean'], ->
	gulp.src(path.src)
		.pipe(babel())
		.pipe(gulp.dest(path.output))