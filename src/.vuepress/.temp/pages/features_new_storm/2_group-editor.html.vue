<template><div><h1 id="редактор-групп-процессов" tabindex="-1"><a class="header-anchor" href="#редактор-групп-процессов"><span>Редактор групп процессов</span></a></h1>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Группы процессов работают только на тарифах TEAM и выше.</p>
</div>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Функционал недавно выпущен и может содержать ошибки. Сообщайте о любых ошибках в чат в приложении, мы оперативно их устраним.</p>
</div>
<p>Группы процессов – это отличная возможность моделировать процессы сверху-вниз. Вы можете смотреть на группы процессов как на простую иерархию, бизнес-возможности (Business Capability) или бизнес-функции.</p>
<p><img src="@source/features_new_storm/diagram-group.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Вложенность групп не ограничена, но по практике лучше не использовать больше 3-4 уровней, а сложные структуры проектировать через вложенность диаграммы групп в диаграммы групп.</p>
</div>
<h2 id="создание-группы-процессов" tabindex="-1"><a class="header-anchor" href="#создание-группы-процессов"><span>Создание группы процессов</span></a></h2>
<p>Создать группу процессов можно из меню <RouteLink to="/features_new_storm/0_home-page.html#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8">навигации</RouteLink>:
<img src="@source/features_new_storm/create-group.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Групп процессов может быть сколько угодно! Это значит, что вы можете формировать разные иерархии для разных целей. И этими группами можно так же <a href="#%D0%BF%D0%BE%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D1%8C%D1%81%D1%8F-%D0%B4%D0%B8%D0%B0%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BE%D0%B8">делиться по ссылке</a>. А ещё работают <a href="#%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5">комментарии</a>.</p>
</div>
<h2 id="редактор-группы-процессов" tabindex="-1"><a class="header-anchor" href="#редактор-группы-процессов"><span>Редактор Группы процессов</span></a></h2>
<p>Наш редактор имеет несколько меню для удобства работы с диаграммами Групп процессов.<br>
<img src="@source/features_new_storm/diagram-group-modeler.png" alt="image"></p>
<h2 id="описание-всех-меню" tabindex="-1"><a class="header-anchor" href="#описание-всех-меню"><span>Описание всех меню</span></a></h2>
<h3 id="меню-деиствии" tabindex="-1"><a class="header-anchor" href="#меню-деиствии"><span>Меню действий</span></a></h3>
<p>Аналогично меню действий редактора <RouteLink to="/features_new_storm/1_bpmn-editor.html#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%B4%D0%B5%D0%B8%D1%81%D1%82%D0%B2%D0%B8%D0%B8">BPMN</RouteLink></p>
<h3 id="меню-навигации" tabindex="-1"><a class="header-anchor" href="#меню-навигации"><span>Меню навигации</span></a></h3>
<p>О нём рассказано в описании <RouteLink to="/features_new_storm/0_home-page.html#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BD%D0%B0%D0%B2%D0%B8%D0%B3%D0%B0%D1%86%D0%B8%D0%B8">главной</RouteLink> страницы</p>
<h3 id="верхнее-меню" tabindex="-1"><a class="header-anchor" href="#верхнее-меню"><span>Верхнее меню</span></a></h3>
<p>Верхнее меню предназначено для работы с конкретной диаграммой и предоставляет возможности:</p>
<ol>
<li>Развернуть диаграмму на полный экран.</li>
<li>Приблизить.</li>
<li>Отдалить.</li>
<li>Отменить последнее действие.</li>
<li>Вернуть отмененное действие.</li>
<li>Скопировать выделенные элементы для вставки между вкладками.</li>
<li>Вставить выделенные элементы в другую схему.</li>
<li>Открыть справку по верхнему меню и горячим клавишам.</li>
<li>Скрыть шапку: меню действий и меню навигации.</li>
</ol>
<p><img src="@source/features_new_storm/group-up-menu.png" alt="image"></p>
<h3 id="левое-меню" tabindex="-1"><a class="header-anchor" href="#левое-меню"><span>Левое меню</span></a></h3>
<p>Левое меню предоставляет следующие возможности</p>
<ol>
<li>Переместить рабочее пространство</li>
<li>Выделить несколько элементов, обведя их</li>
<li>Изменить размеры элементов, пространства по вертикали или горизонтали</li>
<li>Добавить элемент &quot;Группа&quot; на диаграмму</li>
</ol>
<p><img src="@source/features_new_storm/group-left-menu.png" alt="image"></p>
<h3 id="контекстное-меню" tabindex="-1"><a class="header-anchor" href="#контекстное-меню"><span>Контекстное меню</span></a></h3>
<p>В этом меню доступна функция удаления элемента. Она также выполняется нажатием клавиши <span style="background-color: #A7A9F8;"> Delete</span>.</p>
<h3 id="правое-меню" tabindex="-1"><a class="header-anchor" href="#правое-меню"><span>Правое меню</span></a></h3>
<p>Правое меню позволяет:</p>
<ol>
<li>Ввести название группы процессов (<em>вверху прямоугольника группы на диаграмме</em>)</li>
<li>Дать её описание</li>
<li>Установить приоритет:
<ul>
<li>низкий (<em>в группе отображен звездой зеленого цвета</em>);</li>
<li>средний (<em>жёлтая звезда</em>);</li>
<li>высокий (<em>красная звезда</em>)</li>
</ul>
</li>
<li>Выбрать уровень:
<ul>
<li>стратегия;</li>
<li>контроль;</li>
<li>исполнение</li>
</ul>
</li>
<li>Создать новую диаграмму, указав её название и тип, и связать её с группой</li>
<li>Выбрать, найти уже существующую диаграмму и связать её с группой</li>
<li>Установить цвет группы</li>
</ol>
<p>В группе (<em>в нижней части прямоугольника</em>) отображается информация о связанной диаграмме: <br>
а) статус <br>
б) тип <br>
в) название</p>
<p><img src="@source/features_new_storm/group-right-menu.png" alt="image"></p>
<h2 id="как-работать-с-группами" tabindex="-1"><a class="header-anchor" href="#как-работать-с-группами"><span>Как работать с группами</span></a></h2>
<ol>
<li>
<p>Добавьте группу в пространство диаграммы (<em>при необходимости измените её размер</em>):</p>
<p><img src="@source/features_new_storm/create-group-1.gif" alt="image"></p>
</li>
<li>
<p>Двойным кликом на группу провалитесь в поле названия группы и внесите его название. <br>
Или внесите название в правом меню:</p>
<p><img src="@source/features_new_storm/create-group-2.gif" alt="image"></p>
</li>
<li>
<p>В правом меню укажите информацию о группе:</p>
<ul>
<li>Описание</li>
<li>Приоритет</li>
<li>Уровень</li>
<li>Цвет</li>
</ul>
</li>
</ol>
<p><img src="@source/features_new_storm/create-group-3.gif" alt="image"></p>
<ol start="4">
<li>Укажите связь группы с реализацией. Тут 2 возможности:
<ul>
<li><strong>Создать новую</strong> - создастся &quot;заглушка&quot; процесса (если выбрать BPMN) или группы процессов (если выбрать BCM). Отличная возможность приступить к реализации позднее или раздать задачи бизнес-аналиткам для моделирования.</li>
</ul>
</li>
</ol>
<p><img src="@source/features_new_storm/create-group-4.gif" alt="image"></p>
<ul>
<li><strong>Существующая схема</strong> - позволяет выбрать уже существующую реализацию процесса или группы процессов. Отлично подойдет, если вы из существующих процессов формируете иерархию.</li>
</ul>
<p><strong>Существующая схема может быть привязана к любому количеству групп</strong>.</p>
<p><img src="@source/features_new_storm/create-group-5.gif" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Привязка реализации позволяет отслеживать статус работы над реализацией и визуализировать ваш процесс по моделированию всей иерархии!</p>
<p><img src="@source/features_new_storm/create-group-6.png" alt="image"></p>
</div>
<ol start="5">
<li>Формируйте группы и перемещайте их друг в друга, чтобы отобразить иерархию, вложенность.</li>
</ol>
<p><img src="@source/features_new_storm/create-group-7.gif" alt="image"></p>
<h2 id="горячие-клавиши" tabindex="-1"><a class="header-anchor" href="#горячие-клавиши"><span>Горячие клавиши</span></a></h2>
<p>Редактор групп поддерживает горячие клавиши:</p>
<ul>
<li><strong>CTRL+Z</strong> - отменить последнее действие</li>
<li><strong>CTRL+Y</strong> или <strong>CTRL+SHIFT+Z</strong> - повторить отмененное действие</li>
<li><strong>CTRL+C</strong> - скопировать группу (без дочерних)</li>
<li><strong>CTRL+V</strong> - вставить группу</li>
<li><strong>DEL</strong> - удалить группу с дочерними</li>
<li><strong>CTRL+SCROLL</strong> - изменение масштаба</li>
<li><strong>SCROLL</strong> - перемещение по вертикали</li>
<li><strong>SHIFT+SCROLL</strong> - перемещение по горизонтали</li>
<li><strong>SHIFT+CLICK</strong> - выделять элементы по одному или обводя их лассо</li>
</ul>
</div></template>


