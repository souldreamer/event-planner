'use strict';

const browserSync = require('browser-sync');
const settings = require('./settings');
const objectAssignDeep = require('object-assign-deep');

class DelayedBrowserSync {
	constructor() {
		this.timer = null;
		this.delay = 1000;
		this.browserSync = browserSync.create(undefined, undefined);
	}

	init(options) {
		this.browserSync.init(options);
	}

	reload() {
		if (this.timer === null) {
			this.timer = setTimeout(() => {
				browserSync.reload();
				this.timer = null;
			}, this.delay);
		}
	}

	run(options) {
		this.browserSync.init(objectAssignDeep({
			port: 3000,
			files: [],
			injectChanges: true,
			logFileChanges: true,
			logLevel: 'info',
			logConnections: true,
			logPrefix: settings.appName,
			reloadDelay: 0,
			notify: true,
			server: {
				baseDir: ['.']
			},
			startPath: './index.html'
		}, options));
	}

	watch(sourcesToTasks, watchers) {
		for (let {sources, task: sourceTask} of sourcesToTasks) {
			if (!sources || !sourceTask) continue;

			let watcher = gulp.watch(Array.isArray(sources) ? sources : [sources], sourceTask);

			watcher.on('change', () => this.reload());
			for (let {watch, task: watchTask} of watchers) {
				if (!watch || !watchTask) continue;

				watcher.on(watch, watchTask);
			}
		}
		return Promise.resolve();
	}
}
let delayedBrowserSync = new DelayedBrowserSync();
module.exports = delayedBrowserSync;
