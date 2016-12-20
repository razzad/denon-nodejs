var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('test:server', function () {
  return gulp.src('test/*.spec.js', {read: false})
		// gulp-mocha needs filepaths so you can't have any plugins before it 
		.pipe(mocha());
});