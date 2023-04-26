const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

gulp.task('copy-img', function() {
    return gulp.src('./src/img/*.png')
      .pipe(gulp.dest('./dist/img'))
      .pipe(browserSync.stream());
    });
  
  gulp.task('copy-html', function() {
    return gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
    });
  
  gulp.task('copy-css', function() {
    return gulp.src('./src/**/*.css')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
    });

  gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
    });
  
  gulp.task('concat', function() {
    return gulp.src('./src/**/*.js')
    //   .pipe(concat('app.js'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
  });

  gulp.task('copy_node', function() {
    return gulp.src('./node_modules/moment/min/moment.min.js')
      .pipe(gulp.dest('./dist/node'))
      .pipe(browserSync.stream());
  });

  // Monitoramento
  gulp.task('watch', function() {
    gulp.watch('./src/**/*.html', gulp.series('copy-html'));
    gulp.watch('./src/**/*.css', gulp.series('copy-css'));
    gulp.watch('./src/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/**/*.js', gulp.series('concat'));
    gulp.watch('./node_modules/moment/min/moment.min.js', gulp.series('copy_node'));
  });


  gulp.task('default', gulp.series('copy-img', 'copy-html', 'copy-css','copy_node', 'sass', 'concat', 'watch'));

  // gulp.watch('./src/**/*.html', gulp.series('copy-html')).on('change', browserSync.reload);
  // gulp.watch('./src/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
  // gulp.watch('./src/**/*.css', gulp.series('copy-css')).on('change', browserSync.reload);
  // gulp.watch('./src/**/*.js', gulp.series('concat')).on('change', browserSync.reload);