const gulp = require('gulp');
const prettier = require('gulp-plugin-prettier');

gulp.task('prettier', () => {
    gulp.src(['src/**/*.ts', '!src/shaders/**/*'])
        .pipe(prettier.format({
            singleQuote: true,
            tabWidth: 4,
        }))
        .pipe(gulp.dest(file => file.base));
});