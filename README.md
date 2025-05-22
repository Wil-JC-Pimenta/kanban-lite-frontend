# Kanban Lite Frontend

## Objetivo
O frontend do Kanban Lite é uma aplicação moderna e responsiva que permite aos usuários gerenciar seus quadros Kanban de forma intuitiva e eficiente. Desenvolvido com Vue.js 3, oferece uma experiência de usuário fluida e interativa.

## Arquitetura de Software

### Diagrama de Componentes
```
+------------------+     +------------------+     +------------------+
|    App.vue       |     |    Router        |     |    Store         |
+------------------+     +------------------+     +------------------+
        |                       |                        |
        v                       v                        v
+------------------+     +------------------+     +------------------+
|    Views         |     |    Components    |     |    Services      |
+------------------+     +------------------+     +------------------+
        |                       |                        |
        v                       v                        v
+------------------+     +------------------+     +------------------+
|    BoardView     |     |    CardList      |     |    API Client    |
|    ListView      |     |    CardItem      |     |    HTTP Client   |
|    CardView      |     |    DragDrop      |     |    Auth Service  |
+------------------+     +------------------+     +------------------+
```

### Fluxo de Dados
```
[User Action] -> [Component] -> [Store Action] -> [API Service] -> [Backend]
      ^                                                              |
      |                                                              v
      +------------------ [Store Mutation] <-- [API Response] -------+
```

### Componentes Principais

#### 1. Views
- **BoardView**: Visualização principal do quadro Kanban
- **ListView**: Gerenciamento de listas
- **CardView**: Visualização e edição de cards

#### 2. Components
- **CardList**: Lista de cards com suporte a drag-and-drop
- **CardItem**: Item individual de card
- **DragDrop**: Componente de arrastar e soltar

#### 3. Store (Pinia)
- **BoardStore**: Gerenciamento de estado dos quadros
- **ListStore**: Gerenciamento de estado das listas
- **CardStore**: Gerenciamento de estado dos cards

## Estrutura de Diretórios
```
frontend/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes Vue
│   │   ├── board/       # Componentes de quadro
│   │   ├── list/        # Componentes de lista
│   │   └── card/        # Componentes de card
│   ├── router/          # Configuração do Vue Router
│   ├── stores/          # Stores Pinia
│   ├── services/        # Serviços e API
│   ├── utils/           # Utilitários
│   └── views/           # Páginas/Vistas
├── public/              # Arquivos públicos
└── tests/              # Testes
```

## Tecnologias Utilizadas
- Vue.js 3
- Pinia
- Vue Router
- Vue Draggable Next
- Axios
- Vite
- TypeScript
- Tailwind CSS

## Pré-requisitos
- Node.js 16+
- npm 7+ ou yarn 1.22+

## Configuração e Execução

### 1. Instalação
```bash
npm install
# ou
yarn install
```

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Execução em Desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### 4. Build para Produção
```bash
npm run build
# ou
yarn build
```

## Conexão com Backend

### Configuração do Axios
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### Exemplo de Uso
```typescript
// src/stores/boardStore.ts
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useBoardStore = defineStore('board', {
  state: () => ({
    boards: [],
    currentBoard: null
  }),
  actions: {
    async fetchBoards() {
      const response = await api.get('/boards');
      this.boards = response.data;
    }
  }
});
```

## Funcionalidades Principais

### 1. Gerenciamento de Quadros
- Criação, edição e exclusão de quadros
- Visualização em lista e kanban
- Filtros e busca

### 2. Gerenciamento de Listas
- Criação, edição e exclusão de listas
- Reordenação via drag-and-drop
- Limite de cards por lista

### 3. Gerenciamento de Cards
- Criação, edição e exclusão de cards
- Movimentação entre listas
- Atribuição de responsáveis
- Etiquetas e cores

## Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença
MIT 