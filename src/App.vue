<script setup lang="ts">

import { ref, onMounted } from 'vue';

let crtRef = ref(null);
const speedup = 1;
const glitchTMin = 5000 / speedup;
const glitchTMax = 25000 / speedup;
const rollTMin = 1000 / speedup;
const rollTMax = 10000 / speedup;
const flickerTMin = 1000 / speedup;
const flickerTMax = 5000 / speedup;
const glitchDuration = 300;
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
    scheduleGlitch();
    scheduleRoll();
    scheduleFlicker();
})

</script>

<template>
    <div ref="crtRef" class="crt">
        <div class="wrapper">
            <code>
                <span class="pink">import</span> <span class="lightblue">{ home }</span> from <span class="yellow">'./_site/home/'</span>;<span class="cursor">_</span>
            </code>
            <p>This is the game.</p>
        </div>
    </div>
</template>

<style scoped>
:root {
  --crt-red: rgb(10, 8, 8);
  --crt-green: rgb(112, 159, 115);
  --crt-blue: rgb(40, 129, 206);
}

.crt {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: monospace;
    border-radius: 30px;
}
.pink {
    color: pink;
}
.yellow {
    color: yellow;
}
.lightblue {
    color: lightblue;
}
.code {
    color: attr(data-color);
    display: inline-block;
    white-space: nowrap;
}
.wrapper {
    padding-top: 6rem;
    padding-left: 4rem;
    max-width: 1280px;
    text-align: left;
}
.code {
    animation: typewriter 1s steps(14) 1s 1 normal both;
    line-height: 1;
    margin: 0;
    display: inline-block;
    white-space: nowrap;
    overflow-x: hidden;
}
.cursor {
    display: inline-block;
    animation: blinkTextCursor 1200ms infinite normal;
}

/* Animation */
.anim-typewriter {
}
@keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
}
@keyframes blinkTextCursor {
    0% { opacity: 0; }
    20% { opacity: 1; }
    60% { opacity: 1; }
    95% { opacity: 0; }
    100% { opacity: 0; }
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
            var(--crt-red) 0px,
            var(--crt-green) 2px,
            var(--crt-blue) 4px
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
    animation: glitch 0.3s linear;
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
