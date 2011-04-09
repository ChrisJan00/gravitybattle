
GLOBAL.gameControl = new GameControl();
GLOBAL.player1 = new Player(120,420);
GLOBAL.player2 = new Player(480,420);
GLOBAL.player2.animationStrip.src = "graphics/Player2.png";
GLOBAL.level = new Level();

function loaderProgress()
{
	if (!GLOBAL.player1.complete)
		return 0;
	if (!GLOBAL.level.ready())
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
	GLOBAL.level.draw(0);
	
	/////////////////////////////////////
	GLOBAL.gravity = 500;
	GLOBAL.gravityDir = 0;
	
	// player 1
	GLOBAL.player1.keys = GLOBAL.keyManager.appendMapping([
		["up", 38],
		["down", 40],
		["left", 37],
		["right", 39],
		["action1", 75],
		["action2", 76]
	] );
	// player 2
	GLOBAL.player2.keys = GLOBAL.keyManager.appendMapping([
		["up", 69],
		["down", 68],
		["left", 83],
		["right", 70],
		["action1", 81],
		["action2", 65]
	] );
	GLOBAL.player1.gravityPile = new GravityPile(640 - 16, 0, 10);
}

// gravityDir:
// 0: up
// 1: down
// 2: right
// 3: left


// Use this function to update the simulation.  dt will be the same as gameControl.updateStep, given in ms
function update(dt) 
{
	GLOBAL.player1.update(dt);
	GLOBAL.player2.update(dt);
}

// Use this function to update the graphics, using the game state computed in "update".  dt is given in milliseconds and represents
// elapsed time since the last call to dt.  Use it to interpolate the graphics and achieve a smoother simulation, although you can
// safely ignore it if you want (no interpolation at all).
function draw(dt)
{ 
	GLOBAL.player1.undraw(dt);
	GLOBAL.player2.undraw(dt);
	
	GLOBAL.player1.draw(dt);
	GLOBAL.player2.draw(dt);
}