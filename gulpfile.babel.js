'use strict';

// based on Dan Wahlin's "Angular 2.0 in TypeScript"
// (https://github.com/DanWahlin/AngularIn20TypeScript/)
class Settings {
	constructor() {
		this.sourceApp = './app';
		this.dist = './dist';
		this.tsOutputPath = this.dist + '/js';
		this.libOutputPath = this.tsOutputPath + '/lib';
		this.allJavaScript = [this.dist + '/js/**/*.js'];
		this.allTypeScript = this.sourceApp + '/**/*.ts';
		this.allAssets = [this.sourceApp + '/**/*', '!' + this.allTypeScript];
		this.typingsOutputPath = './typings/typescriptApp.d.ts';
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
const merge = require('merge2');
const browserSync = require('browser-sync');
const superstatic = require('superstatic');
const typedoc = require('gulp-typedoc');

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

	return merge([
		tsResult.dts.pipe(gulp.dest(settings.typingsOutputPath)),
		tsResult.js
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(settings.tsOutputPath))
	]);
});

gulp.task('clean-ts', cb => {
	del([
		    settings.tsOutputPath + '/**/*.js',
		    settings.tsOutputPath + '/**/*.js.map',
		    '!' + settings.tsOutputPath + '/lib'
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

gulp.task('tsdoc', () => {
	let tsDocSettings = {
		module: 'system',
		target: 'es5',
		includeDeclarations: true,
		exclude: 'node_modules/**',
		mode: 'file',

		out: './docs',

		name: 'Udacity Event Planner',
		readme: './README.md',
		theme: 'default',
		ignoreCompilerErrors: false,
		hideGenerator: true,
		verbose: true,
		version: true
	};

	return gulp
		.src(settings.allTypeScript)
		.pipe(typedoc(tsDocSettings));
});

gulp.task('copy:libs', () => {
	return gulp
		.src([
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/angular2/bundles/http.dev.js'
		])
		.pipe(settings.libOutputPath);
});

gulp.task('copy:assets', () => {
	return gulp
		.src(settings.allAssets)
		.pipe(settings.dist);
});

gulp.task('default', ['ts-lint', 'compile-ts']);
