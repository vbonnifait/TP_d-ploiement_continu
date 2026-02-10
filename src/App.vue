<script setup>
import ChessBoard from './components/ChessBoard.vue'
</script>

<template>
  <div class="app">
    <!-- Top nav bar like Lichess -->
    <nav class="navbar">
      <div class="nav-brand">
        <svg class="logo" viewBox="0 0 50 50" width="28" height="28">
          <path d="M25 3C12.87 3 3 12.87 3 25s9.87 22 22 22 22-9.87 22-22S37.13 3 25 3zm0 3c2.61 0 4.09 2.08 5.13 4.7L25 22l-5.13-11.3C21.04 8.06 22.27 6 25 6zm-9.5 7.5c1.62-.07 3.35.9 4.85 2.88L14 27l-5.67-7.4c.57-3.5 3.27-5.94 7.17-6.1zm19 0c3.9.16 6.6 2.6 7.17 6.1L36 27l-6.35-10.62c1.5-1.98 3.23-2.95 4.85-2.88zM10.25 24.5L17 30l-7.77 7.55C7.2 34.72 6 30.06 6 25c0-.17.01-.34.02-.5h4.23zm29.5 0H44c.01.16.02.33.02.5 0 5.06-1.2 9.72-3.22 12.55L33 30l6.75-5.5zM25 27l8 7H17l8-7zm-7.75 9h15.5L25 45l-7.75-9z" fill="#fff"/>
        </svg>
        <span class="brand-text">lichess</span>
      </div>
      <div class="nav-links">
        <span class="nav-link active">Partie</span>
        <span class="nav-link">Analyse</span>
        <span class="nav-link">Puzzles</span>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <ChessBoard />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 16px;
  height: 44px;
  background: #262421;
  border-bottom: 1px solid #3a3835;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo {
  opacity: 0.9;
}

.brand-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #999;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: #3a3835;
  color: #ddd;
}

.nav-link.active {
  color: #fff;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 16px;
}
</style>
