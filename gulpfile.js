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

var del = require("del");
var glob = require("glob");

var browserSync = require("browser-sync").create();
var runSequence = require("run-sequence");


// browsersync
var config = {

    remoteURL: "https://hammerandbrain.plentymarkets-cloud01.com/",

    injectDir: "./tmp",
    localPath: "/resources",

    localAssets: {
        css: [
            "/css/beach.css"
        ]
    }

};


// browsersync
gulp.task("clean", function() {
    return del.sync(config.injectDir);
});

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
        .pipe(gulp.dest(SCSS_DIST))
        .pipe(gulp.dest("./tmp/css"))
        .pipe(browserSync.stream());
}

gulp.task("browserSync", ["build:sass"], function() {
    browserSync.init({
        proxy: {
            target: config.remoteURL
        },
        rewriteRules: [{
            // Inject Local CSS at the end of HEAD
            match: /<\/head>/i,
            fn: function(req, res, match) {
                var localCssAssets = "";

                var files = glob.sync(config.localAssets.css[0], {
                    cwd: "./tmp"
                });

                //localCssAssets += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + config.localPath + "/" + files[file] + "\">";
                localCssAssets += "<link rel=\"stylesheet\" type=\"text/css\" href=\"/resources/css/beach.css\">";


                return localCssAssets + match;
            }
        }],
        serveStatic: [{
            route: config.localPath,
            dir: "./tmp"
        }],
        watchTask: true
    });
});


// Watchers
gulp.task("watch:sass", ["browserSync", "build:sass"], function()
{
    return gulp.watch(SCSS_SRC + "**/*.scss", ["build:sass"]).on('change', browserSync.stream);
});

gulp.task("build", function() {
    runSequence([
        "clean",
        "build:sass"
    ]);
});

gulp.task("default", function() {
    runSequence(["build", "browserSync", "watch:sass"]);
});






