var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function(cb) {
  nodemon({
    script: 'server.js',
    //ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
    ext: 'html',
    env: {
      NODE_ENV: 'development'
    }
  }).on('start', function() {
    browserSync.init(
      {
        proxy: 'http://localhost:7000',
        //files: ['src/**/*.less', 'src/**/*.html', 'src/**/*.js'],
        port: 8183
      },
      function() {
        console.log('browser refreshed.');
      }
    );
    cb();
  });
});
gulp.task('less', function() {
  return gulp
    .src(['src/**/*.less', '!src/**/_*.less'])
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});
gulp.task('watch', function(cb) {
  watch('src/**/*.less', gulp.series('less'));
  watch('src/**/*.html', browserSync.reload);
  watch('src/**/*.js', browserSync.reload);
  cb();
});

gulp.task('clean', function(cb) {
  return del('dist', cb);
});

gulp.task('image', function() {
  return gulp
    .src('src/**/*.{jpg,png,svg,gif}')
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/image'));
});

gulp.task('css', function() {
  return gulp
    .src(['dist/rev/**/*.json', 'src/**/*.css'])
    .pipe(
      revCollector({
        replaceReved: true
      })
    )
    .pipe(minifycss())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

gulp.task('js', function() {
  return gulp
    .src(['dist/rev/**/*.json', 'src/**/*.js'])
    .pipe(
      revCollector({
        replaceReved: true
      })
    )
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});

gulp.task('json', function() {
  return gulp
    .src(['dist/rev/**/*.json', 'src/**/*.json'])
    .pipe(
      revCollector({
        replaceReved: true
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
  return gulp
    .src(['dist/rev/**/*.json', 'src/**/*.html'])
    .pipe(
      revCollector({
        replaceReved: true
      })
    )
    .pipe(
      htmlmin({
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function(cb) {
  gulp.src('src/**/*.{mp4,pdf,ico,woff2,woff,ttf}').pipe(gulp.dest('dist'));
  cb();
});

gulp.task('server', gulp.series('browserSync', 'less', 'watch'));
gulp.task('build', gulp.series('clean', 'less', 'image', 'css', 'js', 'json', 'html', 'copy')); ////gulp.paralle
