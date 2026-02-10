<script setup>
import { ref, computed } from 'vue'
import ChessSquare from './ChessSquare.vue'
import ChessService from '../services/ChessService.js'

const chessService = new ChessService()

const board = ref(chessService.getBoard())
const history = ref(chessService.getHistory())
const draggedFrom = ref(null)

const lastMove = computed(() => {
  if (history.value.length === 0) return null
  const last = history.value[history.value.length - 1]
  return { from: last.from, to: last.to }
})

function toCoords(algebraic) {
  const col = algebraic.charCodeAt(0) - 97
  const row = 8 - parseInt(algebraic[1])
  return { row, col }
}

function isLastMoveFrom(row, col) {
  if (!lastMove.value) return false
  const c = toCoords(lastMove.value.from)
  return c.row === row && c.col === col
}

function isLastMoveTo(row, col) {
  if (!lastMove.value) return false
  const c = toCoords(lastMove.value.to)
  return c.row === row && c.col === col
}

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

function currentTurn() {
  return history.value.length % 2 === 0 ? 'white' : 'black'
}

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const rows = [8, 7, 6, 5, 4, 3, 2, 1]

// Format history in pairs for Lichess-style display
const movePairs = computed(() => {
  const pairs = []
  for (let i = 0; i < history.value.length; i += 2) {
    const pair = {
      number: Math.floor(i / 2) + 1,
      white: history.value[i],
      black: history.value[i + 1] || null
    }
    pairs.push(pair)
  }
  return pairs
})

function formatMove(move) {
  if (!move) return ''
  const pieceLetter = { Roi: 'K', Dame: 'Q', Tour: 'R', Fou: 'B', Cavalier: 'N', Pion: '' }
  const prefix = pieceLetter[move.piece.name] || ''
  const capture = move.captured ? 'x' : ''
  return `${prefix}${capture}${move.to}`
}
</script>

<template>
  <div class="game-container">
    <!-- Board section -->
    <div class="board-section">
      <!-- Black player bar -->
      <div class="player-bar">
        <div class="player-icon black-icon"></div>
        <span class="player-name">Noir</span>
      </div>

      <!-- Board -->
      <div class="board-wrapper">
        <div class="board">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <ChessSquare
              v-for="(piece, colIndex) in row"
              :key="colIndex"
              :piece="piece"
              :color="getSquareColor(rowIndex, colIndex)"
              :row="rowIndex"
              :col="colIndex"
              :showRow="colIndex === 0"
              :showCol="rowIndex === 7"
              :rowLabel="String(rows[rowIndex])"
              :colLabel="columns[colIndex]"
              :isSelected="draggedFrom?.row === rowIndex && draggedFrom?.col === colIndex"
              :isLastMoveFrom="isLastMoveFrom(rowIndex, colIndex)"
              :isLastMoveTo="isLastMoveTo(rowIndex, colIndex)"
              @drag-start="onDragStart"
              @drop-piece="onDrop"
              @drag-end="onDragEnd"
            />
          </div>
        </div>
      </div>

      <!-- White player bar -->
      <div class="player-bar">
        <div class="player-icon white-icon"></div>
        <span class="player-name">Blanc</span>
      </div>
    </div>

    <!-- Side panel -->
    <div class="side-panel">
      <!-- Move list -->
      <div class="move-list-container">
        <div class="move-list-header">
          <span class="turn-indicator" :class="currentTurn()"></span>
          <span>Tour des {{ currentTurn() === 'white' ? 'Blancs' : 'Noirs' }}</span>
        </div>
        <div class="move-list">
          <div v-if="movePairs.length === 0" class="no-moves">
            Glissez une piece pour jouer
          </div>
          <div v-for="pair in movePairs" :key="pair.number" class="move-row">
            <span class="move-number">{{ pair.number }}.</span>
            <span class="move-notation white-move">{{ formatMove(pair.white) }}</span>
            <span v-if="pair.black" class="move-notation black-move">{{ formatMove(pair.black) }}</span>
          </div>
        </div>
      </div>

      <!-- Captured pieces -->
      <div v-if="history.some(m => m.captured)" class="captured-section">
        <div class="captured-group">
          <span class="captured-label">Pieces capturees</span>
          <div class="captured-pieces">
            <span
              v-for="(move, i) in history.filter(m => m.captured)"
              :key="i"
              class="captured-piece"
              :class="move.captured.color"
            >{{ move.captured.symbol }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.board-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Player bars */
.player-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #262421;
  border-radius: 4px;
}

.player-icon {
  width: 28px;
  height: 28px;
  border-radius: 3px;
}

.white-icon {
  background: #fff;
  border: 1px solid #ccc;
}

.black-icon {
  background: #333;
  border: 1px solid #555;
}

.player-name {
  font-size: 14px;
  font-weight: 600;
  color: #bababa;
}

/* Board */
.board-wrapper {
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.board {
  display: flex;
  flex-direction: column;
  line-height: 0;
}

.row {
  display: flex;
}

/* Side panel */
.side-panel {
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
}

.move-list-container {
  background: #262421;
  border-radius: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.move-list-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #3a3835;
  font-size: 13px;
  font-weight: 600;
  color: #bababa;
}

.turn-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.turn-indicator.white {
  background: #fff;
  border: 1px solid #ccc;
}

.turn-indicator.black {
  background: #333;
  border: 1px solid #555;
}

.move-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.no-moves {
  padding: 16px 12px;
  color: #787672;
  font-size: 13px;
  text-align: center;
  font-style: italic;
}

.move-row {
  display: flex;
  align-items: center;
  padding: 2px 0;
}

.move-row:nth-child(odd) {
  background: #1e1d1b;
}

.move-number {
  width: 36px;
  text-align: center;
  color: #787672;
  font-size: 12px;
  flex-shrink: 0;
}

.move-notation {
  flex: 1;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #bababa;
  cursor: default;
  border-radius: 2px;
}

.move-notation:hover {
  background: #3a3835;
}

/* Captured pieces */
.captured-section {
  background: #262421;
  border-radius: 4px;
  padding: 10px 12px;
}

.captured-label {
  font-size: 11px;
  color: #787672;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 6px;
}

.captured-pieces {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.captured-piece {
  font-size: 18px;
  line-height: 1;
}

.captured-piece.white {
  filter: drop-shadow(0 0 1px rgba(255,255,255,0.5));
}

.captured-piece.black {
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
}
</style>
