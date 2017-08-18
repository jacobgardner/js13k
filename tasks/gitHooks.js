const gulp = require('gulp');
const sequence = require('gulp-sequence');

const guppy = require('git-guppy')(gulp);

gulp.task('pre-commit', ['prettier']);
gulp.task('pre-push', ['deploy']);