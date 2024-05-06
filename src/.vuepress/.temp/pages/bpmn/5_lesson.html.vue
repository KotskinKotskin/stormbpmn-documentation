<template><div><h1 id="_5-урок-bpmn-для-чаиников-базовые-элементы-2-3" tabindex="-1"><a class="header-anchor" href="#_5-урок-bpmn-для-чаиников-базовые-элементы-2-3"><span>5 урок: BPMN для &quot;чайников&quot;. Базовые элементы. (2/3)</span></a></h1>
<p>Я не сказал вам всей правды — в BPMN для чайников символов немного больше. Сегодня обсудим оставшиеся базовые элементы и особенности их применения.</p>
<p>Это большое письмо. Крепитесь.</p>
<h2 id="уточняем-базовые-символы" tabindex="-1"><a class="header-anchor" href="#уточняем-базовые-символы"><span>Уточняем базовые символы</span></a></h2>
<h3 id="деиствия" tabindex="-1"><a class="header-anchor" href="#деиствия"><span>Действия</span></a></h3>
<p>Действия бывают двух видов: <strong>задача</strong> и <strong>подпроцесс</strong>.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td><strong>Тип</strong></td>
<td><strong>Название</strong></td>
<td><strong>Как выглядит</strong></td>
<td><strong>Зачем нужно</strong></td>
</tr>
<tr>
<td>1</td>
<td>Действие</td>
<td>Задача</td>
<td><img src="@source/bpmn/5_lesson_1.png" alt="image"></td>
<td>Отражает часть работы конкретного исполнителя. Задача не может быть разделена, она атомарна</td>
</tr>
<tr>
<td>2</td>
<td>Действие</td>
<td>Подпроцесс</td>
<td><img src="@source/bpmn/5_lesson_2.png" alt="image"></td>
<td>Отражает большую часть работы</td>
</tr>
<tr>
<td>3</td>
<td>Действие</td>
<td>Пользовательская задача</td>
<td><img src="@source/bpmn/5_lesson_3.png" alt="image"></td>
<td>Отражает задачу, как правило выполняемую с помощью BPMS-системы</td>
</tr>
<tr>
<td>4</td>
<td>Действие</td>
<td>Сервисная задача</td>
<td><img src="@source/bpmn/5_lesson_4.png" alt="image"></td>
<td>Отражает вызов некоторого внешнего сервиса или программы</td>
</tr>
</tbody>
</table>
<p>Подпроцессы помогают экономить пространство на схеме и декомпозировать, т.е. разделять на части большие процессы.</p>
<p><img src="@source/bpmn/5_lesson_5.png" alt="image"></p>
<h3 id="события" tabindex="-1"><a class="header-anchor" href="#события"><span>События</span></a></h3>
<p>События бывают трёх видов: <strong>стартовое</strong>, <strong>промежуточное</strong> и <strong>завершающее</strong>.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td><strong>Тип</strong></td>
<td><strong>Название</strong></td>
<td><strong>Как выглядит</strong></td>
<td><strong>Зачем нужно</strong></td>
</tr>
<tr>
<td>1</td>
<td>Событие</td>
<td>Стартовое событие</td>
<td><img src="@source/bpmn/5_lesson_6.png" alt="image"></td>
<td>Показывает, что что-то случилось, и нужно начать процесс</td>
</tr>
<tr>
<td>2</td>
<td>Событие</td>
<td>Стартовое событие по времени</td>
<td><img src="@source/bpmn/5_lesson_7.png" alt="image"></td>
<td>Показывает, что пришло конкретное время (или прошёл интервал времени) и пора начать процесс</td>
</tr>
<tr>
<td>3</td>
<td>Событие</td>
<td>Стартовое событие по сообщению</td>
<td><img src="@source/bpmn/5_lesson_8.png" alt="image"></td>
<td>Показывает, что пришло сообщение от участников взаимодействия и пора начать процесс</td>
</tr>
<tr>
<td>4</td>
<td>Событие</td>
<td>Промежуточное событие</td>
<td><img src="@source/bpmn/5_lesson_9.png" alt="image"></td>
<td>Показывает, что что-то случилось, но делать ничего особенного не нужно</td>
</tr>
<tr>
<td>5</td>
<td>Событие</td>
<td>Завершающее событие</td>
<td><img src="@source/bpmn/5_lesson_10.png" alt="image"></td>
<td>Показывает, что что-то случилось и процесс нужно завершить</td>
</tr>
<tr>
<td>6</td>
<td>Событие</td>
<td>Завершающее событие отправки сообщения</td>
<td><img src="@source/bpmn/5_lesson_11.png" alt="image"></td>
<td>Показывает, что нужно завершить процесс и отправить сообщение участнику взаимодействия</td>
</tr>
<tr>
<td>7</td>
<td>События</td>
<td>Терминальное завершающее событие</td>
<td><img src="@source/bpmn/5_lesson_12.png" alt="image"></td>
<td>Показывает, что нужно завершить процесс и любые прочие действия в процессе немедленно</td>
</tr>
</tbody>
</table>
<h3 id="шлюзы" tabindex="-1"><a class="header-anchor" href="#шлюзы"><span>Шлюзы</span></a></h3>
<p>Шлюзы бывают двух видов: <strong>исключающий</strong> и <strong>параллельный</strong>.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td><strong>Тип</strong></td>
<td><strong>Название</strong></td>
<td><strong>Как выглядит</strong></td>
<td><strong>Зачем нужно</strong></td>
</tr>
<tr>
<td>1</td>
<td>Шлюз</td>
<td>Исключающий шлюз</td>
<td><img src="@source/bpmn/5_lesson_13.png" alt="image"></td>
<td>Разделяет работу исключительно на 1 поток</td>
</tr>
<tr>
<td>1</td>
<td>Шлюз</td>
<td>Параллельный шлюз</td>
<td><img src="@source/bpmn/5_lesson_14.png" alt="image"></td>
<td>Распараллеливает работу на все исходящие потоки</td>
</tr>
</tbody>
</table>
<h3 id="артефакты" tabindex="-1"><a class="header-anchor" href="#артефакты"><span>Артефакты</span></a></h3>
<p>Эти штуки улучшают читаемость схем.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td>Тип</td>
<td>Название</td>
<td>Как выглядит</td>
<td>Зачем нужно</td>
</tr>
<tr>
<td>1</td>
<td>Артефакт</td>
<td>Текстовая аннотация</td>
<td><img src="@source/bpmn/5_lesson_15.png" alt="image"></td>
<td>Даёт информацию к одному элементу</td>
</tr>
<tr>
<td>2</td>
<td>Артефакт</td>
<td>Группа</td>
<td><img src="@source/bpmn/5_lesson_16.png" alt="image"></td>
<td>Даёт информацию к группе элементов</td>
</tr>
<tr>
<td>3</td>
<td>Артефакт</td>
<td>Объект данных</td>
<td><img src="@source/bpmn/5_lesson_17.png" alt="image"></td>
<td>Показывает, какая информация создаётся в процессе</td>
</tr>
<tr>
<td>4</td>
<td>Артефакт</td>
<td>Хранилище данных</td>
<td><img src="@source/bpmn/5_lesson_18.png" alt="image"></td>
<td>Представляет механизм для действий по получению или обновлению данных, которые хранятся независимо от процесса</td>
</tr>
</tbody>
</table>
<h3 id="потоки" tabindex="-1"><a class="header-anchor" href="#потоки"><span>Потоки</span></a></h3>
<p>Потоки используются для передачи работы или информации между участниками процесса.</p>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td>Тип</td>
<td>Название</td>
<td>Как выглядит</td>
<td>Зачем нужно</td>
</tr>
<tr>
<td>1</td>
<td>Объект соединения</td>
<td>Поток управления</td>
<td><img src="@source/bpmn/5_lesson_19.png" alt="image"></td>
<td>Последовательность выполнения работ</td>
</tr>
<tr>
<td>2</td>
<td>Объект соединения</td>
<td>Поток сообщений</td>
<td><img src="@source/bpmn/5_lesson_20.png" alt="image"></td>
<td>Передача информации между процессами</td>
</tr>
<tr>
<td>3</td>
<td>Объект соединения</td>
<td>Ассоциация</td>
<td><img src="@source/bpmn/5_lesson_21.png" alt="image"></td>
<td>Привязка артефактов к элементам процесса</td>
</tr>
</tbody>
</table>
</div></template>


