<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue';
import { Terminal } from './terminal.ts';

const emit = defineEmits(['event']);

let container = useTemplateRef('container');
let terminal = null;

onMounted(async () => {
    if (container.value === null) throw new Error("Typewriter container is null");
    terminal = new Terminal({
        element: container.value,
        rows: 12,
        cols: 60,
        eventCallback: (evt: any) => {
            emit('event', evt);
        }
    });
    terminal.moveCursor(0, 0);
    terminal.write("X\nThis is ");
    terminal.pushAttr({ bold: true });
    terminal.write("text");
    terminal.popAttr();
    terminal.write(" in the ");
    terminal.writeAttrib("typewriter", { fg: '#ff0' });
    terminal.write(". More text.");
    terminal.write("\b\b\b\b\b\b\b\b\b\b\b\b\n");
    await terminal.writeMixedAsync([
        "What do we ", [ 'push', { bold: true }], "do", [ 'pop' ], " about you? ",
    ]);
    await terminal.writeAsync("All work and no play makes Jack a dull boy. ".repeat(10));
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
    margin: auto;
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
