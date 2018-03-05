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

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;


// browsersync
var config = {

    remoteURL: "https://www.dortmunderisch.de/",

    srcDir: SCSS_SRC,
    injectDir: "./inject",
    localPath: "/resources",

    localAssets: {
        css: [
            "css/beach.css"
        ]
    }

};


gulp.task("default", ["build"]);

gulp.task("build", ["clean"]);

// browsersync
gulp.task("clean", ["build:sass-min"], function() {
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
        .pipe(browserSync.stream());
}



gulp.task("browserSync", function() {
    browserSync.init({
        proxy: {
            target: config.remoteURL
        },
        rewriteRules: [{
            // Inject Local CSS at the end of HEAD
            match: /<\/head>/i,
            fn: function(req, res, match) {
                var localCssAssets = "";
                for (var i = 0; i < config.localAssets.css.length; i++) {

                    var files = glob.sync(config.localAssets.css[i], {
                        cwd: config.injectDir
                    });

                    for (var file in files) {
                        localCssAssets += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + config.localPath + "/" + files[file] + "\">";
                    }
                }

                return localCssAssets + match;
            }
        }],
        serveStatic: [{
            route: config.localPath,
            dir: config.injectDir
        }],
        watchTask: true
    });
});


// Watchers
gulp.task("watch:sass", ["browserSync"], function()
{
    return gulp.watch(SCSS_SRC + "**/*.scss", ["build:sass"]);
});
