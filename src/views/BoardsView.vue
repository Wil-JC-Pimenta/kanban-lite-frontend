<template>
  <app-layout>
    <div class="boards-view">
      <!-- Header -->
      <div class="boards-header">
        <div class="header-left">
          <h1>Meus Quadros</h1>
          <p class="subtitle">Gerencie seus quadros e tarefas</p>
        </div>
        <button class="btn-primary" @click="showCreateBoardModal = true">
          <i class="fas fa-plus"></i>
          Novo Quadro
        </button>
      </div>

      <!-- Boards Grid -->
      <div class="boards-grid">
        <div v-for="board in boards" :key="board.id" class="board-card" @click="openBoard(board)">
          <div class="board-card-header">
            <h3>{{ board.name }}</h3>
            <div class="board-actions">
              <button class="btn-icon" @click.stop="editBoard(board)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <p class="board-description">{{ board.description }}</p>
          <div class="board-stats">
            <div class="stat">
              <i class="fas fa-list-check"></i>
              <span>{{ board.totalTasks }} tarefas</span>
            </div>
            <div class="stat">
              <i class="fas fa-users"></i>
              <span>{{ board.members }} membros</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Board Modal -->
      <modal v-if="showCreateBoardModal" @close="showCreateBoardModal = false">
        <template #header>
          <h2>Criar Novo Quadro</h2>
        </template>
        <template #default>
          <form @submit.prevent="createBoard" class="board-form">
            <div class="form-group">
              <label for="boardName">Nome do Quadro</label>
              <input
                type="text"
                id="boardName"
                v-model="newBoard.name"
                placeholder="Digite o nome do quadro"
                required
              />
            </div>
            <div class="form-group">
              <label for="boardDescription">Descrição</label>
              <textarea
                id="boardDescription"
                v-model="newBoard.description"
                placeholder="Digite uma descrição para o quadro"
                rows="3"
              ></textarea>
            </div>
          </form>
        </template>
        <template #footer>
          <button class="btn-secondary" @click="showCreateBoardModal = false">Cancelar</button>
          <button class="btn-primary" @click="createBoard">Criar Quadro</button>
        </template>
      </modal>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'BoardsView',
  components: {
    AppLayout,
    Modal
  },
  data() {
    return {
      boards: [],
      showCreateBoardModal: false,
      newBoard: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    async fetchBoards() {
      try {
        const response = await fetch('http://localhost:8081/kanban-lite-api/boards')
        this.boards = await response.json()
      } catch (error) {
        console.error('Erro ao carregar quadros:', error)
      }
    },
    async createBoard() {
      try {
        const response = await fetch('http://localhost:8081/kanban-lite-api/boards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newBoard)
        })
        
        if (response.ok) {
          this.showCreateBoardModal = false
          this.newBoard = { name: '', description: '' }
          await this.fetchBoards()
        }
      } catch (error) {
        console.error('Erro ao criar quadro:', error)
      }
    },
    openBoard(board) {
      this.$router.push(`/boards/${board.id}`)
    },
    editBoard(board) {
      // Implementar edição do quadro
    }
  },
  mounted() {
    this.fetchBoards()
  }
}
</script>

<style scoped>
.boards-view {
  max-width: 1200px;
  margin: 0 auto;
}

.boards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h1 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  margin: 0.5rem 0 0;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.boards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.board-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.board-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.board-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.board-card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.board-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.board-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.board-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style> 