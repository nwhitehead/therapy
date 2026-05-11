<script setup lang="ts">

import { useTemplateRef, onMounted, watch } from 'vue';
import VUMeter from './VUMeter01.png';
import { perlin2 } from './perlin.js';

const props = defineProps(['level', 'noise', 'frequency']);

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
const outputScale = 1.5;

function clamp(x: number, lo: number, hi: number) {
    return Math.min(Math.max(x, lo), hi);
}

onMounted(async () => {
    const ctx = canvas.value?.getContext('2d');
    const img = await newImg(VUMeter);
    const noiseAmp = props.noise ?? 0;
    const noiseFreq = props.frequency ?? 1;
    function update(v: number, t: number) {
        ctx?.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);
        ctx?.fillRect(0, 0, frameWidth, frameHeight);
        // freq 0.3 1.0 3.0
        const x = props.level + perlin2(0.23, t * noiseFreq * 0.001) * noiseAmp;
        const frame = clamp(Math.floor(x * frameCount), 0, frameCount - 1);
        ctx?.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth * outputScale, frameHeight * outputScale);
    }
    update(props.level);
    function f(t) {
        update(props.level, t);
        requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
    watch(props, async (newValue) => {
        update(props.level);
    });
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
    width: 100vw;
    justify-content: center;
    align-items: center;
}
div.vstack {
    display: flex;
    flex-direction: column;
}
</style>
