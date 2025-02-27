<template><div><h1 id="get-started" tabindex="-1"><a class="header-anchor" href="#get-started"><span>Get started</span></a></h1>
<p>Для минимальной работы приложения вам нужно всего 2 контейнера - сам контейнер приложения и база данных.</p>
<h2 id="настроика-базы" tabindex="-1"><a class="header-anchor" href="#настроика-базы"><span>Настройка базы</span></a></h2>
<ul>
<li>Разверните в докере Postgresql (12 или старше версии) или воспользуйтесь существующей инфраструктурой в компании.</li>
<li>Создайте схему (не обязательно, будет использоваться public по умолчанию). Запомните название.</li>
<li>Создайте базу. Запомните название.</li>
<li>Создайте пользователя с полными правами доступа к базе (и схему). Запомните логин и пароль.</li>
<li>Узнайте порт, на котором работает сервер БД. Запомните его.</li>
<li>Обеспечьте сетевую доступность между базой и предполагаемым местом установки основного контейнера.</li>
</ul>
<h2 id="настроика-приложения-через-env-переменные" tabindex="-1"><a class="header-anchor" href="#настроика-приложения-через-env-переменные"><span>Настройка приложения через .ENV-переменные</span></a></h2>
<ul>
<li>Скачайте образ приложения из репозитория (запросите ссылку и параметры авторизации у нас).</li>
<li>Передайте значения в ENV переменные
<ul>
<li><strong>JDBC_URL</strong> - строка подключения к базе. Ожидается значение, похожее на <strong>jdbc:postgresql://192.168.0.6:5432/storm</strong>, где <strong>192.168.0.6</strong> - адрес сервера БД, <strong>5432</strong> - порт сервера БД,  <strong>storm</strong> - название базы. Если требуется указать схему, то значение будет выглядеть так jdbc:postgresql://localhost:5432/mydatabase?currentSchema=myschema</li>
<li><strong>JDBC_USERNAME</strong> - название учетной записи.</li>
<li><strong>JDBC_PASSWORD</strong> - пароль учетной записи.</li>
<li><strong>JAVA_OPTS</strong> -  значение оперативки, которое выделили контейнеру. Ожидается значение, похожее на &quot;-Xmx8g&quot;</li>
<li><strong>SPRING_PROFILES_ACTIVE</strong> - установить prod.</li>
<li><strong>LICENSE_KEY</strong> - лицензионный ключ. Запросите его у нас.</li>
<li><strong>JWTSECRET</strong> - соль для шифрования паролей. Укажите не меньше 15 символов, желательно случайных.</li>
</ul>
</li>
<li>Запустите контейнер, если всё ок, то миграции в базу данных выполнятся автоматически.</li>
<li>Пропишите порт, по которому хотите ходить в приложение. Контейнер выставляет наружу порт 8080.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Вот и всё, минимальная установка готова! Вы сможете попасть в приложение через веб интерфейс по порту, который прописали выше.</p>
</div>
<h2 id="создание-административнои-учетнои-записи" tabindex="-1"><a class="header-anchor" href="#создание-административнои-учетнои-записи"><span>Создание административной учетной записи</span></a></h2>
<ul>
<li>Зайдите в приложение по адресу <strong>/app/signup</strong></li>
<li>Зарегистрируйтесь с логином и паролем</li>
<li>Войдите в систему</li>
<li>Перейдите по ссылке <strong>/app/team</strong></li>
<li>Создайте команду</li>
<li>Выполните в базе данных запрос</li>
</ul>
<div class="language-sql line-numbers-mode" data-ext="sql" data-title="sql"><pre v-pre class="language-sql"><code><span class="token keyword">update</span> sm_teams <span class="token keyword">set</span> full_access <span class="token operator">=</span> <span class="token boolean">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Теперь учетная запись является административной и все последующие учетные записи в этой команде тоже будут административными. Перезайдите в систему, чтобы получить доступ в административный интерфейс. Не используйте эту учетную запись в работе.</p>
<p><img src="@source/enterprise/Установка/admin-link.png" alt="image"></p>
<h2 id="настроика-авторизации" tabindex="-1"><a class="header-anchor" href="#настроика-авторизации"><span>Настройка авторизации</span></a></h2>
<p>Для настройки входа в систему прочитайте <RouteLink to="/enterprise/security.html">отдельную инструкцию по обеспечению информационной безопасности</RouteLink> и выберите подходящий для себя вариант.</p>
</div></template>


