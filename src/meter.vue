<script setup lang="ts">

import { useTemplateRef, onMounted, onUnmounted, ref, watch } from 'vue';
import VUMeter from './VUMeter01.png';
import { perlin2 } from './perlin.js';

const props = defineProps(['level', 'noise', 'frequency']);

let canvas = useTemplateRef('canvas');
const rAF = ref(null);

async function newImg(src) {
    let img = new Image();
    img.src = src;
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img);
        };
    });
}

const frameWidth = 177;
const frameHeight = 94;
const frameCount = 61;
const outputScale = 1.5;

function clamp(x: number, lo: number, hi: number) {
    return Math.min(Math.max(x, lo), hi);
}

onMounted(async () => {
    const ctx = canvas.value?.getContext('2d');
    const img = await newImg(VUMeter);
    function update(t: number) {
        const noiseAmp = props.noise ?? 0;
        const noiseFreq = props.frequency ?? 1;
        ctx?.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);
        ctx?.fillRect(0, 0, frameWidth, frameHeight);
        const x = props.level + perlin2(0.23, t * noiseFreq * 0.001) * noiseAmp;
        const frame = clamp(Math.floor(x * frameCount), 0, frameCount - 1);
        ctx?.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth * outputScale, frameHeight * outputScale);
    }
    function f(t) {
        update(t);
        rAF.value = requestAnimationFrame(f);
    }
    rAF.value = requestAnimationFrame(f);
});

onUnmounted(() => {
    if (rAF.value) {
        cancelAnimationFrame(rAF.value);
    }
});

</script>

<template>
    <div class="container">
        <div class="vstack">
            <span>Lie Meter</span>
            <canvas ref="canvas" :width="frameWidth * outputScale" :height="frameHeight * outputScale"></canvas>
        </div>
    </div>
</template>

<style>
div.container {
    position: absolute;
    top: 50px;
    display: flex;
    flex-direction: row;
    /* width: 100vw; */
    justify-content: center;
    align-items: center;
}
div.vstack {
    display: flex;
    flex-direction: column;
}
</style>
