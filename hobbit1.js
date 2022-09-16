var forest = [];
var rows = 8;
var columns = 8;

var orcsCount = 10;
var orcsLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; //goal to click all tiles except the ones containing mines
var orcEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
}

function setOrcs() {

    let orcsLeft = orcsCount;
    while (orcsLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!orcsLocation.includes(id)) {
            orcsLocation.push(id);
            orcsLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("orcs-count").innerText = orcsCount;
    document.getElementById("foundone-button").addEventListener("click", setOrc);
    setOrcs();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("forest").append(tile);
            row.push(tile);
        }
        forest.push(row);
    }

    console.log(forest);
}

function setOrc() {
    if (orcEnabled) {
        orcEnabled = false;
        document.getElementById("foundone-button").style.backgroundColor = "rgba(184, 154, 110, 1)";
    }
    else {
        orcEnabled = true;
        document.getElementById("foundone-button").style.backgroundColor = "rgba(138, 117, 85, 1)";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (orcEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "⬛️";
        }
        else if (tile.innerText == "⬛️") {
            tile.innerText = "";
        }
        return;
    }

    if (orcsLocation.includes(tile.id)) {
        gameOver = true;
        revealOrcs();
        return;
    }


    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkOrc(r, c);

}

function revealOrcs() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = forest[r][c];
            if (orcsLocation.includes(tile.id)) {
                tile.innerText = "💀";
                tile.style.backgroundColor = "DarkRed";                
            }
        }
    }
}

function checkOrc(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (forest[r][c].classList.contains("tile-clicked")) {
        return;
    }

    forest[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let orcsFound = 0;

    //top 3
    orcsFound += checkTile(r-1, c-1);      //top left
    orcsFound += checkTile(r-1, c);        //top 
    orcsFound += checkTile(r-1, c+1);      //top right

    //left and right
    orcsFound += checkTile(r, c-1);        //left
    orcsFound += checkTile(r, c+1);        //right

    //bottom 3
    orcsFound += checkTile(r+1, c-1);      //bottom left
    orcsFound += checkTile(r+1, c);        //bottom 
    orcsFound += checkTile(r+1, c+1);      //bottom right

    if (orcsFound > 0) {
        forest[r][c].innerText = orcsFound;
        forest[r][c].classList.add("x" + orcsFound.toString());
    }
    else {
        //top 3
        checkOrc(r-1, c-1);    //top left
        checkOrc(r-1, c);      //top
        checkOrc(r-1, c+1);    //top right

        //left and right
        checkOrc(r, c-1);      //left
        checkOrc(r, c+1);      //right

        //bottom 3
        checkOrc(r+1, c-1);    //bottom left
        checkOrc(r+1, c);      //bottom
        checkOrc(r+1, c+1);    //bottom right
    }

    if (tilesClicked == rows * columns - orcsCount) {
        document.getElementById("orcs-count").innerText = "Cleared";
        gameOver = true;
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (orcsLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

