let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let selectedNum = null;
let wrong = 0;
let maxWrong = 3;

window.onload = function () {
    setGame();
};

// เริ่มเกม
function setGame() {
    wrong = 0;
    document.getElementById("errors").innerText = "Wrong: 0 / 3";

    generateBoard(); 
    drawBoard();
    drawDigits();
}

// อัปเดตตัวนับผิด
function updateErrors() {
    document.getElementById("errors").innerText = `Wrong: ${wrong} / ${maxWrong}`;
}

// วาดบอร์ด
function drawBoard() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {

            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = r.toString() + "-" + c.toString();

            let num = board[r][c];
            if (num !== 0) tile.innerText = num;

            tile.addEventListener("click", selectTile);
            boardDiv.appendChild(tile);
        }
    }
}

// วาดปุ่มตัวเลขด้านล่าง
function drawDigits() {
    let digitsDiv = document.getElementById("digits");
    digitsDiv.innerHTML = "";

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.classList.add("number");
        number.innerText = i;

        number.addEventListener("click", function () {
            if (selectedNum !== null) selectedNum.classList.remove("number-selected");
            selectedNum = number;
            number.classList.add("number-selected");
        });

        digitsDiv.appendChild(number);
    }
}

// คลิกช่อง
function selectTile() {
    if (!selectedNum) return;

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // ถ้าช่องเต็มแล้ว ให้เปลี่ยนเลขใหม่
    if (board[r][c] !== 0) return;

    let value = parseInt(selectedNum.innerText);

    if (isValid(r, c, value)) {
        board[r][c] = value;
        drawBoard();

        if (checkWin()) {
            alert("🎉 Win! สุ่มบอร์ดใหม่");
            setGame();
        }
    } else {
        wrong++;
        updateErrors();

        if (wrong >= maxWrong) {
            alert("❌ Lose! สุ่มบอร์ดใหม่");
            setGame();
        }
    }
}

/* -------------------------
   สร้างบอร์ด Sudoku
------------------------- */

function clearBoard() {
    board = Array.from({ length: 9 }, () => Array(9).fill(0));
}

function generateBoard() {
    clearBoard();
    fillBoard(0, 0);

    // ลบตัวเลขบางช่องให้เหลือว่าง (40 ช่อง)
    removeNumbers(40);
}

// ลบตัวเลข
function removeNumbers(count) {
    let removed = 0;

    while (removed < count) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);

        if (board[r][c] !== 0) {
            board[r][c] = 0;
            removed++;
        }
    }
}

// เติมบอร์ดด้วย backtracking
function fillBoard(row, col) {
    if (row == 9) return true;

    let nextRow = col == 8 ? row + 1 : row;
    let nextCol = col == 8 ? 0 : col + 1;

    let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);

    for (let num of nums) {
        if (isValid(row, col, num)) {
            board[row][col] = num;
            if (fillBoard(nextRow, nextCol)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

// ตรวจว่าตัวเลขถูกต้อง
function isValid(row, col, num) {
    for (let c = 0; c < 9; c++) if (board[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (board[r][col] === num) return false;

    let sr = Math.floor(row / 3) * 3;
    let sc = Math.floor(col / 3) * 3;
    for (let r = sr; r < sr + 3; r++)
        for (let c = sc; c < sc + 3; c++)
            if (board[r][c] === num) return false;

    return true;
}

// ตรวจว่าชนะ
function checkWin() {
    for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++)
            if (board[r][c] === 0) return false;

    return true;
}
