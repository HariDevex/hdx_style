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
  { type: 'success', title: 'Deployment complete', cls: 'hdx_alert-success' },
  { type: 'danger', title: 'Disk usage above 90%', cls: 'hdx_alert-danger' },
  { type: 'warning', title: 'Rate limit approaching', cls: 'hdx_alert-warning' },
];

const rows = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', badge: 'hdx_badge-primary' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', badge: 'hdx_badge-outline' },
  { name: 'Alex Kim', email: 'alex@example.com', role: 'User', badge: 'hdx_badge-outline' },
];
</script>

<template>
  <div
    class="hdx_min-h-screen hdx_bg-background hdx_text-text"
    :class="dark ? 'hdx_dark' : ''"
  >
    <div class="hdx_container hdx_mx-auto hdx_p-6">

      <!-- Header with a live dark-mode toggle -->
      <header class="hdx_flex hdx_items-center hdx_justify-between hdx_mb-8">
        <h1 class="hdx_text-2xl hdx_font-bold">HDX Style + Vue</h1>
        <button
          class="hdx_btn hdx_btn-ghost hdx_btn-md"
          @click="dark = !dark"
        >
          {{ dark ? 'Light mode' : 'Dark mode' }}
        </button>
      </header>

      <!-- Alerts -->
      <div class="hdx_flex hdx_flex-col hdx_gap-3 hdx_mb-8">
        <div
          v-for="a in alerts"
          :key="a.title"
          class="hdx_flex hdx_items-center hdx_justify-between hdx_p-4 hdx_rounded-lg"
          :class="[a.cls, 'hdx_dark_bg-surface-secondary']"
        >
          <span class="hdx_text-sm hdx_font-medium">{{ a.title }}</span>
          <span class="hdx_btn hdx_btn-ghost hdx_btn-sm">Dismiss</span>
        </div>
      </div>

      <!-- Team table (components + hover states) -->
      <div class="hdx_table-container">
        <table class="hdx_table">
          <thead class="hdx_table-header">
            <tr>
              <th class="hdx_table-cell">Name</th>
              <th class="hdx_table-cell">Email</th>
              <th class="hdx_table-cell">Role</th>
              <th class="hdx_table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in rows"
              :key="r.email"
              class="hdx_table-row hdx_hover_bg-surface-secondary hdx_transition"
            >
              <td class="hdx_table-cell hdx_font-medium">{{ r.name }}</td>
              <td class="hdx_table-cell">{{ r.email }}</td>
              <td class="hdx_table-cell">{{ r.role }}</td>
              <td class="hdx_table-cell">
                <span class="hdx_badge" :class="r.badge">{{ r.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Responsive + arbitrary value demo -->
      <div
        class="hdx_mt-8 hdx_bg-surface hdx_dark_bg-surface-secondary hdx_border hdx_border-border
               hdx_rounded-xl hdx_shadow-sm hdx_p-6 hdx_flex hdx_flex-col hdx_md_flex-row
               hdx_items-start hdx_md_items-center hdx_justify-between hdx_gap-4"
      >
        <div>
          <h2 class="hdx_text-lg hdx_font-semibold">Responsive & arbitrary</h2>
          <p class="hdx_text-sm hdx_text-text-secondary hdx_mt-1">
            <code class="hdx_text-primary">hdx_md_flex-row</code> flips this panel on desktop;
            <code class="hdx_text-primary">hdx_w-[180px]</code> sizes the button below.
          </p>
        </div>
        <button class="hdx_btn hdx_btn-primary hdx_w-full hdx_md_w-[180px] hdx_rounded-[14px]">
          Resize me
        </button>
      </div>

    </div>
  </div>
</template>