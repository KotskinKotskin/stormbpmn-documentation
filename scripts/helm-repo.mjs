// Собирает Helm-репозиторий StormBPMN в src/.vuepress/public/helm/ перед сборкой сайта.
// Версии берутся из src/Changelog/X.Y.Z.md: на каждую версию не старше MIN_VERSION
// пакуется чарт с version = appVersion = X.Y.Z, поэтому новый релиз в Changelog
// сам даёт новую версию чарта — руками в чарте ничего менять не нужно.
// Запуск: node scripts/helm-repo.mjs (нужен helm 3.8+ в PATH).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// С этой версии шаблоны чарта совпадают с приложением (LICENSE_KEY_V2, SESSION_EXPIRATION в секундах).
const MIN_VERSION = "9.1.302";
const PUBLIC_URL = "https://enterprise.stormbpmn.com/helm";
// Откуда брать уже опубликованное; переопределяется только для локальной проверки.
const SITE_URL = process.env.HELM_SITE_URL ?? PUBLIC_URL;

const root = path.resolve(import.meta.dirname, "..");
const chartDir = path.join(root, "charts/stormbpmn");
const outDir = path.join(root, "src/.vuepress/public/helm");

// Та же нумерация, что в readReleases() из src/.vuepress/config.ts.
const versionNum = (v) => {
    const [major, minor, patch] = v.split(".").map(Number);
    return major * 100000000 + minor * 10000 + patch;
};

const versions = fs
    .readdirSync(path.join(root, "src/Changelog"))
    .filter((file) => /^\d+\.\d+\.\d+\.md$/.test(file))
    .map((file) => file.replace(".md", ""))
    .filter((v) => versionNum(v) >= versionNum(MIN_VERSION))
    .sort((a, b) => versionNum(a) - versionNum(b));

if (versions.length === 0) throw new Error(`В src/Changelog нет версий не старше ${MIN_VERSION}`);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// Опубликованная версия неизменна: её архив скачиваем с сайта как есть (тот же digest для
// helm/Argo CD/Flux), пакуем только новые. HELM_REPACK="X.Y.Z,…" — осознанная перепаковка.
const repack = new Set((process.env.HELM_REPACK ?? "").split(",").filter(Boolean));

// Что опубликовано — по живому index.yaml. Неизвестный путь nginx сайта отдаёт как
// index.html с кодом 200, поэтому индекс без «apiVersion:» = репозиторий ещё пуст.
const indexRes = await fetch(`${SITE_URL}/index.yaml`);
if (!indexRes.ok && indexRes.status !== 404) throw new Error(`${SITE_URL}/index.yaml: HTTP ${indexRes.status}`);
const indexText = indexRes.ok ? await indexRes.text() : "";
const published = indexText.startsWith("apiVersion:")
    ? new Set([...indexText.matchAll(/^\s+version: "?([\d.]+)"?\s*$/gm)].map((m) => m[1]))
    : new Set();

for (const v of versions) {
    const file = `stormbpmn-${v}.tgz`;
    if (published.has(v) && !repack.has(v)) {
        const res = await fetch(`${SITE_URL}/${file}`);
        const body = res.ok ? Buffer.from(await res.arrayBuffer()) : null;
        // Версия в индексе, а архива нет — падаем: тихая перепаковка сменила бы digest.
        if (!body || body[0] !== 0x1f || body[1] !== 0x8b) {
            throw new Error(`${file} есть в index.yaml, но не скачался как gzip (HTTP ${res.status})`);
        }
        fs.writeFileSync(path.join(outDir, file), body);
        console.log(`${file}: уже опубликован, взят с сайта`);
        continue;
    }
    execFileSync("helm", ["package", chartDir, "--version", v, "--app-version", v, "-d", outDir], {
        stdio: "inherit",
    });
}
execFileSync("helm", ["repo", "index", outDir, "--url", PUBLIC_URL], { stdio: "inherit" });

console.log(`Helm-репозиторий собран: ${versions.join(", ")}`);
