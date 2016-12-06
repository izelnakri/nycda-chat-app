const gulp = require('gulp'),
      nodemon = require('gulp-nodemon'),
      sass = require('gulp-sass'),
      buffer = require('vinyl-buffer'), // check if needed
      babelify = require('babelify'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'), // check if needed
      sourcemaps = require('gulp-sourcemaps'),
      rev = require('gulp-rev'),
      revDel = require('rev-del'),
      uglify = require('gulp-uglify'),
      size = require('gulp-size'),
      mocha = require('gulp-mocha'),
      concat = require('gulp-concat');

gulp.task('js:vendor', () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/tether/dist/js/tether.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
  ]).pipe(concat('vendor.js'))
    .pipe(size({ title: 'vendor.js' }))
    .pipe(rev())
    .pipe(gulp.dest('public/js'))
    .pipe(rev.manifest('config/assets.json', {
        base: 'config',
        merge: true
    }))
    .pipe(revDel({
        dest: 'public/js',
        oldManifest: 'config/assets.json'
    }))
    .pipe(gulp.dest('config'));
});

gulp.task('js:application', () => {
  var bundler = browserify({
    entries: 'frontend/js/application.js',
    debug: true
  });

  bundler.transform(babelify, { presets: ["es2015"] });
  bundler.bundle()
    .on('error', function(err) {
        // this is plumber like error reporting
        console.log('ERROR OCCURED ON js:compile'.red);
        console.error(err);
        // notifier.notify({
        //     title: 'build failed',
        //     message: err
        // });
    })
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(size({ title: 'application.js' }))
    .pipe(rev())
    .pipe(gulp.dest('public/js'))
    .pipe(rev.manifest('config/assets.json', {
        base: 'config',
        merge: true
    }))
    .pipe(revDel({
        dest: 'public/js',
        oldManifest: 'config/assets.json'
    }))
    .pipe(gulp.dest('config'));
});

gulp.task('scss', () => {
  gulp.src('frontend/scss/application.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat({ path: 'application.css', cwd: '' }))
    .pipe(size({ title: 'application.css' }))
    .pipe(rev())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(rev.manifest('config/assets.json', {
      base: 'config',
      merge: true
    }))
    .pipe(revDel({
      dest: 'public/css',
      oldManifest: 'config/assets.json'
    }))
    .pipe(gulp.dest('config'));
});

// gulp.task('test', ['test:unit'], () => {
//   gulp.watch('test/**/*.js', ['test:unit']);
// });
//
// gulp.task('test:unit', () => {
//   gulp.src('test/unit/post.js')
//     .pipe(mocha());
// });

gulp.task('default', ['scss', 'js:vendor', 'js:application'], () => {
  gulp.watch('frontend/scss/**/*.scss', ['scss']);
  gulp.watch('frontend/js/**/*.js', ['js:vendor', 'js:application']);
});
