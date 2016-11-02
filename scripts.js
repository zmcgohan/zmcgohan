var NUM_SECTIONS = document.getElementById('sections').value,
	LINE_WIDTH = 1,
	RADIUS = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;

// set up canvas and its context
var canvas = document.getElementById('main-canvas'),
	ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

var red = document.getElementById('r'),
	green = document.getElementById('g'),
	blue = document.getElementById('b');

var dots = [ ]; // array for all dots to be drawn

var mouseDown = false; // is the mouse currently down?
var lastMousePos = undefined; // last position mouse was at

document.getElementById('reset').addEventListener('click', function() {
	dots = [];
	fullUpdate();
});

document.getElementById('sections').addEventListener('change', function() {
	NUM_SECTIONS = document.getElementById('sections').value;
	document.getElementById('sections-text').innerText = NUM_SECTIONS + " sections";
	dots = [ ];
	fullUpdate();
});

canvas.addEventListener('mousedown', function(e) { 
	var posPolar = convertToPolar(e.clientX*2 - canvas.width/2, (e.clientY*2 - canvas.height/2)*-1);
	dots.push(posPolar);
	drawDot(posPolar[0], posPolar[1]);
	mouseDown = true; 
	lastMousePos = [ e.clientX, e.clientY ];
});

function slope(a, b) {
	if (a[0] == b[0]) return null;
	return (b[1] - a[1]) / (b[0] - a[0]);
}

function intercept(point, slope) {
	if (slope === null) return point[0];
	return point[1] - slope * point[0];
}

function distance(p1, p2) {
	return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
}

window.addEventListener('mouseup', function(e) { mouseDown = false; });

canvas.addEventListener('mousemove', function(e) { 
	if(!mouseDown) return;
	// add and draw all dots in between last position
	var p1, p2;
	if(lastMousePos[0] < e.clientX) {
		p1 = lastMousePos; p2 = [ e.clientX, e.clientY ];
	} else {
		p2 = lastMousePos; p1 = [ e.clientX, e.clientY ];
	}
	var dist = distance(p1,p2),
		deltaX = (p2[0] - p1[0]) / dist,
		deltaY = (p2[1] - p1[1]) / dist;
	for(var d = 0; d < dist; ++d) {
		var posPolar = convertToPolar((p1[0]+d*deltaX)*2 - canvas.width/2, ((p1[1]+d*deltaY)*2 - canvas.height/2)*-1);
		dots.push(posPolar);
		drawDot(posPolar[0], posPolar[1]);
	}
	//var m = slope(p1, p2),
	//	b = intercept(p1, m);
	//for(var x = p1[0]; x !== p2[0]; x < p2[0] ? ++x : --x) {
	//	var y = m * x + b;
	//	var posPolar = convertToPolar(x*2 - canvas.width/2, (y*2 - canvas.height/2)*-1);
	//	dots.push(posPolar);
	//	drawDot(posPolar[0], posPolar[1]);
	//}

	var posPolar = convertToPolar(e.clientX*2 - canvas.width/2, (e.clientY*2 - canvas.height/2)*-1);
	dots.push(posPolar);
	drawDot(posPolar[0], posPolar[1]);
	lastMousePos = [ e.clientX, e.clientY ];
});

function convertToCartesian(r, theta) {
	return [
		r * Math.cos(theta) + canvas.width / 2,
		canvas.height / 2 - r * Math.sin(theta)
	];
}

function convertToPolar(x, y) {
	var theta = Math.atan(y / x);
	if(x < 0) theta += Math.PI;
	else if(y < 0) theta += Math.PI * 2;
	return [
		Math.sqrt(x*x + y*y),
		theta
	];
}

function drawLines() {
	var SECTION_WIDTH = 2 * Math.PI / NUM_SECTIONS;
	for(var i = 0; i < NUM_SECTIONS; ++i) {
		ctx.beginPath();
		ctx.moveTo.apply(ctx, convertToCartesian(0,0));
		ctx.lineTo.apply(ctx, convertToCartesian(canvas.width, SECTION_WIDTH / 2 + i*SECTION_WIDTH));
		ctx.stroke();
	}
}

function drawDot(r, theta) {
	ctx.fillStyle = "rgb(" + red.value + "," + green.value + "," + blue.value + ")";
	for(var j = 0; j < NUM_SECTIONS; ++j) {
		var pos = convertToCartesian(r, theta + j*(Math.PI*2/NUM_SECTIONS));
		ctx.beginPath();
		ctx.arc(pos[0], pos[1], LINE_WIDTH, 0, Math.PI*2);
		ctx.fill();

		var mod = theta % (Math.PI*2/NUM_SECTIONS),
			halfSection = Math.PI*2/NUM_SECTIONS/2;
		if(mod < halfSection)
			pos = convertToCartesian(r, theta + j*(Math.PI*2/NUM_SECTIONS) + (halfSection-mod)*2);
		else
			pos = convertToCartesian(r, theta + j*(Math.PI*2/NUM_SECTIONS) - (mod-halfSection)*2);
		ctx.beginPath();
		ctx.arc(pos[0], pos[1], LINE_WIDTH, 0, Math.PI*2);
		ctx.fill();
	}
}

function fullUpdate() {
	ctx.clearRect(0,0,canvas.width,canvas.height);

	ctx.strokeStyle = "#fefefe";
	ctx.fillStyle = "#fefefe";
	ctx.lineWidth = LINE_WIDTH;

	drawLines();

	for(var i = 0; i < dots.length; ++i)
		drawDot(dots[i][0], dots[i][1]);
}

fullUpdate();
