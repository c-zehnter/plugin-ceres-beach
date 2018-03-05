// ceres beach: only watch and compile scss 


const SCSS_SRC = "./resources/scss/";
const SCSS_DIST = "./resources/css/";
const OUTPUT_PREFIX = "beach";

// import gulp
var gulp = require("gulp");
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var minifyCSS = require("gulp-minify-css");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");

gulp.task("default", ["build"]);

gulp.task("build", [
    "build:sass-min"
]);

// SASS
gulp.task("build:sass-min", ["build:sass"], function()
{
    return buildSass(OUTPUT_PREFIX + ".min.css", "compressed");
});

gulp.task("build:sass", function()
{
    return buildSass(OUTPUT_PREFIX + ".css", "expanded");
});

function buildSass(outputFile, outputStyle)
{
    var config = {
        scssOptions  : {
            errLogToConsole: true,
            outputStyle    : outputStyle
        },
        prefixOptions: {
            browsers: [
                "last 2 versions",
                "> 5%",
                "Firefox ESR"
            ]
        }
    };

    return gulp
        .src(SCSS_SRC + "Ceres.scss")
        .pipe(sourcemaps.init())
        .pipe(sass(config.scssOptions).on("error", sass.logError))
        .pipe(rename(outputFile))
        .pipe(autoprefixer(config.prefixOptions))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(SCSS_DIST));
}

// Watchers
gulp.task("watch:sass", function()
{
    return gulp.watch(SCSS_SRC + "**/*.scss", ["build:sass"]);
});
