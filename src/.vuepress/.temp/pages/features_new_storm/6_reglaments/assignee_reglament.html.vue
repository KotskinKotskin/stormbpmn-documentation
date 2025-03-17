<template><div><h1 id="регламент-роли" tabindex="-1"><a class="header-anchor" href="#регламент-роли"><span>Регламент роли</span></a></h1>
<p>В системе есть возможность выгрузить ркгламент роли в виде текстового регламента - документа MS Word ( .DOCX ).</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Выгрузка работает на тарифах TEAM или выше.</p>
</div>
<p>В регламент роли можно выгрузить</p>
<ul>
<li>Описание роли</li>
<li>Реестр процессов в которых участвует эта роль</li>
<li>Подробный перечень задач этих процессов, с указанием подробностей и веб-ссылками на эти задачи</li>
<li>Ведомость должностей, выполняющих роль</li>
<li>Список работников по этим должностям</li>
</ul>
<h2 id="порядок-выгрузки" tabindex="-1"><a class="header-anchor" href="#порядок-выгрузки"><span>Порядок выгрузки</span></a></h2>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
</div>
<h2 id="шаблон-регламента-роли" tabindex="-1"><a class="header-anchor" href="#шаблон-регламента-роли"><span>Шаблон регламента роли</span></a></h2>
<p>Для выгрузки регламента используется шаблон (.docx-файла ), загружаемый в системы</p>
<div class="hint-container info">
<p class="hint-container-title">Инфо</p>
<p>Воспользуйтесь <a href="https://docs.google.com/document/d/17WWmGZGagXA6r4aFL59sCD4bCBvUaWXamCFAGf3iUMY/edit?usp=sharing" target="_blank" rel="noopener noreferrer">базовым шаблоном<ExternalLinkIcon/></a> для быстрого старта.</p>
<p>Или <a href="https://disk.yandex.ru/i/XnBKp4pG4T684g" target="_blank" rel="noopener noreferrer">расширенным шаблоном<ExternalLinkIcon/></a>.
И <a href="https://disk.yandex.ru/i/7EiD_Pmn_-FYUg" target="_blank" rel="noopener noreferrer">пример выгрузки регламента роли по этому шаблону<ExternalLinkIcon/></a></p>
</div>
<h2 id="создание-шаблона-регламента-роли" tabindex="-1"><a class="header-anchor" href="#создание-шаблона-регламента-роли"><span>Создание шаблона регламента роли</span></a></h2>
<p>Создание шаблона заключается в создании .docx-файла и расстановки в нем тегов.</p>
<p>Шаблоны поддерживают сложные условия и программирование, вот <a href="https://deepoove-com.translate.goog/poi-tl/?_x_tr_sl=uk&amp;_x_tr_tl=ru&amp;_x_tr_hl=ru&amp;_x_tr_pto=wapp#_spring%E8%A1%A8%E8%BE%BE%E5%BC%8F" target="_blank" rel="noopener noreferrer">детальная инструкция<ExternalLinkIcon/></a>.</p>
<p>Пример фильтрации массива по типу:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{{?assetList.?[#this.assetType.toString() == 'SYSTEM']}}
{{?assetType.toString() == 'SYSTEM'}}{{assetLinkReg}}{{/}}
{{/assetList.?[#this.assetType.toString() == 'SYSTEM']}}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="список-тегов-для-регламента-роли" tabindex="-1"><a class="header-anchor" href="#список-тегов-для-регламента-роли"><span>Список тегов для регламента роли</span></a></h2>
<div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">{</span><span class="token punctuation">{</span>assignee.name<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> имя роли

<span class="token punctuation">{</span><span class="token punctuation">{</span>assignee.updatedOn<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> дата обновления

<span class="token punctuation">{</span><span class="token punctuation">{</span>assignee.updateBy<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> почта автора обновления

<span class="token punctuation">{</span><span class="token punctuation">{</span>onlineVersionUrl<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> кликабельная ссылка на карточку

<span class="token punctuation">{</span><span class="token punctuation">{</span>+assignee.description<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> описание роли

<span class="token punctuation">{</span><span class="token punctuation">{</span>diagramEdgesCount<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица участия роли в процессах
 <span class="token punctuation">[</span>diagramName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название процесса
 <span class="token punctuation">[</span>count<span class="token punctuation">]</span> <span class="token punctuation">-</span> количество задач в процессе на роли

<span class="token punctuation">{</span><span class="token punctuation">{</span>assignee.diagramEdges<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>массив задач роли
  <span class="token punctuation">{</span><span class="token punctuation">{</span>elementName<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> название задачи
  (<span class="token punctuation">{</span><span class="token punctuation">{</span>diagramName<span class="token punctuation">}</span><span class="token punctuation">}</span>) <span class="token punctuation">-</span> название процесса
  <span class="token punctuation">{</span><span class="token punctuation">{</span>diagramStatus<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> статус процесса
  <span class="token punctuation">{</span><span class="token punctuation">{</span>diagramElementId<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>кликабельная ссылка на задачу в шторме
  <span class="token punctuation">{</span><span class="token punctuation">{</span>assetList<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> массив элементов архитектуры задачи (атрибуты в массиве аналогично из раздела про процесс)

<span class="token punctuation">{</span><span class="token punctuation">{</span>assigneeDetails<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> массив должностей<span class="token punctuation">,</span> назначенных на роль
 <span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token punctuation">-</span> название
 <span class="token punctuation">[</span>+description<span class="token punctuation">]</span> <span class="token punctuation">-</span> описание
 <span class="token punctuation">[</span>head.name<span class="token punctuation">]</span> <span class="token punctuation">-</span> название руководителя текущей должности
 <span class="token punctuation">[</span>children<span class="token punctuation">]</span> <span class="token punctuation">-</span> массив подчиненных должностей текущей должности

<span class="token punctuation">{</span><span class="token punctuation">{</span>personsByAssignee<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> массив сотрудников<span class="token punctuation">,</span> назначенных на должности<span class="token punctuation">,</span> назначенные на роли
 <span class="token punctuation">[</span>firstName<span class="token punctuation">]</span>
 <span class="token punctuation">[</span>lastName<span class="token punctuation">]</span>
 <span class="token punctuation">[</span>patronymic<span class="token punctuation">]</span>
 <span class="token punctuation">[</span>phone<span class="token punctuation">]</span>
 <span class="token punctuation">[</span>email<span class="token punctuation">]</span>

<span class="token punctuation">{</span><span class="token punctuation">{</span>TOC<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> содержимое
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="загрузка-шаблона-в-систему" tabindex="-1"><a class="header-anchor" href="#загрузка-шаблона-в-систему"><span>Загрузка шаблона в систему</span></a></h2>
<p><strong>Загрузить</strong> шаблон возможно</p>
<ul>
<li>в меню <a href="#%D0%BF%D0%BE%D1%80%D1%8F%D0%B4%D0%BE%D0%BA-%D0%B2%D1%8B%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8">выгрузки регламента</a></li>
<li>в разделе <a href="https://stormbpmn.com/app/team/regulation" target="_blank" rel="noopener noreferrer">Команда<ExternalLinkIcon/></a> на вкладке Шаблоны регламентов</li>
</ul>
<p><img src="@source/features_new_storm/6_reglaments/template-reglament_import.png" alt="image"></p>
<h2 id="удаление-шаблона" tabindex="-1"><a class="header-anchor" href="#удаление-шаблона"><span>Удаление шаблона</span></a></h2>
<p>Удалить шаблон можно в том же разделе <a href="https://stormbpmn.com/app/team/regulation" target="_blank" rel="noopener noreferrer">Команда<ExternalLinkIcon/></a> на вкладке Шаблоны регламентов.</p>
<p><img src="@source/features_new_storm/6_reglaments/template-reglament_delete.png" alt="image"></p>
</div></template>


