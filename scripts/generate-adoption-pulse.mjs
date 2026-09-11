// Static illustrations for the Enterprise recipe; no browser runtime or chart library.
// Data is illustrative, reproduced from the original adoption-pulse example.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../src/.vuepress/public/recipes/adoption-pulse/', import.meta.url));
fs.mkdirSync(out, { recursive: true });
const data = JSON.parse(fs.readFileSync(new URL('./adoption-pulse-data.json', import.meta.url), 'utf8'));
const purple = '#6366f1', orange = '#df642e', green = '#159467', gray = '#9a9eb8';
const esc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const text = (x, y, value, extra = '') => `<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
const rect = (x, y, w, h, color, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" ${extra}/>`;
function write(name, title, description, body, height = 430) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}" role="img" aria-labelledby="title description">
<title id="title">${esc(title)}</title>
<desc id="description">${esc(description)} Условные данные для примера.</desc>
<style>text{font-family:Arial,'Segoe UI',sans-serif;font-size:18px;fill:#464960}.title{font-size:24px;font-weight:700;fill:#17182d}.small{font-size:16px}.value{font-weight:700;fill:#17182d}</style>
${rect(1, 1, 798, height - 2, '#ffffff', 'rx="14" stroke="#dfe0ec"')}
${text(28, 40, title, 'class="title"')}
${text(28, height - 20, 'Условные данные · пример чтения метрики', 'class="small"')}
${body}
</svg>
`;
  fs.writeFileSync(path.join(out, `${name}.svg`), svg);
}
function chart(name, title, labels, series, { max, percent = false, bars = false, note = '' } = {}) {
  const left = percent ? 86 : 68, right = 766, top = 85 + series.length * 26, bottom = 350;
  const ceiling = max ?? Math.ceil(Math.max(...series.flatMap(s => s.values)) / 20) * 20;
  const y = value => bottom - value / ceiling * (bottom - top);
  const x = i => left + (right - left) * (bars ? (i + 0.5) / labels.length : i / (labels.length - 1));
  const fmt = v => `${Number(v.toFixed(2)).toLocaleString('ru-RU')}${percent ? ' %' : ''}`;
  let body = series.map((s, i) => rect(30, 60 + i * 26, 14, 14, s.color, 'rx="3"') + text(54, 73 + i * 26, s.label)).join('');
  for (let i = 0; i <= 4; i++) {
    const value = ceiling * i / 4;
    body += `<path d="M${left} ${y(value)}H${right}" stroke="#e6e7f0"/>` + text(left - 12, y(value) + 6, fmt(value), 'text-anchor="end" class="small"');
  }
  const ticks = new Set([0, ...Array.from({ length: 4 }, (_, i) => Math.round((i + 1) * (labels.length - 1) / 5)), labels.length - 1]);
  for (const i of ticks) body += text(x(i), bottom + 29, labels[i], 'text-anchor="middle" class="small"');
  series.forEach((s, j) => {
    if (bars) {
      const width = Math.min(22, (right - left) / labels.length * 0.75 / series.length);
      body += s.values.map((v, i) => rect(x(i) + (j - series.length / 2) * width, y(v), Math.max(1, width - 1), bottom - y(v), s.color, 'rx="2"')).join('');
    } else {
      body += `<polyline points="${s.values.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
      const last = s.values.length - 1;
      body += `<circle cx="${x(last)}" cy="${y(s.values[last])}" r="5" fill="${s.color}"/>`;
    }
  });
  write(name, title, note || series.map(s => `${s.label}: от ${fmt(s.values[0])} до ${fmt(s.values.at(-1))}`).join('; '), body);
}
const series = (label, values, color = purple) => ({ label, values, color });
chart('raw-events', 'События за день: много шума', data.dayLabels, [series('События в sm_business_event', data.days, gray)], { bars: true, max: 800 });
chart('authors-trend', 'Авторы за 28 дней: виден тренд', data.wl.slice(14), [series('Пользователи, сделавшие вклад', data.contrib28.slice(14))]);
chart('audience', 'Аудитория за скользящие 28 дней', data.wl, [series('Пришли за 28 дней', data.users28, orange), series('Работали за 28 дней', data.contrib28)]);
chart('weekly', 'Недельная аудитория', data.wl, [series('Пришли за неделю', data.usersWeek, orange), series('Работали за неделю', data.contribWeek)]);
chart('stickiness', 'Доля недельной аудитории в 28-дневной', data.wl, [series('Недельная аудитория / аудитория за 28 дней', data.stick)], { max: 1 });
chart('newcomers', 'Активация и возврат новичков', data.newW, [series('Пришли впервые', data.newcomers, gray), series('Сделали вклад за 14 дней', data.contrib14, green), series('Вернулись на 2–4-й неделе', data.returned)], { bars: true, max: 60 });
chart('core', 'Ядро пользователей по неделям', data.wl, [series('Все авторы за 14 дней', data.contrib14d, gray), series('Ядро: 3+ вклада за 14 дней', data.coreUsers)]);
chart('models', 'Количество моделей в базе', data.wl, [series('Модели без удалённых', data.baseTotal)], { bars: true, max: 800 });
chart('alive', 'Доля живых моделей', data.wl, [series('Есть сохранённая версия за последние 90 дней', data.alive, orange)], { max: 100, percent: true });
chart('collaboration', 'Совместная работа по неделям', data.wl, [series('Уникальные комментаторы', data.commenters), series('Решения по согласованиям', data.approvals, orange)], { bars: true });
chart('ai', 'Пользователи ИИ-чата по неделям', data.wl, [series('Уникальные отправители сообщений', data.aiUsers)], { bars: true });
chart('ai-share', 'Доля авторов, использующих ИИ', data.wl, [series('Пользователи ИИ / все авторы за неделю', data.aiShare)], { max: 50, percent: true });

let heat = text(28, 88, 'Когорта', 'class="small"') + text(146, 88, 'Людей', 'class="small"');
for (let c = 0; c < 6; c++) heat += text(259 + c * 88, 88, `М${c}`, 'text-anchor="middle"');
data.cohorts.forEach((cohort, i) => {
  const y = 106 + i * 47;
  heat += text(28, y + 27, cohort.m) + text(172, y + 27, cohort.size, 'text-anchor="middle"');
  for (let c = 0; c < 6; c++) {
    const value = cohort.ret[c], alpha = value == null ? 0 : 0.08 + value / 100 * 0.92;
    const rgb = [99, 102, 241].map(v => Math.round(255 * (1 - alpha) + v * alpha));
    heat += rect(218 + c * 88, y, 81, 40, `rgb(${rgb.join(',')})`, 'rx="5"');
    heat += text(259 + c * 88, y + 27, value == null ? '—' : `${value}%`, `text-anchor="middle" style="fill:${value >= 55 ? '#fff' : '#33344d'}"`);
  }
});
heat += text(28, 422, 'М0 — месяц первого вклада; «—» — период ещё не наблюдался.', 'class="small"');
write('cohorts', 'Удержание по месяцу первого вклада', 'Ячейка — доля когорты с вкладом в месяц N. Июльская когорта удерживается хуже майской.', heat, 478);

let tiers = '';
data.tiers.forEach((tier, i) => {
  const y = 83 + i * 55;
  tiers += text(28, y + 22, tier.l) + rect(286, y, 320, 30, '#f0f0f8', 'rx="5"');
  tiers += rect(286, y, 320 * tier.v / 104, 30, [purple, '#8587ee', '#adb0f1', gray, '#c8cbda'][i], 'rx="5"');
  tiers += text(626, y + 22, `${tier.v} · ${Math.round(100 * tier.v / 260)}%`, 'class="value"');
});
write('tiers', 'Структура аудитории за 28 дней', '260 учётных записей: 22 в ядре, 35 активных, 41 эпизодическая, 58 только заходили, 104 не появлялись.', tiers, 410);

let campaign = '';
[{ label: 'Волна рассылки', users: 168, returned: 71, contributed: 44 }, { label: 'Обычная неделя (−5 недель)', users: 96, returned: 58, contributed: 41 }].forEach((group, i) => {
  const y = 80 + i * 120, share = Math.round(100 * group.returned / group.users);
  campaign += text(28, y, group.label, 'class="value"') + text(750, y, `${share}%`, 'text-anchor="end" class="value"');
  campaign += rect(28, y + 15, 722, 18, '#f0f0f8', 'rx="5"') + rect(28, y + 15, 722 * share / 100, 18, i ? purple : orange, 'rx="5"');
  campaign += text(28, y + 60, `Вернулись на 2–4-й неделе: ${group.returned} из ${group.users}. Сделали вклад: ${group.contributed}.`);
});
write('campaign', 'Возвращаемость после рассылки', 'Вернулись 42% участников волны рассылки и 60% участников обычной недели.', campaign, 345);
console.log('Generated 15 static SVG illustrations.');
