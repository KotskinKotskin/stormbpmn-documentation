---
home: true
title: Home page
heroText: Stormbpmn Enterprise Knowledge Base
tagline: 'Complete documentation for installing, configuring, and maintaining the Enterprise edition of Stormbpmn'
actions:
  - text: "\U0001F3D7️ 1. System Architecture"
    link: /en/get-started.html
    type: primary
  - text: "\U0001F680 2. Quick Start"
    link: /en/install/
    type: secondary
  - text: ⚙️ 3. Configuration
    link: /en/configure/
    type: secondary
  - text: "\U0001F916 4. AI Assistant"
    link: /en/ai/
    type: secondary
  - text: "\U0001F527 5. Maintenance"
    link: /en/operation/
    type: secondary
  - text: "\U0001F4CB 6. Change History"
    link: /en/Changelog/
    type: secondary
footer: |
  <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eaecef; margin-top: 40px;">
      <p><strong>StormBPMN Enterprise Documentation</strong></p>
      <p><a href="mailto:help@stormbpmn.com">help@stormbpmn.com</a> | 
         <a href="https://t.me/stormbpmn_bot">Telegram Bot</a> | 
         <a href="https://stormbpmn.com">stormbpmn.com</a></p>
      <p style="color: #666; font-size: 0.9em;">
          GPL-3.0 Licensed (documentation) | © 2019-2025 Stormbpmn Team
      </p>
  </div>
dir:
  order: 0
source_hash: 652ddc62141b54c9
---

<LatestChangelog />

<ChangelogTimeline :limit="5" :skip="1" :open-first="false" caption="What was before this" />

::: warning Important
This documentation is intended for the **Enterprise version** of Stormbpmn. For the cloud version, refer to the [main documentation](https://docs.stormbpmn.com).
:::

## Getting Started {#с-чего-начать}

Find your scenario and navigate to the relevant section:

| Your scenario | Where to go |
| ------------- | --------- |
| 🆕 Installing StormBPMN **for the first time** | **[Installation](/en/install/)** — step by step: quick start → production |
| ⚙️ Already installed — configuring **authentication, email, S3, storage** | **[Configuration](/en/configure/)** |
| 🔐 Need **enterprise authentication** (OAuth2, Keycloak, ADFS), SIEM | **[Security](/en/configure/security/)** |
| 🤖 Need **AI chat**: assistant, knowledge base, custom LLM | **[AI Assistant](/en/ai/)** |
| 🔧 System is running — **monitoring, backups, updates** | **[Maintenance](/en/operation/)** |
| 🔌 Integration via **API** | **[REST API](/en/REST%20API/)** |
| 🏛 Undergoing **internal architecture review**: diagrams, RACI, requirements | **[Architecture Review](/en/architecture/)** |
| 🆘 **Something broke** or you have a question | **[Support](/en/support/)** |
