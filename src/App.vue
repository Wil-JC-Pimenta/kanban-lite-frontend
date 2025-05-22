<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Kanban Lite</h1>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #026aa7;
  padding: 1rem;
  color: white;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

.main-content {
  flex: 1;
  padding: 1rem;
  background-color: #f4f5f7;
}
</style> 