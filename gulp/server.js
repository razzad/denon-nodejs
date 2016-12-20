var gulp = require('gulp');
var nodemon = require('gulp-nodemon');


gulp.task('dev:server', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['gulp*', 'assets*']

  });
  gulp.watch('../controllers/**.js', ['server.js']);
});
