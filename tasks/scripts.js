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
const fs = require('fs');

const generateHTML = require('./html').generateHTML;

const MAX_SIZE = 13312;

const tsProject = typescript.createProject('./tsconfig.json');

function isProduction() {
    const env = process.env['NODE_ENV'] || 'development';
    return env === 'production';
}

function isDeploy() {
    const env = process.env['DEPLOY'] || 'false';
    return env === 'true';
}

gulp.task('build-scripts', () => {
    const context = { DEBUG: isProduction() === false, DEPLOY: isDeploy() };

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

        console.log(isDeploy());

        if (!isDeploy()) {
            stream = stream.pipe(zip('i.zip'));
        }
    } else {
        stream = stream.pipe(rename('bundle.js')).pipe(sourcemaps.write());
    }

    stream = stream.pipe(gulp.dest('dist'));

    if (!isDeploy() && isProduction()) {
        stream.on('end', () => {
            const stats = fs.statSync('./dist/i.zip');
            console.log(`Size: ${stats.size} B/${MAX_SIZE} B = ${Math.floor(stats.size/MAX_SIZE * 100)}%`);
        });
    }

    return stream;
});
