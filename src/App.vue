<script setup lang="ts">

import { ref, useTemplateRef, onMounted } from 'vue';
import Typewriter from './typewriter.vue';

// crt help from: https://codepen.io/thisanimus/pen/OJpaqWz

let bgMusic = useTemplateRef('bgMusic');
let crtRef = useTemplateRef('crt');
let clickRef = useTemplateRef('clickSfx');
let playing = false;
const data = ref([]);
let ready = false;

function f(lst) {
    return [ { clear: 1}, ...lst, { push: { bold: true } }, "\nClick to continue", { pop:1 }];
}

const cards: any = [
    [  { push: { bold: true } }, "click to start", { pop:1 } ],
    f([ "Did you hear that? Make sure you have volume on.\n" ]),
    f([ "Clicker training is a positive reinforcement method using a\ndistinct sound.\n" ]),
    // [ { clear:1 }, "What do we ", { push: { fg: "#ff0" } }, "do", { pop:1 }, " about you?\n" ],
    // [ { clear:1 }, "Let's just see what happens.\n" ],
    [ { clear: 1} ],
];
let position: number = 0;

const speedup = 1;
const glitchTMin = 5000 / speedup;
const glitchTMax = 25000 / speedup;
const flickerTMin = 1000 / speedup;
const flickerTMax = 5000 / speedup;
const glitchDuration = 350;
const flickerDuration = 1000;

function scheduleGlitch() {
    const delay = Math.random() * (glitchTMax - glitchTMin) + glitchTMin;
    setTimeout(() => {
        crtRef.value?.classList.add('glitch');
        setTimeout(() => crtRef.value?.classList.remove('glitch'), glitchDuration);
        scheduleGlitch();
    }, delay);
}

function scheduleFlicker() {
    const delay = Math.random() * (flickerTMax - flickerTMin) + flickerTMin;
    setTimeout(() => {
        crtRef.value?.classList.add('flicker');
        setTimeout(() => crtRef.value?.classList.remove('flicker'), flickerDuration);
        scheduleFlicker();
    }, delay);
}

onMounted(() => {
    scheduleGlitch();
    // scheduleRoll();
    scheduleFlicker();
    data.value = cards[position];
});

function onReady() {
    ready = true;
    console.log('onReady');
}

function click() {
    if (!playing) {
        play();
    }
    if (ready) {
        ready = false;
        position += 1;
        if (position < cards.length) {
            data.value = cards[position];
            if (clickRef.value) {
                clickRef.value.play();
            }
        }
    }
}

function play() {
    playing = true;
    if (bgMusic.value) {
        bgMusic.value.volume = 0.5;
        bgMusic.value.play();
    }
}

</script>

<template>
    <audio ref="clickSfx" src="/click.opus"></audio>
    <audio ref="bgMusic" src="/nomads.mp3" loop></audio>
    <div ref="crt" class="crt" @click="click">
        <div class="wrapper">
            <Typewriter :data=data @ready="onReady">
            </Typewriter>
        </div>
    </div>
</template>

<style scoped>

.crt {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: monospace;
    border-radius: 30px;
    user-select: none;
}
.wrapper {
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.crt {
    background-color: rgb(25, 25, 30);
    text-shadow: 0 0 0.2em currentColor, 1px 1px rgba(255, 0, 255, 0.5),-1px -1px rgba(0, 255, 255, 0.4);
    position: relative;
    &:before,
    &:after {
        content: "";
        transform: translateZ(0);
        pointer-events: none;
        mix-blend-mode: overlay;
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        border-radius: 30px;
    }

    &:before {
        background: repeating-linear-gradient(
            rgb(218, 49, 49) 0px,
            rgb(112, 159, 115) 2px,
            rgb(40, 129, 206) 4px
        );
    }
}

@keyframes glitch {
    0% { transform: translate(0); opacity: 1; filter: none; }
    20% { transform: translate(-2px, 2px) skew(0.5deg,0.5deg); filter: blur(1px); }
    40% { transform: translate(2px,-2px) skew(-0.5deg,-0.5deg); filter: blur(1px); }
    60% { transform: translate(-1px,1px) skew(0.25deg,0.25deg); opacity: 0.9; }
    80% { transform: translate(1px,-1px) skew(-0.25deg,-0.25deg); opacity: 1; }
    100% { transform: translate(0); opacity: 1; filter: none; }
}

.glitch {
    animation: glitch 0.35s linear;
}

@keyframes flicker {
  0% { opacity:   0.92470; }
  5% { opacity:   0.92250; }
  10% { opacity:  0.95397; }
  15% { opacity:  0.99918; }
  20% { opacity:  0.95121; }
  25% { opacity:  0.99582; }
  30% { opacity:  0.95925; }
  35% { opacity:  0.96666; }
  40% { opacity:  0.90380; }
  45% { opacity:  0.99641; }
  50% { opacity:  0.99994; }
  55% { opacity:  0.93594; }
  60% { opacity:  0.99382; }
  65% { opacity:  0.97803; }
  70% { opacity:  0.89917; }
  75% { opacity:  0.95337; }
  80% { opacity:  0.97669; }
  85% { opacity:  0.97411; }
  90% { opacity:  0.97307; }
  95% { opacity:  0.93920; }
  100% { opacity: 0.96779; }
}

.flicker .wrapper {
    animation: flicker 4.0s infinite;
}


</style>
