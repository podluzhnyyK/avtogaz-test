const { src, dest, watch, series, lastRun } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const stylelint = require('gulp-stylelint');
// const cleanCSS = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
// const cssimport = require('gulp-cssimport');
// const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');
// const terser = require('gulp-terser');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const critical = require('critical').stream;
const webphtml = require('gulp-webp-html');

const ROOT_PATH = {
    DIST: 'dist',
    PROJECT: 'src',
    BUILD: 'build',
};

const path = {
    build: {
        base: `${ROOT_PATH.BUILD}/`,
        html: `${ROOT_PATH.BUILD}/`,
        css: `${ROOT_PATH.BUILD}/css/`,
        js: `${ROOT_PATH.BUILD}/js/`,
        upload: `${ROOT_PATH.BUILD}/upload/`,
        fonts: `${ROOT_PATH.BUILD}/fonts/`,
        img: `${ROOT_PATH.BUILD}/img/`,
    },
    dist: {
        base: `${ROOT_PATH.DIST}/`,
        html: `${ROOT_PATH.DIST}/`,
        css: `${ROOT_PATH.DIST}/css/`,
        js: `${ROOT_PATH.DIST}/js/`,
        upload: `${ROOT_PATH.DIST}/upload/`,
        fonts: `${ROOT_PATH.DIST}/fonts/`,
        img: `${ROOT_PATH.DIST}/img/`,
    },
    src: {
        base: `${ROOT_PATH.PROJECT}/`,
        html: `${ROOT_PATH.PROJECT}/*.html`,
        css: `${ROOT_PATH.PROJECT}/scss/**/*.scss`,
        js: `${ROOT_PATH.PROJECT}/js/**/*.js`,
        upload: `${ROOT_PATH.PROJECT}/upload/**/*.{png,jpg,svg,gif,webp}`,
        fonts: `${ROOT_PATH.PROJECT}/fonts/**/*.{woff,ttf}`,
        img: `${ROOT_PATH.PROJECT}/img/**/*.{png,jpg,svg,gif,webp}`,
    },
};

const isDist = () => Boolean(process.argv.indexOf('--dist') > -1);
const getDestinationPath = () => isDist() ? path.dist : path.build;

const serveTask = (done) => {
    if (!isDist()) {
        browserSync.init({
            server: {
                baseDir: path.build.base,
            },
        }, done);
    } else {
        done();
    }
};

const htmlTask = () => {
    let result;

    if (isDist()) {
        result = src(path.src.html, { since: lastRun(htmlTask) })
            .pipe(
                critical({
                    base: path.dist.base,
                    inline: true,
                }),
            )
            .pipe(webphtml())
            .pipe(dest(path.dist.html));
    } else {
        result = src(path.src.html, { since: lastRun(htmlTask) })
            .pipe(dest(path.build.html));
    }

    return result;
};

const cssTask = () => {
    let result;

    result = src('src/scss/normalize.css').pipe(dest(path.build.css));

    if (isDist()) {
        result = src(path.src.css, { since: lastRun(cssTask) })
            .pipe(plumber())
            .pipe(stylelint({
                reporters: [
                    {
                        formatter: 'string',
                        console: true,
                    },
                ],
            }))
            // .pipe(cssimport())
            .pipe(sass().on('error', sass.logError))
            .pipe(gcmq())
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 3 versions'],
                cascade: true,
            }))
            // .pipe(cleanCSS())
            .pipe(rename({ extname: '.css' }))
            .pipe(dest(path.dist.css));
    } else {
        result = src(path.src.css, { since: lastRun(cssTask) })
            // .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(stylelint({
                reporters: [
                    {
                        formatter: 'string',
                        console: true,
                    },
                ],
            }))
            // .pipe(cssimport())
            .pipe(sass().on('error', sass.logError))
            .pipe(rename({ extname: '.css' }))
            // .pipe(sourcemaps.write('.'))
            .pipe(dest(path.build.css));
    }

    return result;
};

const jsTask = () => src(path.src.js, { since: lastRun(jsTask) })
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    // .pipe(terser())
    .pipe(rename({ extname: '.js' }))
    .pipe(dest(getDestinationPath().js));

const imgTask = () => {
    let result;

    if (isDist()) {
        result = src(path.src.img, { since: lastRun(imgTask) })
            .pipe(plumber())
            .pipe(webp({
                quality: 70,
            }))
            .pipe(dest(path.dist.img))
            .pipe(src(path.src.img))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false,
                }],
                interlaced: true,
                optimizationLevel: 3,
            }))
            .pipe(dest(path.dist.img));
    } else {
        result = src(path.src.img, { since: lastRun(imgTask) })
            .pipe(plumber())
            .pipe(dest(path.build.img));
    }

    return result;
};

const uploadTask = () => {
    let result;

    if (isDist()) {
        result = src(path.src.upload, { since: lastRun(uploadTask) })
            .pipe(plumber())
            .pipe(webp({
                quality: 70,
            }))
            .pipe(dest(path.dist.upload))
            .pipe(src(path.src.upload))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{
                    removeViewBox: false,
                }],
                interlaced: true,
                optimizationLevel: 3,
            }))
            .pipe(dest(path.dist.upload));
    } else {
        result = src(path.src.upload, { since: lastRun(uploadTask) })
            .pipe(plumber())
            .pipe(dest(path.build.upload));
    }

    return result;
};

const fontsTask = () => src(path.src.fonts)
    .pipe(dest(getDestinationPath().fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff())
    .pipe(dest(getDestinationPath().fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(getDestinationPath().fonts));

const liveReload = (done) => {
    browserSync.reload();
    done();
};

const watchFilesTask = (done) => {
    if (!isDist()) {
        watch(path.src.css, series(cssTask, liveReload));
        watch(path.src.html, series(htmlTask, liveReload));
        watch(path.src.js, series(jsTask, liveReload));
        watch(path.src.fonts, series(fontsTask, liveReload));
        watch(path.src.img, series(imgTask, liveReload));
        watch(path.src.upload, series(uploadTask, liveReload));
    }
    done();
};

const cleanTask = () => del(getDestinationPath().base);

exports.default = series(
    cleanTask,
    series(fontsTask, imgTask, uploadTask, cssTask, jsTask, htmlTask),
    serveTask,
    watchFilesTask,
);
