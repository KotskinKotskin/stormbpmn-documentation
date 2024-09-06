<template><div><h1 id="_7-урок-проверка-bpmn-схем-на-корректность" tabindex="-1"><a class="header-anchor" href="#_7-урок-проверка-bpmn-схем-на-корректность"><span>7 урок: Проверка BPMN-схем на корректность</span></a></h1>
<p>Настало время научиться проверять, что схема, которую мы составили, не содержит логических ошибок. Для этого в BPMN-науке используется воображаемая игра — Token game.</p>
<h2 id="видеоверсия" tabindex="-1"><a class="header-anchor" href="#видеоверсия"><span>Видеоверсия</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/44y1u8BWR6Y?si=TXVBH5u5aoHMkylN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="идея" tabindex="-1"><a class="header-anchor" href="#идея"><span>Идея</span></a></h2>
<p>Token games — это игра с жетонами, или “токенами”. Такая же, как любая настольная игра. Только вместо поля настольной игры используется поле вашего процесса.</p>
<p><img src="@source/bpmn/7_lesson_1.png" alt="image"></p>
<p>Токены появляются на стартовых событиях, по одной штуке на событие.  Количество токенов не меняется на действиях, но может меняться на развилках. Хотя бы один токен должен дойти до завершающего события, чтобы процесс считался завершённым.</p>
<p>По итогам прохождения процесса все токены должны исчезнуть.</p>
<h2 id="развилка-или" tabindex="-1"><a class="header-anchor" href="#развилка-или"><span>Развилка ИЛИ</span></a></h2>
<p>На вход приезжает токен — на выход идёт всегда один токен, по одному из путей.</p>
<p>ИЛИ не увеличивает количество токенов. Эта развилка отрабатывает сразу же, как только приехал токен.</p>
<p><img src="@source/bpmn/7_lesson_2.gif" alt="image"></p>
<h2 id="развилка-и" tabindex="-1"><a class="header-anchor" href="#развилка-и"><span>Развилка И</span></a></h2>
<p>Эта развилка хитрая:</p>
<ul>
<li>Развилка выпускает столько токенов, сколько исходящих потоков указано.</li>
<li>Развилка срабатывает не мгновенно, а только тогда, когда на неё приходит столько токенов, сколько указано на входном шлюзе.</li>
</ul>
<p><img src="@source/bpmn/7_lesson_3.gif" alt="image"></p>
<h2 id="пример-проверки-схем-через-token-game" tabindex="-1"><a class="header-anchor" href="#пример-проверки-схем-через-token-game"><span>Пример проверки схем через token game</span></a></h2>
<p><img src="@source/bpmn/7_lesson_4.png" alt="image"></p>
<p>Развилка №2 никогда не пропустит процесс дальше, т.к. ждёт 3 токена на вход (потому что 3 входящих потока), но ИЛИ развилка между Task 2 и Task 3 запустит токен только по одному из потоков.</p>
<p>Исправляется тем, что мы добавляем исключающий шлюз, который “соберёт” токены, перед тем, как их вставить в шлюз №2.</p>
<p><img src="@source/bpmn/7_lesson_5.png" alt="image"></p>
<h2 id="проверка-больших-схем" tabindex="-1"><a class="header-anchor" href="#проверка-больших-схем"><span>Проверка больших схем</span></a></h2>
<p>Для валидации больших схем одной внимательности не хватит — нужно использовать специализированные средства, например, <RouteLink to="/features/1_bpmn-editor.html#%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE-%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2-bpmn">проверку качества в stormbpmn.com</RouteLink>.</p>
<h2 id="факультатив" tabindex="-1"><a class="header-anchor" href="#факультатив"><span>Факультатив</span></a></h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/GUCgr7J-Pzs?si=GteDuwUi7NVRlb4M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div></template>


