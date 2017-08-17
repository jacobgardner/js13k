const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sequence = require("gulp-sequence");

require("./tasks/scripts");
require("./tasks/shaders");

gulp.task("build", sequence("build-shaders", "build-scripts", "reload"));

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
        ["src/**/*", "assets/shaders/**/*", "!src/shaders/**/*"],
        ["build"]
    );
});

gulp.task("watch", ["watch-js"]);
gulp.task("serve", sequence("browserSync-init", "watch"));
gulp.task("default", ["serve"]);
