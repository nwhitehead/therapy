<script setup lang="ts">

import { useTemplateRef, onMounted, watch } from 'vue';
import { Terminal } from './terminal.ts';

const emit = defineEmits(['ready']);
const props = defineProps(['data']);

let container = useTemplateRef('container');
let terminal: Terminal | null = null;

onMounted(async () => {
    if (container.value === null) throw new Error("Typewriter container is null");
    terminal = new Terminal({
        element: container.value,
        rows: 12,
        cols: 60,
    });
    watch(props, async () => {
        console.log('data changed');
        await terminal?.writeMixedAsync(props.data);
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
.terminal .row {
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
