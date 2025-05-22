<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <img src="@/assets/logo.svg" alt="Kanban Lite" class="logo" />
        <h1 v-if="!isCollapsed">Kanban Lite</h1>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/boards" class="nav-item" active-class="active">
          <i class="fas fa-columns"></i>
          <span v-if="!isCollapsed">Quadros</span>
        </router-link>
      </nav>
      <button class="collapse-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </aside>
    <div class="main-content">
      <header class="header">
        <div class="header-left">
          <h2>{{ title }}</h2>
        </div>
        <div class="header-right">
          <button class="btn-icon">
            <i class="fas fa-bell"></i>
          </button>
          <button class="btn-icon">
            <i class="fas fa-cog"></i>
          </button>
          <div class="user-menu">
            <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" alt="User" class="avatar" />
            <span>User</span>
          </div>
        </div>
      </header>
      <main class="content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  width: 32px;
  height: 32px;
}

.sidebar-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.sidebar-nav {
  padding: 1rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #3b82f6;
}

.collapse-btn {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f6f8;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu:hover {
  background-color: #f3f4f6;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style> 