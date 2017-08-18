const gulp = require('gulp');
const sequence = require('gulp-sequence');

gulp.task('pre-commit', ['prettier']);
gulp.task('pre-push', ['deploy']);