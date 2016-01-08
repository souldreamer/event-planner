'use strict';

// based on Dan Wahlin's "Angular 2.0 in TypeScript"
// (https://github.com/DanWahlin/AngularIn20TypeScript/)
class Settings {
	constructor() {
		this.sourceApp = './app';
		this.tsOutputPath = this.sourceApp + '/js';
		this.allJavaScript = [this.sourceApp + '/js/**/*.js'];
		this.allTypeScript = this.sourceApp + '/**/*.ts';
		this.typings = './typings';
		this.libraryTypeScriptDefinitions = './typings/**/*.ts';
	}
}
const settings = new Settings();

const gulp = require('gulp');
const debug = require('gulp-debug');
const inject = require('gulp-inject');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const tsProject = tsc.createProject('tsconfig.json');
const browserSync = require('browser-sync');
const superstatic = require('superstatic');

gulp.task('ts-lint', () => {
	return gulp
		.src(settings.allTypeScript)
		.pipe(tslint())
		.pipe(tslint.report('prose'));
});

gulp.task('compile-ts', () => {
	var tsResult = gulp
		.src([settings.allTypeScript, settings.libraryTypeScriptDefinitions])
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	tsResult.dts.pipe(gulp.dest(settings.tsOutputPath));

	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(settings.tsOutputPath));
});

gulp.task('clean-ts', cb => {
	del([
		    settings.tsOutputPath + '/**/*.js',
		    settings.tsOutputPath + '/**/*.js.map',
		    '!' + settings.tsOutputPath + '/lib',
	], cb);
});

gulp.task('watch', () => {
	gulp.watch([settings.allTypeScript], ['ts-lint', 'compile-ts']);
});

gulp.task('serve', ['compile-ts', 'watch'], () => {
	process.stdout.write('Starting browserSync and superstatic...\n');
	browserSync({
		port: 3000,
		files: ['index.html', '**/*.js', '**/*.css'].map(file => settings.sourceApp + '/' + file),
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'silent',
		logPrefix: 'event-planner',
		notify: true,
		reloadDelay: 0,
		server: {
			baseDir: ['app', '.']//,
			//middleware: superstatic({debug: false})
		}
	});
});

gulp.task('default', ['ts-lint', 'compile-ts']);
