<script setup lang="ts">

import { useTemplateRef, onMounted, watch } from 'vue';
import { Terminal } from './terminal.ts';

const emit = defineEmits(['ready']);
const props = defineProps(['data']);

let container = useTemplateRef('container');
let terminal: Terminal | null = null;
let controller: AbortController = new AbortController();

onMounted(async () => {
    if (container.value === null) throw new Error("Typewriter container is null");
    terminal = new Terminal({
        element: container.value,
        rows: 12,
        cols: 60,
        delay: 0,
    });
    watch(props, async () => {
        controller.abort();
        controller = new AbortController();
        await terminal?.writeMixedAsync(props.data, controller.signal);
        console.log('ready');
        emit('ready');
    });
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
    text-align: left;
    white-space: pre;
    width: fit-content;
    margin: 0;
}
.terminal .row span {
    display: inline-block;
    width: 0.605em;
    height: 1.5em;
}
@keyframes blinkTextCursor {
    0% { opacity: 1; }
    40% { opacity: 1; }
    75% { opacity: 0; }
    100% { opacity: 0; }
}
.cursor {
    animation: blinkTextCursor 1200ms infinite normal;
    display: inline-block;
    width: 0;
    left: 0;
    top: 0;
}
</style>
