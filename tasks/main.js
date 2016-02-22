'use strict';

const gulp = require('gulp');
const typescript = require('./common/typescript');

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
const historyApiFallback = require('connect-history-api-fallback');
const preprocess = require('gulp-preprocess');
const sortStream = require('sort-stream');
const print = require('gulp-print');
const order = require('gulp-order');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const arrayOrder = require('./common/gulp-arrayordersort');

exports.watchMainFiles = watch;

gulp.task('ts:lint', tsLint);
gulp.task('ts:compile', tsCompile);
gulp.task('ts:clean', tsClean);
gulp.task('watch', watch);
gulp.task('ts:doc', tsDoc);
gulp.task('copy:assets', gulp.series(copyLibs, copyIndex, copyAssets));
gulp.task('clean', clean);
gulp.task('build', gulp.parallel('copy:assets', 'ts:lint', 'ts:compile'));
gulp.task('build:clean', gulp.series('clean', 'build'));
gulp.task('serve', gulp.parallel('watch', gulp.series('build:clean', serve)));
gulp.task('default', gulp.series('serve'));

function tsLint() {
	return typescript.lint(settings.allTypeScript);
}
tsLint.description = 'Linting TypeScript sources';

function tsCompile() {
	return typescript.compile(
		[settings.allTypeScript, ...settings.allTypings],
		settings.tsOutputPath,
		settings.typingsOutputPath
	);
}
tsCompile.description = 'Compiling TypeScript sources';

function tsClean() {
	return del([
		`${settings.tsOutputPath}/**/*.js`,
		`${settings.tsOutputPath}/**/*.js.map`,
		`!${settings.tsOutputPath}/lib`
	]);
}
tsClean.description = 'Cleaning compiled sources';

function clean() {
	return del([settings.dist]);
}
clean.description = 'Cleaning entire dist';


function watch() {
	return browserSync.watch([
		{sources: settings.allTypeScript, task: gulp.series(/*'ts:lint',*/ 'ts:compile')},
		{sources: settings.indexHtml, task: gulp.series('copy:assets')},
		{sources: [`${settings.sourceApp}/**/*.html`, `!${settings.indexHtml}`], task: gulp.series('copy:assets')},
		{sources: `${settings.sourceApp}/**/*.css`, task: gulp.series('copy:assets')},
		{sources: `${settings.sourceApp}/**/*.js`, task: gulp.series('copy:assets')}
	]);
}
watch.description = 'Watching TypeScript sources';

function serve() {
	browserSync.init({
		port: 3000,
		files: settings.watchFiles,
		logPrefix: 'event-planner',
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: true
		},
		server: {
			baseDir: [settings.dist],
			middleware: [historyApiFallback()]
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

		out: settings.docsFolder,

		name: settings.appName,
		readme: settings.readmeFile,
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
		.src(settings.jsLibs)
		.pipe(changed(settings.libOutputPath))
		.pipe(gulp.dest(settings.libOutputPath));
}
copyLibs.description = 'Copying libs to distribution folder';

function copyIndex() {
	return gulp
		.src(settings.indexHtml)
		.pipe(changed(settings.dist))
		.pipe(gulp.dest(settings.dist));
}
copyLibs.description = 'Copying index HTML file to distribution folder';

// needs to run after copyLibs and copyIndex (in series)
function copyAssets() {
	let jsLibsFiles = settings.jsLibs.map(lib => lib.substr(lib.lastIndexOf('/') + 1));

	return merge([
		gulp
			.src(settings.indexHtmlOut)
			.pipe(inject(
				gulp
					.src(`${settings.libOutputPath}/*.js`, {read: false})
					.pipe(sortStream(arrayOrder.sort(jsLibsFiles))),
				{
					relative: true,
					starttag: '<!-- inject:libs -->'
				}))
			.pipe(gulp.dest(settings.dist)),
		gulp
			.src([...settings.allAssets, `!${settings.indexHtml}`])
			.pipe(changed(settings.dist))
			.pipe(gulp.dest(settings.dist))
	]);
}
copyAssets.description = 'Copying assets to distribution folder';

