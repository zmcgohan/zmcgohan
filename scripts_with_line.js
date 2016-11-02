var NUM_SECTIONS = 50,
	LINE_WIDTH = 1.5,
	RADIUS = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;

var canvas = document.getElementById('main-canvas'),
	ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

var mouseDown = false;
var lastMousePos = undefined;
window.addEventListener('mousedown', function(e) { 
	lastMousePos = [ e.clientX, e.clientY ];
	var posPolar = convertToPolar(e.clientX*2 - canvas.width/2, (e.clientY*2 - canvas.height/2)*-1);
	mouseDown = true; 
	draws.push({
		type: "dot",
		r: posPolar[0],
		theta: posPolar[1]
	});
	window.requestAnimationFrame(updateCanvas);
});
window.addEventListener('mouseup', function(e) { mouseDown = false; });

var draws = [ ];

window.addEventListener('mousemove', function(e) { 
	if(!mouseDown) return;
	var startPosPolar = convertToPolar(lastMousePos[0]*2 - canvas.width/2, (lastMousePos[1]*2 - canvas.height/2)*-1);
	var endPosPolar = convertToPolar(e.clientX*2 - canvas.width/2, (e.clientY*2 - canvas.height/2)*-1);
	draws.push({
		type: "dot",
		r: endPosPolar[0],
		theta: endPosPolar[1]
	});
	//draws.push({
	//	type: "line",
	//	startR: startPosPolar[0],
	//	startTheta: startPosPolar[1],
	//	endR: endPosPolar[0],
	//	endTheta: endPosPolar[1]
	//});
	//console.log(startPosPolar);
	//console.log(endPosPolar);
	lastMousePos = [ e.clientX, e.clientY ];
	window.requestAnimationFrame(updateCanvas);
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

function updateCanvas() {
	ctx.clearRect(0,0,canvas.width,canvas.height);

	ctx.strokeStyle = "#fefefe";
	ctx.fillStyle = "#fefefe";
	ctx.lineWidth = LINE_WIDTH;

	var SECTION_WIDTH = 2 * Math.PI / NUM_SECTIONS;
	for(var i = 0; i < NUM_SECTIONS; ++i) {
		ctx.beginPath();
		ctx.moveTo.apply(ctx, convertToCartesian(0,0));
		ctx.lineTo.apply(ctx, convertToCartesian(canvas.width, SECTION_WIDTH / 2 + i*SECTION_WIDTH));
		ctx.stroke();
	}

	for(var i = 0; i < draws.length; ++i) {
		var draw = draws[i];
		if(draw.type === "dot") {
			for(var j = 0; j < NUM_SECTIONS; ++j) {
				var pos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS));
				ctx.beginPath();
				ctx.arc(pos[0], pos[1], LINE_WIDTH, 0, Math.PI*2);
				ctx.fill();

				var mod = draw.theta % (Math.PI*2/NUM_SECTIONS),
					halfSection = Math.PI*2/NUM_SECTIONS/2;
				if(mod < halfSection)
					pos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) + (halfSection-mod)*2);
				else
					pos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) - (mod-halfSection)*2);
				ctx.beginPath();
				ctx.arc(pos[0], pos[1], LINE_WIDTH, 0, Math.PI*2);
				ctx.fill();
			}
			//console.log(draw.theta % (Math.PI*2 / NUM_SECTIONS));
		} else if(draw.type === "line") {
			var startPos = convertToCartesian(draw.startR, draw.startTheta);
			var endPos = convertToCartesian(draw.endR, draw.endTheta);
			ctx.beginPath();
			ctx.moveTo(startPos[0], startPos[1]);
			ctx.lineTo(endPos[0], endPos[1]);
			ctx.stroke();

			var startMod = draw.startTheta % (Math.PI*2/NUM_SECTIONS),
				endMod = draw.endTheta % (Math.PI*2/NUM_SECTIONS),
				halfSection = Math.PI*2/NUM_SECTIONS/2;

			if(startMod < halfSection) {
				startPos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) + (halfSection-startMod)*2);
				endPos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) + (halfSection-endMod)*2);
			} else {
				startPos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) - (startMod-halfSection)*2);
				endPos = convertToCartesian(draw.r, draw.theta + j*(Math.PI*2/NUM_SECTIONS) - (endMod-halfSection)*2);
			}
			ctx.beginPath();
			ctx.moveTo(startPos[0], startPos[1]);
			ctx.lineTo(endPos[0], endPos[1]);
			ctx.stroke();
		}
	}
}

updateCanvas();
