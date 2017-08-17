const gulp = require("gulp");
const rollup = require("gulp-rollup");
const browserSync = require("browser-sync").create();
const sequence = require("gulp-sequence");
const minify = require("gulp-babel-minify");
const insert = require("gulp-insert");
const replace = require("gulp-replace");

const typescript = require("gulp-typescript");
const tsProject = typescript.createProject("./tsconfig.json");
const rename = require("gulp-rename");

const through = require("through2");

const env = process.env["NODE_ENV"] || "development";
function isProduction() {
    return env === "production";
}

const tokenizer = require("glsl-tokenizer/stream");
const parser = require("glsl-parser");
const deparser = require("glsl-deparser");
const glslminify = require("glsl-min-stream");
const Duplex = require("stream").Duplex;

// Builds and minifies glsl
function generateGLSLTemplates() {
    return through.obj(function(file, enc, cb) {
        if (file.path.endsWith(".glsl")) {
            file.path = file.path.replace(/\.glsl$/, ".ts");

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
                        contents = "export default `" + contents + "`";
                        file.contents = new Buffer(contents);
                        console.log(contents);

                        this.push(file);
                        cb();
                    });
            } else {
                contents = "export default `" + file.contents.toString() + "`";
                file.contents = new Buffer(contents);
                this.push(file);
                cb();
            }
        } else {
            this.push(file);
            cb();
        }
    });
}

gulp.task("build-js", () => {
    let stream = gulp
        .src("./src/**/*{.ts,.glsl}")
        .pipe(generateGLSLTemplates())
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
            .pipe(replace(/\bconst\b/g, "let"));
    }

    stream
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream());
});

gulp.task("browserSync-init", () => {
    return browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("watch-js", ["build-js"], () => {
    return gulp.watch("./src/**/*", ["build-js"]);
});

gulp.task("watch", ["watch-js"]);
gulp.task("serve", sequence("browserSync-init", "watch"));
gulp.task("default", ["serve"]);
