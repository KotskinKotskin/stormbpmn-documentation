<template><div><h1 id="_8-урок-хорошии-стиль-bpmn" tabindex="-1"><a class="header-anchor" href="#_8-урок-хорошии-стиль-bpmn"><span>8 урок: Хороший стиль BPMN</span></a></h1>
<p>Вы уже умеете использовать BPMN и знаете, как проверять корректность схем. Этого ещё недостаточно, чтобы делать адекватные и читаемые диаграммы. Сегодня поговорим про “хороший стиль” моделирования и о том, что нужно обязательно учитывать, когда делаете схемы.</p>
<h2 id="видеоверсия" tabindex="-1"><a class="header-anchor" href="#видеоверсия"><span>Видеоверсия</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/KmwUmINlzGo?si=F9C03KODLxb-FJcz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="зачем-нужен-хорошии-стиль" tabindex="-1"><a class="header-anchor" href="#зачем-нужен-хорошии-стиль"><span>Зачем нужен хороший стиль</span></a></h2>
<p>Ваши схемы могут видеть сотни людей — коллеги в офисе, посетители вашей страницы на Facebook, разработчики BPMS-систем. Чтобы людям было удобно работать со схемами, недостаточно соблюдать спецификацию BPMN — она не учитывает особенности человеческого восприятия.</p>
<p>Работая с разными схемами, я прочувствовал правила “хорошего стиля”, т.е. негласное соглашение о том, как лучше оформлять схемы. Делюсь с вами.</p>
<h2 id="элементы-хорошего-стиля" tabindex="-1"><a class="header-anchor" href="#элементы-хорошего-стиля"><span>Элементы хорошего стиля</span></a></h2>
<h3 id="happy-path" tabindex="-1"><a class="header-anchor" href="#happy-path"><span>Happy path</span></a></h3>
<p>Последовательность работ должна идти слева направо. По визуальному центру схемы должен быть расположен типичный сценарий выполнения процесса.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_1.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_2.png" alt="image"></th>
</tr>
</thead>
</table>
<p>Так удобнее воспринимать схему. Она читается так же, как и текст. Читателю не нужно концентрироваться на происходящем в процессе — можно поднять взгляд до визуальной середины схемы и понять, что происходит.</p>
<h3 id="наименование-задачи-глагол-существительное" tabindex="-1"><a class="header-anchor" href="#наименование-задачи-глагол-существительное"><span>Наименование задачи “Глагол” + “Существительное”</span></a></h3>
<p>Любая пользовательская задача для сотрудников должна именоваться по шаблону.</p>
<p><strong>Плохо</strong><br>
Заявка оформляется<br>
<strong>Хорошо</strong><br>
Оформить заявку</p>
<p>Задачи превратятся в поручения на корпоративном портале. Сотрудникам будет понятно, что делать</p>
<h3 id="процесс-без-дорожек" tabindex="-1"><a class="header-anchor" href="#процесс-без-дорожек"><span>Процесс без дорожек</span></a></h3>
<p>Рисуйте процесс без указания исполнителей. Концентрируйтесь на задачах и последовательностях.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_3.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_4.png" alt="image"></th>
</tr>
</thead>
</table>
<p>Исполнители довольно просто определяются в конце работы с процессом, когда сама схема уже готова. Чтобы не создавать много пустого места дорожками исполнителей, рисуйте без использования дорожек.</p>
<h3 id="много-заверающих-событии" tabindex="-1"><a class="header-anchor" href="#много-заверающих-событии"><span>Много заверающих событий</span></a></h3>
<p>Рисуйте схемы так, чтобы каждому варианту завершения процесса соответствовало завершающее событие.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_5.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_6.png" alt="image"></th>
</tr>
</thead>
</table>
<p>В будущем вам потребуется аналитика о том, как завершаются процессы. Если все они сходятся в одно событие, то собрать такую статистику будет проблематично.</p>
<h3 id="нумерация-шлюзов" tabindex="-1"><a class="header-anchor" href="#нумерация-шлюзов"><span>Нумерация шлюзов</span></a></h3>
<p>Каждый шлюз должен иметь номер, каждый поток работ (если он не один в шлюзе) должен быть подписан и пронумерован.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_7.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_8.png" alt="image"></th>
</tr>
</thead>
</table>
<p>Диаграммы процесса мало для успешной автоматизации. Чтобы обсуждать шлюзы и развилки, нужно их как-то называть, а без нумерации это затруднительно.</p>
<h3 id="путь-по-умолчанию" tabindex="-1"><a class="header-anchor" href="#путь-по-умолчанию"><span>Путь по-умолчанию</span></a></h3>
<p>Указывайте на шлюзах поток по умолчанию.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_9.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_10.png" alt="image"></th>
</tr>
</thead>
</table>
<p>Сэкономите время себе и программисту.</p>
<h3 id="один-вход-один-выход-в-задаче" tabindex="-1"><a class="header-anchor" href="#один-вход-один-выход-в-задаче"><span>Один вход, один выход в задаче</span></a></h3>
<p>В задачу делайте один входящий поток и один выходящий.</p>
<table>
<thead>
<tr>
<th><img src="@source/bpmn/8_lesson_11.png" alt="image"></th>
<th><img src="@source/bpmn/8_lesson_12.png" alt="image"></th>
</tr>
</thead>
</table>
<p>Разные движки BPMS реализуют множественные потоки по-разному — где-то множественные стрелки будут поняты как распараллеливание, где-то — как выбор. Используйте шлюзы, чтобы явно указать логику.</p>
<h3 id="не-используите-условныи-переход" tabindex="-1"><a class="header-anchor" href="#не-используите-условныи-переход"><span>Не используйте условный переход</span></a></h3>
<p><img src="@source/bpmn/8_lesson_13.png" alt="image"><br>
Это избыточный символ BPMN, который портит читаемость — со схемы непонятно, что хотели сказать. Используйте шлюзы, если есть условия для перехода потоков.</p>
<h2 id="факультатив" tabindex="-1"><a class="header-anchor" href="#факультатив"><span>Факультатив</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/bfHvofV_xkk?si=P_qw7IxZowzd3zqu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div></template>


