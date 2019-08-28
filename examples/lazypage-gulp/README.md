# LazyPage 整合 gulp 支持热更新

### 如何运行

安装依赖

```
npm install
```

开始运行

```
npm run server
```

打包

```
npm run build
```

# gulp 配置

### 安装 gulp 依赖

```
npm install --save-dev gulp
```

### 配置热更新 server

1, 安装 lazypage-node 依赖

```
npm install --save-dev lazypage-node express
```

2, 创建 server.js

```
var express = require('express');
var serverFilter = require('lazypage-node');

var app = express();
app.use(serverFilter.filter('src'));
app.use(express.static('src'));

app.listen(7000, function() {});

```

3, 安装 browserSync 依赖

```
npm install --save-dev browser-sync gulp-nodemon
```

4, 创建 browserSync 任务

```
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
```

### 编译 less

安装依赖

```
npm install --save-dev gulp-less
```

创建 gulp less 任务

```
var less = require('gulp-less');

gulp.task('less', function() {
  return gulp
    .src(['src/**/*.less', '!src/**/_*.less'])
    .pipe(less())
    .pipe(gulp.dest('src'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});
```

### 自动追加 css 前缀

安装依赖

```
npm install --save-dev gulp-autoprefixer
```

在上面的 less 任务中追加.pipe(autoprefixer())

```
var autoprefixer = require('gulp-autoprefixer');
...
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src'))
...
```

在 package.json 中配置

```
"browserslist": [
    "last 2 versions",
    "Android >= 4.0"
]
```

### 监控文件变化

安装依赖

```
npm install --save-dev gulp-watch
```

创建 watch 任务

```
var watch = require('gulp-watch');
gulp.task('watch', function(cb) {
  watch('src/**/*.less', gulp.series('less'));
  watch('src/**/*.html', browserSync.reload);
  watch('src/**/*.js', browserSync.reload);
  cb();
});
```

### 创建热更新任务

```
gulp.task('server', gulp.series('browserSync', 'less', 'watch'));
```

### 静态文件版本控制

安装依赖

```
npm install --save-dev gulp-rev gulp-rev-collector
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
```

追加文件版本号到文件名中，版本号为文件 md5 后的值

```
...
.pipe(rev())
.pipe(gulp.dest('dist'))
.pipe(rev.manifest())
...
```

替换文件引用路径为带版本号路径

```
...
.pipe(
    revCollector({
        replaceReved: true
    })
)
...
```

### 处理图片

```
gulp.task('image', function() {
  return gulp
    .src('src/**/*.{jpg,png,svg,gif}')
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/image'));
});
```

### 处理 css

安装压缩 css 依赖

```
npm install --save-dev gulp-clean-css
```

创建 css 任务

```
var minifycss = require('gulp-clean-css');
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
```

### 处理 js

安装压缩 js 依赖

```
npm install --save-dev gulp-uglify
```

创建 js 任务

```
var uglify = require('gulp-uglify');
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
```

### 创建 json 任务

```
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
```

### 处理 html

安装压缩 html 依赖

```
npm install --save-dev gulp-htmlmin
```

创建 html 任务

```
var htmlmin = require('gulp-htmlmin');
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
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      })
    )
    .pipe(gulp.dest('dist'));
});
```

### 清理输出文件夹

安装文件删除依赖

```
npm install --save-dev del
```

创建删除任务

```
var del = require('del');
gulp.task('clean', function(cb) {
  return del('dist', cb);
});
```

### 拷贝其他资源

```
gulp.task('copy', function(cb) {
  gulp.src('src/**/*.{mp4,pdf,ico,woff2,woff,ttf}').pipe(gulp.dest('dist'));
  cb();
});
```

### 创建打包任务

```
gulp.task('build', gulp.series('clean', 'less', 'image', 'css', 'js', 'json', 'html', 'copy'));
```
