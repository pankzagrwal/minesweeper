(function (document) {

function MineSwipper(pElementId, row, col, mineCount) {
	this.pElement = document.getElementById(pElementId);
	this.row = row || 9;
	this.col = col || 9;
	this.mineCount = mineCount || 9;
	this.tileRef = [];
	this.matrix = [];
	this.isGameFin = false;
	this.createTiles();
	this.attachHandler();
}

MineSwipper.prototype.createTiles = function () {
	var oThis = this,
		row = oThis.row,
		col = oThis.col,
		mineCount = oThis.mineCount,
		randomRow,
		randomCol;

	
	for (var i = 0; i< row; i++) {
		//create Row
		var rowElement = document.createElement("div");
		rowElement.classList.add(i, "row");

		this.matrix[i] = [];

		for (var j = 0; j< col; j++) {
			//create Column
			var columnElement = document.createElement("div");
			columnElement.classList.add(j, "box", "tile", "col");
			rowElement.appendChild(columnElement);
			this.matrix[i][j] = {
				mine: false,
				processed: false
			};
		}

		oThis.pElement.appendChild(rowElement);
	}

	for (var i = 0; i< mineCount; i++) {
		randomRow = Math.floor(Math.random()*row);
		randomCol = Math.floor(Math.random()*col);
		this.matrix[randomRow][randomCol].mine = true;
		console.log("Row " + randomRow + "col"+ randomCol);
	}
}

MineSwipper.prototype.attachHandler = function () {
	var oThis = this;
	oThis.pElement.addEventListener("click", clickHandler.bind(oThis), false);

	function clickHandler(ev) {
		var oThis  = this,
			parent = ev.target.parentElement,
			target = ev.target;
		if (!target.classList.contains("col")) {
			return;
		}
		if (this.isGameFin) {
			alert("Refresh page..Play Again")
			return;
		}
		oThis.tileRef = [];
		processTile(parseInt(parent.classList[0], 10), parseInt(target.classList[0], 10), false);
		//console.log(target);

	function processTile (row, col, flag) {
		var matrix = oThis.matrix,
			adjacentMineCount = 0,
			rowRef = document.getElementsByClassName(row + " row")[0],
			colRef = rowRef.getElementsByClassName(col + " col")[0],
			isProg = flag;

		if (!isProg && matrix[row] && matrix[row][col].mine) {
			showMines(); // Clicked tile is Mine
			alert("Game Finish");
			oThis.isGameFin = true;
			
			return;
		}

		if (isProg && matrix[row] && matrix[row][col] && matrix[row][col].mine) {
			return; // to stop recursive call if tile is Mined
		}

		if (!matrix[row] || !matrix[row][col]) {
			return; // no such tile
		}

		if (matrix[row] && matrix[row][col] && !matrix[row][col].processed) {
			matrix[row][col].processed = true; // Mark tile as processed , to avoid re processing 
		}


		//Calculate adjacent Mine
		for (var tempRow = row -1; tempRow < row + 2; tempRow++) {
			for (var tempCol = col - 1; tempCol < col + 2; tempCol++) {
				if (matrix[tempRow] && matrix[tempRow][tempCol] && matrix[tempRow][tempCol].mine) {
					adjacentMineCount++;
				}
			}
		}

		//Create array for tile DOM reference
		oThis.tileRef.push({
			ref: colRef,
			mineCount: adjacentMineCount,
			processed: matrix[row][col]
		});


		if (adjacentMineCount !== 0) {
			updateTiles();
		}
		else { // if Clicked tile is not adjacent to any Mine.. Recursevly trigger Click Evnet on every adjacent tile excluding Mined Tile
			for (var x = row -1; x < row + 2; x++) {
				for (var y = col - 1; y < col + 2; y++) {
					if (matrix[x] && matrix[x][y] && !(x===row && y=== col) && !matrix[x][y].processed) {
						
						processTile(x, y, true);

					}
				}
			}
		}

	}


	//Update Tile DOM
	function updateTiles () {
		var tileRef = oThis.tileRef,
			label = null,
			text = null;

		for (var i = 0; i< tileRef.length; i++) {
			label = document.createElement("Label");
			if (!tileRef[i].isMine) {
				label.classList.add("mineCount");
				text = document.createTextNode(tileRef[i].mineCount);
			}
			else {
				label.classList.add("mineTile");
				text = document.createTextNode("");
			}
			label.appendChild(text);
			tileRef[i].ref.classList.add("opened");
			tileRef[i].ref.appendChild(label);
			
		}

	}


	//Show all Mine TIle on Click of Mined Tile
	function showMines() {
		var matrix = oThis.matrix,
			rowRef,
			colRef,
			adjacentMineCount = 0;

		for (var row = 0; row < matrix.length ; row++) {
			for (var col = 0; col < matrix.length; col++) {
				if (matrix[row][col].mine) {
					rowRef = document.getElementsByClassName(row + " row")[0],
					colRef = rowRef.getElementsByClassName(col + " col")[0];
					oThis.tileRef.push({
						ref: colRef,
						//mineCount: adjacentMineCount,
						processed: matrix[row][col],
						isMine: true
					});
				}
			}
		}

		updateTiles();
	}

	}
}

window.mine = new MineSwipper("mine", 12, 12, 18);
//mine.createTiles();

})(document);