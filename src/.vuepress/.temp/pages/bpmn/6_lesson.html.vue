<template><div><h1 id="_6-урок-bpmn-для-чаиников-пулы-и-дорожки-3-3" tabindex="-1"><a class="header-anchor" href="#_6-урок-bpmn-для-чаиников-пулы-и-дорожки-3-3"><span>6 урок: BPMN для &quot;чайников&quot;. Пулы и дорожки. (3/3)</span></a></h1>
<p>В этом письме заканчиваем тему базовых элементов. Я расскажу, как использовать дорожки и пулы правильно и избежать ошибок.</p>
<h2 id="пулы" tabindex="-1"><a class="header-anchor" href="#пулы"><span>Пулы</span></a></h2>
<p>Пулы отображают участников взаимодействия СНАРУЖИ процесса -  можно понимать организации, отделы, процессы — это зависит от вашей точки зрения на процесс. Как правило, если вы рисуете сквозной процесс, у вас будет один пул для вашей организации и прочие — для ваших клиентов, партнёров и так далее.</p>
<p><img src="@source/bpmn/6_lesson_1.png" alt="image"></p>
<h2 id="исполнители" tabindex="-1"><a class="header-anchor" href="#исполнители"><span>Исполнители</span></a></h2>
<p>Для того чтобы показать отдельное подразделение или роль, отвечающую за конкретный шаг, вы можете разделить использовать цвета, роли, анотации над элементами или явное указание исполнителя в названии задачи.</p>
<iframe src="https://stormbpmn.com/app/diagram/6346b347-13b9-48f2-9cf6-b2fef7a89070?overlays=eyJkdXJhdGlvbiI6ZmFsc2UsImFzc2lnbmVlcyI6dHJ1ZSwicG9zaXRpb25zIjpmYWxzZSwic3lzdGVtcyI6ZmFsc2UsImRvY3VtZW50cyI6ZmFsc2UsImxpbmtzIjpmYWxzZSwiY29tbWVudHMiOmZhbHNlLCJkZXNjcmlwdGlvbiI6ZmFsc2V9&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="500" width="100%" allowfullscreen></iframe>
<p>BPMN предполагает, что когда вы рисуете собственную организацию в процессе, вы имеете полный контроль над тем, как выполняется процесс.</p>
<h2 id="взаимодеиствие-исполнителеи-между-собои" tabindex="-1"><a class="header-anchor" href="#взаимодеиствие-исполнителеи-между-собои"><span>Взаимодействие исполнителей между собой</span></a></h2>
<p>Как помните, я показывал вам 3 типа линии.</p>
<p><img src="@source/bpmn/6_lesson_3.png" alt="image"></p>
<p>Линияи спользуется для соединения элементов процесса (события, задачи, подпроцессы, шлюзы) в пуле. Вы не можете начать или прервать эту линию в процессе просто так. Линии должны начинаться на стартовых событиях, а заканчиваться на завершающих событиях.</p>
<p>Линия НЕ может выходить за границу пула: это нарушит целостность процесса, и вы потеряете над ним контроль.</p>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Вы не можете рисовать задачи, события, шлюзы другим организациям. Только своей.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/hCt6EJxtxpE?si=JREbAI7iUVCEQ7rW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<h2 id="взаимодеиствие-пулов-между-собои" tabindex="-1"><a class="header-anchor" href="#взаимодеиствие-пулов-между-собои"><span>Взаимодействие пулов между собой</span></a></h2>
<p>Для отображения деталей общения пулов, т.е. процессов или организаций, вы должны использовать поток сообщений.</p>
<iframe src="https://stormbpmn.com/app/diagram/6346b347-13b9-48f2-9cf6-b2fef7a89070?overlays=eyJkdXJhdGlvbiI6ZmFsc2UsImFzc2lnbmVlcyI6dHJ1ZSwicG9zaXRpb25zIjpmYWxzZSwic3lzdGVtcyI6ZmFsc2UsImRvY3VtZW50cyI6ZmFsc2UsImxpbmtzIjpmYWxzZSwiY29tbWVudHMiOmZhbHNlLCJkZXNjcmlwdGlvbiI6ZmFsc2V9&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="500" width="100%" allowfullscreen></iframe>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Потоки сообщений допускаются только между пулами</p>
</div>
<h2 id="типичные-ошибки-и-способ-их-решения" tabindex="-1"><a class="header-anchor" href="#типичные-ошибки-и-способ-их-решения"><span>Типичные ошибки и способ их решения</span></a></h2>
<p><img src="@source/bpmn/6_lesson_5.png" alt="image"></p>
<p>Чтобы исправить эти ошибку нам нужно соединить два первых пула в один, т.к. эти задачи выполняет одна организация.</p>
<p>А следом нам нужно добавить пул для отображения клиента, чтобы события получения и отправки оплаты выглядели как чёрный ящик: так называют пулы, когда реализация того, что находится внутри них, нашему процессу не интересна.</p>
<p>Нам всё равно, как клиент оплачивает заказы.</p>
<div class="hint-container important">
<p class="hint-container-title">Важно</p>
<p>Stormbpmn не позволит совершать такие (и многие другие) ошибки за счет автоматческого <RouteLink to="/features/1_bpmn-editor.html#%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE-%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2-bpmn">контроля качества</RouteLink></p>
</div>
<h2 id="факультатив" tabindex="-1"><a class="header-anchor" href="#факультатив"><span>Факультатив</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/EshGX0pa6_M?si=aEn1R3U4jBfpPaMw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></template>


