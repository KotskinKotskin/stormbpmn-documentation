<script setup>
import { computed } from 'vue';

// Данные передаются через Vite define из config.ts
// eslint-disable-next-line no-undef
const latestRelease = __LATEST_RELEASE__;

const latestChangelog = computed(() => {
  if (latestRelease) {
    return {
      version: latestRelease.version,
      date: latestRelease.date,
      path: `/Changelog/${latestRelease.version}.html`
    };
  }
  return null;
});
</script>

<template>
  <div v-if="latestChangelog" class="latest-changelog">
    <a :href="latestChangelog.path" class="changelog-card">
      <div class="changelog-badge">🆕 Последняя версия</div>
      <div class="changelog-version">{{ latestChangelog.version }}</div>
      <div class="changelog-date">{{ latestChangelog.date }}</div>
      <div class="changelog-link">Смотреть changelog →</div>
    </a>
  </div>
</template>

<style scoped>
.latest-changelog {
  margin: 1rem 0 1.5rem 0;
}

.changelog-card {
  display: block;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.changelog-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.changelog-badge {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.changelog-version {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.changelog-date {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.changelog-link {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

:root.dark .changelog-card {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}
</style>
