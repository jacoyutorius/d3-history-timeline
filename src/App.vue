<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">History Timeline</RouterLink>
      <nav aria-label="メインナビゲーション">
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>
