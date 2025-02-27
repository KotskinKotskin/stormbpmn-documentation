<template><div><h1 id="задачи-администрирования" tabindex="-1"><a class="header-anchor" href="#задачи-администрирования"><span>Задачи администрирования</span></a></h1>
<h2 id="мониторинг" tabindex="-1"><a class="header-anchor" href="#мониторинг"><span>Мониторинг</span></a></h2>
<p>Система предоставляет http-endpoint с метриками приложения в формате Micrometer.</p>
<p>Для сбора этих метрик необходимо использовать Prometeus с такой конфигурацией:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>- job_name: 'storm-1' //повторить для всех нод
    metrics_path: '/actuator/prometheus'
    scrape_interval: 15s
    static_configs:
    - targets: ['10.1.0.3:80'] // ip-адрес сервиса
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>В Endpoint предоставляются базовые метрики spring-приложения, для их визуализации можно использовать вот такой <a href="https://grafana.com/grafana/dashboards/12835-spring-boot-statistics-6756-tomcat/" target="_blank" rel="noopener noreferrer">дашборд<ExternalLinkIcon/></a>.</p>
<h3 id="настроика-алертов" tabindex="-1"><a class="header-anchor" href="#настроика-алертов"><span>Настройка алертов</span></a></h3>
<p>Хорошими показателями для реагирования будет:</p>
<ul>
<li>СPU usage &gt; 0.90 &gt;5 min</li>
<li>Request Count /api/v1/* &gt; 100</li>
<li>HEAP used &gt;0.9 &gt;5</li>
<li>NO DATA &gt; 5 min</li>
</ul>
<p>При срабатывании алертов переходите к <a href="#disaster-recovery-plan-%D0%BF%D1%80%D0%B8-%D0%B1%D0%B0%D0%B7%D0%BE%D0%B2%D0%BE%D0%B8-%D1%8D%D0%BA%D1%81%D0%BF%D0%BB%D1%83%D0%B0%D1%82%D0%B0%D1%86%D0%B8%D0%B8">Disaster recovery</a>.</p>
<h3 id="liveness-и-readiness-probe" tabindex="-1"><a class="header-anchor" href="#liveness-и-readiness-probe"><span>Liveness и readiness probe</span></a></h3>
<p>Система предоставляет liveness и readiness проблы по адресам:</p>
<div class="language-yaml line-numbers-mode" data-ext="yml" data-title="yml"><pre v-pre class="language-yaml"><code> <span class="token key atrule">livenessProbe</span><span class="token punctuation">:</span>
            <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
              <span class="token key atrule">path</span><span class="token punctuation">:</span> /api/health/liveness
              <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
            <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">30</span> 
            <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
 <span class="token key atrule">readinessProbe</span><span class="token punctuation">:</span>
            <span class="token key atrule">httpGet</span><span class="token punctuation">:</span>
              <span class="token key atrule">path</span><span class="token punctuation">:</span> /api/health/readiness
              <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
            <span class="token key atrule">initialDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">30</span> 
            <span class="token key atrule">periodSeconds</span><span class="token punctuation">:</span> <span class="token number">5</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="резверное-копирование" tabindex="-1"><a class="header-anchor" href="#резверное-копирование"><span>Резверное копирование</span></a></h2>
<p>Вся ключевая  информация (схемы, описание и т.д.) хранится в базе данных.</p>
<p>Достаточно обеспечить ее резервное копирование удобными и принятыми инструментами. Например:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>pg_dump -h localhost XXX -U YYYY -W -Ft -b >/mnt/STORM.tar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Обеспечьте ежедневное резервное копирование и обеспечьте постоянное свободное место для резервных копий.</p>
<p>Обеспечьте информирование администратора системы информацией об успешных и неуспешных попытках сделать резервную копию.</p>
</div>
<h2 id="восстановление-резервнои-копии" tabindex="-1"><a class="header-anchor" href="#восстановление-резервнои-копии"><span>Восстановление резервной копии</span></a></h2>
<p>Восстановите базу данных любым удобным способом, например:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>pg_restore --format=t -c -N -O -h localhost -p 5432 -U YYYY -d ХХХ /mnt/STORM.tar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="обновление-версии" tabindex="-1"><a class="header-anchor" href="#обновление-версии"><span>Обновление версии</span></a></h2>
<ol>
<li>Определить текущую версию образа контейнера.</li>
<li>Ознакомиться с <a href="https://stormbpmn.changelogfy.com/changelog/en" target="_blank" rel="noopener noreferrer">changelog<ExternalLinkIcon/></a></li>
<li>Определить целевую версию образа контейнера.</li>
<li>Выполнить <a href="#%D1%80%D0%B5%D0%B7%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%B5-%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5">резервное копирование базы</a>.</li>
<li>Выполнить ЛОКАЛЬНОЕ сохранение текущего image контейнера.</li>
<li>Скачать целевую версию образа контейнера.</li>
<li>Сменить версию образа контейнера на целевую.</li>
<li>Дождаться положительных ответов liveness и readiness probe.</li>
<li>Обновление выполнено.</li>
</ol>
<p>При ошибках обновления перейти к <a href="#disaster-recovery-%D0%BF%D0%BB%D0%B0%D0%BD-%D0%BF%D1%80%D0%B8-%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B8">Disaster recovery plan</a>.</p>
<div class="hint-container caution">
<p class="hint-container-title">Предупреждение</p>
<p>Обновление между версией &lt;6.3.231 на более высокую требует манипуляции с базой.
Перед обновлением выполните запрос в БД:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>update databasechangelog set filename = CONCAT('/db/changelog/changes/',SUBSTRING(filename,35))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Обновление на версию &gt;=6.6.441 требует новых ENV переменных:</p>
<ul>
<li>STORM_ALLOWED_ORIGINS - установить значение, с которого разрешены сетевые запросы из браузера. Как правило это base_url, что-то типа https://storm.corp.local. Можно установить *(любой адрес), но кто вы после этого?</li>
<li>STORM_DISABLE_SIMPLE_AUTH - установить true \ false. Запрещает базовую авторизацию c емейлом и паролем по базе Stormbpmn.</li>
<li>STORM_DISABLE_ENV_IN_UI - установить true \ false. Запрещает просмотр ENV-значений в UI администратора.</li>
<li>STORM_DISABLE_ANON_SHARING - установить true \ false.  запрещает делиться диаграммами анонимно.  Переопределяет настройку enableAnonDiagrams в UI администратора.</li>
<li>STORM_SENTRY_ENABLE - установить false.</li>
<li>STORM_ENABLE_SAAS_FEATURES - установить false.</li>
<li>GOTENBERG_URL - ссылка на URL-сервериса конвертации docx в pdf, например. https://demo.gotenberg.dev. Можно вписать что угодно, если не используете конверацию.</li>
<li></li>
</ul>
<p>Обновление на версию &gt;=6.6.559 требует установки extention базы данных:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>CREATE EXTENSION IF NOT EXISTS pgcrypto;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div>
<h2 id="disaster-recovery-plan-при-обновлении" tabindex="-1"><a class="header-anchor" href="#disaster-recovery-plan-при-обновлении"><span>Disaster recovery plan при обновлении</span></a></h2>
<ol>
<li>Сохранить логи контейнера.</li>
<li><a href="#%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%80%D0%B5%D0%B7%D0%B5%D1%80%D0%B2%D0%BD%D0%BE%D0%B8-%D0%BA%D0%BE%D0%BF%D0%B8%D0%B8">Восстановить базу</a>.</li>
<li>Вернуть предидущую версию котнейнера.</li>
<li>Перезагрузить контнейнер.</li>
<li>Сообщить <a href="#%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D1%83%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D0%B8">информацию</a> по <a href="#%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8">каналу поддержки</a>. Укажите версию, на которую обновиться не вышло и с какой обновлялись.</li>
<li>Ожидать решения от поддержки.</li>
</ol>
<h2 id="disaster-recovery-plan-при-базовои-эксплуатации" tabindex="-1"><a class="header-anchor" href="#disaster-recovery-plan-при-базовои-эксплуатации"><span>Disaster recovery plan при базовой эксплуатации</span></a></h2>
<ol>
<li>Сохранить логи контейнера.</li>
<li>Перезагрузить контнейнер.</li>
<li>Сообщить <a href="#%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D1%83%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D0%B8">информацию</a> по <a href="#%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8">каналу поддержки</a>.</li>
<li>Ожидать решения от поддержки.</li>
</ol>
<h2 id="особенности" tabindex="-1"><a class="header-anchor" href="#особенности"><span>Особенности</span></a></h2>
<ul>
<li>Настройте максимальный размер пакетов на балансере в 10MB (директива client_max_body_size для nginx).</li>
<li>Укажите JAVA_OPTS в ENV контейнера как минимум -Xmx<strong>2</strong>g</li>
</ul>
</div></template>


