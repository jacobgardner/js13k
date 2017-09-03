const gulp = require('gulp');
const replace = require('gulp-replace');
const minify = require('gulp-babel-minify');
const insert = require('gulp-insert');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const preprocess = require('gulp-preprocess');
const zip = require('gulp-zip');
const sourcemaps = require('gulp-sourcemaps');

const generateHTML = require('./html').generateHTML;

const tsProject = typescript.createProject('./tsconfig.json');

function isProduction() {
    const env = process.env['NODE_ENV'] || 'development';
    return env === 'production';
}

gulp.task('build-scripts', () => {
    const context = { DEBUG: isProduction() === false };

    let stream = gulp
        .src('./src/**/*')
        .pipe(sourcemaps.init())
        .pipe(preprocess({ context }))
        .pipe(tsProject())
        .on('error', function(err) {
            console.error(err.message);
            this.emit('end');
        })
        .pipe(
            rollup({
                entry: './src/main.js'
            })
        )
        .on('error', function(err) {
            console.error(err.message);
            this.emit('end');
        })
        .pipe(replace(/Object\.freeze/, ''))
        .pipe(insert.prepend('(()=>{\n'))
        .pipe(insert.append('\n})();'));

    if (isProduction()) {
        stream = stream
            .pipe(
                minify({
                    mangle: true
                })
            )
            .pipe(replace(/^\(\(\)=>{/, ''))
            .pipe(replace(/}\)\(\);?$/, ''))
            .pipe(replace(/\bconst\b/g, 'let'))
            .pipe(generateHTML())
            .pipe(rename('index.html'))
            .pipe(zip('i.zip'));
    } else {
        stream = stream.pipe(rename('bundle.js')).pipe(sourcemaps.write());
    }

    return stream.pipe(gulp.dest('dist'));
});
