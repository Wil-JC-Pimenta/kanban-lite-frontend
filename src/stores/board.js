import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [],
    currentBoard: null,
    lists: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchBoards() {
      this.loading = true
      try {
        const response = await axios.get(`${API_URL}/boards`)
        this.boards = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async fetchBoard(id) {
      this.loading = true
      try {
        const [boardResponse, listsResponse] = await Promise.all([
          axios.get(`${API_URL}/boards/${id}`),
          axios.get(`${API_URL}/lists/board/${id}`)
        ])
        this.currentBoard = boardResponse.data
        this.lists = listsResponse.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async createBoard(title) {
      try {
        const response = await axios.post(`${API_URL}/boards`, { title })
        this.boards.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async createList(boardId, title) {
      try {
        const response = await axios.post(`${API_URL}/lists/board/${boardId}`, { title })
        this.lists.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async createCard(listId, title, content) {
      try {
        const response = await axios.post(`${API_URL}/cards/list/${listId}`, { title, content })
        const list = this.lists.find(l => l.id === listId)
        if (list) {
          list.cards = list.cards || []
          list.cards.push(response.data)
        }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async updateCardPosition(cardId, position) {
      try {
        const response = await axios.put(`${API_URL}/cards/${cardId}/position?position=${position}`)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async moveCard(cardId, listId) {
      try {
        const response = await axios.put(`${API_URL}/cards/${cardId}/move?listId=${listId}`)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 