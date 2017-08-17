const gulp = require('gulp');
const shadify = require('gulp-shadify');
const rename = require("gulp-rename");
const replace = require("gulp-replace");

gulp.task('build-shaders', () => {
    // TODO: Clear shaders directory before populating it.
    return gulp.src('./assets/shaders/**/*.glslx')
        .pipe(shadify())
        .pipe(replace(/\bconst\b/g, 'let'))
        .pipe(rename({extname: '.ts'}))  .pipe(rename({extname: '.ts'}))
        .pipe(gulp.dest('./src/shaders'));
});

