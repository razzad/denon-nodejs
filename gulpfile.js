var gulp = require('gulp');



gulp.task('watch:api', function () {
  gulp.watch(['controllers/**/*.js', 'models/**/*.js', 'test/**/*.js', './*.js'], ['test:server']);

});

gulp.task('dev', [ 'watch:api', 'dev:server', 'test:server']);

var fs = require('fs');
fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require('./gulp/' + task);
});
