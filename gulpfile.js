const gulp = require("gulp");
const rollup = require("gulp-rollup");
const browserSync = require("browser-sync").create();
const sequence = require("gulp-sequence");
const minify = require("gulp-babel-minify");
const insert = require("gulp-insert");
const replace = require("gulp-replace");
const htmlMinifier = require("html-minifier").minify;

const typescript = require("gulp-typescript");
const tsProject = typescript.createProject("./tsconfig.json");
const rename = require("gulp-rename");

const through = require("through2");
const preprocess = require("gulp-preprocess");

const env = process.env["NODE_ENV"] || "development";
function isProduction() {
    return env === "production";
}

const tokenizer = require("glsl-tokenizer/stream");
const parser = require("glsl-parser");
const deparser = require("glsl-deparser");
const glslminify = require("glsl-min-stream");
const Duplex = require("stream").Duplex;

function transformGLSL(shaderType, glsl) {
    return `
        import {buildShader} from '../shader';

        export default buildShader(${shaderType}, \`${glsl}\`)
        `;
}

// Builds and minifies glsl
function generateGLSLTemplates() {
    return through.obj(function(file, enc, cb) {
        if (file.path.endsWith(".glslx")) {
            file.path = file.path.replace(/\.glslx$/, ".ts");
            const shaderType = file.path[0] === "v" ? 0 : 1;

            let contents = "";

            if (isProduction()) {
                file
                    .pipe(tokenizer())
                    .pipe(parser())
                    .pipe(glslminify())
                    .pipe(deparser(false))
                    .on("data", output => {
                        contents += output;
                    })
                    .on("end", () => {
                        // contents = "export default `" + contents + "`";
                        file.contents = new Buffer(transformGLSL(shaderType, contents));
                        console.log(contents);

                        this.push(file);
                        cb();
                    });
            } else {
                file.contents = new Buffer(transformGLSL(shaderType, file.contents.toString()));
                this.push(file);
                cb();
            }
        } else {
            this.push(file);
            cb();
        }
    });
}

function generateHTML() {
    return through.obj(function(file, enc, cb) {
        const fs = require("fs");
        let contents = fs.readFileSync("index.html").toString();

        contents = contents.replace(
            /<script src=".*"><\/script>/,
            `<script>${file.contents.toString()}</script>`
        );

        // TODO: Minify HTML
        file.contents = new Buffer(
            htmlMinifier(contents, {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyURLS: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            })
        );
        this.push(file);
        cb();
    });
}

gulp.task('build-shaders', () => {
    const shadify = require('gulp-shadify');
    return gulp.src('./assets/shaders/**/*.glslx')
        .pipe(shadify())
        .pipe(replace(/\bconst\b/g, 'let'))
        .pipe(rename({extname: '.ts'}))
        .pipe(gulp.dest('./src/shaders'));
});

gulp.task("build-js", ['build-shaders'], () => {
    const context = {DEBUG: isProduction() === false };
    console.log(context);

    let stream = gulp
        .src("./src/**/*")
        // .pipe(generateGLSLTemplates())
        .pipe(preprocess({ context }))
        .pipe(tsProject())
        .on("error", function(err) {
            console.error(err);
            this.emit("end");
        })
        .pipe(
            rollup({
                entry: "./src/main.js"
            })
        )
        .pipe(replace(/Object\.freeze/, ''))
        .pipe(insert.prepend("(()=>{\n"))
        .pipe(insert.append("\n})();"));

    if (isProduction()) {
        stream = stream
            .pipe(
                minify({
                    mangle: true
                })
            )
            .pipe(replace(/^\(\(\)=>{/, ""))
            .pipe(replace(/}\)\(\);?$/, ""))
            .pipe(replace(/\bconst\b/g, "let"))
            .pipe(generateHTML())
            .pipe(rename("index.html"));
    } else {
        stream = stream.pipe(rename("bundle.js"));
    }

    return stream.pipe(gulp.dest("dist")).pipe(browserSync.stream());
});

gulp.task("browserSync-init", () => {
    return browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("watch-js", ["build-js"], () => {
    return gulp.watch(["src/**/*", "assets/shaders/**/*", "!src/shaders/**/*"], ["build-js"]);
});

gulp.task("watch", ["watch-js"]);
gulp.task("serve", sequence("browserSync-init", "watch"));
gulp.task("default", ["serve"]);
