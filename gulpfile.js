
const path = require('path');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const stylish = require('jshint-stylish');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins({
    rename: {
        'gulp-angular-filesort': 'fileSort'
    }
});

const config = {
    src: 'src',
    dist: 'dist',
    module: 'U9ImBase'
};

gulp.task('clean', del.bind(null, [config.dist]));

gulp.task('lint', () => {
  return gulp.src(path.join(config.src, '/**/*.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
});

gulp.task('scripts', () => {
    return gulp.src(path.join(config.src, '/**/*.js'))
        .pipe($.concat(config.module + '.js'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('uglify', () => {
    return gulp.src(path.join(config.dist, '/' + config.module + '.js'))
        .pipe($.rename(config.module + '.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(config.dist));
});

gulp.task('build', () => {
    return new Promise(resolve => {
        runSequence(['clean', 'lint'], 'scripts', 'uglify', resolve);
    });
});

gulp.task('gzip', () => {
    return gulp.src(path.join(config.dist, '/**/*')).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('dist', () => {
    return new Promise(resolve => {
        runSequence(['clean', 'lint'], 'build', 'gzip', resolve);
    });
});
