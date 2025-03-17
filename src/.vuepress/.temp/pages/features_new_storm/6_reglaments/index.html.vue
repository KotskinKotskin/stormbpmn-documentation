<template><div><h1 id="new-шторм-регламенты" tabindex="-1"><a class="header-anchor" href="#new-шторм-регламенты"><span>New Шторм. Регламенты</span></a></h1>
<h2 id="виды-регламентов" tabindex="-1"><a class="header-anchor" href="#виды-регламентов"><span>Виды регламентов</span></a></h2>
<p>Система позволяет выгружать три типа регламентов:</p>
<ol>
<li>процессов,</li>
<li>ролей</li>
<li>элементов архитектуры (ЭА)</li>
</ol>
<p>Регламент представляет собой документ MS Word ( файл формата .DOCX ).</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Выгрузка работает на тарифах TEAM или выше.</p>
</div>
<h2 id="шаблоны-регламентов" tabindex="-1"><a class="header-anchor" href="#шаблоны-регламентов"><span>Шаблоны регламентов</span></a></h2>
<p>Для выгрузки регламента используется шаблон (.docx-файла ), загружаемый в систему</p>
<p>Создание шаблона заключается в создании .docx-файла и расстановки в нем тегов.</p>
<p>Шаблоны поддерживают сложные условия и программирование, вот <a href="https://deepoove-com.translate.goog/poi-tl/?_x_tr_sl=uk&amp;_x_tr_tl=ru&amp;_x_tr_hl=ru&amp;_x_tr_pto=wapp#_spring%E8%A1%A8%E8%BE%BE%E5%BC%8F" target="_blank" rel="noopener noreferrer">детальная инструкция<ExternalLinkIcon/></a>.</p>
<p>Пример фильтрации массива по типу:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{{?assetList.?[#this.assetType.toString() == 'SYSTEM']}}
{{?assetType.toString() == 'SYSTEM'}}{{assetLinkReg}}{{/}}
{{/assetList.?[#this.assetType.toString() == 'SYSTEM']}}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="список-тегов-для-регламента" tabindex="-1"><a class="header-anchor" href="#список-тегов-для-регламента"><span>Список тегов для регламента</span></a></h2>
<p>Для каждого типа регламента используются свои теги:</p>
<ol>
<li><RouteLink to="/features_new_storm/6_reglaments/process_reglament.html#%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D1%82%D0%B5%D0%B3%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%D0%B0-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%B0">для регламента процесса</RouteLink></li>
<li><RouteLink to="/features_new_storm/6_reglaments/assignee_reglament.html#%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D1%82%D0%B5%D0%B3%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%D0%B0-%D1%80%D0%BE%D0%BB%D0%B8">для регламента роли</RouteLink></li>
<li><RouteLink to="/features_new_storm/6_reglaments/assets_reglament.html#%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA-%D1%82%D0%B5%D0%B3%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%80%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82%D0%B0-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%B0-%D0%B0%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D1%8B">для регламента элемента архитектуры</RouteLink></li>
</ol>
<h2 id="загрузка-шаблона-в-систему" tabindex="-1"><a class="header-anchor" href="#загрузка-шаблона-в-систему"><span>Загрузка шаблона в систему</span></a></h2>
<p><strong>Загрузить</strong> шаблон возможно</p>
<ul>
<li>в меню <a href="#%D0%BF%D0%BE%D1%80%D1%8F%D0%B4%D0%BE%D0%BA-%D0%B2%D1%8B%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B8">выгрузки регламента</a></li>
<li>в разделе <a href="https://stormbpmn.com/app/team/regulation" target="_blank" rel="noopener noreferrer">Команда<ExternalLinkIcon/></a> на вкладке Шаблоны регламентов</li>
</ul>
<p><img src="@source/features_new_storm/6_reglaments/template-reglament_import.png" alt="image"></p>
<h2 id="удаление-шаблона" tabindex="-1"><a class="header-anchor" href="#удаление-шаблона"><span>Удаление шаблона</span></a></h2>
<p>Удалить шаблон можно в том же разделе <a href="https://stormbpmn.com/app/team/regulation" target="_blank" rel="noopener noreferrer">Команда<ExternalLinkIcon/></a> на вкладке Шаблоны регламентов.
<img src="@source/features_new_storm/6_reglaments/template-reglament_delete.png" alt="image"></p>
</div></template>


