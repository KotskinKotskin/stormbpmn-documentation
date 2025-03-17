<template><div><h1 id="связь-между-диаграммами" tabindex="-1"><a class="header-anchor" href="#связь-между-диаграммами"><span>Связь между диаграммами</span></a></h1>
<h2 id="cвязь-между-as-is-и-to-be" tabindex="-1"><a class="header-anchor" href="#cвязь-между-as-is-и-to-be"><span>Cвязь между AS-IS и TO-BE</span></a></h2>
<p>Для установления связи в <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F">меню сохранения</a> установить тип процесса и связанный процесс:<br>
<img src="@source/features_new_storm/1_bpmn-editor/as-is-to-be-2.png" alt="imaget"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Советуем для начала хорошенько проработать модель AS-IS, тогда её можно будет дублировать и на базе дубля сделать TO-BE. Также это сделает возможным автоматическое сравнение схем (когда оно будет готово).</p>
</div>
<div class="hint-container caution">
<p class="hint-container-title">В разработке</p>
<h2 id="связь-двух-процессов" tabindex="-1"><a class="header-anchor" href="#связь-двух-процессов"><span>Связь двух процессов</span></a></h2>
<p>Бизнес-процессы редко работают в одиночку. В целях декомпозиции и управляемости их часто разделяют на разные процессы, которые даже могут описываться разными людьми, департаментами, компаниями.</p>
<p>Система поддерживает возможность связи процессов друг с другом с целью удобной навигации и построения графов связности.</p>
<p>Просматривать связи можно через <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BE%D0%B2%D0%B5%D1%80%D0%BB%D0%B5%D0%B5%D0%B2">меню оверлеев</a> или <a href="#%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D0%B5-%D0%BC%D0%B5%D0%BD%D1%8E">правое меню</a>.</p>
<h3 id="связь-через-call-activity-и-participant" tabindex="-1"><a class="header-anchor" href="#связь-через-call-activity-и-participant"><span>Связь через Call activity и Participant</span></a></h3>
<p>Для установления связи через Call activity\Participant откройте <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</a> и укажите соответствующий связанный бизнес-процесс:<br>
<img src="@source/features_new_storm/1_bpmn-editor/links-1.png" alt="imaget"></p>
<h3 id="связь-через-message-catch-events-message-catch-task" tabindex="-1"><a class="header-anchor" href="#связь-через-message-catch-events-message-catch-task"><span>Связь через Message Catch Events \ Message Catch Task</span></a></h3>
<p>Для установления такой связи откройте <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</a> и укажите соответствующий связанный элемент отправки сообщения:<br>
<img src="@source/features_new_storm/1_bpmn-editor/links-2.png" alt="imaget"></p>
</div>
</div></template>


