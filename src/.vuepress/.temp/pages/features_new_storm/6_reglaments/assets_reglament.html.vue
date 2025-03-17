<template><div><h1 id="регламент-элемента-архитектуры" tabindex="-1"><a class="header-anchor" href="#регламент-элемента-архитектуры"><span>Регламент элемента архитектуры</span></a></h1>
<p>В системе есть возможность выгрузить регламент элемента архитектуры в виде текстового регламента - документа MS Word ( .DOCX ).</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Выгрузка работает на тарифах TEAM или выше.</p>
</div>
<p>В регламент элемента архитектуры можно выгрузить</p>
<ul>
<li>Внешний ID</li>
<li>Ссылка на внешнюю вики-систему с информацией об ЭА</li>
<li>Описание элемента архитектуры</li>
<li>Реестр процессов в которых его используют</li>
<li>Подробный перечень задач с этим ЭА и веб-ссылками на эти задачи.</li>
</ul>
<h2 id="порядок-выгрузки" tabindex="-1"><a class="header-anchor" href="#порядок-выгрузки"><span>Порядок выгрузки</span></a></h2>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
</div>
<h2 id="шаблон-регламента-элемента-архитектуры" tabindex="-1"><a class="header-anchor" href="#шаблон-регламента-элемента-архитектуры"><span>Шаблон регламента элемента архитектуры</span></a></h2>
<p>Для выгрузки регламента используется шаблон (.docx-файла ), загружаемый в системы</p>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<div class="hint-container info">
<p class="hint-container-title">Инфо</p>
</div>
</div>
<p>:::</p>
<h2 id="создание-шаблона-регламента-элемента-архитектуры" tabindex="-1"><a class="header-anchor" href="#создание-шаблона-регламента-элемента-архитектуры"><span>Создание шаблона регламента элемента архитектуры</span></a></h2>
<p>Создание шаблона заключается в создании .docx-файла и расстановки в нем тегов.</p>
<p>Шаблоны поддерживают сложные условия и программирование, вот <a href="https://deepoove-com.translate.goog/poi-tl/?_x_tr_sl=uk&amp;_x_tr_tl=ru&amp;_x_tr_hl=ru&amp;_x_tr_pto=wapp#_spring%E8%A1%A8%E8%BE%BE%E5%BC%8F" target="_blank" rel="noopener noreferrer">детальная инструкция<ExternalLinkIcon/></a>.</p>
<p>Пример фильтрации массива по типу:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{{?assetList.?[#this.assetType.toString() == 'SYSTEM']}}
{{?assetType.toString() == 'SYSTEM'}}{{assetLinkReg}}{{/}}
{{/assetList.?[#this.assetType.toString() == 'SYSTEM']}}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="список-тегов-для-регламента-элемента-архитектуры" tabindex="-1"><a class="header-anchor" href="#список-тегов-для-регламента-элемента-архитектуры"><span>Список тегов для регламента элемента архитектуры</span></a></h2>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre v-pre class="language-yaml"><code>
<span class="token punctuation">{</span><span class="token punctuation">{</span>assets.name<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> имя "F"

<span class="token punctuation">{</span><span class="token punctuation">{</span>assets.updatedOn<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> дата обновления

<span class="token punctuation">{</span><span class="token punctuation">{</span>assets.updateBy<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> почта автора обновления

<span class="token punctuation">{</span><span class="token punctuation">{</span>onlineVersionUrl<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> кликабельная ссылка на карточку

<span class="token punctuation">{</span><span class="token punctuation">{</span>+assets.description<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> описание "F"

<span class="token punctuation">{</span><span class="token punctuation">{</span>diagramEdgesCount<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица использования ЭА в процессах
 <span class="token punctuation">[</span>diagramName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название процесса
 <span class="token punctuation">[</span>count<span class="token punctuation">]</span> <span class="token punctuation">-</span> количество задач в процессе с этим ЭА

<span class="token punctuation">{</span><span class="token punctuation">{</span>assets.diagramEdges<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>массив задач с ЭА
  <span class="token punctuation">{</span><span class="token punctuation">{</span>elementName<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> название задачи
  (<span class="token punctuation">{</span><span class="token punctuation">{</span>diagramName<span class="token punctuation">}</span><span class="token punctuation">}</span>) <span class="token punctuation">-</span> название процесса
  <span class="token punctuation">{</span><span class="token punctuation">{</span>diagramStatus<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> статус процесса
  <span class="token punctuation">{</span><span class="token punctuation">{</span>diagramElementId<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>кликабельная ссылка на задачу в шторме
  <span class="token punctuation">{</span><span class="token punctuation">{</span>assigneeList<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> массив ролей задачи (атрибуты в массиве аналогично из раздела про процесс)

<span class="token punctuation">{</span><span class="token punctuation">{</span>TOC<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> содержимое
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
<h2 id="загрузка-шаблона-в-систему" tabindex="-1"><a class="header-anchor" href="#загрузка-шаблона-в-систему"><span>Загрузка шаблона в систему</span></a></h2>
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


