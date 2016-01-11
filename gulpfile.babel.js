'use strict';

/**
 * Usage: node ./node_modules/gulp/bin/gulp.js ......
 */

/**
 * Class to hold some recurring values used further in the script
 */
class Settings {
	constructor() {
		this.sourceApp = './app';
		this.dist = './dist';
		this.tsOutputPath = this.dist + '/js';
		this.libOutputPath = this.tsOutputPath + '/lib';
		this.allJavaScript = [this.dist + '/js/**/*.js'];
		this.allTypeScript = this.sourceApp + '/**/*.ts';
		this.allTypings = [
			'./typings/**/*.d.ts'
		];
		this.allAssets = [
			this.sourceApp + '/**/*',
			'!' + this.allTypeScript
		];
		this.typingsOutputPath = './typings/typescriptApp.d.ts';
		this.libraryTypeScriptDefinitions = './typings/**/*.ts';
	}
}
const settings = new Settings();

const process = require('process');
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
const historyApiFallback = require('connect-history-api-fallback');
const preprocess = require('gulp-preprocess');
const inlineNg2Template = require('gulp-inline-ng2-template');

gulp.task('ts:lint', tsLint);
gulp.task('ts:compile', tsCompile);
gulp.task('ts:clean', tsClean);
gulp.task('watch', watch);
gulp.task('ts:doc', tsDoc);
gulp.task('copy:libs', copyLibs);
gulp.task('copy:assets', copyAssets);
gulp.task('clean', clean);
gulp.task('build', gulp.parallel('copy:libs', 'copy:assets', gulp.series('ts:lint', 'ts:compile')));
gulp.task('build:clean', gulp.series('clean', 'build'));
gulp.task('serve', gulp.parallel('watch', gulp.series('build', serve)));
gulp.task('default', gulp.series('serve'));

function tsLint() {
	return gulp
		.src(settings.allTypeScript)
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
}
tsLint.description = 'Linting TypeScript sources';

function tsCompile() {
	var tsResult = gulp
		.src([settings.allTypeScript, settings.libraryTypeScriptDefinitions])
		.pipe(preprocess({context: process.env}))
		.pipe(inlineNg2Template({useRelativePaths: true}))
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	return merge([
		tsResult.dts.pipe(gulp.dest(settings.typingsOutputPath)),
		tsResult.js
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(settings.tsOutputPath))
	]);
}
tsCompile.description = 'Compiling TypeScript sources';

function tsClean() {
	return del([
		settings.tsOutputPath + '/**/*.js',
		settings.tsOutputPath + '/**/*.js.map',
		'!' + settings.tsOutputPath + '/lib'
	]);
}
tsClean.description = 'Cleaning compiled sources';

function clean() {
	return del([settings.dist]);
}
clean.description = 'Cleaning entire dist';

function watch() {
	gulp.watch([settings.allTypeScript], gulp.series('ts:lint', 'ts:compile'));
	gulp.watch([settings.sourceApp + '/index.html'], gulp.series('copy:assets'));
	gulp.watch([settings.sourceApp + '/**/*.css'], gulp.series('copy:assets'));
	gulp.watch([settings.sourceApp + '/**/*.js'], gulp.series('copy:assets')); //?
}
watch.description = 'Watching TypeScript sources';

function serve() {
	browserSync({
		port: 3000,
		files: [
			'/index.html',
			'/**/*.js',
			'/**/*.css',
			'/**/*.png', '/**/*.jpg', '/**/*.jpeg', '/**/*.gif'
		].map(file => settings.dist + file),
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'debug',
		logPrefix: 'event-planner',
		notify: true,
		reloadDelay: 0,
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: true
		},
		tunnel: true,
		open: 'tunnel',
		server: {
			baseDir: ['dist'],
			middleware: [historyApiFallback()]//superstatic({debug: false})
		},
		ui: {
			port: 3030
		}
	});
}
serve.description = 'Starting browserSync';

function tsDoc() {
	let tsDocSettings = {
		module: 'commonjs',
		target: 'es5',
		mode: 'file',
		experimentalDecorators: true,

		out: './docs',

		name: 'Udacity Event Planner',
		readme: './README.md',
		theme: 'default',

		ignoreCompilerErrors: false,
		hideGenerator: true,
		verbose: true
	};

	return gulp
		.src([...settings.allTypings, settings.allTypeScript])
		.pipe(typedoc(tsDocSettings));
}
tsDoc.description = 'Generating TypeScript documentation';

function copyLibs() {
	return gulp
		.src([
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/angular2/bundles/http.dev.js'
		])
		.pipe(gulp.dest(settings.libOutputPath));
}
copyLibs.description = 'Copying libs to distribution folder';

function copyAssets() {
	return gulp
		.src(settings.allAssets)
		.pipe(gulp.dest(settings.dist));
}
copyAssets.description = 'Copying assets to distribution folder';

