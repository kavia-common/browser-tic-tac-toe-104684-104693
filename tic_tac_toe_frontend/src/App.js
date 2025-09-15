import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Square component renders a single cell of the board.
 * Accessible button with proper labeling for screen readers.
 */
function Square({ value, onClick, index, disabled }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={`Square ${index + 1}, ${value ? value : 'empty'}`}
      disabled={disabled || Boolean(value)}
    >
      {value}
    </button>
  );
}

/**
 * Board component renders the 3x3 grid of squares.
 */
function Board({ squares, onSquareClick, disabled }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          index={idx}
          onClick={() => onSquareClick(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/**
 * Utility to determine the winner of a Tic Tac Toe board.
 * Returns "X", "O" or null if there is no winner yet.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * Returns true if all squares are filled.
 */
function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * State:
   * - squares: 9-length array with 'X' | 'O' | null
   * - xIsNext: boolean indicating current player
   * - theme: light | dark (kept from template, with toggle)
   * - history: for simple reset or potential future undo/redo
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [theme, setTheme] = useState('light');

  // Persist theme to document for CSS variables defined in App.css
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived state using useMemo for clarity and efficiency
  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const winner = winnerInfo?.player ?? null;
  const draw = !winner && isBoardFull(squares);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // Ignore clicks if game is over or square already filled
    if (squares[index] || winner || draw) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const statusText = winner
    ? `Winner: ${winner}`
    : draw
    ? 'Draw! No more moves.'
    : `Turn: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="App">
      <header className="ttt-header">
        <div className="ttt-header-left">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players, one board. Take turns placing X and O.</p>
        </div>
        <div className="ttt-header-actions">
          <button
            className="ttt-btn ttt-btn-secondary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button className="ttt-btn" onClick={resetGame} aria-label="Reset game">
            ↺ Reset
          </button>
        </div>
      </header>

      <main className="ttt-container">
        <div className="ttt-status" role="status" aria-live="polite">
          {statusText}
        </div>

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={Boolean(winner) || draw}
        />

        {(winner || draw) && (
          <div className="ttt-result">
            {winner ? (
              <span className="ttt-result-text">🎉 Player {winner} wins!</span>
            ) : (
              <span className="ttt-result-text">🤝 It’s a draw!</span>
            )}
            <button className="ttt-btn ttt-btn-large" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}

        {!winner && !draw && (
          <footer className="ttt-footer">
            <small>
              Current player: <strong>{xIsNext ? 'X' : 'O'}</strong>. Click a square to make a move.
            </small>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
