const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X'; // Human starts
let board = Array(9).fill(null);

cells.forEach(cell => 
    cell.addEventListener('click', onCellClick));

function onCellClick(event) {
    const index = event.target.dataset.index;

    if (board[index] !== null || currentPlayer === 'O') {
        return;
    }

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 10);
        setTimeout(resetGame, 2000);
        return;
    }

    if (isBoardFull()) {
        setTimeout(() => alert('It\'s a tie!'), 10);
        setTimeout(resetGame, 2000);
        return;
    }

    currentPlayer = 'O'; // Switch to AI player
    setTimeout(makeAIMove, 500); // Delay for realism
}

function makeAIMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('o');

    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 10);
        setTimeout(resetGame, 2000);
        return;
    }

    if (isBoardFull()) {
        setTimeout(() => alert('It\'s a tie!'), 10);
        setTimeout(resetGame, 2000);
        return;
    }

    currentPlayer = 'X'; // Switch back to human player
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull() {
    return board.every(cell => cell !== null);
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    currentPlayer = 'X'; // Start with human player again
}