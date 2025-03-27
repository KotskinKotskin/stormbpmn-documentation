<template><div><h1 id="prodution-ready-установка" tabindex="-1"><a class="header-anchor" href="#prodution-ready-установка"><span>Prodution-ready установка</span></a></h1>
<p>Для полноценной работы необходимо:</p>
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
<h2 id="балансер" tabindex="-1"><a class="header-anchor" href="#балансер"><span>Балансер</span></a></h2>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="s3-хранилище" tabindex="-1"><a class="header-anchor" href="#s3-хранилище"><span>S3-хранилище</span></a></h2>
<p>В S3-хранилище хранятся картинки бизнес-процессов, аватары пользователей, шаблоны для генерации документов. Можно использовать любое, мы советуем <strong>minio</strong>. Вот <a href="https://min.io/docs/minio/linux/index.html" target="_blank" rel="noopener noreferrer">отличный мануал<ExternalLinkIcon/></a>.
После установки укажите значения в ENV-переменные storm:</p>
<ul>
<li><strong>MINIO_ENDPOINT</strong> - URL хранилища, ожидается значение, похожее на &quot;http://192.168.0.4:9000&quot;</li>
<li><strong>MINIO_ACCESSKEY</strong> - название учетной записи с правами на создание бакетов и запись файлов.</li>
<li><strong>MINIO_SECRETKEY</strong> - пароль учетной записи с правами на создание бакетов и запись файлов.</li>
<li><strong>MINIO_DEFAULTBUCKET</strong> - бакет для файлов по умолчанию. Значение по умолчанию - storm-uploads.
После установки параметров при сохранении версии диаграммы должна отображаться ее миниатюра в карточном представлении.</li>
</ul>
<h2 id="plantuml-сервер" tabindex="-1"><a class="header-anchor" href="#plantuml-сервер"><span>Plantuml-сервер</span></a></h2>
<p>Этот компонент позволяет генерировать UML-диаграммы в интерфейсе. Если эта функция нужна, то установите сервер командой:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>И укажите адрес сервера в ENV-переменную storm:</p>
<ul>
<li><strong>PLANTUML_SERVER</strong> - ожидаемое значение похоже на http://192.168.0.5:8080/</li>
</ul>
<h2 id="сервис-конвератации-документов" tabindex="-1"><a class="header-anchor" href="#сервис-конвератации-документов"><span>Сервис конвератации документов</span></a></h2>
<p>Этот компонент обеспечивает подготовку PDF-файлов. Установите его командой:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>docker run --rm -d -p 3000:3000 gotenberg/gotenberg:8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>И укажите адрес сервера в ENV-переменную storm:</p>
<ul>
<li><strong>GOTENBERG_URL</strong> - ожидаемое значение похоже на 	http://192.168.0.5:3000
В некоторых ситуациях (балансеры, сложности с SSL и так далее) может потребоваться указать внутренний хост контейнера, на котором развернут STORM, чтобы сервис конвертации обращался к нему напрямую, минуя балансеры.
Для этого в административном интерфейсе укажите значение:</li>
<li><strong>gotenbergOverrideBaseUrl</strong> - прямой адрес контейнера, ожидается значение http://corp.storm.internal</li>
</ul>
<h2 id="подключить-storm-к-системам-мониторинга-и-обеспечить-резервное-копирование" tabindex="-1"><a class="header-anchor" href="#подключить-storm-к-системам-мониторинга-и-обеспечить-резервное-копирование"><span>Подключить STORM к системам мониторинга и обеспечить резервное копирование</span></a></h2>
<p>Мы предоставляем метрики в формате Prometeus, <RouteLink to="/support/">подробности о подключении и обеспечении резервного копирования</RouteLink>.</p>
<h2 id="хардендинг-и-siem" tabindex="-1"><a class="header-anchor" href="#хардендинг-и-siem"><span>Хардендинг и SIEM</span></a></h2>
<p>Мы предоставляет возможности по глубокой настройки безопасности и сбору событий информации в SIEM-лог-коллекторах, <RouteLink to="/enterprise/security.html">подробности</RouteLink>.</p>
<h2 id="обеспечение-высокои-доступности" tabindex="-1"><a class="header-anchor" href="#обеспечение-высокои-доступности"><span>Обеспечение высокой доступности</span></a></h2>
<p>Контейнеры stateless. Обеспечить высокую доступность возможно просто развернув второй контейнер приложения и поставив балансер перед двумя контейнерами.
Возможно использование базовых инструментов k8s.</p>
<p>Пример <a href="https://nginx.org/en/docs/http/load_balancing.html" target="_blank" rel="noopener noreferrer">конфигурации nginx<ExternalLinkIcon/></a> для 2 контейнеров:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>upstream storm {
    server 10.0.0.3:80 weight=5 max_conns=500;
    server 10.0.0.4:80 weight=5 max_conns=500;

  }

  location ~ ^/ {
        limit_conn two 30;
        proxy_pass      http://storm;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Вряд ли вы достигните необходимости масштабировать базу данных, но если потребуется, то вот <a href="https://www.percona.com/blog/setting-up-and-deploying-postgresql-for-high-availability/" target="_blank" rel="noopener noreferrer">хорошая инструкция<ExternalLinkIcon/></a>.</p>
<h2 id="выбрать-проваидер-почты" tabindex="-1"><a class="header-anchor" href="#выбрать-проваидер-почты"><span>Выбрать провайдер почты</span></a></h2>
<p>На текущий момент существует 2 варианта работы с почтой под разные задачи:</p>
<ul>
<li><strong>Нужны красивые письма и мы готовы их составлять</strong> - тогда используется сервис ListMonk, сторонее  docker-приложение с базой на PG.</li>
<li><strong>Нужные любые письма или некому составлять красивые</strong> - тогда используется встроенный SMTP-клиент, дополнительных сервисов не требуется.</li>
</ul>
<p>Установите значение в административном интерфейсе:</p>
<ul>
<li><strong>baserUrl</strong> - используется для формирований правильных ссылок в письмах. Ожидается значение, похожее на https://stormbpmn.com</li>
</ul>
<h3 id="нужны-красивые-письма" tabindex="-1"><a class="header-anchor" href="#нужны-красивые-письма"><span>Нужны красивые письма</span></a></h3>
<ul>
<li>Скачайте актуальную версию docker-compose</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>curl -LO https://github.com/knadh/listmonk/raw/master/docker-compose.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>(Опционально) Правим содержимое. По-умолчанию в контейнере listmonk поднимаются два сервиса: само приложение на порте 9000 и его база данных на порте 5432. Если какие-то из этих портов заняты, их можно обновить на удобные вам в параметрах services.app.ports и services.db.ports соответственно.
Обратите внимание, что менять требуется только внешний порт. Например, если на localhost порт 5432 уже занят другим инстансом Postgres, то в docker-compose можно обновить параметр services.db.ports на &quot;127.0.0.1:{НЕЗАНЯТЫЙ_ПОРТ}:5432&quot;</li>
<li>Поднимаем контейнер:</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>docker compose up -d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Заходим в панель администратора (по умолчанию http://localhost:9000), создаем учетную запись супер пользователя и логинимся.</li>
<li>В Settings-General указываем email по умолчанию для отправки писем, например:
<img src="@source/enterprise/Установка/list_monk_1.png" alt="image"></li>
<li>В Settings-SMTP указываем настройки вашего корпоративного SMTP сервера. По кнопке &quot;Test connection&quot; можно отправить тестовое письмо с адреса, указанного в предыдущем шаге, на любой корпоративный email.
<img src="@source/enterprise/Установка/list_monk_2.png" alt="image"></li>
<li>Далее создаем сервисную УЗ для Storm. В Users нажимаем на New, выбираем тип учетки API, указываем ее имя (например, stormbpmn) и роль Super Admin (при желании можно кастомизировать и создать выделенную роль во вкладке User roles). Сохраняем и получаем наш API токен.
<img src="@source/enterprise/Установка/list_monk_3.png" alt="image"></li>
<li>В env-переменных Stormbpmn указываем следующие значения:</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>EMAIL_PROVIDER: listmonk
LISTMONK_BASE_URL: http://localhost:9000/api (изменить на ваш кастомный внешний URL/порт при необходимости)
LISTMONK_USERNAME: username сервисной УЗ (см. скрин выше)
LISTMONK_PASSWORD: API токен сервисной УЗ (см. скрин выше)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Перезапускаем контейнер Stormbpmn</li>
<li>Создаем <a href="https://listmonk.app/docs/templating/" target="_blank" rel="noopener noreferrer">шаблоны для писем в listmonk<ExternalLinkIcon/></a> и запоминаем их идентификаторы.</li>
<li>При создании шаблонов можно использовать следующие подстановки:</li>
</ul>
<table>
<thead>
<tr>
<th>Смысл шаблона</th>
<th>Название настройки в административном интерфейсе</th>
<th>Возможный заголовок</th>
<th>Возможные подстановки</th>
</tr>
</thead>
<tbody>
<tr>
<td>NEW_COMMENT</td>
<td>commentEmailTemplateId</td>
<td>Комментарий от {comment_author} к процессу {diagram_name}</td>
<td>{comment_author}, {diagram_url}, {diagram_name}, {html_text}</td>
</tr>
<tr>
<td>NEW_APPROVAL</td>
<td>approvalTemplateId</td>
<td>{invite_author} запросил согласование бизнес-процесса {diagram_name}</td>
<td>{invite_author}, {diagram_url}, {diagram_name}</td>
</tr>
<tr>
<td>RESTORE_PASSWORD</td>
<td>restorePasswordTemplateId</td>
<td>Восстановление пароля на stormbpmn.com</td>
<td>{restoreCode}</td>
</tr>
<tr>
<td>APPROVAL_COMPLETED</td>
<td>approvalCompletedTemplateId</td>
<td>По процессу {diagram_name} завершены все согласования</td>
<td>{diagram_name}, {diagram_url}</td>
</tr>
<tr>
<td>USER_ACTIVATION</td>
<td>userActivationTemplateId</td>
<td>Всё почти готово! Подтвердите ваш e-mail</td>
<td>{activation_token}</td>
</tr>
<tr>
<td>INVITE_TO_DIAGRAM</td>
<td>secureUpdateTemlateId</td>
<td>{invite_author} предоставил доступ к бизнес-процессу {diagram_name}</td>
<td>{invite_author}, {diagram_url}, {diagram_name}</td>
</tr>
<tr>
<td>INVITE_TO_DIAGRAM_AND_REGISTER</td>
<td>inviteDiagramAndRegisterTemplateId</td>
<td>{invite_author} предоставил доступ к бизнес-процессу {diagram_name}</td>
<td>{invite_author}, {diagram_url}, {diagram_name}, {register_url}</td>
</tr>
<tr>
<td>INVITE_TO_TEAM</td>
<td>teamInviteTemplateId</td>
<td>{invite_author} пригласил вас в команду {team_name}</td>
<td>{invite_author}, {team_name}</td>
</tr>
<tr>
<td>INVITE_TO_TEAM_AND_REGISTER</td>
<td>teamInviteAndRegisterTemplateId</td>
<td>{invite_author} пригласил вас в команду {team_name}</td>
<td>{invite_author}, {team_name}, {register_url}</td>
</tr>
</tbody>
</table>
<ul>
<li>Запомните идентификаторы шаблонов и установите их в административном интерфейсе Storm.</li>
</ul>
<h3 id="не-нужны-красивые-письма" tabindex="-1"><a class="header-anchor" href="#не-нужны-красивые-письма"><span>Не нужны красивые письма</span></a></h3>
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
<h2 id="настроика-бизнес-параметров" tabindex="-1"><a class="header-anchor" href="#настроика-бизнес-параметров"><span>Настройка бизнес-параметров</span></a></h2>
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
<p>Настройка видимости в “настройке” разрешает возвращать настройку на фронт, т.е. делает доступным просмотр для клиента. Не устанавливаете ее для паролей и прочих вещей, которые не влияют на поведение приложения на фронте.</p>
<div class="hint-container tip">
<p class="hint-container-title">Совет</p>
<p>Напишите по почте help@stormbpmn.com или вашему менджеру, если у вас что-то не получилось. Мы с радостью поможем.</p>
</div>
</div></template>


