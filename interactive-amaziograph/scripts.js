var NUM_SECTIONS = document.getElementById('sections').value, // number of sections in the circle
	LINE_WIDTH = 1, // width of drawn lines
	RADIUS = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight; // radius of draw circle, set to screen width/height, whichever is bigger

// set up canvas and its context
var canvas = document.getElementById('main-canvas'),
	ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

// color controls
var red = document.getElementById('r'),
	green = document.getElementById('g'),
	blue = document.getElementById('b');

var dots = [ ]; // array for all dots to be drawn

var mouseDown = false; // is the mouse currently down?
var lastMousePos = undefined; // last position mouse was at

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

function reset() {
	dots = [];
	fullUpdate();
}

document.getElementById('reset').addEventListener('click', reset);

document.getElementById('sections').addEventListener('change', function() {
	NUM_SECTIONS = document.getElementById('sections').value;
	document.getElementById('sections-text').innerText = NUM_SECTIONS + " sections";
	reset();
});

canvas.addEventListener('mousedown', function(e) { 
	var posPolar = convertToPolar(e.clientX*2 - canvas.width/2, (e.clientY*2 - canvas.height/2)*-1);
	dots.push(posPolar);
	drawDot(posPolar[0], posPolar[1]);
	mouseDown = true; 
	lastMousePos = [ e.clientX, e.clientY ];
});

window.addEventListener('mouseup', function(e) { mouseDown = false; });

function distance(p1, p2) {
	return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2));
}

canvas.addEventListener('mousemove', function(e) { 
	if(!mouseDown) return;
	// get distance between each dot to draw
	var p1 = lastMousePos,
	 	p2 = [ e.clientX, e.clientY ],
		dist = distance(p1,p2),
		deltaX = (p2[0] - p1[0]) / dist,
		deltaY = (p2[1] - p1[1]) / dist;
	// draw each dot between points
	for(var d = 0; d < dist; ++d) {
		var posPolar = convertToPolar((p1[0]+d*deltaX)*2 - canvas.width/2, ((p1[1]+d*deltaY)*2 - canvas.height/2)*-1);
		dots.push(posPolar);
		drawDot(posPolar[0], posPolar[1]);
	}
	// update last mouse position
	lastMousePos = [ e.clientX, e.clientY ];
});

function drawLines() {
	var SECTION_WIDTH = 2 * Math.PI / NUM_SECTIONS;

	ctx.strokeStyle = "#fefefe";
	ctx.lineWidth = LINE_WIDTH;

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
	drawLines();
	for(var i = 0; i < dots.length; ++i)
		drawDot(dots[i][0], dots[i][1]);
}

fullUpdate();
