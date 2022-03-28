'use strict';

//require
var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    fileinclude = require("gulp-file-include"),
    uglify = require('gulp-uglify-es').default,
    gulpIf = require('gulp-if'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    imageminGifsicle = require('imagemin-gifsicle'),
    useref = require('gulp-useref'),
    cssbeautify = require('gulp-cssbeautify'),
    browserSync = require('browser-sync'),
    imagemin = import('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    postcss = require('gulp-postcss'),
    atImport = require('postcss-import'),
    cssnext = require('postcss-cssnext'),
    browserReport = require('postcss-browser-reporter'),
    rtlcss = require('gulp-rtlcss'),
    rename = require('gulp-rename'),
    wait = require('gulp-wait');



//paths

var paths = {
    sass: {
        src: './src/sass',
        files: './src/sass/**/*.scss',
        dest: './build/css'
    },
    js: {
        src: './src/js',
        files: './src/js/*.js',
        dest: './build/js'
    },
    build: {
        html: 'build/**/*.html',
    },
    sync: {
        css: 'src/css/**/*.css',
        html: 'src/**/*.html',
        js: 'src/js/**/*.js'
    },
    img: {
        src: './src/images/**/*.!(db)',
        dest: './build/images'
    },
    fonts: {
        src: './src/fonts/**/*',
        dest: './build/fonts'
    },
    assets: {
        src: './src/assets/**/*',
        dest: './build/assets'
    }
}

//browser sync
var server = browserSync.create();

function reload(done) {
    server.reload();
    done();
};

function serve(done) {
    server.init({
        port: 3014,
        server: "./",
        startPath: "/build"
    });
    done();
};

//concat HTML
gulp.task('htmlConcat', function () {
    return gulp
        .src(["src/**/*.html", "!src/template-parts/**/*.html"])
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest("./build/"));
});

//compile sass
gulp.task('main-sass', function () {
    var plugins = [
        atImport(),
        cssnext({
            browsers: ['last 10 versions', '> 1%', 'Firefox ESR']
        }),
        //browserReport()
    ];
    return gulp.src(paths.sass.files)
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(wait(200))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [paths.sass.src]
        }).on('error', sass.logError))
        .pipe(postcss(
            plugins
        ))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('rtl-sass', function () {
    var plugins = [
        atImport(),
        cssnext({
            browsers: ['last 10 versions', '> 1%', 'Firefox ESR']
        }),
        //browserReport()
    ];
    return gulp.src(paths.sass.files)
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [paths.sass.src]
        }).on('error', sass.logError))
        .pipe(postcss(
            plugins
        ))
        .pipe(rtlcss({
            stringMap: [{
                name: 'previous-next',
                priority: 100,
                search: ['previous', 'Previous', 'PREVIOUS'],
                replace: ['next', 'Next', 'NEXT'],
                options: {
                    scope: '*',
                    ignoreCase: false
                }
            }]
        }))
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('sass', gulp.parallel('main-sass', 'rtl-sass'));

//watcher
function watch(done) {
    gulp.watch(paths.sass.files).on('change', gulp.series('main-sass', reload));
    gulp.watch(paths.sync.html).on('change', gulp.series('htmlConcat', reload));
    gulp.watch(paths.sync.js).on('change', gulp.series('jsOptimize', reload));
    done();
};
//gulp.task('watch', gulp.series('sass', serve, watch));
gulp.task('watch', gulp.series('main-sass', 'htmlConcat', serve, watch));


// compile and concat all js files
gulp.task('jsOptimize', function () {
    return gulp.src(paths.js.files)
        .pipe(gulp.dest(paths.js.dest))
});

//copy fonts
gulp.task('fonts', function () {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
});

//copy assets
gulp.task('assets', function () {
    return gulp.src(paths.assets.src)
        .pipe(gulp.dest(paths.assets.dest))
});

gulp.task('fontsToDist', function () {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest('./dist/fonts/'))
});

//copy images
gulp.task('images', function () {
    return gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.dest))
});

gulp.task('imagesToDist', function () {
    return gulp.src(paths.img.src)
        .pipe(gulp.dest('dist/images'))
});


//compress
gulp.task('useref', function () {
    var plugins = [
        cssnext({
            browsers: ['last 10 versions', '> 1%', 'Firefox ESR']
        }),
        cssnano({
            autoprefixer: false,
            safe: true,
            discardComments: {
                removeAll: true
            }
        })
    ];
    return gulp.src(paths.build.html)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', postcss(
            plugins
        )))
        .pipe(gulp.dest('dist'));
});

//build
gulp.task('default', gulp.series(gulp.parallel('sass', 'imagesToDist', 'fonts', 'fontsToDist', 'htmlConcat', 'jsOptimize', 'useref')));


//build
gulp.task('build', gulp.series(gulp.parallel('main-sass', 'htmlConcat', 'jsOptimize', 'fonts', 'assets', 'images')));


/*
//before gulp dist 
//
gulp main-sass
gulp htmlConcat
gulp jsOptimize
gulp fonts
gulp assets
gulp images
*/