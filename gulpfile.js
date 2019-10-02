// Build HTML

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const gulpCopy = require('gulp-copy');

const reload = browserSync.reload;


// Link folder
const config = {
  srcHtml: 'src/html/*.html',
  buildHtml: 'build/html',
  srcCss: 'src/scss/**/*.scss',
  buildCss: 'build/css',
  srcJs: 'src/js/*.js',
  buildJs: 'build/js',
  srcImg: 'src/images/*',
  buildImg: 'build/images',
};

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
  gulp.src(config.srcJs)
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

gulp.task('html', () => {
  gulp.src(['./src/html/*.*'])
    .pipe(gulpCopy('build/', { prefix: 2 }));
});

// - Create server
gulp.task('browser-sync', () => {
  browserSync.init(['build/css/*.css', 'build/js/*.js'], {
    server: {
      baseDir: 'src/html',
      routes: {
        '/node_modules': 'node_modules',
        '/css': 'build/css',
        '/img': 'build/img',
        '/js': 'build/js',
        '/images': 'build/images',
      },
    },
  });
});

// - Watch
gulp.task('watch', () => {
  gulp.watch('src/html/*.html').on('change', reload);
  gulp.watch(config.srcCss, ['styles']);
  gulp.watch(config.srcJs, ['scripts']);
});

// - Build
gulp.task('default', ['styles', 'scripts', 'images', 'html', 'browser-sync', 'watch']);
