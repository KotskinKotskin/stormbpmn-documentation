<template><div><h1 id="регламент-процесса" tabindex="-1"><a class="header-anchor" href="#регламент-процесса"><span>Регламент процесса</span></a></h1>
<p>Диаграмму процесса можно выгрузить в виде текстового регламента - документа MS Word ( .DOCX ).</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Выгрузка работает на тарифах TEAM или выше.</p>
</div>
<p>В регламент процесса можно выгрузить</p>
<ul>
<li>Описание процесса</li>
<li>История версий</li>
<li>Схема бизнес-процесса</li>
<li>Участники  процесса</li>
<li>Исполнители процесса</li>
<li>Описание всех шагов процесса ( с ролями и элементами архитектуры)</li>
<li>Связи с другими процессами</li>
<li>Элементы архитектуры</li>
<li>Согласование</li>
</ul>
<h2 id="порядок-выгрузки" tabindex="-1"><a class="header-anchor" href="#порядок-выгрузки"><span>Порядок выгрузки</span></a></h2>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Для выгрузки регламента нужно хотя бы один раз сохранить версию, тогда все будет работать.</p>
</div>
<ol>
<li>нажмите в верхнем меню кнопку <RouteLink to="/features_new_storm/1_bpmn-editor/#%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C">Скачать</RouteLink></li>
<li>переключитесь на вкладку Регламенты</li>
</ol>
<p>и далее используйте желаемые возможности:</p>
<ol start="3">
<li>загрузка своего шаблона регламента;</li>
<li>выбрать шаблон из списка загруженных;</li>
<li>выгрузить в шаги процесса только задачи (убрать события, развилки и другие объекты диаграммы процесса)</li>
<li>скачать регламент процесса по базовому шаблону;</li>
<li>скачать регламент по своему выбранному шаблону
<img src="@source/features_new_storm/6_reglaments/reglament_download_2.png" alt="image"></li>
</ol>
<h2 id="шаблон-регламента-процесса" tabindex="-1"><a class="header-anchor" href="#шаблон-регламента-процесса"><span>Шаблон регламента процесса</span></a></h2>
<p>Для выгрузки регламента используется шаблон (.docx-файла ), загружаемый в системы</p>
<div class="hint-container info">
<p class="hint-container-title">Инфо</p>
<p>Воспользуйтесь <a href="https://docs.google.com/document/d/1e9GZfWQDymoFcsF95yOTZdqkz4hXflzI2QyMUpqaFmY/edit#heading=h.bnj92bmrrns8" target="_blank" rel="noopener noreferrer">базовым шаблоном<ExternalLinkIcon/></a> для быстрого старта.</p>
<p>Для расширения возможностей выгрузки в регламент используйте:</p>
<ul>
<li><a href="https://disk.yandex.ru/i/SvPWDpMdyEpvZQ" target="_blank" rel="noopener noreferrer">Расширенный шаблон регламента<ExternalLinkIcon/></a>. И <a href="https://disk.yandex.ru/i/kv62j46wSRE_Nw" target="_blank" rel="noopener noreferrer">пример выгрузки регламента по этому шаблону<ExternalLinkIcon/></a> с раскрытием источников информации.</li>
<li><a href="https://disk.yandex.ru/i/lSHwv4s1ZzqJ9A" target="_blank" rel="noopener noreferrer">4 разных варианта описания шагов процесса<ExternalLinkIcon/></a></li>
</ul>
</div>
<h2 id="создание-шаблона-регламента-процесса" tabindex="-1"><a class="header-anchor" href="#создание-шаблона-регламента-процесса"><span>Создание шаблона регламента процесса</span></a></h2>
<p>Создание шаблона заключается в создании .docx-файла и расстановки в нем тегов.</p>
<p>Шаблоны поддерживают сложные условия и программирование, вот <a href="https://deepoove-com.translate.goog/poi-tl/?_x_tr_sl=uk&amp;_x_tr_tl=ru&amp;_x_tr_hl=ru&amp;_x_tr_pto=wapp#_spring%E8%A1%A8%E8%BE%BE%E5%BC%8F" target="_blank" rel="noopener noreferrer">детальная инструкция<ExternalLinkIcon/></a>.</p>
<p>Пример фильтрации массива по типу:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{{?assetList.?[#this.assetType.toString() == 'SYSTEM']}}
{{?assetType.toString() == 'SYSTEM'}}{{assetLinkReg}}{{/}}
{{/assetList.?[#this.assetType.toString() == 'SYSTEM']}}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="список-тегов-для-регламента-процесса" tabindex="-1"><a class="header-anchor" href="#список-тегов-для-регламента-процесса"><span>Список тегов для регламента процесса</span></a></h2>
<div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">{</span><span class="token punctuation">{</span>TOC<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> содержимое<span class="token punctuation">,</span> будет работать только при открытии файла на Windows в Word

<span class="token punctuation">{</span><span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> Имя процесса

<span class="token punctuation">{</span><span class="token punctuation">{</span>versionNumber<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> номер последней версии

<span class="token punctuation">{</span><span class="token punctuation">{</span>versionDate<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> дата последней версии

<span class="token punctuation">{</span><span class="token punctuation">{</span>authorName<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> ФИО автора (из профиля автора)

<span class="token punctuation">{</span><span class="token punctuation">{</span>authorEmail<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>email автора

<span class="token punctuation">{</span><span class="token punctuation">{</span>onlineVersionUrl<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> ссылка на версию процесса в онлайне

<span class="token punctuation">{</span><span class="token punctuation">{</span>versionHistoryTable<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span>таблица версий
 <span class="token punctuation">[</span>versionNumber<span class="token punctuation">]</span> <span class="token punctuation">-</span> номер версии
 <span class="token punctuation">[</span>createdOnReport<span class="token punctuation">]</span> <span class="token punctuation">-</span> дата создания версии
 <span class="token punctuation">[</span>authorReport<span class="token punctuation">]</span> <span class="token punctuation">-</span> автор версии
 <span class="token punctuation">[</span>comment<span class="token punctuation">]</span> <span class="token punctuation">-</span> комментарий к версии

<span class="token punctuation">{</span><span class="token punctuation">{</span>participantsTable<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>таблица участников
 <span class="token punctuation">[</span>typeStr<span class="token punctuation">]</span>  <span class="token punctuation">-</span> тип участника
 <span class="token punctuation">[</span>person.email<span class="token punctuation">]</span><span class="token punctuation">-</span> почта
 <span class="token punctuation">[</span>person.firstName<span class="token punctuation">]</span><span class="token punctuation">-</span> имя
 <span class="token punctuation">[</span>person.lastName<span class="token punctuation">]</span><span class="token punctuation">-</span> фамилия
 <span class="token punctuation">[</span>person.patronymic<span class="token punctuation">]</span><span class="token punctuation">-</span> отчество
 <span class="token punctuation">[</span>person.phone<span class="token punctuation">]</span><span class="token punctuation">-</span> телефон

<span class="token punctuation">{</span><span class="token punctuation">{</span>processDescription<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>описание процесса

<span class="token punctuation">{</span><span class="token punctuation">{</span>@processDiagram<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>картинка схемы (требует ручного изменения под масштаб страницы после выгрузки)

<span class="token punctuation">{</span><span class="token punctuation">{</span>assigneesListTable<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица исполнителей процессов
 <span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token punctuation">-</span> название исполнителя
 <span class="token punctuation">[</span>type<span class="token punctuation">]</span> <span class="token punctuation">-</span> тип исполнителя 
 <span class="token punctuation">[</span>count<span class="token punctuation">]</span> <span class="token punctuation">-</span> количество задач


<span class="token key atrule">Массив описания задач</span><span class="token punctuation">:</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token punctuation">?</span>assigneesListDescription<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> начало массива
  <span class="token key atrule">Внутри него</span><span class="token punctuation">:</span>
   <span class="token punctuation">{</span><span class="token punctuation">{</span>activityName<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> название элемента диаграммы (задачи)
   <span class="token punctuation">{</span><span class="token punctuation">{</span>elementType<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> тип элемента (событие<span class="token punctuation">,</span> шлюз<span class="token punctuation">,</span> задача)
   <span class="token punctuation">{</span><span class="token punctuation">{</span>durationString <span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> строка длительности задачи
   <span class="token punctuation">{</span><span class="token punctuation">{</span>activityPoolName<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> пул задачи
   <span class="token punctuation">{</span><span class="token punctuation">{</span>assigneeName<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> название исполнителя
   <span class="token punctuation">{</span><span class="token punctuation">{</span>+activityDescription<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> описание действия
   <span class="token punctuation">{</span><span class="token punctuation">{</span>elementList<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span>элементы архитектуры внутри задачи (строкой) 
   <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token punctuation">?</span>assetList<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> элементы архитектуры<span class="token punctuation">,</span> связанные с задачей<span class="token punctuation">,</span> массивом (начало)
     <span class="token punctuation">{</span><span class="token punctuation">{</span>assetType<span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">-</span>тип элемента архитектуры
     <span class="token punctuation">{</span><span class="token punctuation">{</span>assetTypeStr<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> тип элемента архитектуры на русском
     <span class="token punctuation">{</span><span class="token punctuation">{</span>assetName<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> название элемента архитектуры
     <span class="token punctuation">{</span><span class="token punctuation">{</span>+assetDescription<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> описание элемента архитектуры
     <span class="token punctuation">{</span><span class="token punctuation">{</span>assetLink<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span>внешняя ссылка
     <span class="token punctuation">{</span><span class="token punctuation">{</span>assetLinkReg<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> красивая кликабельная ссылка<span class="token punctuation">,</span> где под именем ссылка
   <span class="token punctuation">{</span><span class="token punctuation">{</span>/assetList<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> окончание массива элементы архитектуры<span class="token punctuation">,</span> связанные с задачей
<span class="token punctuation">{</span><span class="token punctuation">{</span>/assigneesListDescription<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> окончание массива описания задач

<span class="token key atrule">Массив пулов с описанием задач в каждом из них</span><span class="token punctuation">:</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token punctuation">?</span>assigneesListDescriptionByPool<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> начало массива пулов
<span class="token punctuation">{</span><span class="token punctuation">{</span>first<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> название пула
  <span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token punctuation">?</span>second<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> начало массива задач в пуле
Внутри него те же хэштеги описания задач<span class="token punctuation">,</span> <span class="token key atrule">что описаны выше</span><span class="token punctuation">:</span>
     <span class="token punctuation">{</span><span class="token punctuation">{</span>activityName<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> название элемента диаграммы
      <span class="token punctuation">...</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span>/second<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> окончание массива задач в пуле
<span class="token punctuation">{</span><span class="token punctuation">{</span>/assigneesListDescriptionByPool<span class="token punctuation">}</span><span class="token punctuation">}</span>  <span class="token punctuation">-</span> окончание массива пулов


<span class="token punctuation">{</span><span class="token punctuation">{</span>processCollaboration<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица связей процесса
 <span class="token punctuation">[</span>type<span class="token punctuation">]</span> <span class="token punctuation">-</span> тип  связи (мессадж<span class="token punctuation">,</span> коллактивити)
 <span class="token punctuation">[</span>fromDiagramName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название диаграммы<span class="token punctuation">,</span> откуда идет связь
 <span class="token punctuation">[</span>fromItemName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название элемента диаграммы<span class="token punctuation">,</span> откуда идет связь
 <span class="token punctuation">[</span>toDiagramName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название диаграммы<span class="token punctuation">,</span> куда идет связь
 <span class="token punctuation">[</span>toItemName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название элемента диаграммы<span class="token punctuation">,</span> куда идет связь

<span class="token punctuation">{</span><span class="token punctuation">{</span>processAssets<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица элементов архитектуры процессса (без повторений)
 <span class="token punctuation">[</span>assetType<span class="token punctuation">]</span> <span class="token punctuation">-</span>тип элемента архитектуры
 <span class="token punctuation">[</span>assetTypeStr<span class="token punctuation">]</span> <span class="token punctuation">-</span> тип элемента архитектуры на русском
 <span class="token punctuation">[</span>assetName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название элемента архитектуры
 <span class="token punctuation">[</span>+assetDescription<span class="token punctuation">]</span> <span class="token punctuation">-</span> описание элемента архитектуры
 <span class="token punctuation">[</span>assetLink<span class="token punctuation">]</span> <span class="token punctuation">-</span>внешняя ссылка
 <span class="token punctuation">[</span>assetLinkReg<span class="token punctuation">]</span> <span class="token punctuation">-</span> красивая кликабельная ссылка<span class="token punctuation">,</span> где под именем ссылка

 <span class="token punctuation">[</span><span class="token punctuation">?</span>linkedTasks<span class="token punctuation">]</span> <span class="token punctuation">-</span> массив привязанных к элементу архитектуры задачи
  <span class="token punctuation">[</span>fromItemName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название задачи
  <span class="token punctuation">[</span>assetType<span class="token punctuation">]</span> <span class="token punctuation">-</span>тип элемента архитектуры
  <span class="token punctuation">[</span>assetTypeStr<span class="token punctuation">]</span> <span class="token punctuation">-</span> тип элемента архитектуры на русском
  <span class="token punctuation">[</span>assetName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название элемента архитектуры
  <span class="token punctuation">[</span>+assetDescription<span class="token punctuation">]</span> <span class="token punctuation">-</span> описание элемента архитектуры
  <span class="token punctuation">[</span>assetLink<span class="token punctuation">]</span> <span class="token punctuation">-</span>внешняя ссылка
  <span class="token punctuation">[</span>assetLinkReg<span class="token punctuation">]</span> <span class="token punctuation">-</span> красивая кликабельная ссылка<span class="token punctuation">,</span> где под именем ссылка
 <span class="token punctuation">[</span>/linkedTasks<span class="token punctuation">]</span> 

<span class="token punctuation">{</span><span class="token punctuation">{</span>processAssetsToActivity<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица элементов архитектуры процессса в привязке к задачам
 <span class="token punctuation">[</span>assetType<span class="token punctuation">]</span> <span class="token punctuation">-</span>тип элемента архитектуры
 <span class="token punctuation">[</span>assetTypeStr<span class="token punctuation">]</span> <span class="token punctuation">-</span> тип элемента архитектуры на русском
 <span class="token punctuation">[</span>assetName<span class="token punctuation">]</span> <span class="token punctuation">-</span> название элемента архитектуры
 <span class="token punctuation">[</span>+assetDescription<span class="token punctuation">]</span> <span class="token punctuation">-</span> описание элемента архитектуры
 <span class="token punctuation">[</span>fromItemName<span class="token punctuation">]</span><span class="token punctuation">-</span>элемент<span class="token punctuation">,</span> к которому пркреплен элемент архитектуры
 <span class="token punctuation">[</span>assetLink<span class="token punctuation">]</span> <span class="token punctuation">-</span>внешняя ссылка строкой
 <span class="token punctuation">[</span>assetLinkReg<span class="token punctuation">]</span> <span class="token punctuation">-</span> внешняя ссылка с положенной ссылкой в ворде

<span class="token punctuation">{</span><span class="token punctuation">{</span>processApprovals<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">-</span> таблица согласования процесса
 <span class="token punctuation">[</span>createdOnStr<span class="token punctuation">]</span> <span class="token punctuation">-</span> дата создания согласования
 <span class="token punctuation">[</span>approvalTimeStr<span class="token punctuation">]</span> <span class="token punctuation">-</span> дата принятия решения согласования
 <span class="token punctuation">[</span>approverEmail<span class="token punctuation">]</span> <span class="token punctuation">-</span> емейл согласующего
 <span class="token punctuation">[</span>status<span class="token punctuation">]</span> <span class="token punctuation">-</span> статус согласования
 <span class="token punctuation">[</span>comment<span class="token punctuation">]</span> <span class="token punctuation">-</span> комментарий согласования
 <span class="token punctuation">[</span>diagramVersion<span class="token punctuation">]</span> <span class="token punctuation">-</span> версия<span class="token punctuation">,</span> по которой принято решение
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="загрузка-шаблона-в-систему" tabindex="-1"><a class="header-anchor" href="#загрузка-шаблона-в-систему"><span>Загрузка шаблона в систему</span></a></h2>
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


