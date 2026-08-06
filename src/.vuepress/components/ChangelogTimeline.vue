<script setup>
import { computed, onMounted, ref } from 'vue';
import { withBase } from 'vuepress/client';

const props = defineProps({
  /** Сколько релизов показать. 0 — все (полная лента на /Changelog/). */
  limit: { type: Number, default: 0 },
  /** Сколько верхних релизов пропустить. На главной — 1: самый свежий уже в баннере. */
  skip: { type: Number, default: 0 },
  /** Раскрывать ли верхнюю запись. На главной под баннером — не надо. */
  openFirst: { type: Boolean, default: true },
  /** Надпись над лентой. Пусто — ленту подписывает сама страница. */
  caption: { type: String, default: '' },
});

// Индекс генерируется на сборке в public/changelog-index.json (см. config.ts).
// Тянем его здесь, а не через define: тексты всех релизов весят ~170 КБ и в
// бандле приехали бы на каждую страницу доков.
const releases = ref([]);
const state = ref('loading'); // loading | ready | error

const toDate = (raw) => {
  const parts = raw?.split('.');
  if (parts?.length !== 3) return null;

  const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return Number.isNaN(date.getTime()) ? null : date;
};

const pluralize = (count, one, few, many) => {
  const tail10 = count % 10;
  const tail100 = count % 100;

  if (tail10 === 1 && tail100 !== 11) return one;
  if (tail10 >= 2 && tail10 <= 4 && (tail100 < 10 || tail100 >= 20)) return few;
  return many;
};

// Возраст самого свежего релиза. Считается на клиенте: страницы уезжают в
// статику на сборке, и «7 дней назад» из билда протухло бы уже назавтра.
const freshness = ref(null);

const shown = computed(() => {
  const rest = releases.value.slice(props.skip);
  return props.limit > 0 ? rest.slice(0, props.limit) : rest;
});

const hasMore = computed(() => shown.value.length < releases.value.length);

const items = computed(() => {
  let previousYear = null;

  return shown.value.map((release, index) => {
    const date = toDate(release.date);
    const year = date?.getFullYear() ?? null;
    const startsYear = year !== null && year !== previousYear;
    previousYear = year;

    const changes = release.sections.reduce((total, section) => total + section.items.length, 0);

    return {
      ...release,
      // Только настоящий верх ленты: при skip первая показанная запись — уже
      // не текущий релиз, и зелёный узел с плашкой возраста ей не положены.
      isLatest: index === 0 && props.skip === 0,
      year,
      startsYear,
      changes,
      iso: date ? `${release.date.slice(6)}-${release.date.slice(3, 5)}-${release.date.slice(0, 2)}` : undefined,
    };
  });
});

onMounted(async () => {
  try {
    const response = await fetch(withBase('/changelog-index.json'));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    releases.value = await response.json();
    state.value = 'ready';
  } catch {
    // Молча деградируем до ссылки на левое меню — в сайдбаре тот же список
    // релизов, так что пользователь не остаётся без навигации.
    state.value = 'error';
    return;
  }

  const latest = toDate(releases.value[0]?.date);
  if (!latest) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // round, а не floor: перевод часов даёт сутки в 23 или 25 часов, и floor
  // на такой границе занижает возраст релиза на день.
  const days = Math.round((today - latest) / 86_400_000);
  if (days < 0) return;

  if (days === 0) freshness.value = 'сегодня';
  else if (days === 1) freshness.value = 'вчера';
  else freshness.value = `${days} ${pluralize(days, 'день', 'дня', 'дней')} назад`;
});
</script>

<template>
  <section class="timeline" aria-label="Лента релизов">
    <p v-if="caption && state === 'ready'" class="timeline__caption">{{ caption }}</p>

    <p v-if="state === 'loading'" class="timeline__status">Загружаем ленту релизов…</p>

    <p v-else-if="state === 'error'" class="timeline__status">
      Не удалось загрузить ленту релизов. Полный список версий есть в левом меню.
    </p>

    <ol v-else class="timeline__list">
      <li v-for="release in items" :key="release.version" class="timeline__item">
        <p v-if="release.startsYear" class="timeline__year">{{ release.year }}</p>

        <details
          class="entry"
          :class="{ 'entry--latest': release.isLatest }"
          :open="release.isLatest && openFirst"
        >
          <summary class="entry__summary">
            <span class="entry__node" aria-hidden="true" />

            <span class="entry__head">
              <span class="entry__version">{{ release.version }}</span>
              <time class="entry__date" :datetime="release.iso">{{ release.date }}</time>
              <span v-if="release.isLatest && freshness" class="entry__fresh">{{ freshness }}</span>
            </span>

            <span class="entry__chips">
              <span
                v-for="section in release.sections"
                :key="section.title"
                class="entry__chip"
                :title="section.title"
              >
                <span aria-hidden="true">{{ section.icon }}</span>
                {{ section.items.length }}
              </span>
              <!-- У ранних релизов страница состоит из одной таблички с версией
                   и docker-образом — разбирать там нечего, и честнее сказать это,
                   чем показывать пустую раскрытую запись. -->
              <span v-if="!release.changes" class="entry__chip entry__chip--empty">без описания</span>
            </span>
          </summary>

          <div class="entry__body">
            <div v-for="section in release.sections" :key="section.title" class="entry__section">
              <p class="entry__section-title">
                <span aria-hidden="true">{{ section.icon }}</span> {{ section.title }}
              </p>
              <ul class="entry__section-list">
                <li v-for="(item, index) in section.items" :key="index">{{ item }}</li>
              </ul>
            </div>

            <a class="entry__link" :href="withBase(release.path)">
              Полное описание версии {{ release.version }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </details>
      </li>
    </ol>

    <a v-if="state === 'ready' && hasMore" class="timeline__more" :href="withBase('/Changelog/')">
      Все релизы ({{ releases.length }})
      <span aria-hidden="true">→</span>
    </a>
  </section>
</template>

<style scoped>
/* Лента релизов в маркетинговом языке «Process-Architecture Editorial»:
   вертикальный рельс-хайрлайн, узел на каждом релизе, чертёжные плашки.
   Токены приходят из .vuepress/styles/index.scss. */
.timeline {
  margin: 1.5rem 0 2rem;
}

.timeline__status {
  color: var(--text-color-lighter);
  font-size: 0.95rem;
}

.timeline__caption {
  margin: 0 0 0.75rem;
  color: var(--text-color-lighter);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.timeline__list {
  position: relative;
  margin: 0;
  padding: 0 0 0 1.5rem;
  list-style: none;
}

/* Рельс. Тянется по всей ленте, узлы записей садятся ровно на него. */
.timeline__list::before {
  content: "";

  position: absolute;
  top: 0.35rem;
  bottom: 0.35rem;
  left: 5px;

  width: 1px;
  background: var(--border-color-dark);
}

.timeline__item + .timeline__item {
  margin-top: 0.5rem;
}

/* Год — единственная «шапка» в ленте: даёт опору при скролле на 40+ релизов. */
.timeline__year {
  margin: 1.75rem 0 0.75rem;
  color: var(--text-color-lighter);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.timeline__item:first-child .timeline__year {
  margin-top: 0;
}

.entry {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--mkt-radius);
  background: var(--bg-color);
}

.entry[open] {
  box-shadow: var(--mkt-shadow);
}

/* Свежий релиз выделен бренд-краем, а не цветной заливкой: в ленте из
   сорока плашек заливка перетянула бы на себя весь экран. */
.entry--latest {
  border-color: color-mix(in srgb, var(--mkt-color-brand) 45%, transparent);
}

.entry__summary {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;

  padding: 0.7rem 0.9rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.entry__summary::-webkit-details-marker {
  display: none;
}

.entry__summary:hover {
  background: var(--bg-color-secondary);
}

/* Узел на рельсе. Считается от плашки (-1.5rem = отступ списка), поэтому
   держится на первой строке даже когда чипы переносятся на вторую. */
.entry__node {
  position: absolute;
  top: 1.1rem;
  left: -1.5rem;

  width: 11px;
  height: 11px;
  border: 1px solid var(--border-color-dark);
  border-radius: 50%;

  background: var(--bg-color);
}

.entry--latest .entry__node {
  border-color: transparent;
  background: var(--mkt-color-token);
  box-shadow: 0 0 8px color-mix(in srgb, var(--mkt-color-token-glow) 70%, transparent);
}

.entry__head {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  flex: 1;
  flex-wrap: wrap;
  min-width: 0;
}

.entry__version {
  font-family: var(--mkt-font-display);
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.entry__date {
  color: var(--text-color-lighter);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.entry__fresh {
  padding: 0.05rem 0.4rem;
  border: 1px solid color-mix(in srgb, var(--mkt-color-token) 40%, transparent);
  border-radius: var(--mkt-radius-sm);

  background: color-mix(in srgb, var(--mkt-color-token) 10%, transparent);
  color: var(--mkt-color-token);

  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.entry__chips {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  flex-shrink: 0;
}

/* Чип = «сколько изменений этого рода». Иконка берётся из самого заголовка
   секции в md, так что новый вид секции подхватится без правок здесь. */
.entry__chip {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;

  padding: 0.1rem 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: var(--mkt-radius-sm);

  color: var(--text-color-light);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.entry__chip--empty {
  color: var(--text-color-lighter);
}

.entry__body {
  padding: 0.9rem;
  border-top: 1px solid var(--border-color);
}

.entry__section + .entry__section {
  margin-top: 1rem;
}

.entry__section-title {
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.entry__section-list {
  margin: 0;
  padding-left: 1.1rem;
}

.entry__section-list li {
  margin: 0.25rem 0;
  line-height: 1.5;
}

.entry__link {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Виден только у урезанной ленты (главная): ведёт на полную на /Changelog/. */
.timeline__more {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;

  margin: 0.9rem 0 0 1.5rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--border-color-dark);
  border-radius: var(--mkt-radius);

  box-shadow: var(--mkt-shadow);

  font-size: 0.9rem;
  font-weight: 600;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.timeline__more:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--mkt-shadow-hover);
}

@media (prefers-reduced-motion: reduce) {
  .timeline__more {
    transition: none;
  }

  .timeline__more:hover {
    transform: none;
  }
}

@media (max-width: 719px) {
  .entry__chips {
    width: 100%;
  }
}
</style>
