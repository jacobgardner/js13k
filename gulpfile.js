const gulp = require("gulp");
const rollup = require("gulp-rollup");
const browserSync = require("browser-sync").create();
const sequence = require("gulp-sequence");
const minify = require("gulp-babel-minify");
const insert = require("gulp-insert");

const typescript = require("gulp-typescript");
const tsProject = typescript.createProject("./tsconfig.json");

const env = process.env["NODE_ENV"] || "development";
function isProduction() {
    return env === "production";
}

gulp.task("build-js", () => {
    let stream = gulp
        .src("./src/**/*")
        .pipe(tsProject())
        .pipe(
            rollup({
                entry: "./src/main.js"
            })
        )
        .pipe(insert.prepend("(()=>{\n"))
        .pipe(insert.append("\n})();"));

    if (isProduction()) {
        stream = stream.pipe(
            minify({
                mangle: true
            })
        );
    }

    stream.pipe(gulp.dest("dist")).pipe(browserSync.stream());
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
