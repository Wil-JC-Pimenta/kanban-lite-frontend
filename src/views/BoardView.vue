<template>
  <app-layout>
    <div class="board-view">
      <!-- Board Header -->
      <div class="board-header">
        <div class="header-left">
          <h1>{{ board.name }}</h1>
          <p class="subtitle">{{ board.description }}</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" @click="showAddColumnModal = true">
            <i class="fas fa-plus"></i>
            Nova Coluna
          </button>
          <button class="btn-primary" @click="showAddTaskModal = true">
            <i class="fas fa-plus"></i>
            Nova Tarefa
          </button>
        </div>
      </div>

      <!-- Board Content -->
      <div class="board-content" ref="boardContent">
        <div class="columns-container">
          <div v-for="column in columns" :key="column.id" class="column">
            <div class="column-header">
              <h3>{{ column.name }}</h3>
              <span class="task-count">{{ column.tasks.length }}</span>
            </div>
            <div class="tasks-container">
              <div
                v-for="task in column.tasks"
                :key="task.id"
                class="task-card"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                @dragend="onDragEnd"
                @click="openTaskDetails(task)"
              >
                <div class="task-header">
                  <span class="task-priority" :class="task.priority.toLowerCase()">
                    {{ task.priority }}
                  </span>
                  <button class="btn-icon" @click.stop="showTaskActions(task)">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </div>
                <h4 class="task-title">{{ task.title }}</h4>
                <p class="task-description">{{ task.description }}</p>
                <div class="task-footer">
                  <div class="task-meta">
                    <span class="due-date" :class="{ 'overdue': isOverdue(task.dueDate) }">
                      <i class="fas fa-calendar"></i>
                      {{ formatDate(task.dueDate) }}
                    </span>
                    <span class="assignee">
                      <i class="fas fa-user"></i>
                      {{ task.assignee }}
                    </span>
                  </div>
                  <div class="task-tags">
                    <span v-for="tag in task.tags" :key="tag" class="tag">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Column Modal -->
      <modal v-if="showAddColumnModal" @close="showAddColumnModal = false">
        <template #header>
          <h2>Nova Coluna</h2>
        </template>
        <template #default>
          <form @submit.prevent="createColumn" class="column-form">
            <div class="form-group">
              <label for="columnName">Nome da Coluna</label>
              <input
                type="text"
                id="columnName"
                v-model="newColumn.name"
                placeholder="Digite o nome da coluna"
                required
              />
            </div>
          </form>
        </template>
        <template #footer>
          <button class="btn-secondary" @click="showAddColumnModal = false">Cancelar</button>
          <button class="btn-primary" @click="createColumn">Criar Coluna</button>
        </template>
      </modal>

      <!-- Add Task Modal -->
      <modal v-if="showAddTaskModal" @close="showAddTaskModal = false">
        <template #header>
          <h2>Nova Tarefa</h2>
        </template>
        <template #default>
          <form @submit.prevent="createTask" class="task-form">
            <div class="form-group">
              <label for="taskTitle">Título</label>
              <input
                type="text"
                id="taskTitle"
                v-model="newTask.title"
                placeholder="Digite o título da tarefa"
                required
              />
            </div>
            <div class="form-group">
              <label for="taskDescription">Descrição</label>
              <textarea
                id="taskDescription"
                v-model="newTask.description"
                placeholder="Digite a descrição da tarefa"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="taskPriority">Prioridade</label>
              <select id="taskPriority" v-model="newTask.priority">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div class="form-group">
              <label for="taskDueDate">Data de Entrega</label>
              <input
                type="date"
                id="taskDueDate"
                v-model="newTask.dueDate"
                required
              />
            </div>
            <div class="form-group">
              <label for="taskAssignee">Responsável</label>
              <input
                type="text"
                id="taskAssignee"
                v-model="newTask.assignee"
                placeholder="Digite o nome do responsável"
              />
            </div>
            <div class="form-group">
              <label for="taskTags">Tags</label>
              <input
                type="text"
                id="taskTags"
                v-model="newTask.tagsInput"
                placeholder="Digite as tags separadas por vírgula"
              />
            </div>
          </form>
        </template>
        <template #footer>
          <button class="btn-secondary" @click="showAddTaskModal = false">Cancelar</button>
          <button class="btn-primary" @click="createTask">Criar Tarefa</button>
        </template>
      </modal>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'BoardView',
  components: {
    AppLayout,
    Modal
  },
  data() {
    return {
      board: {},
      columns: [],
      showAddColumnModal: false,
      showAddTaskModal: false,
      newColumn: {
        name: ''
      },
      newTask: {
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignee: '',
        tagsInput: ''
      }
    }
  },
  methods: {
    async fetchBoard() {
      try {
        const boardId = this.$route.params.id
        const response = await fetch(`http://localhost:8081/kanban-lite-api/boards/${boardId}`)
        this.board = await response.json()
      } catch (error) {
        console.error('Erro ao carregar quadro:', error)
      }
    },
    async fetchColumns() {
      try {
        const boardId = this.$route.params.id
        const response = await fetch(`http://localhost:8081/kanban-lite-api/boards/${boardId}/columns`)
        this.columns = await response.json()
      } catch (error) {
        console.error('Erro ao carregar colunas:', error)
      }
    },
    async createColumn() {
      try {
        const boardId = this.$route.params.id
        const response = await fetch(`http://localhost:8081/kanban-lite-api/boards/${boardId}/columns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newColumn)
        })
        
        if (response.ok) {
          this.showAddColumnModal = false
          this.newColumn = { name: '' }
          await this.fetchColumns()
        }
      } catch (error) {
        console.error('Erro ao criar coluna:', error)
      }
    },
    async createTask() {
      try {
        const boardId = this.$route.params.id
        const task = {
          ...this.newTask,
          tags: this.newTask.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
        
        const response = await fetch(`http://localhost:8081/kanban-lite-api/boards/${boardId}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
        
        if (response.ok) {
          this.showAddTaskModal = false
          this.newTask = {
            title: '',
            description: '',
            priority: 'MEDIUM',
            dueDate: '',
            assignee: '',
            tagsInput: ''
          }
          await this.fetchColumns()
        }
      } catch (error) {
        console.error('Erro ao criar tarefa:', error)
      }
    },
    onDragStart(event, task) {
      event.dataTransfer.setData('taskId', task.id)
    },
    onDragEnd(event) {
      // Implementar lógica de drag and drop
    },
    openTaskDetails(task) {
      // Implementar visualização detalhada da tarefa
    },
    showTaskActions(task) {
      // Implementar menu de ações da tarefa
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },
    isOverdue(date) {
      return new Date(date) < new Date()
    }
  },
  mounted() {
    this.fetchBoard()
    this.fetchColumns()
  }
}
</script>

<style scoped>
.board-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board-header {
  padding: 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.board-content {
  flex: 1;
  padding: 1.5rem;
  overflow-x: auto;
}

.columns-container {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  min-width: min-content;
}

.column {
  width: 300px;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.column-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.task-count {
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.tasks-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.task-priority {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.task-priority.high {
  background-color: #fee2e2;
  color: #dc2626;
}

.task-priority.medium {
  background-color: #fef3c7;
  color: #d97706;
}

.task-priority.low {
  background-color: #dcfce7;
  color: #16a34a;
}

.task-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.task-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.due-date.overdue {
  color: #dc2626;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.task-form {
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
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style> 