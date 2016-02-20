'use strict';

const browserSync = require('browser-sync');

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
}
let delayedBrowserSync = new DelayedBrowserSync();
let delayedBrowserSyncReload = () => delayedBrowserSync.reload();

module.exports.reload = delayedBrowserSyncReload;
module.exports.main = delayedBrowserSync;