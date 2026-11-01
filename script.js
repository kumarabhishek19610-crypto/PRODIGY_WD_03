const cells = document.querySelectorAll('.box');
const statusDisplay = document.getElementById('game-status');
const resetButton = document.getElementById('play-again');

let currentPlayer = 'X'; 
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
const wincombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function markBoard(clickedCell, clickedCellIndex) {
    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); 
}

function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayer === 'X' ? "Your turn (X)" : "Computer's turn (O)";

    if (gameActive && currentPlayer === 'O') {
        setTimeout(computerMove, 600);
    }
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < wincombos.length; i++) {
        const winCombo = wincombos[i];
        const firstcell = boardState[winCombo[0]];
        const secondcell = boardState[winCombo[1]];
        const thirdcell = boardState[winCombo[2]];

        if (firstcell === '' || secondcell === '' || thirdcell === '') continue;

        if (firstcell === secondcell && secondcell === thirdcell) {
            roundWon = true;
            cells[winCombo[0]].classList.add('winner');
            cells[winCombo[1]].classList.add('winner');
            cells[winCombo[2]].classList.add('winner');
            break;
        }
    }

    if (roundWon) {
        const winnerMessage = currentPlayer === 'X'
            ? "🎉 Congratulations! You have won! 🎉" 
            : "😐 The computer has won! 😐";

        statusDisplay.innerHTML = winnerMessage;
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        statusDisplay.innerHTML = "💛 Game is a draw! 💛";
        gameActive = false;
        return;
    }

    switchTurn();
}

function checkWinningState(board, player) {
    for (let i = 0; i < wincombos.length; i++) {
        const [a, b, c] = wincombos[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function minimax(newBoard, depth, isMaximizing) {
    if (checkWinningState(newBoard, 'O')) return 10 - depth; 
    if (checkWinningState(newBoard, 'X')) return depth - 10; 
    if (!newBoard.includes('')) return 0; 

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O'; 
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = ''; 
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X'; 
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = ''; 
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function computerMove() {
    if (!gameActive) return;

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            let score = minimax(boardState, 0, false);
            boardState[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    const computerCell = cells[move];
    markBoard(computerCell, move);
    checkWinner();
}

function handleCellClick(event) {
    const selectedCell = event.target;
    const cellindex = parseInt(selectedCell.getAttribute('data-cell'));

    if (boardState[cellindex] !== '' || !gameActive || currentPlayer === 'O') {
        return;
    }

    markBoard(selectedCell, cellindex);
    checkWinner();
}

function ResetGame() {
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = "Your turn (X)";
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('x', 'o', 'winner'); 
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', ResetGame);
statusDisplay.innerHTML = "Your turn (X)";