<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue';
import { Terminal } from './terminal.ts';

let container = useTemplateRef('container');
let terminal = null;

onMounted(async () => {
    if (container.value === null) throw new Error("Typewriter container is null");
    terminal = new Terminal({
        element: container.value,
    });
    terminal.write("This is text in the typewriter.");
})

</script>

<template>
    <div ref="container">
    </div>
</template>

<style>
.terminal {
    line-height: 1.5em;
    padding: 0;
    margin: 0;
    text-align: left;
    white-space: pre;
}
.terminal .row {
}
@keyframes blinkTextCursor {
    0% { opacity: 0; }
    20% { opacity: 1; }
    60% { opacity: 1; }
    95% { opacity: 0; }
    100% { opacity: 0; }
}
.cursor {
    animation: blinkTextCursor 1200ms infinite normal;
}
</style>
