<script setup lang="ts">

import { useTemplateRef, onMounted, watch } from 'vue';
import VUMeter from './VUMeter01.png';

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
    async function update(v: number) {
        const ctx = canvas.value?.getContext('2d');
        let img = await newImg(VUMeter);
        ctx?.clearRect(0, 0, canvas.value?.width ?? 0, canvas.value?.height ?? 0);
        ctx?.fillRect(0, 0, frameWidth, frameHeight);
        const frame = clamp(Math.floor(v * frameCount), 0, frameCount - 1);
        ctx?.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    }
    update(props.data);
    watch(props, async (newValue) => {
        update(props.data);
    });
});


</script>

<template>
    <canvas ref="canvas" width="200px" height="200px"></canvas>
</template>

<style>
canvas {
    position: absolute;
    top: 200px;
}
</style>
