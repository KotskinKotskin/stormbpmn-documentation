<script setup>
import { computed, onMounted, ref } from 'vue';

// Данные передаются через Vite define из config.ts
// eslint-disable-next-line no-undef
const latestRelease = __LATEST_RELEASE__;

const latestChangelog = computed(() => {
  if (!latestRelease) return null;

  return {
    version: latestRelease.version,
    date: latestRelease.date,
    path: `/Changelog/${latestRelease.version}.html`
  };
});

// config.ts отдаёт дату уже в человеческом ДД.ММ.ГГГГ. Для <time datetime>
// нужен ISO — разворачиваем строку, а на неожиданном формате просто молчим
// (атрибут не выводится, видимый текст не страдает).
const isoDate = computed(() => {
  const raw = latestChangelog.value?.date;
  if (!raw) return undefined;

  const parts = raw.split('.');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : undefined;
});

const pluralizeDays = (days) => {
  const tail10 = days % 10;
  const tail100 = days % 100;

  if (tail10 === 1 && tail100 !== 11) return 'день';
  if (tail10 >= 2 && tail10 <= 4 && (tail100 < 10 || tail100 >= 20)) return 'дня';
  return 'дней';
};

// «Сколько дней назад» считаем ТОЛЬКО на клиенте (onMounted), а не в computed:
// страницы рендерятся в статику на сборке, и вычисленное там «7 дней назад»
// протухло бы к следующему визиту и вдобавок разошлось бы с гидрацией.
// До монтирования подпись просто отсутствует.
const releasedAgo = ref(null);

onMounted(() => {
  const raw = latestChangelog.value?.date;
  const parts = raw?.split('.');
  if (parts?.length !== 3) return;

  const released = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  if (Number.isNaN(released.getTime())) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // round, а не floor: перевод часов даёт сутки в 23 или 25 часов, и floor
  // на такой границе занижает возраст релиза на день.
  const days = Math.round((today - released) / 86_400_000);
  if (days < 0) return; // дата релиза в будущем — считать нечего

  if (days === 0) releasedAgo.value = 'сегодня';
  else if (days === 1) releasedAgo.value = 'вчера';
  else releasedAgo.value = `${days} ${pluralizeDays(days)} назад`;
});
</script>

<template>
  <a
    v-if="latestChangelog"
    :href="latestChangelog.path"
    class="release-card"
    :aria-label="`Что изменилось в версии ${latestChangelog.version}`"
  >
    <div class="release-card__meta">
      <span class="release-card__label">Текущий релиз</span>
      <span class="release-card__version">{{ latestChangelog.version }}</span>
      <span class="release-card__date">
        <time :datetime="isoDate">от {{ latestChangelog.date }}</time>
        <template v-if="releasedAgo">
          <span class="release-card__sep" aria-hidden="true">·</span>
          <span>{{ releasedAgo }}</span>
        </template>
      </span>
    </div>

    <span class="release-card__cta">
      Что изменилось
      <span class="release-card__arrow" aria-hidden="true">→</span>
    </span>
  </a>
</template>

<style scoped>
/* Карточка релиза в маркетинговом языке «Process-Architecture Editorial»:
   тёмная панель-акцент посреди светлой страницы, чертёжная форма (острый
   радиус, 1px-хайрлайн, смещённая тень) и «живой токен» вместо эмодзи.
   Токены приходят из .vuepress/styles/index.scss. */
.release-card {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  margin: 1rem 0 1.5rem;
  padding: 1.35rem 1.6rem;
  border: 1px solid var(--mkt-hairline-on-dark);
  border-radius: var(--mkt-radius);

  background: var(--mkt-panel-dark);
  box-shadow: var(--mkt-shadow);
  color: #f8fafc;

  text-decoration: none;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

/* Плашка едет на пиксель к курсору, тень подрастает — тот же жест, что у
   кнопок херо, никаких scale и цветных свечений. */
.release-card:hover {
  transform: translate(-1px, -1px);
  border-color: color-mix(in srgb, var(--mkt-color-token) 50%, transparent);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.35);
  color: #f8fafc;
}

.release-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

/* Надзаголовок — инженерный лейбл: капс + трекинг, без третьей гарнитуры. */
.release-card__label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  color: #c7d2fe;

  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Точка-токен: сигнатурный акцент симуляции вместо эмодзи 🆕. */
.release-card__label::before {
  content: "";

  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  background: var(--mkt-color-token);
  box-shadow: 0 0 8px color-mix(in srgb, var(--mkt-color-token-glow) 70%, transparent);
}

.release-card__version {
  font-family: var(--mkt-font-display);
  font-size: 2.1rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.release-card__date {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;

  color: #94a3b8;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.release-card__sep {
  color: #475569;
}

/* CTA — не кнопка, а хайрлайн-плашка: карточка кликабельна целиком, второй
   «настоящей» кнопкой внутри ссылки мы бы соврали про интерактив. */
.release-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  padding: 0.5rem 0.95rem;
  border: 1px solid var(--mkt-hairline-on-dark);
  border-radius: var(--mkt-radius-sm);

  font-size: 0.95rem;
  font-weight: 600;
}

.release-card__arrow {
  transition: transform 0.15s ease;
}

.release-card:hover .release-card__arrow {
  transform: translateX(3px);
}

@media (max-width: 719px) {
  .release-card__version {
    font-size: 1.7rem;
  }

  .release-card__cta {
    width: 100%;
    justify-content: center;
  }
}

/* Уважаем системную настройку: сдвиг плашки и стрелки — украшение, не смысл. */
@media (prefers-reduced-motion: reduce) {
  .release-card,
  .release-card__arrow {
    transition: none;
  }

  .release-card:hover {
    transform: none;
  }

  .release-card:hover .release-card__arrow {
    transform: none;
  }
}
</style>
