<script setup>
import { ref } from 'vue'
import ChessPiece from './ChessPiece.vue'

const props = defineProps({
  piece: { type: Object, default: null },
  color: { type: String, required: true },
  row: { type: Number, required: true },
  col: { type: Number, required: true },
  showRow: { type: Boolean, default: false },
  showCol: { type: Boolean, default: false },
  rowLabel: { type: String, default: '' },
  colLabel: { type: String, default: '' },
  isSelected: { type: Boolean, default: false },
  isLastMoveFrom: { type: Boolean, default: false },
  isLastMoveTo: { type: Boolean, default: false }
})

const emit = defineEmits(['drag-start', 'drop-piece', 'drag-end'])

const isDragOver = ref(false)

function handleDragStart(e) {
  if (props.piece) {
    e.dataTransfer.effectAllowed = 'move'
    const el = e.target.closest('.piece-wrapper')
    if (el) {
      e.dataTransfer.setDragImage(el, 32, 32)
    }
    emit('drag-start', props.row, props.col)
  }
}

function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(e) {
  e.preventDefault()
  isDragOver.value = false
  emit('drop-piece', props.row, props.col)
}

function handleDragEnd() {
  isDragOver.value = false
  emit('drag-end')
}
</script>

<template>
  <div
    class="square"
    :class="[
      color,
      {
        'drag-over': isDragOver,
        'selected': isSelected,
        'last-move': isLastMoveFrom || isLastMoveTo
      }
    ]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <span v-if="showRow" class="coord coord-row" :class="color">{{ rowLabel }}</span>
    <span v-if="showCol" class="coord coord-col" :class="color">{{ colLabel }}</span>
    <div
      v-if="piece"
      class="piece-wrapper"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <ChessPiece :symbol="piece.symbol" :color="piece.color" />
    </div>
  </div>
</template>

<style scoped>
.square {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
}

.square.light {
  background-color: #ebecd0;
}

.square.dark {
  background-color: #739552;
}

.square.drag-over.light,
.square.selected.light {
  background-color: #f6f669;
}

.square.drag-over.dark,
.square.selected.dark {
  background-color: #baca2b;
}

.square.last-move.light {
  background-color: #f6f669;
}

.square.last-move.dark {
  background-color: #baca2b;
}

/* Coordinates */
.coord {
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
}

.coord.coord-row {
  top: 2px;
  left: 3px;
}

.coord.coord-col {
  bottom: 2px;
  right: 3px;
}

.coord.light {
  color: #739552;
}

.coord.dark {
  color: #ebecd0;
}

/* Piece */
.piece-wrapper {
  width: 60px;
  height: 60px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: transform 0.08s;
}

.piece-wrapper:active {
  cursor: grabbing;
  transform: scale(1.1);
}
</style>
