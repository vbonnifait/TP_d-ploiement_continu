<script setup>
const props = defineProps({
  piece: { type: Object, default: null },
  color: { type: String, required: true },
  row: { type: Number, required: true },
  col: { type: Number, required: true }
})

const emit = defineEmits(['drag-start', 'drop-piece', 'drag-end'])

function handleDragStart(e) {
  if (props.piece) {
    e.dataTransfer.effectAllowed = 'move'
    emit('drag-start', props.row, props.col)
  }
}

function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

function handleDrop(e) {
  e.preventDefault()
  emit('drop-piece', props.row, props.col)
}

function handleDragEnd() {
  emit('drag-end')
}
</script>

<template>
  <div
    class="square"
    :class="[color, { 'has-piece': piece }]"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <span
      v-if="piece"
      class="piece"
      :class="piece.color"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      {{ piece.symbol }}
    </span>
  </div>
</template>

<style scoped>
.square {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

.square.has-piece {
  cursor: grab;
}

.piece {
  font-size: 50px;
  line-height: 1;
  user-select: none;
  cursor: grab;
}

.piece:active {
  cursor: grabbing;
}

.piece.white {
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));
}

.piece.black {
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));
}
</style>
