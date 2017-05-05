"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import browserify from "browserify";
import source from "vinyl-source-stream";

gulp.task("transpile", () => {

  return browserify("src/js/app.js")
    .transform("babelify")
    .bundle()
    .pipe(source("app.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("watch", ["transpile"], () => {
  gulp.watch("src/**/*.js", ["transpile"]);
});

gulp.task("default", ["transpile"]);
