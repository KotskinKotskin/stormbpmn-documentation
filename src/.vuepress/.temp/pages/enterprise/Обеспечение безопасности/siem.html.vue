<template><div><h1 id="siem" tabindex="-1"><a class="header-anchor" href="#siem"><span>SIEM</span></a></h1>
<p>Мы предоставляем возможность получать информацию о всех операциях, выполняемых авторизированными пользователями в отдельном хранилище. Сейчас поддерживается Syslog как транспорт, сообщите менеджерам, если вам требуется другой транспорт, например Kafka.</p>
<h2 id="особенности" tabindex="-1"><a class="header-anchor" href="#особенности"><span>Особенности</span></a></h2>
<ul>
<li>SIEM-логирование работает только для авторизованных методов</li>
<li>Мы маскируем авторизационные заголовки и пароли, их невозможно найти в логах.</li>
<li>Мы не сохраняем большие элементы запросов (body диаграмм).</li>
</ul>
<h2 id="принцип-работы" tabindex="-1"><a class="header-anchor" href="#принцип-работы"><span>Принцип работы</span></a></h2>
<p>Каждый запрос-ответ от пользователя формирует следующий объект:</p>
<div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre v-pre class="language-text"><code>{
  "timestamp": "2007-12-03T10:15:30:55.000000", // Временная метка в таймзоне сервера
  "sessionId": "ergjieor-ergjniuo-qjwer", // Уникальный ID сессии пользователя 
  "forwarder": null, // Служебное поле
  "source": "stormbpmn", // Название нашего приложения. Может быть изменено в ENV переменной SYSLOG_SOURCE.
  "subject": "kotov@bpmn2.ru", // Почта пользователя, соверщающего запрос
  "subjectIP": "192.168.0.1", // IP-адрес пользователя. Проставляется при наличии заголовка X-Forwarded-For от прокси-сервера.
  "object": "uaerhgae-aerj3234-egerg", // ID объекта, над которым совершается операция
  "resourse": "diagram", // Тип объекта, над которым совершается операция. Список возможных значений: GET /api/v1/syslog/resources
  "ctp": null, // Служебное поле
  "action": "CHANGE" // Тип события. Возможные значения: [ GET, CREATE, CHANGE, DELETE ]
  "tags": [ 
    "storm",
    "users_audit",
    "iia",
    null,
    null
  ], // Служебные поля
  "payload": {
    "method": "POST", // Вызванный метод
    "url": "/api/v1/diagram", // Вызванный URL
    "request": { // Присланный запрос, уникальный объект для каждого URL
       ...
    },
    "response": { // Полученный ответ, уникальный объект для каждого URL
       ...
    }
  },
  "result": "SUCCESSFUL" // Статус ответа. Возможные значения: [ SUCCESSFUL, CLIENT_ERROR, SERVER_ERROR ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="настроика-syslog" tabindex="-1"><a class="header-anchor" href="#настроика-syslog"><span>Настройка Syslog</span></a></h2>
<p>Для включения SIEM-логирования в syslog необходимо установить следующие ENV-переменные:</p>
<table>
<thead>
<tr>
<th style="text-align:center">Название</th>
<th style="text-align:center">Описание</th>
<th style="text-align:center">Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">AUDIT_ENABLED</td>
<td style="text-align:center">Флаг включения аудита запросов</td>
<td style="text-align:center">true</td>
</tr>
<tr>
<td style="text-align:center">AUDIT_CHANNEL</td>
<td style="text-align:center">Канал аудит логов</td>
<td style="text-align:center">syslog</td>
</tr>
<tr>
<td style="text-align:center">SYSLOG_SERVERS</td>
<td style="text-align:center">Список syslog серверов для стриминга<br>(протокол TCP, формат сообщений <a href="https://datatracker.ietf.org/doc/html/rfc3164" target="_blank" rel="noopener noreferrer">RFC 3164<ExternalLinkIcon/></a>)</td>
<td style="text-align:center">localhost:514,192.168.78.53:601<br>(пример)</td>
</tr>
<tr>
<td style="text-align:center">SYSLOG_SOURCE</td>
<td style="text-align:center">Название приложения<br>(передается серверам и в поле source самого лога)</td>
<td style="text-align:center">stormbpmn<br>(по умолчанию)</td>
</tr>
</tbody>
</table>
</div></template>


