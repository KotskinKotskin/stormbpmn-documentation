<template><div><h1 id="_4-урок-bpmn-для-чаиников-базовые-элементы-1-3" tabindex="-1"><a class="header-anchor" href="#_4-урок-bpmn-для-чаиников-базовые-элементы-1-3"><span>4 урок: BPMN для &quot;чайников&quot;. Базовые элементы. (1/3)</span></a></h1>
<p>Нотация BPMN делится на три части по уровню сложности - для чайников, для аналитиков и для исполняемых моделей в BPMS. Уровня &quot;для чайников&quot; хватит для создания согласовательных схем.</p>
<p>А аналитикам и инженерам нужно знать нотацию всю.</p>
<p>Сегодня поговорим про элементы для “чайников”, будет 3 письма на эту тему. Но сначала пару слов про BPMN в целом.</p>
<h2 id="видеоверсия-и-повторение-3-урока" tabindex="-1"><a class="header-anchor" href="#видеоверсия-и-повторение-3-урока"><span>Видеоверсия и повторение 3 урока</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/qvXpMlXaRnQ?si=9XuIKPjr0iKMxfVD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="bpmn-развивается-с-2004-года" tabindex="-1"><a class="header-anchor" href="#bpmn-развивается-с-2004-года"><span>BPMN развивается с 2004 года</span></a></h2>
<p>Нотацию создавали и продолжают развивать с прицелом на:</p>
<ul>
<li>людей: в схемах, в основном, люди выполняют задачи.</li>
<li>разрушение функционального разделения в компаниях: процессы не зависят от того, в каких департаментах числятся люди.</li>
<li>потоки информации: процессы помогают понять, где, кем и когда создается важная для бизнеса информация.</li>
<li>Из-за этого схемы получаются хорошо читаемые, а для базового BPMN нужно понимать всего 10-14 элементов.</li>
</ul>
<h2 id="общая-схема-базового-bpmn" tabindex="-1"><a class="header-anchor" href="#общая-схема-базового-bpmn"><span>Общая схема базового BPMN</span></a></h2>
<p><img src="@source/bpmn/4_lesson_1.png" alt="image"></p>
<h2 id="таблица-описания-элементов" tabindex="-1"><a class="header-anchor" href="#таблица-описания-элементов"><span>Таблица описания элементов</span></a></h2>
<table>
<thead>
<tr>
<th></th>
<th></th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>№</td>
<td><strong>Название</strong></td>
<td><strong>Как выглядит</strong></td>
<td><strong>Зачем нужно</strong></td>
</tr>
<tr>
<td>1</td>
<td>Действие</td>
<td><img src="@source/bpmn/4_lesson_2.png" alt="image"></td>
<td>Отражает <strong>атомарную</strong> часть работы на схеме</td>
</tr>
<tr>
<td>2</td>
<td>Событие</td>
<td><img src="@source/bpmn/4_lesson_3.png" alt="image"></td>
<td>Показывает, что что-то случилось</td>
</tr>
<tr>
<td>3</td>
<td>Шлюз</td>
<td><img src="@source/bpmn/4_lesson_4.png" alt="image"></td>
<td>Разделяет или соединяет работы</td>
</tr>
<tr>
<td>4</td>
<td>Артефакт</td>
<td><img src="@source/bpmn/4_lesson_5.png" alt="image"></td>
<td>Улучшает читаемость схем</td>
</tr>
<tr>
<td>5</td>
<td>Поток</td>
<td><img src="@source/bpmn/4_lesson_6.png" alt="image"></td>
<td>Показывает последовательность выполнения работы или обмена сообщениями</td>
</tr>
<tr>
<td>6</td>
<td>Дорожка и пул</td>
<td><img src="@source/bpmn/4_lesson_7.png" alt="image"></td>
<td>Дорожки предназначены для группировки задач на схеме. А пулы показывают процесс или различных участников межпроцессного взаимодействия</td>
</tr>
</tbody>
</table>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>На самом BPMN предполагает указания исполнителя <strong>В КАЖДОМ КВАДРАТИКЕ</strong>, в специальном атрибуте. Поэтому использование дорожек для этой цели не всегда оправданно, но получило большое распространение. Мы в Stormbpmn предлагаем использовать <a href="/features/4_assignees">роли</a>, они более гибкие и на 100% сответствуют нотации.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_2W10c0YzcI?si=jp1w8TPZx5RFOrz5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<h2 id="как-выглядит-процесс-без-исполнителеи" tabindex="-1"><a class="header-anchor" href="#как-выглядит-процесс-без-исполнителеи"><span>Как выглядит процесс без исполнителей</span></a></h2>
<p>BPMN определяет процесс, как последовательность <strong>событий</strong>, <strong>шлюзов</strong> и <strong>действий</strong>, соединённых <strong>потоками</strong> и находящихся внутри <strong>пулов</strong>.</p>
<iframe src="https://stormbpmn.com/app/diagram/4fa8602e-4c86-4f4a-bc69-af7380337160?overlays=eyJkdXJhdGlvbiI6ZmFsc2UsImFzc2lnbmVlcyI6dHJ1ZSwicG9zaXRpb25zIjpmYWxzZSwic3lzdGVtcyI6dHJ1ZSwiZG9jdW1lbnRzIjp0cnVlLCJsaW5rcyI6ZmFsc2UsImNvbW1lbnRzIjpmYWxzZSwiZGVzY3JpcHRpb24iOmZhbHNlfQ==&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="400" width="100%" allowfullscreen></iframe>
<p>Процесс начинается с того, что произошло  <strong>начальное событие</strong> — клиент оставил заявку на сайте.
Через <strong>поток</strong> работа передается дальше по процессу в <strong>действие</strong>. Использован <strong>артефакт</strong>, который поможет читателю лучше понять схему.</p>
<p>Дальше работа передается с помощью <strong>потока</strong> в следующее действие. На  <strong>разделяющем шлюзе</strong> процесс говорит, что нужно пойти по одному из путей, это описано текстом на схеме.</p>
<p>После используется <strong>действие</strong> и <strong>шлюз</strong> (в зависимости от результата), а заканчивается всё <strong>завершающим событием</strong>. Весь процесс “обернут” <strong>пулом</strong>, в котором указано название процесса.</p>
<h2 id="факультатив" tabindex="-1"><a class="header-anchor" href="#факультатив"><span>Факультатив</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/ZID0FeLZQPE?si=yxn1ScxWPY4O5IAt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></template>


