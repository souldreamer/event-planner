'use strict';

const gulp = require('gulp');
const tsc = require('gulp-typescript');
const tsProject = tsc.createProject('tsconfig.json', {typescript: require('typescript')});

exports.compile = compileTypescript;

function compileTypescript(sources, jsOutput, dtsOutput) {
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
