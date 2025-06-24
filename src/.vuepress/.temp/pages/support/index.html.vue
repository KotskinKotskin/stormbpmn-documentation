<template><div><nav class="table-of-contents"><ul><li><router-link to="#🔄-доступные-способы-связи">🔄 Доступные способы связи</router-link></li><li><router-link to="#🎯-выбор-канала-связи">🎯 Выбор канала связи</router-link></li><li><router-link to="#📋-информация-для-диагностики">📋 Информация для диагностики</router-link><ul><li><router-link to="#🔍-обязательная-информация">🔍 Обязательная информация</router-link></li><li><router-link to="#📊-детальныи-чек-лист">📊 Детальный чек-лист</router-link></li></ul></li><li><router-link to="#🔧-команды-диагностики">🔧 Команды диагностики</router-link><ul><li><router-link to="#🐳-docker-команды">🐳 Docker команды</router-link></li></ul></li><li><router-link to="#⏱️-sla-соглашение-об-уровне-обслуживания">⏱️ SLA (Соглашение об уровне обслуживания)</router-link><ul><li><router-link to="#📊-гарантии-по-версиям">📊 Гарантии по версиям</router-link></li><li><router-link to="#🕐-рабочее-время">🕐 Рабочее время</router-link></li><li><router-link to="#🚨-критические-неисправности">🚨 Критические неисправности</router-link></li></ul></li><li><router-link to="#📚-самообслуживание">📚 Самообслуживание</router-link><ul><li><router-link to="#📖-база-знании">📖 База знаний</router-link></li><li><router-link to="#🔍-поиск-решении">🔍 Поиск решений</router-link></li></ul></li><li><router-link to="#📈-обратная-связь">📈 Обратная связь</router-link><ul><li><router-link to="#💡-предложения-улучшении">💡 Предложения улучшений</router-link></li></ul></li></ul></nav>
<h1 id="📧-каналы-поддержки" tabindex="-1"><a class="header-anchor" href="#📧-каналы-поддержки"><span>📧 Каналы поддержки</span></a></h1>
<h3 id="🔄-доступные-способы-связи" tabindex="-1"><a class="header-anchor" href="#🔄-доступные-способы-связи"><span>🔄 Доступные способы связи</span></a></h3>
<table>
<thead>
<tr>
<th>Канал</th>
<th>Описание</th>
<th>Доступность</th>
<th>Время ответа</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>📧 Email</strong></td>
<td>help@stormbpmn.com</td>
<td>Все версии</td>
<td>До 16 часов</td>
</tr>
<tr>
<td><strong>🤖 Telegram бот</strong></td>
<td><a href="https://t.me/stormbpmn_bot" target="_blank" rel="noopener noreferrer">@Stormbpmn_bot<ExternalLinkIcon/></a></td>
<td>Все версии</td>
<td>Быстрые вопросы</td>
</tr>
</tbody>
</table>
<h3 id="🎯-выбор-канала-связи" tabindex="-1"><a class="header-anchor" href="#🎯-выбор-канала-связи"><span>🎯 Выбор канала связи</span></a></h3>
<ul>
<li><strong>📧 Email</strong> - для детальных запросов с приложениями</li>
<li><strong>🤖 Telegram</strong> - для срочных вопросов</li>
</ul>
<hr>
<h2 id="📋-информация-для-диагностики" tabindex="-1"><a class="header-anchor" href="#📋-информация-для-диагностики"><span>📋 Информация для диагностики</span></a></h2>
<h3 id="🔍-обязательная-информация" tabindex="-1"><a class="header-anchor" href="#🔍-обязательная-информация"><span>🔍 Обязательная информация</span></a></h3>
<p>При обращении в поддержку <strong>обязательно</strong> укажите:</p>
<table>
<thead>
<tr>
<th>Тип проблемы</th>
<th>Необходимая информация</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>🌐 Пользовательская ошибка</strong></td>
<td>Версия браузера, HAR-архив, email пользователя, ссылка на диаграмму</td>
</tr>
<tr>
<td><strong>🖥️ Серверная ошибка</strong></td>
<td>Версия образа контейнера, логи контейнера, конфигурация системы</td>
</tr>
<tr>
<td><strong>🔧 Техническая проблема</strong></td>
<td>Описание сценария, шаги воспроизведения, ожидаемый результат</td>
</tr>
</tbody>
</table>
<h3 id="📊-детальныи-чек-лист" tabindex="-1"><a class="header-anchor" href="#📊-детальныи-чек-лист"><span>📊 Детальный чек-лист</span></a></h3>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> <strong>Версия браузера</strong> <em>(для UI проблем)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> <strong>Версия образа контейнера</strong> <em>(для Enterprise)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> <strong>HAR-архив</strong> <em>(записанный в момент ошибки)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-3" disabled="disabled"><label class="task-list-item-label" for="task-item-3"> <strong>Логи контейнера</strong> <em>(актуальные)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-4" disabled="disabled"><label class="task-list-item-label" for="task-item-4"> <strong>Сценарий воспроизведения</strong> <em>(пошагово)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-5" disabled="disabled"><label class="task-list-item-label" for="task-item-5"> <strong>Email пользователя</strong> <em>(при проблемах с аккаунтом)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-6" disabled="disabled"><label class="task-list-item-label" for="task-item-6"> <strong>Ссылка на диаграмму</strong> <em>(если проблема с конкретной диаграммой)</em></label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-7" disabled="disabled"><label class="task-list-item-label" for="task-item-7"> <strong>Конфигурация системы</strong> <em>(docker-compose.yml, ENV переменные)</em></label></li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">🎯 HAR-архив</p>
<p><a href="https://yandex.cloud/ru/docs/support/create-har" target="_blank" rel="noopener noreferrer">Инструкция по созданию HAR-архива<ExternalLinkIcon/></a> поможет нам быстро диагностировать проблемы в браузере.</p>
</div>
<hr>
<h2 id="🔧-команды-диагностики" tabindex="-1"><a class="header-anchor" href="#🔧-команды-диагностики"><span>🔧 Команды диагностики</span></a></h2>
<h3 id="🐳-docker-команды" tabindex="-1"><a class="header-anchor" href="#🐳-docker-команды"><span>🐳 Docker команды</span></a></h3>
<p><strong>Просмотр версии образа:</strong></p>
<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">--format</span> <span class="token string">'{{.ID}} {{.Image}} {{.Names}}'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>Сбор логов контейнера:</strong></p>
<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Просмотр логов</span>
<span class="token function">docker</span> logs <span class="token operator">&lt;</span>container_name_or_id<span class="token operator">></span>

<span class="token comment"># Сохранение в файл</span>
<span class="token function">docker</span> logs stormbpmn <span class="token operator">></span> logs_<span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d_%H%M%S<span class="token variable">)</span></span>.txt

<span class="token comment"># Последние 1000 строк</span>
<span class="token function">docker</span> logs <span class="token parameter variable">--tail</span> <span class="token number">1000</span> stormbpmn <span class="token operator">></span> recent_logs.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h2 id="⏱️-sla-соглашение-об-уровне-обслуживания" tabindex="-1"><a class="header-anchor" href="#⏱️-sla-соглашение-об-уровне-обслуживания"><span>⏱️ SLA (Соглашение об уровне обслуживания)</span></a></h2>
<h3 id="📊-гарантии-по-версиям" tabindex="-1"><a class="header-anchor" href="#📊-гарантии-по-версиям"><span>📊 Гарантии по версиям</span></a></h3>
<table>
<thead>
<tr>
<th>Показатель</th>
<th>Team (Облако)</th>
<th>Enterprise</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>⏰ Время реагирования</strong></td>
<td>5 рабочих дней</td>
<td>16 часов</td>
</tr>
<tr>
<td><strong>🚨 Критические неисправности</strong></td>
<td>30 рабочих дней</td>
<td>15 рабочих дней</td>
</tr>
<tr>
<td><strong>📞 Приоритет поддержки</strong></td>
<td>Обычный</td>
<td>Высокий</td>
</tr>
<tr>
<td><strong>🔧 Техническое консультирование</strong></td>
<td>Базовое</td>
<td>Расширенное</td>
</tr>
</tbody>
</table>
<h3 id="🕐-рабочее-время" tabindex="-1"><a class="header-anchor" href="#🕐-рабочее-время"><span>🕐 Рабочее время</span></a></h3>
<ul>
<li><strong>Часы работы:</strong> 11:00 - 20:00 МСК (GMT+3)</li>
<li><strong>Рабочие дни:</strong> Понедельник - Пятница</li>
<li><strong>Выходные:</strong> Согласно ТК РФ</li>
</ul>
<h3 id="🚨-критические-неисправности" tabindex="-1"><a class="header-anchor" href="#🚨-критические-неисправности"><span>🚨 Критические неисправности</span></a></h3>
<p><strong>Критической считается неисправность, при которой:</strong></p>
<ul>
<li>❌ Невозможен вход в систему для 100% пользователей</li>
<li>❌ Полная недоступность сервиса</li>
</ul>
<hr>
<h2 id="📚-самообслуживание" tabindex="-1"><a class="header-anchor" href="#📚-самообслуживание"><span>📚 Самообслуживание</span></a></h2>
<h3 id="📖-база-знании" tabindex="-1"><a class="header-anchor" href="#📖-база-знании"><span>📖 База знаний</span></a></h3>
<ul>
<li><strong><RouteLink to="/configure/">⚙️ Конфигурация</RouteLink></strong> - настройка системы</li>
<li><strong><RouteLink to="/operation/">🔧 Обслуживание</RouteLink></strong> - администрирование</li>
<li><strong><RouteLink to="/configure/SECURE.html">🔐 Безопасность</RouteLink></strong> - настройки безопасности</li>
<li><strong><RouteLink to="/install/FULL_INSTALL.html">🏭 Production</RouteLink></strong> - развертывание</li>
</ul>
<h3 id="🔍-поиск-решении" tabindex="-1"><a class="header-anchor" href="#🔍-поиск-решении"><span>🔍 Поиск решений</span></a></h3>
<ol>
<li><strong>Проверьте документацию</strong> - большинство вопросов уже освещены</li>
<li><strong>Изучите логи</strong> - часто содержат подсказки о проблеме</li>
<li><strong>Проверьте конфигурацию</strong> - убедитесь в корректности настроек</li>
<li><strong>Обратитесь в поддержку</strong> - если самостоятельно не решается</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">💬 Эффективное обращение</p>
<p>Чем подробнее вы опишете проблему и приложите диагностическую информацию, тем быстрее мы сможем помочь!</p>
</div>
<hr>
<h2 id="📈-обратная-связь" tabindex="-1"><a class="header-anchor" href="#📈-обратная-связь"><span>📈 Обратная связь</span></a></h2>
<h3 id="💡-предложения-улучшении" tabindex="-1"><a class="header-anchor" href="#💡-предложения-улучшении"><span>💡 Предложения улучшений</span></a></h3>
<p>Ваши идеи помогают нам становиться лучше:</p>
<ul>
<li><strong>Новые функции</strong> - что хотели бы видеть в продукте (<a href="https://roadmap.stormbpmn.com" target="_blank" rel="noopener noreferrer">roadmap.stormbpmn.com<ExternalLinkIcon/></a>)</li>
<li><strong>Улучшения UX</strong> - как сделать интерфейс удобнее</li>
<li><strong>Документация</strong> - какие разделы нужно дополнить</li>
<li><strong>Поддержка</strong> - как улучшить сервис</li>
</ul>
</div></template>


