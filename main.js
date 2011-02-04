
GLOBAL.gameControl = new GameControl();
GLOBAL.player1 = new Player(320,240);
GLOBAL.level = new Level();

function loaderProgress()
{
	if (!GLOBAL.player1.animationStrip.complete)
		return 0;
	if (!GLOBAL.level.tiles.complete)
		return 50;
    return 100;
}

function prepareGame()
{ 
	GLOBAL.gameCanvas = document.getElementById("canvas1");
	GLOBAL.gameContext = GLOBAL.gameCanvas.getContext("2d");
	GLOBAL.bgCanvas = document.createElement('canvas');
	GLOBAL.bgCanvas.width = GLOBAL.gameCanvas.width;
	GLOBAL.bgCanvas.height = GLOBAL.gameCanvas.height;
	GLOBAL.bgContext = GLOBAL.bgCanvas.getContext("2d");
	GLOBAL.canvasWidth = GLOBAL.gameCanvas.width;
	GLOBAL.canvasHeight = GLOBAL.gameCanvas.height;
	
	// start with an empty background
	GLOBAL.bgContext.fillStyle = "#000000";
	GLOBAL.bgContext.fillRect(0, 0, GLOBAL.gameCanvas.width, GLOBAL.gameCanvas.height);
	
	GLOBAL.level.init();
	
}

// Use this function to update the simulation.  dt will be the same as gameControl.updateStep, given in ms
function update(dt) 
{
	GLOBAL.player1.update(dt);
}

// Use this function to update the graphics, using the game state computed in "update".  dt is given in milliseconds and represents
// elapsed time since the last call to dt.  Use it to interpolate the graphics and achieve a smoother simulation, although you can
// safely ignore it if you want (no interpolation at all).
function draw(dt)
{ 
	GLOBAL.player1.draw(dt);
}