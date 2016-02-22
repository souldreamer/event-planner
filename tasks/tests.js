'use strict';

const gulp = require('gulp');
const compileTypescript = require('./common/typescript').compile;

const settings = require('./tasks/common/settings');

const process = require('process');
const debug = require('gulp-debug');
const inject = require('gulp-inject');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const merge = require('merge2');
const browserSync = require('./common/delayed-browser-sync');
const superstatic = require('superstatic');
const typedoc = require('gulp-typedoc');
const preprocess = require('gulp-preprocess');
const sortStream = require('sort-stream');
const print = require('gulp-print');
const order = require('gulp-order');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const karmaServer = require('karma').Server;
const arrayOrder = require('./common/gulp-arrayordersort');


gulp.task('tests:compile', testsCompile);
gulp.task('tests:build:index', testsIndexBuild);
gulp.task('tests:copy:libs'. testsCopyLibs);
gulp.task('tests:clean', testsClean);
gulp.task('tests:watch', testsWatch);
gulp.task('tests:build', gulp.series(gulp.parallel(testsCopyLibs, 'tests:compile'), 'tests:build:index'));
gulp.task('tests:clean:build', gulp.series('tests:clean', 'tests:build'));
gulp.task('tests:run', gulp.parallel('tests:watch', gulp.series('tests:clean:build', testsRun)));
gulp.task('tests:karma', gulp.series('tests:build', testsKarma));

function testsCompile() {
	return compileTypescript([...settings.testFiles, ...settings.allTypings], settings.testFilesOut);
}
testsCompile.description = 'Compiling test files';

function testsRun() {
	browserSync.main.init({
		port: 3050,
		files: [settings.testFilesOutGlob, settings.testMain, settings.watchFiles],
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'info',
		logConnections: true,
		logPrefix: 'async-pipe-tests',
		reloadDelay: 0,
		server: {
			baseDir: ['.']
		},
		startPath: settings.testMain
	});
}
testsRun.description = 'Running tests';

function testsIndexBuild() {
	let libFileNames = settings.testLibs.map(lib => lib.substr(lib.lastIndexOf('/') + 1));

	return gulp
		.src(settings.testMainPre)
		.pipe(inject(
			gulp.src(settings.testLibsStylesOutGlob, {read: false}),
			{
				relative: true,
				starttag: '<!-- inject:libs:css -->',
				transform: (filepath) => `<link rel="stylesheet" href="tests/${filepath}">`
			}
		))
		.pipe(inject(
			gulp
				.src(`${settings.testLibsOutputPath}/*.js`, {read: false})
				.pipe(sortStream(arrayOrder.sort(libFileNames))),
			{
				relative: true,
				starttag: '<!-- inject:libs -->',
				transform: (filepath) => `<script src="tests/${filepath}"></script>`
			}
		))
		.pipe(inject(
			gulp.src([
				settings.testFilesOutGlob,
				...(settings.testLibsOutGlob.map(lib => `!${lib}`))
			], {read: false}),
			{
				relative: true,
				starttag: '/* inject:js:imports */',
				endtag: '/* endinject */',
				transform: (filepath) => `System.import('tests/${filepath}');`
			}
		))
		.pipe(rename(settings.testMain))
		.pipe(changed('.'))
		.pipe(gulp.dest('.'));
}
testsIndexBuild.description = 'Build unit-tests.html';

function testsCopyLibs() {
	return merge([
		gulp
			.src(settings.testLibs)
			.pipe(changed(settings.testLibsOutputPath))
			.pipe(gulp.dest(settings.testLibsOutputPath)),
		gulp
			.src(settings.testLibsStyles)
			.pipe(changed(settings.testLibsStylesOutputPath))
			.pipe(gulp.dest(settings.testLibsStylesOutputPath))
	]);
}
testsCopyLibs.description = 'Copy libs used by tests';

function testsClean() {
	return del([settings.testFilesOut, settings.testMain]);
}
testsClean.description = 'Clean compiled test files';

function testsWatch() {
	gulp.watch([settings.testMainPre], gulp.series('tests:build:index')).on('change', browserSync.reload);
	gulp.watch([settings.testFiles], gulp.series('tests:build')).on('change', browserSync.reload);
	watch();
	return Promise.resolve();
}
testsWatch.description = 'Watch test files for changes';

function testsKarma() {
	return new Promise((resolve) => {
		new karmaServer({
			configFile: __dirname + '/karma.conf.js',
			singleRun: true
		}, resolve).start();
	});
}
