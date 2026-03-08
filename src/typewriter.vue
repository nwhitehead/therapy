<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue';
import { init, Terminal } from 'ghostty-web';

let container = useTemplateRef('container');
let terminal = null;

onMounted(async () => {
    await init();
    terminal = new Terminal({
        allowTransparency: true,
        cursorBlink: true,
        cursorStyle: 'bar',
        fontSize: 25,
        fontFamily: 'monospace',
        theme: {
            background: 'rgba(0, 0, 0, 1.0)',
            foreground: '#a9b1d6',
        },
    });
    terminal.open(container.value);
    terminal.write("This is some text.");
})

</script>

<template>
    <p>This is some text.</p>
    <div ref="container">
    </div>
</template>

<style scoped>
</style>
