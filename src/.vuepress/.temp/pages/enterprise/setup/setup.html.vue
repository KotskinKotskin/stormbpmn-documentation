<template><div><h1 id="установка" tabindex="-1"><a class="header-anchor" href="#установка"><span>Установка</span></a></h1>
<p>Stormbpmn поставляется как docker-контейнер из приватного репозитория, который включается в себя и front, и back. Установка заключается в правильном указании .ENV-перменных внутрь контейнера, поднятии смежных контейнеров (если необходимо), и манипуляции в административном интерфейсе.</p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Контейнер расположен в приватном репозитории, запросите доступ к нему через менеджера, с которым работаете.</p>
</div>
<h2 id="верхнеуровневая-архитектура" tabindex="-1"><a class="header-anchor" href="#верхнеуровневая-архитектура"><span>Верхнеуровневая архитектура</span></a></h2>
<p>Если использовать все возможности системы, то компонентная архитектура будет выглядеть так:</p>
<p><img src="@source/enterprise/setup/storm_arch.png" alt="image"></p>
<p>Подробнее по <a href="https://stormbpmn.com/app/diagram/f3af4a00-b1dd-4666-ad10-82f89705c74e?embedded=true" target="_blank" rel="noopener noreferrer">ссылке.<ExternalLinkIcon/></a></p>
<h2 id="get-started" tabindex="-1"><a class="header-anchor" href="#get-started"><span>Get started</span></a></h2>
<p>Для минимальной работы приложения вам нужно всего 2 контейнера - сам контейнер приложения и база данных.</p>
<h3 id="требования-к-ресурсам" tabindex="-1"><a class="header-anchor" href="#требования-к-ресурсам"><span>Требования к ресурсам</span></a></h3>
<p>Контейнер stormbmn:</p>
<ul>
<li>vCPU - 4</li>
<li>vRAM - 8 GB
Прочие контейнеры не требуют серьезных ресурсов - если вы будете создавать их с нуля (а не переиспользовать существующие сервисы компании), то ориентируетесь на минимальные требования из документации соответствующих контейнеров.</li>
</ul>
<h3 id="настроика-базы" tabindex="-1"><a class="header-anchor" href="#настроика-базы"><span>Настройка базы</span></a></h3>
<ul>
<li>Разверните в докере Postgresql (12 или старше версии) или воспользуйтесь существующей инфраструктурой в компании.</li>
<li>Создайте схему (не обязательно, будет использоваться public по умолчанию). Запомните название.</li>
<li>Создайте базу. Запомните название.</li>
<li>Создайте пользователя с полными правами доступа к базе (и схему). Запомните логин и пароль.</li>
<li>Узнайте порт, на котором работает сервер БД. Запомните его.</li>
<li>Обеспечьте сетевую доступность между базой и предполагаемым местом установки основного контейнера.</li>
</ul>
<h3 id="настроика-приложения-через-env-переменные" tabindex="-1"><a class="header-anchor" href="#настроика-приложения-через-env-переменные"><span>Настройка приложения через .ENV-переменные</span></a></h3>
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
<h3 id="настроика-авторизации" tabindex="-1"><a class="header-anchor" href="#настроика-авторизации"><span>Настройка авторизации</span></a></h3>
<p>Для настройки входа в систему прочитайте <RouteLink to="/enterprise/security.html">отдельную инструкцию по обеспечению информационной безопасности</RouteLink> и выберите подходящий для себя вариант.</p>
<h2 id="полноценная-установка" tabindex="-1"><a class="header-anchor" href="#полноценная-установка"><span>Полноценная установка</span></a></h2>
<p>Установка выше позволит убедиться что все базово работает, но не является production-ready. Для полноценной работы необходимо:</p>
<ul>
<li>Поставить балансер и настроить SSL.</li>
<li>Развернуть S3-хранилище для хранения картинок и шаблонов документов.</li>
<li>Развернуть Plantuml-сервер.</li>
<li>Развернуть сервис конвертации файлов.</li>
<li>Подключить Storm к системам мониторинга и алертов.</li>
<li>Обеспечить резервное копирование.</li>
<li>&quot;Захардендить&quot; настройки безопасности.</li>
<li>Подключить SIEM-логирование.</li>
<li>Выбрать провайдер почты и настроить его.</li>
<li>Настроить бизнес-параметры в административном интерфейсе</li>
</ul>
<h3 id="балансер" tabindex="-1"><a class="header-anchor" href="#балансер"><span>Балансер</span></a></h3>
<p>Снимать SSL, а так же обеспечивать отказоустойчивость и скейлинг предлагается путем установки балансера перед нодами приложения. Stormbpmn-ноды stateless. Воспользуйтесь любым, который вам нравится и подходит под вашу архитектуру, мы предпочитаем <strong>nginx</strong>. Вот <a href="https://docs.nginx.com/nginx/admin-guide/security-controls/securing-http-traffic-upstream/" target="_blank" rel="noopener noreferrer">отличный мануал<ExternalLinkIcon/></a>.</p>
<p>Мы советуем настроить на балансере добавление заголовков для кеширования статический ресурсов. Вот так выглядит конфиг для NGINX:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>    # Настройка кеширования для статических ресурсов
    location ~* \.(ico|css|js|woff2?|eot|ttf)$ {
        # Включаем заголовки кеширования
        expires 30d; # Срок кеширования 30 дней
        add_header Cache-Control "public, max-age=2592000, immutable"; # 2592000 секунд = 30 дней

        # Если нужно сбросить заголовки по умолчанию
        add_header Pragma public;
        add_header Vary Accept-Encoding;
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="s3-хранилище" tabindex="-1"><a class="header-anchor" href="#s3-хранилище"><span>S3-хранилище</span></a></h3>
<p>В S3-хранилище хранятся картинки бизнес-процессов, аватары пользователей, шаблоны для генерации документов. Можно использовать любое, мы советуем <strong>minio</strong>. Вот <a href="https://min.io/docs/minio/linux/index.html" target="_blank" rel="noopener noreferrer">отличный мануал<ExternalLinkIcon/></a>.
После установки укажите значения в ENV-переменные storm:</p>
<ul>
<li><strong>MINIO_ENDPOINT</strong> - URL хранилища, ожидается значение, похожее на &quot;http://192.168.0.4:9000&quot;</li>
<li><strong>MINIO_ACCESSKEY</strong> - название учетной записи с правами на создание бакетов и запись файлов.</li>
<li><strong>MINIO_SECRETKEY</strong> - пароль учетной записи с правами на создание бакетов и запись файлов.</li>
<li><strong>MINIO_DEFAULTBUCKET</strong> - бакет для файлов по умолчанию. Значение по умолчанию - storm-uploads.
После установки параметров при сохранении версии диаграммы должна отображаться ее миниатюра в карточном представлении.</li>
</ul>
<h3 id="plantuml-сервер" tabindex="-1"><a class="header-anchor" href="#plantuml-сервер"><span>Plantuml-сервер</span></a></h3>
<p>Этот компонент позволяет генерировать UML-диаграммы в интерфейсе. Если эта функция нужна, то установите сервер командой:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>И укажите адрес сервера в ENV-переменную storm:</p>
<ul>
<li><strong>PLANTUML_SERVER</strong> - ожидаемое значение похоже на http://192.168.0.5:8080/</li>
</ul>
<h3 id="сервис-конвератации-документов" tabindex="-1"><a class="header-anchor" href="#сервис-конвератации-документов"><span>Сервис конвератации документов</span></a></h3>
<p>Этот компонент обеспечивает подготовку PDF-файлов. Установите его командой:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>docker run --rm -d -p 3000:3000 gotenberg/gotenberg:8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>И укажите адрес сервера в ENV-переменную storm:</p>
<ul>
<li><strong>GOTENBERG_URL</strong> - ожидаемое значение похоже на 	http://192.168.0.5:3000
В некоторых ситуациях (балансеры, сложности с SSL и так далее) может потребоваться указать внутренний хост контейнера, на котором развернут STORM, чтобы сервис конвертации обращался к нему напрямую, минуя балансеры.
Для этого в административном интерфейсе укажите значение:</li>
<li><strong>gotenbergOverrideBaseUrl</strong> - прямой адрес контейнера, ожидается значение http://corp.storm.internal</li>
</ul>
<h3 id="подключить-storm-к-системам-мониторинга-и-обеспечить-резервное-копирование" tabindex="-1"><a class="header-anchor" href="#подключить-storm-к-системам-мониторинга-и-обеспечить-резервное-копирование"><span>Подключить STORM к системам мониторинга и обеспечить резервное копирование</span></a></h3>
<p>Мы предоставляем метрики в формате Prometeus, <RouteLink to="/support/">подробности о подключении и обеспечении резервного копирования</RouteLink>.</p>
<h3 id="хардендинг-и-siem" tabindex="-1"><a class="header-anchor" href="#хардендинг-и-siem"><span>Хардендинг и SIEM</span></a></h3>
<p>Мы предоставляет возможности по глубокой настройки безопасности и сбору событий информации в SIEM-лог-коллекторах, <RouteLink to="/enterprise/security.html">подробности</RouteLink>.</p>
<h3 id="выбрать-проваидер-почты" tabindex="-1"><a class="header-anchor" href="#выбрать-проваидер-почты"><span>Выбрать провайдер почты</span></a></h3>
<p>На текущий момент существует 2 варианта работы с почтой под разные задачи:</p>
<ul>
<li><strong>Нужны красивые письма и мы готовы их составлять</strong> - тогда используется сервис Mautic, сторонее statefull docker-приложение с базой на Percona, PG Не поддерживается. Грустно, переезд на нормальное решение в будущем.</li>
<li><strong>Нужные любые письма или некому составлять красивые</strong> - тогда используется встроенный SMTP-клиент, дополнительных сервисов не требуется.</li>
</ul>
<p>Установите значение в административном интерфейсе:</p>
<ul>
<li><strong>baserUrl</strong> - используется для формирований правильных ссылок в письмах. Ожидается значение, похожее на https://stormbpmn.com</li>
</ul>
<h4 id="нужны-красивые-письма" tabindex="-1"><a class="header-anchor" href="#нужны-красивые-письма"><span>Нужны красивые письма</span></a></h4>
<ul>
<li>Установите Mautic на последний релиз версии v.4.xxx (например v.4.2.1) из <a href="https://hub.docker.com/r/mautic/mautic" target="_blank" rel="noopener noreferrer">докера<ExternalLinkIcon/></a></li>
<li>Залогиньтесь в веб-интерфес и подключитесь в вашему SMTP-серверу</li>
<li>Создайте дополнительную учетную запись</li>
<li>Включите API и Basic Auth в настройках.</li>
<li>Перезапустите контейнер.</li>
<li>Установите значения переменных в Stormbpmn:
<ul>
<li><strong>MAUTIC_URL</strong> - URL API mautic, ожидается https://marketing.local/api</li>
<li><strong>MAUTIC_USERNAME</strong> - имя отдельной учетной записи</li>
<li><strong>MAUTIC_PASSWORD</strong> - пароль отдельной учетной записи</li>
</ul>
</li>
<li>Создайте шаблонных красивых писем с использованием плейсхолдеров, вставляйте текст в скобках на места, куда система подставит актуальные значения</li>
</ul>
<table>
<thead>
<tr>
<th>№</th>
<th>Тема шаблона</th>
<th>Доступные плейсхолдеры</th>
<th>Когда шлется</th>
<th>Название настройки в административном интерфейсе</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Password recover</td>
<td>{restoreCode}</td>
<td>Когда пользователь запросил восстановление пароля</td>
<td>restorePasswordTemplateId</td>
</tr>
<tr>
<td>2</td>
<td>You have been invited by {invite_author} to work together on business processes</td>
<td>{invite_author},  {diagram_url}, {register_url}</td>
<td>Отправляется после того как поделились диаграммой и у получателя ЕСТЬ учетка в системе</td>
<td>inviteDiagramAndRegisterTemplateId</td>
</tr>
<tr>
<td>3</td>
<td>New comment from {comment_author}</td>
<td>{comment_author}, {html_text}, {diagram_url}</td>
<td>Отправляется после отправки комментария</td>
<td>commentEmailTemplateId</td>
</tr>
<tr>
<td>4</td>
<td>The version of the {diagram_name} diagram has been updated {change_author}</td>
<td>{change_author},{diagram_name},{diagram_description},{version_comment} ,{diagram_url}</td>
<td>Отправляется при обновлении версии</td>
<td>diagramVersionUpdateEmailTemplateId</td>
</tr>
<tr>
<td>5</td>
<td>{invite_author} invited you to {team_name} and REGISTER</td>
<td>{invite_author},{team_name}, {invite_author}, {team_name}, {register_url}</td>
<td>Отправляется при приглашении в команду и когда у получателя НЕТ учетной записи</td>
<td>teamInviteAndRegisterTemplateId</td>
</tr>
<tr>
<td>6</td>
<td>{invite_author} invited you to {team_name}  (USER PRESENTED IN STORM)</td>
<td>{invite_author},{team_name},</td>
<td>Отправляется когда поделились папкой</td>
<td>folderTemplateId</td>
</tr>
<tr>
<td>7</td>
<td>Приглашение в команду</td>
<td>{invite_author}, &quot;{team_name}</td>
<td>Отправляется при приглашении в команду и когда у получателя есть учетная запись и он НЕ состоит в команде</td>
<td>teamInviteTemplateId</td>
</tr>
<tr>
<td>8</td>
<td>Согласование</td>
<td>{invite_author},      {diagram_url},         {diagram_name}</td>
<td>Отправляется, когда запросили согласовании</td>
<td>approvalTemplateId</td>
</tr>
<tr>
<td>9</td>
<td>Предоставлен доступ</td>
<td>{invite_author},      {diagram_url},         {diagram_name}, {settings}</td>
<td>Отправляется, когда изменили правда доступа к диаграмме</td>
<td>secureUpdateTemlateId</td>
</tr>
</tbody>
</table>
<ul>
<li>Запомните идентификаторы шаблонов и установите их в административном интерфейсе в соответсвующую настройку</li>
</ul>
<h4 id="не-нужны-красивые-письма" tabindex="-1"><a class="header-anchor" href="#не-нужны-красивые-письма"><span>Не нужны красивые письма</span></a></h4>
<p>Установите следующие настройки в административном интерфейсе:</p>
<ul>
<li><strong>simpleEmailEnabled</strong> - включен простой отправитель писем. (изменения применяется ТОЛЬКО после перезагрузки приложения). Установите true</li>
<li><strong>simpleSmtpHost</strong> - SMTP хост. (изменения применяется ТОЛЬКО после перезагрузки приложения)</li>
<li><strong>simpleSmtpPort</strong>- SMTP порт. TLS протокол установлен по умолчанию. (изменения применяется ТОЛЬКО после перезагрузки приложения)</li>
<li><strong>simpleSmtpUsername</strong> - SMTP пользователь (аутентификация и отправка “ОТ”). (изменения применяется ТОЛЬКО после перезагрузки приложения)</li>
<li><strong>simpleSmtpPassword</strong> - SMTP пароль.(изменения применяется ТОЛЬКО после перезагрузки приложения)</li>
<li><strong>simpleSmtpFrom</strong> - Электронная почта, от которой будут слаться письма. Может совпадать с simpleSmtpUsername, или не совпадать. Зависит от настроек почтового сервиса. Требование этого поля так же может зависить от настроек почтового сервиса(изменения применяется ТОЛЬКО после перезагрузки приложения).
Будет отсылаться информация об изменении версии, о комментариях, о новой задаче на согласовании, о завершении согласований.</li>
</ul>
<p>Какой вариант вы бы не выбрали, проверить отправку писем можно оставит комментарий с содержимым @&lt;ваш_емейл&gt; test , например &quot;@kotov@bpmn2.ru test&quot;.</p>
<h3 id="настроика-бизнес-параметров" tabindex="-1"><a class="header-anchor" href="#настроика-бизнес-параметров"><span>Настройка бизнес-параметров</span></a></h3>
<p>Управлять бизнес-параметрами может администратор системы, они доступы по ссылке <strong>/app/admin</strong>, во вкладке &quot;настройки приложения&quot;.</p>
<ul>
<li><strong>enableCommonAssets</strong> - разрешить всем командам использовать все элементы архитектуры всех команд.</li>
<li><strong>enableCommonRoles</strong> - разрешить всем командам использовать все роли всех команд.</li>
<li><strong>enableCommonUsers</strong> - разрешить всем командам использовать общую оргструктуру.</li>
<li><strong>enableCommonUsers</strong> - разрешить всем командам использовать общую оргструктуру.</li>
<li><strong>allDiagramsAnonAccess</strong> - разрешить анонимный доступ ко всем диаграммам по умолчанию.</li>
<li><strong>enableAnonSearchPage</strong> - заменить главную страницу для аноимных пользователей на поиск по диаграммам.</li>
<li><strong>autoEnableEnterpriseLicense</strong> - разрешить автоматическую выдачу лицензий.</li>
<li><strong>autoJoinTeamId</strong> - автоматически подключать всех новых пользователей в команду, ID которой указан в настройке.</li>
<li><strong>disableTeamPopUp</strong> - запретить отображение окна с предложением создать команду.</li>
<li><strong>disableTeamCreation</strong> - запретить создание команд.
Настройте эти параметры исходя из ваших требований и сценария работы.</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Напишите по почте help@stormbpmn.com или вашему менджеру, если у вас что-то не получилось. Мы с радостью поможем.</p>
</div>
</div></template>


