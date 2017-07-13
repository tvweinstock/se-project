var gulp = require('gulp');
var browserify = require('gulp-browserify')
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: "."
    });
});

// Watching scss/less/html files
gulp.task('watch', ['serve', 'sass', 'scripts'], function() {
    gulp.watch("assets/scss/*.scss", ['sass']);
    gulp.watch("assets/js/*.js", ['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile SASS into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("assets/scss/*.scss")
    .pipe(sass({
      sourceComments: 'map',
      sourceMap: 'scss'
    }))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function(){
  gulp.src('assets/js/*.js')
      .pipe(browserify({
        insertGlobals: true,
        debug: !gulp.env.production
      }))
      .pipe(gulp.dest('build/js'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
gulp.task('server', ['serve']);
gulp.task('dev', ['watch']);
