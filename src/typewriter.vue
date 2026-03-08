<script setup lang="ts">

import { useTemplateRef, onMounted } from 'vue';
import { init, Terminal } from 'ghostty-web';

let contents = useTemplateRef("me");

onMounted(() => {
    console.log("Mounted", contents.value);
})

</script>

<template>
    <div ref="me">
        <p>This is a paragraph.</p>
        <slot></slot>
    </div>
</template>

<style scoped>
</style>
