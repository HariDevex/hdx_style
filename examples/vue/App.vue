<!--
  HDX Style — Vue example
  Build the stylesheet (from the repo root):
    node src/cli/index.js build -p -c examples/vue/hdx.config.js

  Mount App.vue in any Vite project and import the built CSS once (main.js):
    import "@haridevx/hdx-style/css";   // published package
    import "./dist/hdx.css";            // local build
-->
<script setup>
import { ref } from 'vue';

const dark = ref(true);

const alerts = [
  { type: 'success', title: 'Deployment complete', cls: 'hdx-alert-success' },
  { type: 'danger', title: 'Disk usage above 90%', cls: 'hdx-alert-danger' },
  { type: 'warning', title: 'Rate limit approaching', cls: 'hdx-alert-warning' },
];

const rows = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', badge: 'hdx-badge-primary' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', badge: 'hdx-badge-outline' },
  { name: 'Alex Kim', email: 'alex@example.com', role: 'User', badge: 'hdx-badge-outline' },
];
</script>

<template>
  <div
    class="hdx-min-h-screen hdx-bg-background hdx-text-text"
    :class="dark ? 'hdx-dark' : ''"
  >
    <div class="hdx-container hdx-mx-auto hdx-p-6">

      <!-- Header with a live dark-mode toggle -->
      <header class="hdx-flex hdx-items-center hdx-justify-between hdx-mb-8">
        <h1 class="hdx-text-2xl hdx-font-bold">HDX Style + Vue</h1>
        <button
          class="hdx-btn hdx-btn-ghost hdx-btn-md"
          @click="dark = !dark"
        >
          {{ dark ? 'Light mode' : 'Dark mode' }}
        </button>
      </header>

      <!-- Alerts -->
      <div class="hdx-flex hdx-flex-col hdx-gap-3 hdx-mb-8">
        <div
          v-for="a in alerts"
          :key="a.title"
          class="hdx-flex hdx-items-center hdx-justify-between hdx-p-4 hdx-rounded-lg"
          :class="[a.cls, 'hdx-dark_bg-surface-secondary']"
        >
          <span class="hdx-text-sm hdx-font-medium">{{ a.title }}</span>
          <span class="hdx-btn hdx-btn-ghost hdx-btn-sm">Dismiss</span>
        </div>
      </div>

      <!-- Team table (components + hover states) -->
      <div class="hdx-table-container">
        <table class="hdx-table">
          <thead class="hdx-table-header">
            <tr>
              <th class="hdx-table-cell">Name</th>
              <th class="hdx-table-cell">Email</th>
              <th class="hdx-table-cell">Role</th>
              <th class="hdx-table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in rows"
              :key="r.email"
              class="hdx-table-row hdx-hover_bg-surface-secondary hdx-transition"
            >
              <td class="hdx-table-cell hdx-font-medium">{{ r.name }}</td>
              <td class="hdx-table-cell">{{ r.email }}</td>
              <td class="hdx-table-cell">{{ r.role }}</td>
              <td class="hdx-table-cell">
                <span class="hdx-badge" :class="r.badge">{{ r.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Responsive + arbitrary value demo -->
      <div
        class="hdx-mt-8 hdx-bg-surface hdx-dark_bg-surface-secondary hdx-border hdx-border-border
               hdx-rounded-xl hdx-shadow-sm hdx-p-6 hdx-flex hdx-flex-col hdx-md_flex-row
               hdx-items-start hdx-md_items-center hdx-justify-between hdx-gap-4"
      >
        <div>
          <h2 class="hdx-text-lg hdx-font-semibold">Responsive & arbitrary</h2>
          <p class="hdx-text-sm hdx-text-text-secondary hdx-mt-1">
            <code class="hdx-text-primary">hdx-md_flex-row</code> flips this panel on desktop;
            <code class="hdx-text-primary">hdx-w-[180px]</code> sizes the button below.
          </p>
        </div>
        <button class="hdx-btn hdx-btn-primary hdx-w-full hdx-md_w-[180px] hdx-rounded-[14px]">
          Resize me
        </button>
      </div>

    </div>
  </div>
</template>