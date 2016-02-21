'use strict';

exports.sort = keepArrayOrderSort;

function getIndex(array, element) {
	for (let index = 0; index < array.length; index++) {
		if (array[index] === element) {
			return index;
		}
	}
	return -1;
}

function keepArrayOrderSort(array, ascending) {
	if (ascending === undefined) ascending = true;

	return function(fileA, fileB) {
		let a = fileA.history[0];
		let b = fileB.history[0];
		a = a.substr(a.lastIndexOf('/') + 1);
		b = b.substr(b.lastIndexOf('/') + 1);
		let order = getIndex(array, a) - getIndex(array, b);

		return (ascending ? 1 : -1) * order;
	}
}
