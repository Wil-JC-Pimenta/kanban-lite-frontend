<template>
  <div class="list-column">
    <div class="list-header">
      <h3>{{ list.title }}</h3>
    </div>
    
    <draggable
      v-model="cards"
      group="cards"
      item-key="id"
      class="cards"
      @end="onCardDragEnd"
    >
      <template #item="{ element: card }">
        <CardItem
          :card="card"
          @update="updateCard"
          @delete="deleteCard"
        />
      </template>
    </draggable>
    
    <button @click="showNewCardModal = true" class="btn-add-card">
      Add Card
    </button>
    
    <!-- New Card Modal -->
    <div v-if="showNewCardModal" class="modal">
      <div class="modal-content">
        <h3>Create New Card</h3>
        <input
          v-model="newCardTitle"
          type="text"
          placeholder="Card Title"
          @keyup.enter="createCard"
        />
        <textarea
          v-model="newCardContent"
          placeholder="Card Content"
          rows="3"
        ></textarea>
        <div class="modal-actions">
          <button @click="createCard" class="btn-primary">Create</button>
          <button @click="showNewCardModal = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBoardStore } from '../stores/board'
import draggable from 'vue-draggable-next'
import CardItem from './CardItem.vue'

const props = defineProps({
  list: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['create-card', 'update-card', 'delete-card'])

const store = useBoardStore()
const showNewCardModal = ref(false)
const newCardTitle = ref('')
const newCardContent = ref('')

const cards = computed({
  get: () => props.list.cards || [],
  set: (value) => {
    props.list.cards = value
  }
})

async function createCard() {
  if (!newCardTitle.value) return
  
  try {
    await store.createCard(props.list.id, newCardTitle.value, newCardContent.value)
    showNewCardModal.value = false
    newCardTitle.value = ''
    newCardContent.value = ''
  } catch (error) {
    console.error('Failed to create card:', error)
  }
}

async function onCardDragEnd(evt) {
  const card = cards.value[evt.newIndex]
  if (evt.from !== evt.to) {
    // Card was moved to a different list
    await store.moveCard(card.id, props.list.id)
  } else {
    // Card was reordered within the same list
    await store.updateCardPosition(card.id, card.position)
  }
}

function updateCard(cardId, title, content) {
  emit('update-card', cardId, title, content)
}

function deleteCard(cardId) {
  emit('delete-card', cardId)
}
</script>

<style scoped>
.list-column {
  background-color: #ebecf0;
  border-radius: 4px;
  min-width: 272px;
  max-width: 272px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.list-header {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.list-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #172b4d;
}

.cards {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-add-card {
  padding: 0.5rem;
  background: none;
  border: none;
  color: #5e6c84;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.btn-add-card:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #172b4d;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  min-width: 300px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #026aa7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #f4f5f7;
  color: #172b4d;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style> 