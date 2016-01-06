var gulp = require('gulp');

gulp.task('setup', function(done) {
    gulp.src([
        'node_modules/angular2/bundles/js',
        'node_modules/angular2/bundles/angular2.*.js*',
        'node_modules/angular2/bundles/http.*.js*',
        'node_modules/angular2/bundles/router.*.js*',
        'node_modules/es6-shim/es6-shim.js*',
        'node_modules/systemjs/dist/*.*',
        'node_modules/jquery/dist/jquery.*js',
        'node_modules/bootstrap/dist/js/bootstrap*.js',
        'node_modules/@reactivex/rxjs/dist/global/Rx.js'
    ]).pipe(gulp.dest('web/lib'));

    gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.css'
    ]).pipe(gulp.dest('web/css'));
});

// called when we change our non-TypeScript assets
gulp.task('assets', function() {
    gulp.src(['./src/**/*.json',
            './src/**/*.html',
            './src/**/*.css'])
        .pipe(gulp.dest('./web'));
});

// copies non-typescript assets by calling
// the assets task when any source files change
gulp.task('watch.assets', ['assets'], function() {
	return gulp.watch(['./src/**/*.json',
	                   './src/**/*.html',
	                   './src/**/*.css'],
	                  ['assets']);
});

gulp.task('watch',
    ['watch.assets',
        'watch.ts',
        'watch.web']);
