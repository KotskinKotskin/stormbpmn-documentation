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
<p><img src="@source/features/diagram-group.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Вложенность групп не ограничена, но по практике лучше не использовать больше 3-4 уровней, а сложные структуры проектировать через вложенность диаграммы групп в диаграммы групп.</p>
</div>
<h2 id="создание-группы-процессов" tabindex="-1"><a class="header-anchor" href="#создание-группы-процессов"><span>Создание группы процессов</span></a></h2>
<p>Создать группу процессов можно так:
<img src="@source/features/create-group.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Групп процессов может быть сколько угодно! Это значит, что вы можете формировать разные иерархии для разных целей. И этими группами можно так же <a href="#%D0%BF%D0%BE%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D1%8C%D1%81%D1%8F-%D0%B4%D0%B8%D0%B0%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%BE%D0%B8">делиться по ссылке</a>. А ещё работают <a href="#%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5">комментарии</a>.</p>
</div>
<h2 id="как-работать-с-группами" tabindex="-1"><a class="header-anchor" href="#как-работать-с-группами"><span>Как работать с группами</span></a></h2>
<ol>
<li>Добавьте группу нужного размера:<br>
<img src="@source/features/create-group-1.png" alt="image"></li>
<li>Двойным кликом на группу откройте меню редактирования группы:
<img src="@source/features/create-group-2.png" alt="image"></li>
<li>Укажите информацию о группе:
<ul>
<li>Название</li>
<li>Цвет</li>
<li>Описание</li>
<li>Приоритет (возможно использовать для фильтрации)</li>
<li>Уровень (возможно использовать для фильтрации)</li>
</ul>
</li>
<li>Укажите связь группы с реализацией. Тут 2 возможности:
<ul>
<li><strong>Создать новую</strong> - создастся &quot;заглушка&quot; процесса (если выбрать BPMN) или группы процессов (если выбрать BCM). Отличная возможность приступить к реализации позднее или раздать задачи бизнес-аналиткам для моделирования.</li>
<li><strong>Существующая схема</strong> - позволяет выбрать уже существующую реализацию процесса или группы процессов. Отлично подойдет, если вы из существующих процессов формируете иерархию. <strong>Существующая схема может быть привязана к любому количеству групп</strong>.</li>
</ul>
</li>
</ol>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Привязка реализации позволяет отслеживать статус работы над реализацией и визуализировать ваш процесс по моделированию всей иерархии!
<img src="@source/features/create-group-3.png" alt="image"></p>
</div>
<ol start="5">
<li>
<p>Формируйте группы и перемещайте их друг в друга, чтобы отобразить иерархию. Чтобы вытащить группы другой группы, зажмите <strong>CTRL</strong> и перемещайте ее за границу родителя.</p>
</li>
<li>
<p>Используйте правое меню для навигации или просмотра фильтра групп. В фильтре работают:</p>
<ul>
<li>Фильтр по названию группы</li>
<li>Фильтр по названию родительской группы</li>
<li>Фильтр по статусу привязанного процесса (new, progress, approve, done)</li>
<li>Фильтр по типу (BPMN, BCM)</li>
<li>Фильтр по названию связанного процесса</li>
</ul>
</li>
<li>
<p>Используйте фильтр и перемещайтесь по иерархии кликом на симол лупы с картой.<br>
<img src="@source/features/create-group-4.png" alt="image"></p>
</li>
</ol>
<h2 id="горячие-клавиши" tabindex="-1"><a class="header-anchor" href="#горячие-клавиши"><span>Горячие клавиши</span></a></h2>
<p>Редактор групп поддерживает горячие клавиши:</p>
<ul>
<li><strong>CTRL+Z</strong> - отменить последнее действие</li>
<li><strong>CTRL+Y</strong> - повторить последнее действие</li>
<li><strong>CTRL+C</strong> - скопировать группу (без дочерних)</li>
<li><strong>CTRL+V</strong> - вставить группу</li>
<li><strong>DEL</strong> - удалить группу с дочерними</li>
</ul>
</div></template>


