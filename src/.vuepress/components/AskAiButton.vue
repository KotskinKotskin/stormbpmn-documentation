<script setup>
import { onMounted, ref } from "vue";

// Окно открывает виджет docs-chat (подключён в head config.ts); своего API у него нет,
// поэтому жмём его плавающую кнопку — она же переключает окно.
const open = () => document.querySelector(".sdc-fab")?.click();

const hotkey = ref("Ctrl I");
onMounted(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) hotkey.value = "⌘ I";
});
</script>

<template>
    <button type="button" class="ask-ai-button" aria-label="Спросить AI-помощника по документации" @click="open">
        <span class="ask-ai-icon" aria-hidden="true">✦</span>
        <span class="ask-ai-text">Спросить AI</span>
        <kbd class="ask-ai-kbd">{{ hotkey }}</kbd>
    </button>
</template>
