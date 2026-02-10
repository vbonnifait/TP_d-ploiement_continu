const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const PIECE_NAMES = {
  '♔': 'Roi', '♕': 'Dame', '♖': 'Tour', '♗': 'Fou', '♘': 'Cavalier', '♙': 'Pion',
  '♚': 'Roi', '♛': 'Dame', '♜': 'Tour', '♝': 'Fou', '♞': 'Cavalier', '♟': 'Pion'
}

const SYMBOLS = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
}

export default class ChessService {
  constructor() {
    this.board = this._createInitialBoard()
    this.history = []
  }

  _createInitialBoard() {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null))
    const backRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']

    for (let col = 0; col < 8; col++) {
      board[0][col] = { symbol: SYMBOLS[backRank[col].toLowerCase()], color: 'black' }
      board[1][col] = { symbol: SYMBOLS['p'], color: 'black' }
      board[6][col] = { symbol: SYMBOLS['P'], color: 'white' }
      board[7][col] = { symbol: SYMBOLS[backRank[col]], color: 'white' }
    }

    return board
  }

  getBoard() {
    return this.board
  }

  getPieceAt(row, col) {
    return this.board[row]?.[col] ?? null
  }

  getAllPieces() {
    const pieces = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col]
        if (piece) {
          pieces.push({
            ...piece,
            name: PIECE_NAMES[piece.symbol],
            position: this._toAlgebraic(row, col)
          })
        }
      }
    }
    return pieces
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol]
    if (!piece) return false

    const captured = this.board[toRow][toCol]

    this.history.push({
      piece: { ...piece, name: PIECE_NAMES[piece.symbol] },
      from: this._toAlgebraic(fromRow, fromCol),
      to: this._toAlgebraic(toRow, toCol),
      captured: captured ? { ...captured, name: PIECE_NAMES[captured.symbol] } : null,
      moveNumber: this.history.length + 1
    })

    this.board[fromRow][fromCol] = null
    this.board[toRow][toCol] = piece

    return true
  }

  getHistory() {
    return this.history
  }

  _toAlgebraic(row, col) {
    return `${COLUMNS[col]}${8 - row}`
  }
}
