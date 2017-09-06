const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sequence = require("gulp-sequence");

require('./tasks');

gulp.task("build", (cb) => {
    sequence(["build-shaders", "build-audio"], "build-scripts", "reload")(cb);
});

gulp.task("reload", () => {
    browserSync.reload();
});

gulp.task("browserSync-init", () => {
    return browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("watch-js", ["build"], () => {
    return gulp.watch(
        ["src/**/*", "assets/**/*", "!src/shaders/**/*", "!src/music/**/*"],
        ["build"]
    );
});

gulp.task("watch", ["watch-js"]);
gulp.task("serve", sequence("browserSync-init", "watch"));
gulp.task("default", ["serve"]);
