'use strict';

const gulp = require('gulp');
const tsc = require('gulp-typescript');
const tsProject = tsc.createProject('tsconfig.json', {typescript: require('typescript')});
const tslint = require('gulp-tslint');

exports.compile = compile;
exports.lint = lint;

function compile(sources, jsOutput, dtsOutput) {
	let tsResult = gulp
		.src(sources)
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	let resultArray = [];
	if (dtsOutput !== null && dtsOutput !== undefined) {
		resultArray.push(tsResult.dts.pipe(gulp.dest(dtsOutput)));
	}

	resultArray.push(tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(jsOutput)));

	return merge(resultArray);
}

function lint(sources) {
	return gulp
		.src(sources)
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
}
