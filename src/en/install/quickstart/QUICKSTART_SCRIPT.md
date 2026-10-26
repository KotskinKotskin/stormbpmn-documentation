---
order: 1
dir:
  link: true
index: true
source_hash: 6dd8cc7c24052e37
---

# Installation via script {#установка-скриптом}

:::info Test environment
The script has been tested on Ubuntu 24.04 LTS 64-bit with internet access.

**Compatible OS:** Ubuntu 20.04+, Debian 11+, Astra Linux 1.7+, ALT Linux 10+, RED OS 7.3+ and other Linux distributions with Docker or Podman support.

When using **Podman** instead of Docker, replace commands `docker` with `podman` and `docker-compose` with `podman-compose`.
:::

1. Request a token for access to the Stormbpmn Container Registry from your manager.

2. Download the env file and fill it in.

```bash
curl -O https://raw.githubusercontent.com/KotskinKotskin/stormbpmn-documentation/main/src/install/quickstart/script/install.env
```
|       Key        |                             Description                             |                                            Example                                            |
|:-----------------:|:----------------------------------------------------------------:|:--------------------------------------------------------------------------------------------:|
|     TIMEZONE      |          Time zone for the server and the entire infrastructure          |                                        Europe/Moscow                                         |
| STORMBPMN_VERSION | Application version [(see Changelog)](/en/Changelog/README.md) |                                           6.6.2229                                           |
|  SELECTEL_TOKEN   |                    Stormbpmn CR token from step 1                    | ** your key from step 1 (from the manager), format: CRg.............. **  |


3. Download the bash script and make it executable.

```bash
curl -O https://raw.githubusercontent.com/KotskinKotskin/stormbpmn-documentation/main/src/install/quickstart/script/install.sh
sudo chmod +x install.sh
```

4. Run the script with administrator privileges and wait for it to complete.

```bash
sudo ./install.sh
```

If everything was successful, you will see three generated files in the current directory:

|       Name       |           Description            |
|:--------------------:|:-----------------------------:|
| `docker-compose.yml` |      Docker configuration      |
|  `credentials.txt`   | Infrastructure credentials |
|    `install.log`     |        Installation logs         |

:::important
Be sure to store the credentials in a secure location.
:::

:::info Troubleshooting
If you encounter issues with infrastructure deployment, send the installation logs to your manager, and we will definitely help you.
All changes will be rolled back, and after the issue is resolved, you can rerun the script.
:::

5. Ensure that the image agreed upon with the manager, with v2 support, is installed. Open
   [http://localhost:8081/admin-onboarding](http://localhost:8081/admin-onboarding),
   copy **the entire activation code without abbreviation** and send it to your manager.

6. After receiving a separate v2 key for this installation from your manager, add it to the application.
   Request a separate key for the test environment, DR site, and each clone.

- Log in to Portainer [http://localhost:9080](http://localhost:9080) with the credentials from the table above
- Click the "PORTAINER.IO" icon in the top left corner to go to the home page
- Navigate to **Environments -> local -> Containers -> stormbpmn**
- Click **Duplicate/Edit**
- In **Advanced container settings**, select the **Env** tab
- At the bottom of the list, click **Add an environment variable**
- In the **name** field, specify `LICENSE_KEY_V2`, and in the **value** field — the v2 key provided to you.
  The existing `LICENSE_KEY` is temporarily supported but is deprecated due to a known security limitation.
  If both variables are set, the non-empty `LICENSE_KEY_V2` is used exclusively; an incorrect v2 does not result in a fallback to v1
- Above **Advanced container settings**, click **Deploy the container**, then **Replace**
- Wait for the application to restart and check the license on the page
  [http://localhost:8081/admin-onboarding](http://localhost:8081/admin-onboarding), then
  complete the setup wizard and verify the login of a licensed regular user and
  the required modules, including DES. Do not open the installation to users before activation:
  an empty v2 selects the legacy path and does not guarantee blocking in the absence of keys.
  The order of initial activation and recovery is in the [license section](/en/operation/License.md#активация-инсталляции).

## Important: The following steps {#важно-следующие-шаги}

:::danger This installation is for testing only!
**Warning!** The minimal installation described above is intended **exclusively for verifying functionality** and familiarizing yourself with the system.

**Do not use this configuration for working with real users!**

### Why this setup is not suitable for production: {#почему-эта-установка-не-подходит-для-продакшена}

-   **No SSL/HTTPS** - data is transmitted in plaintext
-   **Database is not protected** - no backup or fault tolerance
-   **No monitoring** - issues and performance cannot be tracked
-   **Simplified authentication** - no integration with corporate systems
-   **No notifications** - users will not receive emails about processes

### What happens if production-ready is not configured: {#что-произоидет-если-не-настроить-production-ready}

-   **Users will be dissatisfied** with slow performance and errors
-   **Data loss** during system failures
-   **Security issues** and leakage of confidential information
-   **Inability to scale** as the number of users grows
:::

### Next steps for production: {#следующие-шаги-для-продакшена}

1. **[Production Ready](/en/install/production/)** - configuration for industrial operation
2. **[Security](/en/configure/security/)** - configuration of HTTPS, authorization, and audit
3. **[System Administration](/en/operation/README.md)** - monitoring performance and availability, protection against data loss

:::info Tip
Plan the transition to a production-ready configuration **before** connecting real users.
Migrating a running system is significantly more complex than the initial setup.
:::
