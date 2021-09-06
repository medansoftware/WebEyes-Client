exports.callback = function(callback) {
	if (callback !== undefined) {
		if (typeof callback == 'function') {
			callback(...Array.prototype.slice.call(arguments, 1));
		} else {
			eval(callback+'(...Array.prototype.slice.call(arguments, 1))');
		}
	}
}