---
title: "How to record a HAR archive"
shortTitle: "HAR archive"
description: "Step-by-step HAR recording in Yandex Browser, Chrome, Edge, Opera, Firefox and Safari for a Stormbpmn support request"
order: 1
source_hash: 9612849202b999d2
---

[[toc]]

# How to record a HAR archive {#как-записать-har-архив}

A HAR archive is a file with a log of every request the browser sent to the Stormbpmn server and the responses to them. It shows support which request failed, what the server returned and how long it took, without access to your installation.

Record a HAR when the error is visible in the browser: a page does not open, a diagram does not save, a button does nothing, an error message appears.

::: warning What goes into the file
A HAR stores page addresses and the content of server responses: diagram names and texts, names and emails of users that were on screen. If you export **with sensitive data**, the file also contains cookies and your session token, which can be used to sign in under your account.

-   Export the file **without sensitive data** (browsers do this by default) unless support asks otherwise.
-   Send the file only to Stormbpmn support, by email or via the Telegram bot, and do not post it in shared chats.
-   If you did send a file with sensitive data, sign out and sign in again after support replies.
:::

## Before recording {#перед-записью}

1. Open Stormbpmn on the page where the error occurs, or one step earlier.
2. Record only the failing scenario: the shorter the recording, the faster it is analysed.
3. If the error appears when the page opens, start recording **before** reloading.

## Yandex Browser, Google Chrome, Microsoft Edge, Opera {#яндекс-браузер-google-chrome-microsoft-edge-opera}

These browsers are built on Chromium and share the same developer tools.

1. Press `Ctrl+Shift+I` (`⌥+⌘+I` on macOS) or `F12` and open the **Network** tab.
2. Make sure recording is on: the round button in the top-left corner of the tab is red. If it is grey, click it.
3. Enable **Preserve log** so entries are not lost when you navigate between pages.
4. Clear the log with the 🚫 (**Clear**) button so it contains only requests related to the error.
5. Reload the page (`F5`) or repeat the actions that cause the error. Wait until the error appears.
6. Click the export button with a down arrow (**Export HAR**) on the tab toolbar and save the file. Alternatively, right-click any row of the request table and choose **Save all as HAR**.

::: tip Export with sensitive data
By default Chromium exports a HAR **without** cookies and authorization headers (**Export HAR (sanitized)**). This is usually enough. If support asks for the full file, open the developer tools settings (gear icon, top right), enable **Allow to generate HAR with sensitive data** under **Preferences → Network**, and choose **Export HAR (with sensitive data)**.
:::

## Mozilla Firefox {#mozilla-firefox}

1. Press `Ctrl+Shift+I` (`⌥+⌘+I` on macOS) or `F12` and open the **Network** tab.
2. Enable **Persist Logs** in the tab's gear menu so entries are not lost when you navigate.
3. Clear the log with the trash-can button.
4. Reload the page or repeat the actions that cause the error.
5. Right-click any row of the request table and choose **Save All As HAR**. The same item is in the gear menu.

## Safari {#safari}

1. Open **Safari → Settings → Advanced** and enable **Show features for web developers** (in older versions, **Show Develop menu in menu bar**).
2. Press `⌥+⌘+I` or choose **Develop → Show Web Inspector** and open the **Network** tab.
3. Enable **Preserve Log**.
4. Clear the log with the 🚫 button.
5. Reload the page or repeat the actions that cause the error.
6. Click **Export** in the top-right corner of the tab and save the file.

## Sending it to support {#отправка-в-поддержку}

Attach the HAR file to your request and add:

-   what you were doing and what went wrong;
-   the approximate time of the error (with time zone), so the recording can be matched with server logs;
-   the user's email and a link to the diagram, if the error concerns them.

If the file is larger than 25 MB, pack it into a ZIP: HAR compresses well.

Where to write and what else to attach — see [Support Channels](./README.md).
