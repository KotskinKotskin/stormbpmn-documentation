<template><div><h1 id="бизнес-процессы-в-bpmn" tabindex="-1"><a class="header-anchor" href="#бизнес-процессы-в-bpmn"><span>Бизнес-процессы в BPMN</span></a></h1>
<p>Наш редактор BPMN имеет несколько меню для удобства работы с BPMN диаграммами.<br>
<img src="@source/features_new_storm/1_bpmn-editor/bpmn-modeler.png" alt="image"></p>
<p><strong>Описание всех меню</strong></p>
<h2 id="сервисное-меню" tabindex="-1"><a class="header-anchor" href="#сервисное-меню"><span>Сервисное меню</span></a></h2>
<p>О нём рассказано в описании <RouteLink to="/features_new_storm/0_home-page/service_menu.html">главной</RouteLink> страницы</p>
<h2 id="меню-деиствии" tabindex="-1"><a class="header-anchor" href="#меню-деиствии"><span>Меню действий</span></a></h2>
<p>В этом меню возможно:</p>
<ul>
<li>
<ol>
<li>Вернуться на главную страницу (Мои процессы);</li>
</ol>
</li>
<li>
<p>Увидеть:</p>
<ol start="2">
<li>название диаграммы;</li>
<li>название папки в которой хранится диаграмма;</li>
<li>кто сохранил эту версию диаграммы;</li>
<li>дату и время версии;</li>
<li>сравнительный вид диаграммы: As Is или To Be</li>
<li>статус диаграммы (новая, в работе, на согласовании, готова, архив);</li>
</ol>
</li>
<li>
<p>Выполнить действия:</p>
<ol start="7">
<li>вызвать меню сохранения;</li>
<li>вызвать меню выгрузки: в регламент (docx) или графический файл (png, svg, pdf);</li>
<li>вызвать меню предоставления доступа другому пользователю Шторма или любому человеку</li>
<li>скрыть диаграмму от всех</li>
<li>удалить диаграмму</li>
<li>изменить статус</li>
</ol>
</li>
</ul>
<p><img src="@source/features_new_storm/1_bpmn-editor/action-menu.png" alt="image"></p>
<h3 id="сохранение-диаграммы" tabindex="-1"><a class="header-anchor" href="#сохранение-диаграммы"><span>Сохранение диаграммы</span></a></h3>
<p>В этом меню вы можете:</p>
<ol>
<li>Дать, изменить название диаграммы</li>
<li>Добавить <RouteLink to="/team-work/7_folders.html">теги</RouteLink></li>
<li>Указать <RouteLink to="/team-work/7_folders.html">папку</RouteLink></li>
<li>Указать сравнительный вид диаграммы (AS-IS / TO-BE) и связать со вторым процессом для <a href="#%D1%81%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-as-is-%D0%B8-to-be">сравнения</a></li>
<li>Оставить комментарий к текущей версии</li>
<li>Увидеть [качество] вашей диаграммы</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>При сохранении создаётся <RouteLink to="/features_new_storm/1_bpmn-editor/2_versioning.html">версия</RouteLink>, к которой можно откатиться или выполнить сравнение</p>
</div>
<p>В этом же меню можно сохранить <strong>чужую диаграмму</strong>, к которой вы не имеете доступа на редактирование, в свои диаграммы.</p>
<p><img src="@source/features_new_storm/1_bpmn-editor/save-menu.png" alt="image"></p>
<h3 id="скачать-экспорт-svg-png-pdf-bpmn-и-docx" tabindex="-1"><a class="header-anchor" href="#скачать-экспорт-svg-png-pdf-bpmn-и-docx"><span>Скачать (экспорт SVG, PNG, PDF, BPMN и .DOCX)</span></a></h3>
<p>В меню Скачать процесс есть 2 вкладки:<br>
А. <em><strong>Файлы</strong></em><br>
Б. <em><strong>Регламенты</strong></em></p>
<p>На вкладке <em><strong>Файлы</strong></em> можно скачать диаграмму</p>
<ul>
<li>как картинку (SVG, PNG);</li>
<li>машиночитаемый файл XML (BPMN);</li>
<li>как документ с оверлеями (PDF).</li>
</ul>
<p><img src="@source/features_new_storm/1_bpmn-editor/download(picture).png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Для сохранения картинки с <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BE%D0%B2%D0%B5%D1%80%D0%BB%D0%B5%D0%B5%D0%B2">оверлеями</a> используйте скачивание в PDF</p>
</div>
<p>На вкладке <em><strong>Регламенты</strong></em> доступно:</p>
<ol>
<li>загрузка своего шаблона регламента;</li>
<li>выбрать шаблон из списка загруженных;</li>
<li>выгрузить в шаги процесса только задачи (убрать события, развилки и другие объекты диаграммы процесса)</li>
<li><RouteLink to="/team-work/6_reglaments/process_reglament.html">скачать регламент процесса</RouteLink> по базовому шаблону;</li>
<li><RouteLink to="/team-work/6_reglaments/process_reglament.html">скачать регламент</RouteLink> по своему выбранному шаблону</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/download(reglament).png" alt="image"></p>
<h3 id="поделиться-диаграммои" tabindex="-1"><a class="header-anchor" href="#поделиться-диаграммои"><span>Поделиться диаграммой</span></a></h3>
<p><img src="@source/features_new_storm/1_bpmn-editor/share-diagram.png" alt="image"></p>
<p>В этом меню можно предоставить/отозвать доступ на диаграмму:</p>
<p><strong>1)</strong> Конкретному человеку по e-mail с указанием прав (просматривать/редактировать)
<strong>2)</strong> Анонимно (не требует учетной записи в системе)</p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Используйте этот способ, если хотите поделиться процессом не заставляя регистрироваться в системе. Включите галочку анонимный доступ.</p>
</div>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Такое предоставление доступа не делает получателя участником вашей команды. Оно потребляет лимит 5 бесплатных доступов на тарифе Personal.
При превышении этого лимита появится ошибка <br>
<img src="@source/features_new_storm/1_bpmn-editor/error-share.png" alt="image"> <br>
Чтобы поделиться другой схемой возможны 2 варианта: <br>
а) удалить один из ранее предоставленных доступов. <br>
б) <a href="https://stormbpmn.com/app/plan/upgrade" target="_blank" rel="noopener noreferrer">Улучшить тариф до Team<ExternalLinkIcon/></a> c бесконечным количеством доступов и возможностью работать командой</p>
</div>
<p>Больше о <RouteLink to="/team-work/">командной работе и возможностях на Team тарифе</RouteLink></p>
<p>При выдаче доступа человек получит уведомление по почте с предложением зарегистрироваться (если не было учетной записи в системе) или с тем, что ему предоставлен доступ (если учетная запись была). <br>
Все диаграммы, которыми когда либо делились с этим человеком, доступы ему на главной странице в таблице <br>
<strong>Поделились со мной</strong> <br>
<img src="@source/features_new_storm/1_bpmn-editor/share-with-me.png" alt="image"></p>
<p>Просмотр и удаление доступов, которые выдали Вы, возможно в таблице <strong>Поделился я</strong>. <br>
<img src="@source/features_new_storm/1_bpmn-editor/share-i.png" alt="image"></p>
<p><strong>3)</strong> Получить iframe-код для встраивания диаграммы в Wiki-системы <em>(типа Confluence)</em>.
В Wiki-системе ваша диаграмма будет выглядеть так:</p>
<iframe src="https://new.stormbpmn.com/app/diagram/ed955b21-8019-48ed-abc4-3fa7b0f491d5?embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="yes" frameborder="1"  height="400" width="100%" allowfullscreen></iframe>
<p><strong>4)</strong> Предоставить доступ к диаграмме для работников организации (только в ENTERPRISE-версии)</p>
<h3 id="сменить-статус" tabindex="-1"><a class="header-anchor" href="#сменить-статус"><span>Сменить статус</span></a></h3>
<p>Для информирования коллег о состоянии работы над процессом можно использовать статусы:</p>
<ul>
<li>
<p><strong>Новый</strong> - процесс ещё не трогали, просто создали</p>
</li>
<li>
<p><strong>В работе</strong> - над процессом активно идёт работа</p>
</li>
<li>
<p><strong>Согласование</strong> - диаграмму процесса согласуем с кем-то, менять диаграмму <strong>нельзя</strong>. Подробнее в <RouteLink to="/features_new_storm/1_bpmn-editor/2_appruval.html">согласованиях</RouteLink></p>
</li>
<li>
<p><strong>Готов</strong> - процесс готов к работе, менять схему нельзя</p>
</li>
<li>
<p><strong>Архив</strong> - процесс в архиве</p>
<p><img src="@source/features_new_storm/1_bpmn-editor/change-status.png" alt="image"></p>
</li>
</ul>
<h3 id="тип-диаграммы-as-is-и-to-be" tabindex="-1"><a class="header-anchor" href="#тип-диаграммы-as-is-и-to-be"><span>Тип диаграммы: AS-IS и TO-BE</span></a></h3>
<p>Если в <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F">меню сохранения</a> вы указали тип процесса и связанный процесс, то появится возможность быстро перемещаться между версиями AS-IS и TO-BE, нажав на кнопку верхнего меню с типом диаграммы</p>
<p><img src="@source/features_new_storm/1_bpmn-editor/as-is-to-be.png" alt="image"></p>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<p>А также визуально <a href="#%D1%81%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-as-is-%D0%B8-to-be">сравнить их</a>.</p>
</div>
<h2 id="левое-меню" tabindex="-1"><a class="header-anchor" href="#левое-меню"><span>Левое меню</span></a></h2>
<p>Левое меню предназначено для выбора элементов BPMN, управления ими и обеспечения удобства использования редактора.</p>
<div class="hint-container warning">
<p class="hint-container-title">Не все элементы</p>
<p>В левом меню находятся не все разновидности элементов BPMN, но это не значит, что их нет в системе 😃 Выбор типа (маркера) элемента производится в контекстном меню нажатием на кнопку .</p>
</div>
<p>Советуем обратить внимание на кнопки, обеспечивающие удобство работы:</p>
<p><img src="@source/features_new_storm/1_bpmn-editor/left-menu.gif" alt="image"></p>
<p>Для понимания того, в какие элементы можно превратить значки, нужно разбираться в <RouteLink to="/bpmn/">BPMN</RouteLink>, т.к. сервис старается защитить вас от ошибок и не дать использовать элементы, которые невозможны по нотации.</p>
<h2 id="верхнее-меню" tabindex="-1"><a class="header-anchor" href="#верхнее-меню"><span>Верхнее меню</span></a></h2>
<p>Верхнее меню предназначено для работы с конкретной диаграммой и предоставляет возможности:</p>
<ol>
<li>Включить симулятор токена.</li>
<li>Развернуть диаграмму на полный экран.</li>
<li>включить, отключить миникарту</li>
<li>Приблизить.</li>
<li>Отдалить.</li>
<li>Отменить последнее действие.</li>
<li>Вернуть отмененное действие.</li>
<li>Сменить цвет выбранным элементам.</li>
<li>Скопировать выделенные элементы для вставки между вкладками.</li>
<li>Вставить выделенные элементы в другую схему.</li>
<li>Включить <RouteLink to="/features_new_storm/1_bpmn-editor/2_bpmn_scoring.html">проверку ошибок</RouteLink>.</li>
<li>Выполнить автонумерацию элементов.</li>
<li>Очистить автонумерацию.</li>
<li>Открыть справку по верхнему меню, горячим клавишам и элементам <a href="https://new.stormbpmn.com/bpmn/elements" target="_blank" rel="noopener noreferrer">BPMN<ExternalLinkIcon/></a> с примерами.</li>
<li>Скрыть шапку: меню действий и меню навигации.</li>
<li>Раскрыть <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BE%D0%B2%D0%B5%D1%80%D0%BB%D0%B5%D0%B5%D0%B2">меню оверлеев</a>.</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/up-menu-3.png" alt="image"></p>
<h2 id="контекстное-меню" tabindex="-1"><a class="header-anchor" href="#контекстное-меню"><span>Контекстное меню</span></a></h2>
<p>Контекстное меню открывается при клике на элемент и предоставляет следующие возможности в зависимости от того, на какой элемент вы кликнули:</p>
<ol>
<li>Выбрать и нарисовать следующий элемент.</li>
<li>Нарисовать следующий шаг процесса с <RouteLink to="/features_new_storm/1_bpmn-editor/2_ai.html">помощью искуственного интелекта</RouteLink></li>
<li>Открыть <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</a> - <em>для создания связей, управления <RouteLink to="/team-work/4_assignees.html">ролями</RouteLink> и <RouteLink to="/team-work/5_elements-architecture/">элементами архитектуры</RouteLink>, описанием подробностей задачи, планового времени выполнения, внешней ссылки.</em></li>
<li>Изменить тип (маркер) элемента</li>
<li>Соеденить текущий элемент с другим.</li>
<li>Написать примечание, текстовую аннотацию к элементу</li>
<li>Удалить элемент.</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/context-menu-1.png" alt="image"></p>
<h2 id="меню-подробностеи" tabindex="-1"><a class="header-anchor" href="#меню-подробностеи"><span>Меню подробностей</span></a></h2>
<p>В этом меню доступны функции:</p>
<ol>
<li>Просмотра, изменения названия элемента <em>(кроме примечаний)</em></li>
<li>Создать, установить, снять <RouteLink to="/team-work/4_assignees.html">роль</RouteLink> (<em>только для задач</em>) - <em>назначить роль на задачу</em></li>
<li>Создать, установить, снять <RouteLink to="/team-work/5_elements-architecture/">элементы архитектуры</RouteLink> (<em>только для задач</em>)- <em>связать элемент архитектуры с задачей</em>
<img src="@source/features_new_storm/1_bpmn-editor/supplemental-menu-1.png" alt="image"></li>
<li>Создать, удалить <RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2-%D0%BF%D0%B5%D1%80%D0%B5%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE-%D0%BF%D0%BE%D0%B4%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%B0-call-activity">связь для Call activity или свернутого пула</RouteLink></li>
<li>Создать, удалить <RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D1%83-%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F">отправку сообщения</RouteLink> <em>(Throw Event)</em> и <RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D1%83-%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F">Связывание события получения сообщения с его отправкой</RouteLink> <em>(Catch Event)</em></li>
<li>Внести, отредактировать Описание элемента</li>
<li>Указать <RouteLink to="/features_new_storm/1_bpmn-editor/features_new_storm/1_bpmn-editor/2_bpmn_calc_duration.html">плановую длительность</RouteLink></li>
<li>Внешнюю ссылку</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/supplemental-menu-2.png" alt="image"></p>
<h2 id="меню-оверлеев" tabindex="-1"><a class="header-anchor" href="#меню-оверлеев"><span>Меню оверлеев</span></a></h2>
<h3 id="отображение-оверлеев-на-схеме-разворачивание-их-списка" tabindex="-1"><a class="header-anchor" href="#отображение-оверлеев-на-схеме-разворачивание-их-списка"><span>отображение оверлеев на схеме, разворачивание их списка</span></a></h3>
<p>Одним из ключевых удобств системы является возможность быстро и удобно включать и выключать отображение информации на диаграмме.
Меню оверлеев предоставляет возможность:</p>
<ol>
<li>Показать на схеме оверлеи:</li>
</ol>
<ul>
<li><RouteLink to="/team-work/4_assignees.html">ролей</RouteLink></li>
<li>должностей <em>(первой должности в <RouteLink to="/team-work/3_org-chart-editor.html">оргструктуре</RouteLink>, назначенной на роль)</em></li>
<li>систем <em>(один из типов <RouteLink to="/team-work/5_elements-architecture/">элементов архитектуры</RouteLink>)</em></li>
<li>документов <em>(один из типов <RouteLink to="/team-work/5_elements-architecture/">элементов архитектуры</RouteLink>)</em></li>
</ul>
<ol start="2">
<li>Развернуть список оверлеев Системы, Документы
<em>(по умолчанию они свёрнуты в группу)</em></li>
<li>Отобразить оверлеи</li>
</ol>
<ul>
<li>описания</li>
<li><a href="#%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5">комментариев</a></li>
</ul>
<ol start="4">
<li>Показать длительность</li>
<li>Отобразить связи с другими диаграммами:</li>
</ol>
<ul>
<li><RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2">связи</RouteLink> (исходящие)</li>
<li><RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2">связи</RouteLink> (входящие)</li>
</ul>
<ol start="6">
<li>Включить оверлеи кастомных <RouteLink to="/team-work/5_elements-architecture/">элементов архитектуры</RouteLink></li>
<li>Развернуть список оверлеев всех кастомных ЭА</li>
<li>использовать горячие клавиши для отображения оверлеев и разворачивания их списков</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/overlays-menu-1.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Включенные оверлеи автоматически вставляются в ссылку, которой вы делитесь с коллегами! Заказчикам ничего дополнительного нажимать не надо.
А еще, если вы включали оверлеи в настройках пользователя (Профиль -&gt; настройки) то на диаграммах вашего авторства они будут отображаться автоматически, даже ссылку делать не надо будет.</p>
</div>
<h2 id="меню-представлении" tabindex="-1"><a class="header-anchor" href="#меню-представлении"><span>Меню представлений</span></a></h2>
<p>Описание процесса в системе можно посмотреть сразу в нескольких представлениях, в зависимости от ваших задач.</p>
<ul>
<li><strong>В виде схемы BPMN</strong> - подходит для анализа последовательности процесса</li>
<li><strong>В виде таблицы</strong> - подходит для уточнения задач, исполнителей, используемых систем и документов</li>
</ul>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<ul>
<li><strong>В виде регламента</strong> - подходит для последовательного изучения всей информации о процессе</li>
</ul>
</div>
<h3 id="схема" tabindex="-1"><a class="header-anchor" href="#схема"><span>Схема</span></a></h3>
<h3 id="табличное-представление" tabindex="-1"><a class="header-anchor" href="#табличное-представление"><span>Табличное представление</span></a></h3>
<p>Табличное представление выводит информацию о:</p>
<ul>
<li>Названии задачи</li>
<li>Пуле, в котором расположена задача</li>
<li>Роль, исполняющая задачу</li>
<li>Должности, привязанные к роли</li>
<li>Системы, используемые в задаче</li>
<li>Документы, используемые в задаче</li>
<li>Описание задачи</li>
</ul>
<p>Это представление даёт возможность скачать таблицу в .xls и осуществить поиск по содержимому. Например, если написать <strong>кладовщик</strong>, то система выдаст только те задачи, где упоминается это слово в любом из столбцов.<br>
<img src="@source/features_new_storm/1_bpmn-editor/table-view-1.png" alt="image"></p>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<h3 id="представление-в-виде-регламента" tabindex="-1"><a class="header-anchor" href="#представление-в-виде-регламента"><span>Представление в виде регламента</span></a></h3>
<p>Это представление позволяет просмотреть на процесс последовательно, со всех сторон и предоставляет возможности:</p>
<ol>
<li>Просмотреть и ввести общее описание.
<img src="@source/features_new_storm/1_bpmn-editor/reglament-view-1.png" alt="image"></li>
<li>Указать состав рабочей группы: владельцев, спонсоров и т.д.</li>
<li>Посмотреть на схему.</li>
<li>Посмотреть и отредактировать описание задач в разрезе ролей
<img src="@source/features_new_storm/1_bpmn-editor/reglament-view-2.png" alt="image"></li>
<li>Историю согласований.</li>
<li>Связь процессов, потребителей и поставщиков процесса.</li>
<li>Используемые элементы архитектуры.</li>
<li>Карту архитектуры относительно процесса.</li>
<li>Все комментарии процесса.</li>
</ol>
</div>
<h2 id="правое-меню" tabindex="-1"><a class="header-anchor" href="#правое-меню"><span>Правое меню</span></a></h2>
<p>Правое меню даёт дополнительные возможности работы с диаграммой:</p>
<ol>
<li><RouteLink to="/features_new_storm/1_bpmn-editor/2_bpmn_scoring.html">оценка качества</RouteLink></li>
<li>отправить диаграмму на <RouteLink to="/features_new_storm/1_bpmn-editor/2_appruval.html">согласование</RouteLink>, просмотреть кому отправлено и результат</li>
<li>создать, установить, снять <RouteLink to="/team-work/4_assignees.html">роль</RouteLink> и все <RouteLink to="/team-work/5_elements-architecture/">элементы архитектуры</RouteLink> для каждого элемента диаграммы;</li>
<li>показать <RouteLink to="/features_new_storm/8_comments.html">комментарии</RouteLink> к диаграмме и отдельным её элементам;</li>
</ol>
<div class="hint-container caution">
<p class="hint-container-title">Ещё в разработке</p>
<ol start="5">
<li>сравнить текущую <RouteLink to="/features_new_storm/1_bpmn-editor/2_versioning.html">версию</RouteLink> диаграммы с предыдущими</li>
<li>отобразить <RouteLink to="/features_new_storm/1_bpmn-editor/2_connection_diagram.html#%D1%81%D0%B2%D1%8F%D0%B7%D1%8C-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2">связи</RouteLink> диаграммы с другими диаграммами, событиями, задачамив</li>
<li>вывести панель упраления Camunda</li>
</ol>
</div>
<p><img src="@source/features_new_storm/1_bpmn-editor/right-menu-1.png" alt="image"></p>
<p><strong>Цвет активной вкладки тёмный.</strong></p>
<h3 id="панель-управления-camunda" tabindex="-1"><a class="header-anchor" href="#панель-управления-camunda"><span>- панель управления Camunda</span></a></h3>
<div class="hint-container caution">
<p class="hint-container-title">В разработке</p>
</div>
<h2 id="обеспечение-удобства-работы" tabindex="-1"><a class="header-anchor" href="#обеспечение-удобства-работы"><span>Обеспечение удобства работы</span></a></h2>
<h3 id="горячие-клавиши" tabindex="-1"><a class="header-anchor" href="#горячие-клавиши"><span>Горячие клавиши</span></a></h3>
<p>Редактор поддерживает работу с горячими клавишами, что сильно ускоряет работу при моделировании процессов:</p>
<ul>
<li><strong>F2</strong> - изменить название выбранного элемента</li>
<li><strong>F3</strong> или <strong>ctrl + f</strong> - открыть меню поиска элементов</li>
<li><strong>F5</strong> или <strong>ctrl + F5</strong> - обновить страницу браузера</li>
<li><strong>F11</strong> - перейти в полноэкранный режим</li>
<li><strong>ctrl + z</strong> - отменить последнее действие</li>
<li><strong>ctrl +shift + z</strong> или <strong>ctrl + y</strong> - вернуть отмененное действие</li>
<li><strong>ctrl + a</strong> - выделить всё</li>
<li><strong>ctrl + scroll</strong> - изменение масштаба</li>
<li><strong>scroll</strong> - перемещение по вертикали</li>
<li><strong>shift + scroll</strong> - перемещение по горизонтали</li>
<li><strong>ctrl + click</strong> - выделять элементы по одному в группу</li>
<li><strong>shift + click</strong> - выбрать элементы группой</li>
<li><strong>alt + 1...8</strong> - включить отображение соответствующих оверлеев</li>
<li><strong>alt + shift + 3, 4</strong> - изменить свёрнутость списка оверлеев Системы, Документы</li>
<li><strong>alt + a</strong> - включить отображение всех оверлеев</li>
<li><strong>alt + sift + a</strong> - изменить свёрнутость списка всех оверлеев</li>
</ul>
</div></template>


