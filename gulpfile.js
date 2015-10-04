var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    imagemin    = require('gulp-imagemin'),
    plumber     = require('gulp-plumber'),
    uglify      = require('gulp-uglify'),
    concatJs    = require('gulp-concat'),
    folders     = require('gulp-folders');

function onError(err) {
    console.log(err);
}

// Static Server + watching scss/html files
gulp.task('watch', function() {

    gulp.watch('sass/*.scss', ['styles']);
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['compressJs']);
    gulp.watch('img/**/*.png', ['images']);

});

// Compile Sass
gulp.task('styles', function () {
    //return gulp.src(paths.sassSrc+'styles.scss')
    return gulp.src(['sass/style.scss'])
    //return gulp.src(['./foo/foo.scss', './bar/bar.scss'], { base: '.' })
    .pipe(sass({
        outputStyle: 'compressed',
        //outputStyle: 'nested',
        //sourceComments: 'normal',
        errLogToConsole: true,
        //includePaths : [paths.sassSrc]
    }))
    .pipe(prefix(
        'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))
    .pipe(gulp.dest('public/css/'))
    .pipe(plumber({
        errorHandler: onError
    }))
});

// Compile JS
gulp.task('compressJs', function() {
   return gulp.src('js/*.js')
    .pipe(concatJs('app.js'))
    .pipe(gulp.dest('public/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'))
});

// Generate IMG
gulp.task('images', function() {
   return gulp.src('img/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('public/img/'))
});

gulp.task('default', ['styles', 'compressJs', 'images', 'watch']);
