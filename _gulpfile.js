// Build PUG

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const changed = require('gulp-changed');

// - Link folder
const config = {
  srcHtml: 'src/pug/*.pug',
  buildHtml: 'build/html',
  srcCss: 'src/scss/**/*.scss',
  buildCss: 'build/css',
  srcJs: 'src/js/*.js',
  buildJs: 'build/js',
  srcImg: 'src/img/*',
  buildImg: 'build/img',
};

// - Config pug
gulp.task('pug', () => {
  gulp.src(config.srcHtml)
    .pipe(plumber())
    .pipe(changed('templates', { extension: '.html' }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(config.buildHtml));
});

// - Config style
gulp.task('styles', () => {
  const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    // expanded, compressed
  };

  gulp.src(config.srcCss)
    // output css
    .pipe(plumber())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest(config.buildCss))

    // output min css
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(config.buildCss));
});

// - Config js
gulp.task('scripts', () => {
  gulp.src([config.srcJs,
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.js'])
    // output js
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.buildJs))

    // output min js
    .pipe(minify({
      ext:
      {
        src: '-debug.js',
        min: '.js',
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js'],
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(config.buildJs));
});

// - IMGmini
gulp.task('images', () => {
  gulp.src(config.srcImg)
    .pipe(imagemin())
    .pipe(gulp.dest(config.buildImg));
});

// - Create server
gulp.task('browser-sync', () => {
  browserSync.init(['build/html/*.html', 'build/css/*.css', 'build/js/*.js'], {
    server: {
      baseDir: 'build/html',
      routes: {
        '/node_modules': 'node_modules',
        '/css': 'build/css',
        '/js': 'build/js',
        '/img': 'build/img',
      },
    },
  });
});

// - Watch
gulp.task('watch', () => {
  gulp.watch(config.srcHtml, ['pug']);
  gulp.watch(config.srcCss, ['styles']);
  gulp.watch(config.srcJs, ['scripts']);
});

// - Build
gulp.task('default', ['pug', 'styles', 'scripts', 'images', 'browser-sync', 'watch']);
