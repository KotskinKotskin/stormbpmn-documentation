<template><div><h1 id="связь-между-диаграммами" tabindex="-1"><a class="header-anchor" href="#связь-между-диаграммами"><span>Связь между диаграммами</span></a></h1>
<h2 id="cвязь-между-as-is-и-to-be" tabindex="-1"><a class="header-anchor" href="#cвязь-между-as-is-и-to-be"><span>Cвязь между AS-IS и TO-BE</span></a></h2>
<p>Для установления связи в <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F">меню сохранения</a> установить тип процесса и связанный процесс:<br>
<img src="@source/features_new_storm/1_bpmn-editor/as-is-to-be-2.png" alt="imaget"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Советуем для начала хорошенько проработать модель AS-IS, тогда её можно будет дублировать и на базе дубля сделать TO-BE. Также это сделает возможным автоматическое сравнение схем (когда оно будет готово).</p>
</div>
<h2 id="связь-процессов" tabindex="-1"><a class="header-anchor" href="#связь-процессов"><span>Связь процессов</span></a></h2>
<p>Бизнес-процессы редко работают в одиночку. В целях декомпозиции и управляемости их часто разделяют на разные процессы, которые даже могут описываться разными людьми, департаментами, компаниями.</p>
<p>Система поддерживает возможность связи процессов друг с другом с целью удобной навигации и построения графов связности.</p>
<p>Просматривать связи можно через <a href="#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BE%D0%B2%D0%B5%D1%80%D0%BB%D0%B5%D0%B5%D0%B2">меню оверлеев</a> или <a href="#%D0%BF%D1%80%D0%B0%D0%B2%D0%BE%D0%B5-%D0%BC%D0%B5%D0%BD%D1%8E">правое меню</a>.</p>
<h2 id="связь-через-вызов-переиспользуемого-подпроцесса-call-activity" tabindex="-1"><a class="header-anchor" href="#связь-через-вызов-переиспользуемого-подпроцесса-call-activity"><span>Связь через вызов переиспользуемого подпроцесса (Call activity)</span></a></h2>
<h2 id="связь-для-свернутого-пула-empty-pool" tabindex="-1"><a class="header-anchor" href="#связь-для-свернутого-пула-empty-pool"><span>Связь для свернутого пула (Empty pool)</span></a></h2>
<p>Установить связь Call activity с диаграммой его &quot;раскрытия&quot; возможно двумя способами:</p>
<ol>
<li>в <RouteLink to="/features_new_storm/1_bpmn-editor/#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</RouteLink>: создать, найти или выбрать из списка соответствующую связанную диаграмму процесса:</li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_CA_create-1.png" alt="imaget"></p>
<ol start="2">
<li>с помощью <strong>призрачного оверлея &quot;Создание связи:&quot;</strong></li>
</ol>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_CA_create-2.png" alt="imaget"></p>
<p><strong>Для свернутого пула (Empty pool) создание связи аналогично</strong></p>
<h2 id="связь-через-отправку-получение-сообщения" tabindex="-1"><a class="header-anchor" href="#связь-через-отправку-получение-сообщения"><span>Связь через отправку, получение сообщения</span></a></h2>
<h2 id="link-message-throw-event-task-message-catch-event-task" tabindex="-1"><a class="header-anchor" href="#link-message-throw-event-task-message-catch-event-task"><span>Link Message Throw Event (Task), Message Catch Event (Task)</span></a></h2>
<div class="hint-container warning">
<p class="hint-container-title">Напоминаем</p>
<p>Отправку сообщения можно обозначать как событием (Message Throw Event), так и задачей (Message Throw Task). Аналогично и получение сообщения может быть как событием (Message Catch Event), так и задачей (Message Catch Task). <br>
При этом, допустимо показать отправку событием, получение - задачей и наоборот, отправку - задачей, получение - событием</p>
</div>
<p>Для установления связи между отправкой сообщения (Message Throw Event/Task) и его получением (Message Catch Event/Task) необходимо сперва создать одно из событий: отправки или получения.</p>
<p>Например, создать сперва отправку сообщения в <RouteLink to="/features_new_storm/1_bpmn-editor/#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</RouteLink></p>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_MTE_create.png" alt="imaget"></p>
<p>Аналогично отправку сообщения можно создать с помощью <strong>призрачного оверлея &quot;Создание связи:&quot;</strong></p>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_MTT_create.png" alt="imaget"></p>
<p>После этого создать получение сообщения и связать с ним отправку:</p>
<ul>
<li>в <RouteLink to="/features_new_storm/1_bpmn-editor/#%D0%BC%D0%B5%D0%BD%D1%8E-%D0%BF%D0%BE%D0%B4%D1%80%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B8">меню подробностей</RouteLink></li>
</ul>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_MCT_create.png" alt="imaget"></p>
<ul>
<li>с помощью <strong>призрачного оверлея &quot;Создание связи:&quot;</strong></li>
</ul>
<p><img src="@source/features_new_storm/1_bpmn-editor/link_MCE_create.png" alt="imaget"></p>
<p>Допустимо делать и наоборот - сперва создать получения сообщения, а потом связать с ним отправку</p>
</div></template>


