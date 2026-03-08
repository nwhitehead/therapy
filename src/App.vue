<script setup lang="ts">

import { ref, onMounted } from 'vue';
import Typewriter from './typewriter.vue';

// crt help from: https://codepen.io/thisanimus/pen/OJpaqWz

let bgMusic = ref(null);
let crtRef = ref(null);
const speedup = 1;
const glitchTMin = 5000 / speedup;
const glitchTMax = 25000 / speedup;
const rollTMin = 1000 / speedup;
const rollTMax = 10000 / speedup;
const flickerTMin = 1000 / speedup;
const flickerTMax = 5000 / speedup;
const glitchDuration = 350;
const flickerDuration = 1000;
const rollYMin = -2;
const rollYMax = 2;
const rollDurationMin = 100;
const rollDurationMax = 300;

function scheduleGlitch() {
    const delay = Math.random() * (glitchTMax - glitchTMin) + glitchTMin;
    setTimeout(() => {
        crtRef.value.classList.add('glitch');
        setTimeout(() => crtRef.value.classList.remove('glitch'), glitchDuration);
        scheduleGlitch();
    }, delay);
}

function scheduleRoll(){
    setTimeout(() => {
        const y = (Math.random() * (rollYMax - rollYMin) + rollYMin).toFixed(1);
        crtRef.value.style.transform = `translateY(${y}px)`;
        setTimeout(() => {
            crtRef.value.style.transform = 'translateY(0)';
        }, rollDurationMin + Math.random() * (rollDurationMax - rollDurationMin));
        scheduleRoll();
    }, rollTMin + Math.random() * (rollTMax - rollTMin));
}

function scheduleFlicker() {
    const delay = Math.random() * (flickerTMax - flickerTMin) + flickerTMin;
    setTimeout(() => {
        crtRef.value.classList.add('flicker');
        setTimeout(() => crtRef.value.classList.remove('flicker'), flickerDuration);
        scheduleFlicker();
    }, delay);
}

onMounted(() => {
    // scheduleGlitch();
    // scheduleRoll();
    scheduleFlicker();
})

// Ideas for bg music:
//
// Cobalt Rabbit, Long Walks and Oceansides, Like Home
// 2:24-5:30ish
// cool, smooth, slow, soft, deep
//
// JIKONU, difficult emotion, analysis paralysis
// intense, hypnotic
//
// JIKONU, spiral, it wouldn't make much of a difference
// slow, piano, sad
//
// JIKONU, spiral, everything will be ok i promise
// harsh at end
//
// JIKONU, who you want me to be, epilogue
// weird, angelic, sci-fi random sounds
//
function play() {
    console.log('Play');
    if (bgMusic.value) {
        bgMusic.value.volume = 0.5;
        bgMusic.value.play();
    }
}
</script>

<template>
    <audio id="bgaudio" ref="bgMusic" src="/home_loop.opus" loop></audio>
    <div ref="crtRef" class="crt" @click="play">
        <div class="wrapper">
            <Typewriter>
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
    max-width: 1280px;
    text-align: left;
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
    20% { transform: translate(-2px, 2px) skew(1deg,1deg); filter: blur(1px); }
    40% { transform: translate(2px,-2px) skew(-1deg,-1deg); filter: blur(1px); }
    60% { transform: translate(-1px,1px) skew(0.5deg,0.5deg); opacity: 0.9; }
    80% { transform: translate(1px,-1px) skew(-0.5deg,-0.5deg); opacity: 1; }
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
