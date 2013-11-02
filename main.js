/*  DarWorms
    Copyright BitBLT Studios inc
    Author: David S. Maynard
    Deployment:
    scp -r -P 12960 ~/projects/SumoWorms/www/*.* dmaynard@bitbltstudios.com:/var/www/darworms/
    git push bitbltstudios:~/repo/ master

    darworms.com
*/
darworms.main = (function() {

   var deviceInfo = function() {
        alert("This is a deviceInfo.");
        document.getElementById("width").innerHTML = screen.width;
        document.getElementById("height").innerHTML = screen.height;
        document.getElementById("colorDepth").innerHTML = screen.colorDepth;
    };
    /* Game Globals  TODO   wrap these globals in a function  */

    // var focusPoint;
    // var focusWorm;
    // var focusValue;
    var players = [1, 0, 0, 0];
    var typeNames = [" None ", "Random", " Same ", " New  " ];
    var canvas;
    var wGraphics;


     // var targetPts = [ new Point( 0.375,0), new Point( 0.25, 0.375), new Point( -0.25, 0.375),
     //    new Point(-0.375,0), new Point(-0.25,-0.375), new Point(  0.25,-0.375)];
    /* Worm  Constants */

    compassPts = [ "e", "se", "sw", "w", "nw", "ne", "unSet", "isTrapped"];
    wormStates = {"dead": 0, "moving" : 1, "paused": 2, "sleeping": 3};
    wormStateNames = ["dead", "moving", "paused", "sleeping"];
    initialWormStates = [3, 2, 2, 2];

    darworms.gameStates = {"over": 0, "running" : 1, "waiting": 2, "paused": 3};
    darworms.gameStateNames = ["over", "running", "waiting", "paused"];

    darworms.outMask = [1, 2, 4, 8, 16, 32];
    darworms.inMask =  [8, 16, 32, 1, 2, 4];

    darworms.inDir =   [3, 4, 5, 0, 1, 2];

    var setTypes = function () {
        document.getElementById("p1button").innerHTML = typeNames[players[0]];
        document.getElementById("p2button").innerHTML = typeNames[players[1]];
        document.getElementById("p3button").innerHTML = typeNames[players[2]];
        document.getElementById("p4button").innerHTML = typeNames[players[3]];
        for (var i = 0; i < gWorms.length; i = i + 1) {
            gWorms[i].wType = players[i];
        }
    };

    var player1 = function() {
        players[0] = players[0] + 1;
        if (players[0] >= typeNames.length) {
            players[0] = 0;
        }
        setTypes();
    };

    var player2 = function() {
        players[1] = players[1] + 1;
        if (players[1] >= typeNames.length) {
            players[1] = 0;
        }
        setTypes();
    };

    var player3 = function() {
        players[2] = players[2] + 1;
        if (players[2] >= typeNames.length) {
            players[2] = 0;
        }
        setTypes();
    };

    var player4 = function() {
        players[3] = players[3] + 1;
        if (players[3] >= typeNames.length) {
            players[3] = 0;
        }
        setTypes();
    };







    /* The following code is called from the game timer */

    /* This should be wrapped in an anonymous function closure */


    var gWorms = [new Worm(1, wormStates.paused), new Worm(2, wormStates.paused),  new Worm(3, wormStates.paused), new Worm(4, wormStates.paused)];
     // var localImage;

    var clearScore = function(segmentIndex, totalSegments)  {
        var segWidth = darworms.dwsettings.scoreCanvas.width / totalSegments;
        darworms.graphics.scorectx.fillStyle =  "rgba(222,222,222, 1.0)";
        darworms.graphics.scorectx.shadowOffsetX = 0;
        darworms.graphics.scorectx.shadowOffsetY = 0;

        darworms.graphics.scorectx.fillRect(segWidth * segmentIndex,  0, segWidth, darworms.dwsettings.scoreCanvas.height);
    }
    var scoreStartx = function( segmentIndex, totalSegments, text) {
        var segWidth = darworms.dwsettings.scoreCanvas.width / totalSegments;
        var twidth = darworms.graphics.scorectx.measureText(text).width;
        return  ((segWidth * segmentIndex) + (segWidth/2) - (twidth/2));

    }
    var updateScores = function () {
        var i;
        for (i = 0; i < 4; i++ ) {
            if (darworms.theGame.worms[i] !== undefined  &&  darworms.theGame.worms[i].shouldDrawScore()) {
                clearScore(i,4);
                darworms.graphics.scorectx.fillStyle = darworms.theGame.colorTable[i+1];
                darworms.graphics.scorectx.shadowOffsetX = 3;
                darworms.graphics.scorectx.shadowOffsetY = 3;
                darworms.graphics.scorectx.fillText(darworms.theGame.worms[i].score, scoreStartx(i,4,darworms.theGame.worms[i].score.toString()), 25);
            }
        }
    };
    var makeMoves = function () {
          // console.log(" makeMoves theGameOver " + theGameOver +  "  gameState " + gameStateNames[theGame.gameState] );
          var startTime = new Date().getTime();
          darworms.theGame.startFrameTimes.push(startTime);
          if (darworms.theGame.needsRedraw) {
            darworms.theGame.drawCells();
            darworms.theGame.needsRedraw = false;
            // wGraphics.drawImage(localImage, 10, 10);

          }
          if (darworms.theGame.gameState != darworms.gameStates.over ) {
              if (darworms.theGame.makeMove() === false) {
                darworms.theGame.elapsedTime = darworms.theGame.elapsedTime  + new Date().getTime();
                console.log(" Game Over");
                clearInterval(darworms.graphics.timer);
                document.getElementById("startpause").innerHTML = "Start Game";
                darworms.theGame.showTimes();
                darworms.theGame.gameState = darworms.gameStates.over;
                // theGame.clearCanvas();
                // alert("Game Over ");
                // wGraphics.restore();
              }
          }
          darworms.theGame.drawDirtyCells();
          darworms.theGame.getAvePos();
          updateScores();
          var elapsed = new Date().getTime() - startTime;
          darworms.theGame.frameTimes.push(elapsed);
    };
    var updateGameState = function () {
        // This is the game loop
        // We either make one round of moves
        // or if we are waiting for user input
        // and we draw the direction selection screen
        //
        // console.log(" updateGameState: gameState " +  gameStateNames[theGame.gameState]);
        darworms.graphics.animFrame = darworms.graphics.animFrame + 1;
        if (darworms.theGame.gameState === darworms.gameStates.running) {
            makeMoves();
        }
        if (darworms.theGame.gameState === darworms.gameStates.waiting) {
            darworms.theGame.drawSelectCell(darworms.focusPoint);
        }

    };
    var doZoomOut = function ( tapPoint ) {
        if (tapPoint.dist(new Point(0, 1.0)) < 0.2 ) {
            if (darworms.theGame.cellsInZoomPane.x >= 3) {
                darworms.theGame.cellsInZoomPane.x = darworms.theGame.cellsInZoomPane.x  - 2;
                darworms.theGame.cellsInZoomPane.y = darworms.theGame.cellsInZoomPane.y - 2;
            }
            console.log( "doZoomIN: returning true  wPane size ="  +  darworms.theGame.cellsInZoomPane.x );
            darworms.theGame.zoomPane.canvasIsDirty = true;
            darworms.theGame.zoomPane.setSize(new Point(darworms.theGame.cellsInZoomPane.x,darworms.theGame.cellsInZoomPane.y))
            return true;
        }
        if (tapPoint.dist(new Point(0, -1.0)) < 0.2 ) {
            if (darworms.theGame.cellsInZoomPane.x < darworms.theGame.grid.width - 2) {
                darworms.theGame.cellsInZoomPane.x = darworms.theGame.cellsInZoomPane.x + 2;
                darworms.theGame.cellsInZoomPane.y = darworms.theGame.cellsInZoomPane.y + 2;
                console.log( "doZoomOut: returning true  wPane size ="  +  darworms.theGame.cellsInZoomPane.x );
                darworms.theGame.zoomPane.canvasIsDirty = true;
                darworms.theGame.zoomPane.setSize(new Point(darworms.theGame.cellsInZoomPane.x,darworms.theGame.cellsInZoomPane.y))
                // theGame.drawZoom(theGame.zoomPane.focus, theGame.cellsInZoomPane);

            return true;
            }
        }
        return false;

    }
    darworms.selectDirection = function ( point ) {
        // console.log( "selectDirection: " + point.format());
        var outvec = darworms.theGame.grid.stateAt(darworms.focusPoint);
        var minDist = 100000;
        var dist;
        var select = -1;
        for (var i = 0; i < 6 ; i = i + 1) {
            if ((outvec & darworms.outMask[i]) === 0) {
              dist = point.dist(new Point(darworms.theGame.xPts[i], darworms.theGame.yPts[i]));
              if (dist < minDist) {
                 minDist = dist;
                 select = i;
              }
             // console.log( "selectDirection i: " + i + "  dist: " + dist + " Min Dist:" + minDist);
            }
        }
        if ((minDist < 0.5)  && (select >= 0)) {
            darworms.focusWorm.dna[darworms.focusValue & 0x3F] = select;
            darworms.theGame.gameState = darworms.gameStates.running;
            darworms.theGame.clearCanvas();
            darworms.theGame.drawCells();
        }
    };
    var wormEventHandler = function(event){
      touchX = event.pageX;
      touchY = event.pageY;
                           //  wGraphics.fillStyle="#0f0";
                            // wGraphics.fillRect(touchX - 75, touchY - 50, 50, 50);

                            // wGraphics.font = "20pt Arial";
                            // wGraphics.fillText("X: " + touchX + " Y: " + touchY, touchX, touchY);
      // console.log ( " Tap Event at x: " + touchX + " y: " + touchY);
      if (darworms.theGame.gameState === darworms.gameStates.waiting) {
        // TODO  - 50 is because canvas appears at y = 50 and touchY is screen relative
        // or is this because of the JetBrains Debug banner at the top ?
        if ( doZoomOut(new Point((touchX/darworms.theGame.canvas.width)*2.0 - 1.0, ((touchY-50)/darworms.theGame.canvas.height)*2.0 - 1.0) )) {
            console.log(" do zoomout here");
        } else {
            darworms.selectDirection( new Point((touchX/darworms.theGame.canvas.width)*2.0 - 1.0, ((touchY-50)/darworms.theGame.canvas.height)*2.0 - 1.0));
        }
      }
    };
    darworms.startgame = function(startNow) {
        var  heightSlider = Math.floor($("#gridsize").val());
        if (darworms.theGame === undefined || darworms.theGame === null || darworms.theGame.grid.height != heightSlider ) {
            console.log(" theGame size has changed ");
            if ((heightSlider & 1) !== 0) {
                // height must be an even number because of toroid shape
                heightSlider = heightSlider*1 + 1;
            }
            darworms.theGame = new darworms.gameModule.Game(heightSlider, heightSlider, canvas, darworms.main.wGraphics);
        }
        if (darworms.theGame.gameState === darworms.gameStates.over) {
            darworms.theGame.clear();

            darworms.theGame.needsRedraw = true;
            darworms.theGame.drawCells();
            darworms.theGame.worms = gWorms;
            console.log(" init gridsize: " + $("#gridsize").val() + " gHeight" + heightSlider);
            for (var i = 0; i < gWorms.length; i = i + 1) {
                if (players[i] !== 0) { //  not None
                    gWorms[i].init(players[i]);
                }
                gWorms[i].place( initialWormStates[players[i]] , darworms.theGame);
            }
        }

        if (startNow === false) return;
        if (darworms.theGame.gameState === darworms.gameStates.running) {
            // This is now a pause game button
            clearInterval(darworms.graphics.timer);
            document.getElementById("startpause").innerHTML = "Resume Game";
            darworms.theGame.gameState = darworms.gameStates.paused;
            return;
        }
        if (darworms.theGame.gameState === darworms.gameStates.paused) {
            // This is now a pause game button
            document.getElementById("startpause").innerHTML = "Pause Game";
            darworms.theGame.gameState = darworms.gameStates.running;
            darworms.graphics.timer = setInterval(updateGameState,1000/$("#fps").val());
            return;
        }
        if (darworms.theGame.gameState === darworms.gameStates.over) {
            // This is now a start game button
            // alert("About to Start Game.");

            document.getElementById("startpause").innerHTML = "<b>Pause Game</b>";
            darworms.theGame.gameState = darworms.gameStates.running;
            console.log(" setInterval: " +  1000/$("#fps").val());
            document.getElementById("startpause").innerHTML = "Pause Game";
            initTheGame(true);
            darworms.theGame.log();
            darworms.graphics.timer = setInterval(updateGameState,1000/$("#fps").val());
        }

    };
    var preventBehavior = function(e) {
        e.preventDefault();
    };
    var fail = function (msg) {
        alert(msg);
    }
    var initTheGame = function(startNow) {


        if (startNow) {
            darworms.theGame.gameState = darworms.gameStates.running;

        } else {
            darworms.theGame.gameState = darworms.gameStates.over;

        }
        // startgame(startNow);
        darworms.theGame.needsRedraw = true;

    }
    var init = function () {
        // This may be needed when we actually build a phoneGap app
        // in this case delay initialization untill we get the deviceready event
        document.addEventListener("deviceready", deviceInfo, true);
        setTypes();
        canvas = document.getElementById("wcanvas");
        darworms.main.wGraphics = canvas.getContext("2d");
        console.log ( " init wGraphics " + darworms.main.wGraphics);
        $('#wcanvas').bind('tap', wormEventHandler);
        // initTheGame(false);
        darworms.dwsettings.scoreCanvas = document.getElementById("scorecanvas");
        darworms.graphics.scorectx =  darworms.dwsettings.scoreCanvas.getContext("2d");
        darworms.graphics.scorectx.font = "bold 18px sans-serif";
        darworms.graphics.scorectx.shadowColor = "rgb(190, 190, 190)";
        darworms.graphics.scorectx.shadowOffsetX = 3;
        darworms.graphics.scorectx.shadowOffsetY = 3;
        darworms.gameModule.init();  // needed to init local data the gameModule closure
        //  These values are needed by both mainModule and gameModule
        //  so for now we keep them as globals
        //  Perhaps the time routins sould all be moved into the gameModule closure
        // and we can make some or all of these private to the gameModule closure
        darworms.theGame = null;
        darworms.focusPoint = null;
        darworms.focusWorm = null;
        darworms.focusValue = null;
        darworms.startgame(false);

    }

    return {
        init : init,
        player1 : player1,
        player2 : player2,
        player3 : player3,
        player4 : player4



    };

})();/* end of Game */