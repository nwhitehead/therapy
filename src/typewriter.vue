<script setup lang="ts">

import { useTemplateRef, onMounted, ref, watch } from 'vue';
import { Terminal } from './terminal.ts';
import Meter from './meter.vue';

const emit = defineEmits(['ready']);
const props = defineProps(['data']);

let container = useTemplateRef('container');
let terminal: Terminal | null = null;
let controller: AbortController = new AbortController();
let clickerRef = useTemplateRef('clickerSfx');
const lie = ref(0.5);
const noise = ref(0.8);
const frequency = ref(2.0);
const meter = ref(true);

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
        const clickerCallback = async () => {
            if (clickerRef.value) {
                clickerRef.value.play();
            }
            console.log('Clicker clicked');
        };
        const lieCallback = async (data) => {
            console.log(`lie callback ${data}`);
            if (data === "0") {
                meter.value = false;
            } else if (data.startsWith('1')) {
                meter.value = true;
                lie.value = parseInt(data[1], 16) / 16;
                noise.value = parseInt(data[2], 16) / 16;
                frequency.value = parseInt(data[3], 16) / 4;
            } else {
                console.log('Illegal lie value');
            }
        };
        await terminal?.writeMixedAsync(props.data, controller.signal, clickerCallback, lieCallback);
        emit('ready');
    });
})

</script>

<template>
    <div ref="container">
        <Transition name="slide">
            <Meter v-if="meter" :level="lie" :noise="noise" :frequency="frequency"></Meter>
        </Transition>
        <audio ref="clickerSfx" src="/clicker.opus"></audio>
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
@keyframes mirror {
    0% {
        transform: translate(2px) skew(5deg) scaleY(-1);
        animation-timing-function: ease-out;
    }
    50% {
        transform: translate(-4px) skew(-20deg) scaleY(-1);
        animation-timing-function: ease-in-out;
    }
    100% {
        transform: translate(2px) skew(5deg) scaleY(-1);
        animation-timing-function: ease-in;
    }
}
/* class mirror is the normal text, mirror-mirror is the reflection */
.mirror-mirror {
    animation: mirror 4s infinite normal;
}
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease-out;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100px);
    opacity: 0;
}

</style>
