<script setup>
import { ref, shallowRef } from 'vue'
import ChessSquare from './ChessSquare.vue'
import ChessService from '../services/ChessService.js'

const chessService = new ChessService()

const board = ref(chessService.getBoard())
const history = ref(chessService.getHistory())
const draggedFrom = ref(null)

function onDragStart(row, col) {
  if (board.value[row][col]) {
    draggedFrom.value = { row, col }
  }
}

function onDrop(row, col) {
  if (draggedFrom.value) {
    const { row: fromRow, col: fromCol } = draggedFrom.value
    chessService.movePiece(fromRow, fromCol, row, col)
    board.value = [...chessService.getBoard()]
    history.value = [...chessService.getHistory()]
    draggedFrom.value = null
  }
}

function onDragEnd() {
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
        <span class="row-label">{{ rows[rowIndex] }}</span>
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

    <div v-if="history.length" class="history">
      <h2>Historique des coups</h2>
      <ul>
        <li v-for="move in history" :key="move.moveNumber">
          <span class="move-number">{{ move.moveNumber }}.</span>
          <span class="move-piece" :class="move.piece.color">{{ move.piece.symbol }}</span>
          {{ move.piece.name }} {{ move.from }} → {{ move.to }}
          <span v-if="move.captured" class="capture">
            (capture {{ move.captured.symbol }} {{ move.captured.name }})
          </span>
        </li>
      </ul>
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

.history {
  margin-top: 20px;
  text-align: left;
  color: #f0d9b5;
  max-height: 300px;
  overflow-y: auto;
}

.history h2 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.history ul {
  list-style: none;
  padding: 0;
}

.history li {
  padding: 4px 8px;
  font-size: 14px;
  border-bottom: 1px solid rgba(240, 217, 181, 0.2);
}

.move-number {
  color: #b58863;
  margin-right: 6px;
  font-weight: bold;
}

.move-piece {
  margin-right: 4px;
  font-size: 18px;
}

.capture {
  color: #e07a5f;
  font-style: italic;
}
</style>
