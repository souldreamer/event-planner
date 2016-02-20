'use strict';

/**
 * Class to hold some recurring values used further in the script
 */
class Settings {
	constructor() {
		this.appName = 'Udacity Event Planner';

		this.docsFolder = './docs';
		this.readmeFile = './README.md';

		this.sourceApp = './src';
		this.dist = './dist';

		this.tsOutputPath = `${this.dist}/js`;
		this.allTypeScript = `${this.sourceApp}/**/*.ts`;
		this.allTypings = [
			'./typings/typescriptApp.d.ts',
			'./typings/browser.d.ts'
		];
		this.typingsOutputPath = './typings/typescriptApp.d.ts';

		this.allAssets = [
			`${this.sourceApp}/**/*`,
			`!${this.allTypeScript}`
		];
		this.watchFiles = [
			'/index.html',
			'/**/*.js',
			'/**/*.css',
			'/**/*.png', '/**/*.jpg', '/**/*.jpeg', '/**/*.gif'
		].map(file => this.dist + file);

		this.indexHtml = `${this.sourceApp}/index.html`;
		this.indexHtmlOut = `${this.dist}/index.html`;
		this.libOutputPath = `${this.tsOutputPath}/lib`;
		this.jsLibs = [
			'./node_modules/es6-shim/es6-shim.js',
			'./node_modules/angular2/bundles/angular2-polyfills.js',
			'./node_modules/systemjs/dist/system.src.js',
			'./node_modules/rxjs/bundles/Rx.js',
			'./node_modules/angular2/bundles/angular2.dev.js',
			'./node_modules/angular2/bundles/router.dev.js',
			'./node_modules/angular2/bundles/http.dev.js'
		];

		this.testBase = './tests';
		this.testFiles = [
			`${this.testBase}/**/*.ts`
		];
		this.testFilesOut = `${this.testBase}/compiled`;
		this.testFilesOutGlob = `${this.testFilesOut}/**/*.js`;
		this.testMainPre = `${this.testBase}/unit-tests.pre.html`;
		this.testMain = `${this.testBase}/unit-tests.html`;
		this.testLibs = [
			'./node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
			'./node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
			'./node_modules/jasmine-core/lib/jasmine-core/boot.js',
			'./node_modules/es6-shim/es6-shim.js',
			'./node_modules/angular2/bundles/angular2-polyfills.js',
			'./node_modules/systemjs/dist/system.src.js',
			'./node_modules/rxjs/bundles/Rx.js',
			'./node_modules/angular2/bundles/angular2.dev.js',
			'./node_modules/angular2/bundles/router.dev.js',
			'./node_modules/angular2/bundles/http.dev.js',
			'./node_modules/angular2/bundles/testing.dev.js'
		];
		this.testLibsOutputPath = `${this.testFilesOut}/lib`;
		this.testLibsOutGlob = [`${this.testLibsOutputPath}/**/*.js`];
		this.testLibsStyles = [
			'./node_modules/jasmine-core/lib/jasmine-core/jasmine.css'
		];
		this.testLibsStylesOutputPath = `${this.testLibsOutputPath}/styles`;
		this.testLibsStylesOutGlob = `${this.testLibsStylesOutputPath}/**/*.*`;
	}
}
module.exports = new Settings();
