<template><div><h1 id="_3-урок-3-уровня-моделирования-bpmn-схем" tabindex="-1"><a class="header-anchor" href="#_3-урок-3-уровня-моделирования-bpmn-схем"><span>3 урок:  3 уровня моделирования BPMN-схем</span></a></h1>
<p>Bpmn2 содержит ~480 элементов, которые не только описывают бизнес-процессы, но и могут использоваться для создания исполняемых программ в BPMS. При этом использование всей палитры может усложнить схему и сделать ее нечитаемой.</p>
<p>Авторы BPMN выделяют 3 уровня моделирования:</p>
<ul>
<li>
<p>Согласовательный (описательный);</p>
</li>
<li>
<p>Аналитический;</p>
</li>
<li>
<p>Исполняемый.</p>
</li>
</ul>
<p>Адаптация схемы под уровень моделирования и включение дополнительных деталей на каждом уровне помогут вам избежать проблем при согласовании и сэкономят много времени.</p>
<h2 id="согласовательныи-уровень" tabindex="-1"><a class="header-anchor" href="#согласовательныи-уровень"><span>Согласовательный уровень</span></a></h2>
<p>Это уровень для руководства, которое заинтересовано в улучшении процесса. Как правило, руководителям интересны:</p>
<ul>
<li>результат процесса;</li>
<li>основные задачи процесса;</li>
<li>исполнители процесса;</li>
<li>общение с внешними участниками процесса;</li>
<li>KPI процесса;</li>
</ul>
<p>Если вы готовите такую схему, то учитывайте, что она должна быть понятна людям без опыта в BPMN.<br>
<img src="@source/bpmn/3_lesson_1.png" alt="image"></p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Для подобных схем рекомендую использовать только элементы: пул, задача, подпроцесс, начальное событие, промежуточное событие, завершающее событие.</p>
</div>
<p>Схема должна показывать только один путь, приводящий процесс к ожидаемому результату.</p>
<p>В примере использованы подпроцессы (квадратики с плюсиками) и клиент, как внешняя, пустая сущность. Почему так сделано, вы узнаете из следующих писем, сейчас это не важно.</p>
<iframe src="https://stormbpmn.com/app/diagram/e58ce143-18b1-4e2f-b808-0e56f8bd5605?overlays=eyJkdXJhdGlvbiI6ZmFsc2UsImFzc2lnbmVlcyI6dHJ1ZSwicG9zaXRpb25zIjpmYWxzZSwic3lzdGVtcyI6ZmFsc2UsImRvY3VtZW50cyI6ZmFsc2UsImxpbmtzIjpmYWxzZSwiY29tbWVudHMiOmZhbHNlLCJkZXNjcmlwdGlvbiI6ZmFsc2V9&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="500" width="100%" allowfullscreen></iframe>
<h2 id="аналитическии-уровень" tabindex="-1"><a class="header-anchor" href="#аналитическии-уровень"><span>Аналитический уровень</span></a></h2>
<p>Это уровень для непосредственных участников процесса и аналитика. Схема такого уровня может быть ежедневной инструкцией.</p>
<div class="hint-container warning">
<p class="hint-container-title">Примечание</p>
<p>Ежедневной инструкцией по тому, как работают процессы, но не как выполнять операции! BPMN плохо подходит для описания операций конкретной роли.</p>
</div>
<p>Для аналитиков из такой схемы интересны:</p>
<ul>
<li>логичность процесса в целом;</li>
<li>разделение задач между системами и пользователями;</li>
<li>потенциальная возможность улучшения процесса за счёт оптимизации или автоматизации.</li>
</ul>
<p>Для исполнителей интересно:</p>
<ul>
<li>С кем общаться, когда выполняем процесс.</li>
</ul>
<iframe src="https://stormbpmn.com/app/diagram/c5ebe0b2-b8be-4a2c-974a-052cb42eccb4?overlays=eyJkdXJhdGlvbiI6dHJ1ZSwiYXNzaWduZWVzIjp0cnVlLCJwb3NpdGlvbnMiOnRydWUsInN5c3RlbXMiOnRydWUsImRvY3VtZW50cyI6dHJ1ZSwibGlua3MiOmZhbHNlLCJjb21tZW50cyI6ZmFsc2UsImRlc2NyaXB0aW9uIjpmYWxzZX0=&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="400" width="100%" allowfullscreen></iframe>
<p>В сравнении с согласовательной моделью здесь нужно:</p>
<ul>
<li>раскрыть подпроцессы до задач;</li>
<li>указать данные, которые важны для процесса;</li>
<li>указать альтернативные сценарии, если они есть.</li>
</ul>
<p>Такую схему нужно обязательно согласовать с экспертами в предметной области, т.к. в дальнейшем эти схемы становятся базой для исполняемых моделей.</p>
<h2 id="исполняемыи-уровень" tabindex="-1"><a class="header-anchor" href="#исполняемыи-уровень"><span>Исполняемый уровень</span></a></h2>
<p>Модель этого уровня нужна для инженера BPMS. Она похожа на аналитическую модель, но должна быть дополнена следующей информацией (в том числе текстом):</p>
<ul>
<li>данные процесса;</li>
<li>группы и роли;</li>
<li>бизнес-правила;</li>
<li>пользовательский интерфейс;</li>
<li>KPI;</li>
<li>скрипты и сервисные задачи.</li>
</ul>
<p><img src="@source/bpmn/3_lesson_5.png" alt="image"></p>
<p>Про каждый из пунктов ещё будут письма в рассылке.</p>
<iframe src="https://stormbpmn.com/app/diagram/6346b347-13b9-48f2-9cf6-b2fef7a89070?overlays=eyJkdXJhdGlvbiI6ZmFsc2UsImFzc2lnbmVlcyI6dHJ1ZSwicG9zaXRpb25zIjpmYWxzZSwic3lzdGVtcyI6dHJ1ZSwiZG9jdW1lbnRzIjp0cnVlLCJsaW5rcyI6ZmFsc2UsImNvbW1lbnRzIjpmYWxzZSwiZGVzY3JpcHRpb24iOmZhbHNlfQ==&embedded=true" style="border:1px #f2f2f2 none;" name="extAdmin" scrolling="no" frameborder="1"  height="500" width="100%" allowfullscreen></iframe>
<h2 id="выводы" tabindex="-1"><a class="header-anchor" href="#выводы"><span>Выводы</span></a></h2>
<p>Заранее определяйтесь с потребителями вашей схемы и используйте соответствующий уровень моделирования.</p>
</div></template>


