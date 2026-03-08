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
    <p>This is some top text.</p>
    <div ref="container">
    </div>
</template>

<style scoped>
</style>
