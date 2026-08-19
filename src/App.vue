<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">
        <img src="/timelends-icon.svg" alt="" width="32" height="32">
        <span>TimeLends</span>
      </RouterLink>
      <nav aria-label="メインナビゲーション">
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/disclaimer">免責事項</RouterLink>
      </nav>
    </header>

    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>
