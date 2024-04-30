<template><div><h1 id="функции-системы" tabindex="-1"><a class="header-anchor" href="#функции-системы"><span>Функции системы</span></a></h1>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Раздел в разработке</p>
</div>
<p>На этой странице дано подробное описание всех функций системы. Страница большая, функций много, крепитесь 😃</p>
<div class="hint-container tip">
<p class="hint-container-title">Подсказка</p>
<p>В <RouteLink to="/real-life-scenarios/">разделе</RouteLink> приведеные реальные сценарии использования системы, возможно начать оттуда будет лучшей идей.</p>
</div>
<nav class="table-of-contents"><ul><li><router-link to="#регламенты">Регламенты</router-link></li><li><router-link to="#комментирование">Комментирование</router-link></li><li><router-link to="#графы">Графы</router-link></li><li><router-link to="#элементы-архитектуры">Элементы архитектуры</router-link><ul><li><router-link to="#загрузка-из-csv">Загрузка из CSV</router-link></li></ul></li><li><router-link to="#поиск">Поиск</router-link></li><li><router-link to="#теги">Теги</router-link></li><li><router-link to="#папки">Папки</router-link></li><li><router-link to="#роли">Роли</router-link><ul><li><router-link to="#создание-ролеи">Создание ролей</router-link></li><li><router-link to="#редактирование-ролеи">Редактирование ролей</router-link></li><li><router-link to="#удаление-ролеи">Удаление ролей</router-link></li></ul></li></ul></nav>
<h1 id="домашняя-страница" tabindex="-1"><a class="header-anchor" href="#домашняя-страница"><span>Домашняя страница</span></a></h1>
<h2 id="регламенты" tabindex="-1"><a class="header-anchor" href="#регламенты"><span>Регламенты</span></a></h2>
<h2 id="комментирование" tabindex="-1"><a class="header-anchor" href="#комментирование"><span>Комментирование</span></a></h2>
<h2 id="графы" tabindex="-1"><a class="header-anchor" href="#графы"><span>Графы</span></a></h2>
<h2 id="элементы-архитектуры" tabindex="-1"><a class="header-anchor" href="#элементы-архитектуры"><span>Элементы архитектуры</span></a></h2>
<h3 id="загрузка-из-csv" tabindex="-1"><a class="header-anchor" href="#загрузка-из-csv"><span>Загрузка из CSV</span></a></h3>
<h2 id="поиск" tabindex="-1"><a class="header-anchor" href="#поиск"><span>Поиск</span></a></h2>
<h2 id="теги" tabindex="-1"><a class="header-anchor" href="#теги"><span>Теги</span></a></h2>
<h2 id="папки" tabindex="-1"><a class="header-anchor" href="#папки"><span>Папки</span></a></h2>
<h2 id="роли" tabindex="-1"><a class="header-anchor" href="#роли"><span>Роли</span></a></h2>
<p>Роли это отличный инструмент для указания исполнителей задач. Под ролью понимается исполнитель конкретной задачи в процессе или процессах (т.к. Роли - это справочник, который можно переиспользовать). Роли это правильная и хорошая альтернатива дорожкам.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_2W10c0YzcI?si=Br3u2STg2zdWwIQ8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
<h3 id="создание-ролеи" tabindex="-1"><a class="header-anchor" href="#создание-ролеи"><span>Создание ролей</span></a></h3>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Создавать роли может только <strong>администратор команды</strong>. Роли - это часть платной подписки TEAM или Enterprise. Без подписки использовать их не получится.</p>
</div>
<p>С интерфейса процесса в <a href="#%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%BD%D0%BE%D0%B5-%D0%BC%D0%B5%D0%BD%D1%8E">контекстом меню</a>:</p>
<p><img src="@source/features/create-assignee.png" alt="image"></p>
<p>С интерфейса процесса в <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%B0">меню подробностей</a>:</p>
<p><img src="@source/features/create-assignee-2.png" alt="image"></p>
<p>C отдельного представления</p>
<p>По <a href="https://stormbpmn.com/app/team/assignees/" target="_blank" rel="noopener noreferrer">ссылке<ExternalLinkIcon/></a>:<br>
<img src="@source/features/create-assignee-3.png" alt="image">
C помощью загрузки из .csv:</p>
<p>По <a href="https://stormbpmn.com/app/team" target="_blank" rel="noopener noreferrer">ссылке<ExternalLinkIcon/></a>:<br>
<img src="@source/features/create-assignee-4.png" alt="image"></p>
<h3 id="редактирование-ролеи" tabindex="-1"><a class="header-anchor" href="#редактирование-ролеи"><span>Редактирование ролей</span></a></h3>
<p>Редактирование ролей так же доступно в контекстом меню или с отдельного представления по <a href="https://stormbpmn.com/app/team/assignees/" target="_blank" rel="noopener noreferrer">ссылке<ExternalLinkIcon/></a>.</p>
<h3 id="удаление-ролеи" tabindex="-1"><a class="header-anchor" href="#удаление-ролеи"><span>Удаление ролей</span></a></h3>
<p>Удалять роли можно только с отдельного представления по <a href="https://stormbpmn.com/app/team/assignees/" target="_blank" rel="noopener noreferrer">ссылке<ExternalLinkIcon/></a>.</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Удалить роли не получится, пока они привязаны к задачам на процессах. Отвяжите их перед удалением.</p>
</div>
<p>Как мне удалить роли</p>
</div></template>


