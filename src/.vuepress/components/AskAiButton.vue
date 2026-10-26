<script setup>
import { usePageLang } from "vuepress/client";
import { computed, onMounted, ref } from "vue";

// Окно открывает виджет docs-chat (подключён в head config.ts); своего API у него нет,
// поэтому жмём его плавающую кнопку — она же переключает окно.
const lang = usePageLang();
const messages = {
    "ru-RU": { label: "Спросить AI-помощника по документации", text: "Спросить AI" },
    "en-US": { label: "Ask the documentation AI assistant", text: "Ask AI" },
};
const t = computed(() => messages[lang.value] ?? messages["ru-RU"]);
const open = () => document.querySelector(".sdc-fab")?.click();

const hotkey = ref("Ctrl I");
onMounted(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) hotkey.value = "⌘ I";
});
</script>

<template>
    <button type="button" class="ask-ai-button" :aria-label="t.label" @click="open">
        <span class="ask-ai-icon" aria-hidden="true">✦</span>
        <span class="ask-ai-text">{{ t.text }}</span>
        <kbd class="ask-ai-kbd">{{ hotkey }}</kbd>
    </button>
</template>
