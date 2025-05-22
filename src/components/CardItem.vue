<template>
  <div class="card-item" @click="showEditModal = true">
    <h4>{{ card.title }}</h4>
    <p v-if="card.content" class="card-content">{{ card.content }}</p>
  </div>
  
  <!-- Edit Card Modal -->
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3>Edit Card</h3>
      <input
        v-model="editTitle"
        type="text"
        placeholder="Card Title"
      />
      <textarea
        v-model="editContent"
        placeholder="Card Content"
        rows="3"
      ></textarea>
      <div class="modal-actions">
        <button @click="updateCard" class="btn-primary">Save</button>
        <button @click="deleteCard" class="btn-danger">Delete</button>
        <button @click="showEditModal = false" class="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const showEditModal = ref(false)
const editTitle = ref('')
const editContent = ref('')

onMounted(() => {
  editTitle.value = props.card.title
  editContent.value = props.card.content
})

function updateCard() {
  emit('update', props.card.id, editTitle.value, editContent.value)
  showEditModal.value = false
}

function deleteCard() {
  if (confirm('Are you sure you want to delete this card?')) {
    emit('delete', props.card.id)
    showEditModal.value = false
  }
}
</script>

<style scoped>
.card-item {
  background-color: white;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.card-item:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.card-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #172b4d;
}

.card-content {
  margin: 0;
  font-size: 0.8rem;
  color: #5e6c84;
  white-space: pre-wrap;
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

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
 