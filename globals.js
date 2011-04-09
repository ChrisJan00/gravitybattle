var runningLocallyOnFirefox = (location.href.substr(0,7) == "file://");

var GLOBAL = {}


GLOBAL.findAbsoluteX = function(object) {
	var x = 0;
	while (object) {
		x += object.offsetLeft;
		object = object.offsetParent;
	}
	return x;
}

GLOBAL.findAbsoluteY = function(object) {
	var y = 0;
	while(object) {
		y += object.offsetTop;
		object = object.offsetParent;
	}
	return y;
}