const gulp = require("gulp");
const ghPages = require("gulp-gh-pages");
const sequence = require("gulp-sequence");

gulp.task("release", () => {
    process.env["NODE_ENV"] = "production";
    process.env["DEPLOY"] = "true";
});

gulp.task("deploy-html", () => {
    return gulp.src("dist/index.html").pipe(ghPages());
})

gulp.task("deploy", sequence("release", "build", "deploy-html"));
