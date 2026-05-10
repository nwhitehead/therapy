<script setup lang="ts">

import { useTemplateRef, onMounted, watch } from 'vue';
import VUMeter from './VUMeter01.png';
import { perlin2 } from './perlin.js';

const props = defineProps(['data']);

let canvas = useTemplateRef('canvas');

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

function clamp(x: number, lo: number, hi: number) {
    return Math.min(Math.max(x, lo), hi);
}

onMounted(async () => {
    const ctx = canvas.value?.getContext('2d');
    const img = await newImg(VUMeter);
    const noiseAmp = 0.8;
    const noiseFreq = 8.0;
    function update(v: number, t: number) {
        ctx?.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);
        ctx?.fillRect(0, 0, frameWidth, frameHeight);
        // Math.cos(t * 2.5 * 0.001) * slowAmp
        // perlin2(3.19, t * 0.3 * 0.001) * slowAmp
        // freq 0.3 1.0 3.0
        const x = 0.5 + perlin2(0.23, t * noiseFreq * 0.001) * noiseAmp;
        const frame = clamp(Math.floor(x * frameCount), 0, frameCount - 1);
        ctx?.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth * 1.5, frameHeight * 1.5);
    }
    update(props.data);
    function f(t) {
        update(props.data, t);
        requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
    watch(props, async (newValue) => {
        update(props.data);
    });
});


</script>

<template>
    <canvas ref="canvas" width="400px" height="200px"></canvas>
</template>

<style>
canvas {
    position: absolute;
    top: 50px;
}
</style>
