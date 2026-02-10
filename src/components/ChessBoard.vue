<script setup>
import { ref } from 'vue'
import ChessSquare from './ChessSquare.vue'

const PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
}

function createInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null))

  const backRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']

  for (let col = 0; col < 8; col++) {
    board[0][col] = { symbol: PIECES[backRank[col].toLowerCase()], color: 'black' }
    board[1][col] = { symbol: PIECES['p'], color: 'black' }
    board[6][col] = { symbol: PIECES['P'], color: 'white' }
    board[7][col] = { symbol: PIECES[backRank[col]], color: 'white' }
  }

  return board
}

const board = ref(createInitialBoard())
const draggedPiece = ref(null)
const draggedFrom = ref(null)

function onDragStart(row, col) {
  if (board.value[row][col]) {
    draggedPiece.value = board.value[row][col]
    draggedFrom.value = { row, col }
  }
}

function onDrop(row, col) {
  if (draggedFrom.value) {
    board.value[draggedFrom.value.row][draggedFrom.value.col] = null
    board.value[row][col] = draggedPiece.value
    draggedPiece.value = null
    draggedFrom.value = null
  }
}

function onDragEnd() {
  draggedPiece.value = null
  draggedFrom.value = null
}

function getSquareColor(row, col) {
  return (row + col) % 2 === 0 ? 'light' : 'dark'
}

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const rows = [8, 7, 6, 5, 4, 3, 2, 1]
</script>

<template>
  <div class="board-container">
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <span v-if="rowIndex === 0 || true" class="row-label">{{ rows[rowIndex] }}</span>
        <ChessSquare
          v-for="(piece, colIndex) in row"
          :key="colIndex"
          :piece="piece"
          :color="getSquareColor(rowIndex, colIndex)"
          :row="rowIndex"
          :col="colIndex"
          @drag-start="onDragStart"
          @drop-piece="onDrop"
          @drag-end="onDragEnd"
        />
      </div>
      <div class="col-labels">
        <span class="col-label-spacer"></span>
        <span v-for="col in columns" :key="col" class="col-label">{{ col }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-container {
  display: inline-block;
}

.board {
  border: 4px solid #5d3a1a;
  border-radius: 4px;
  display: inline-block;
}

.row {
  display: flex;
  align-items: center;
}

.row-label {
  width: 24px;
  text-align: center;
  color: #f0d9b5;
  font-weight: bold;
  font-size: 14px;
}

.col-labels {
  display: flex;
}

.col-label-spacer {
  width: 24px;
}

.col-label {
  width: 80px;
  text-align: center;
  color: #f0d9b5;
  font-weight: bold;
  font-size: 14px;
  padding: 4px 0;
}
</style>
