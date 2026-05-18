<script setup lang="ts">

import { ref, type Ref, useTemplateRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { type MixedText } from './terminal.ts';
import Typewriter from './typewriter.vue';
import { position, subposition } from './useStore.ts';
import script from './script.txt?raw';

let bgMusic = useTemplateRef('bgMusic');
let clickRef = useTemplateRef('clickSfx');
let playing = false;
const data: Ref<MixedText> = ref([]);
let ready = false;

// How long after text is ready until click allowed
const INITIAL_DELAY: number = 200;

function splitDelim(txt: MixedText, delim: string, push: any): MixedText {
    let result: MixedText = [];
    for (const item of txt) {
        if (typeof item === 'string') {
            const m = item.split(delim);
            for (let i = 0; i < m.length; i++) {
                if (i % 2 === 0) {
                    result.push(m[i] ?? '');
                } else {
                    result.push( { push });
                    result.push(m[i] ?? '');
                    result.push( { pop:1 });
                }
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

function splitDelimSingle(txt: MixedText, delim: string, push: any): MixedText {
    let result = [];
    for (const item of txt) {
        if (typeof item === 'string') {
            const m = item.split(delim);
            for (let i = 0; i < m.length; i++) {
                result.push(m[i]);
                if (i < m.length - 1) {
                    result.push(push);
                }
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

function splitBraceDelim(txt: MixedText, delim: string, pushFunc: (x: string | undefined) => any): MixedText {
    let result = [];
    for (const item of txt) {
        if (typeof item === 'string') {
            const rg = new RegExp(`\{\{${delim}([^\}]*)\}\}`);
            const m = item.split(rg);
            for (let i = 0; i < m.length; i+=2) {
                result.push(m[i]);
                if (i < m.length - 1) {
                    result.push(pushFunc(m[i + 1]));
                }
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

function f(item: string) {
    let prompt = '\nClick to continue';
    // First look for alternate prompt
    const m = item.match(/\[(.*)\]/);
    if (m) {
        prompt = m[1] ?? '';
        item = item.replace(/\[(.*)\]/, '');
    }
    // Look for bold-italic, then bold, then italic
    let items = splitDelim([ item ], "***", { bold: true, italic: true, fg: '#ff0'});
    items = splitDelim(items, "**", { italic: true });
    items = splitDelim(items, "*", { italic: true, fg: '#b785c0' });
    items = splitDelim(items, "&&&", { angelic: true });
    items = splitDelim(items, "&-&", { mirror: true });
    items = splitDelimSingle(items, "@", { delay:1 });
    items = splitDelimSingle(items, "%%%", { pause:1 });
    items = splitDelimSingle(items, "$$$", { clicker:1 });
    items = splitBraceDelim(items, "L", (txt) => {
        return { lie: txt };
    });
    return [ { clear: 1}, ...items, { push: { fg: '#b2d9fd' } }, prompt, { pop:1 }];
}

function innerCards() {
    const txt = script;
    const chunks = txt.trimStart().split('\n--\n');
    return chunks.map((x: any) => f(x));
}

const cards: any = [
    ...innerCards(),
    [ { clear: 1} ],
];

function onReady() {
    setTimeout(() => {
        ready = true;
    }, INITIAL_DELAY);
}

function click() {
    if (!playing) {
        play();
    }
    if (ready) {
        ready = false;
        subposition.value += 1;
        if (subposition.value > cardCount()) {
            subposition.value = 0;
            position.value += 1;
            if (position.value < cards.length) {
                data.value = subcard();
                if (clickRef.value) {
                    clickRef.value.play();
                }
            } else {
                // Restart the game
                position.value = 0;
                data.value = subcard();
                if (clickRef.value) {
                    clickRef.value.play();
                }
            }
        } else {
            data.value = subcard();
        }
        console.log(`Position = ${position.value}, ${subposition.value}`);
    }
}

function play() {
    playing = true;
    if (bgMusic.value) {
        bgMusic.value.volume = 0.0;
        bgMusic.value.play();
    }
}

/// Truncate card at correct subposition (just give latest part, other stuff should already be on screen)
function cardUpToSubposition(card: MixedText, subposition: number): MixedText {
    let result = [];
    let count = 0;
    for (const item of card) {
        if (typeof item !== 'string' && ('pause' in item)) {
            if (count === subposition) {
                return result;
            }
            count += 1;
        } else if (count === subposition) {
            result.push(item);
        }
    }
    return result;
}

function subcard(): MixedText {
    const card = cards[position.value];
    if (!card) {
        position.value = 0;
        subposition.value = 0;
    }
    return cardUpToSubposition(cards[position.value], subposition.value);
}

/// How many subpositions does the current card have?
function cardCount(): number {
    let count = 0;
    const card = cards[position.value];
    if (!card) {
        return 0;
    }
    for (const item of card) {
        if (!(typeof item === 'string') && ('pause' in item)) {
            count += 1;
        }
    }
    return count;
}

function onKeydown(evt: any) {
    let changed = false;
    if (evt.key === 'ArrowRight') {
        position.value += 1;
        if (position.value > cards.length - 1) {
            position.value = cards.length - 1;
        }
        subposition.value = 0;
        changed = true;
    }
    if (evt.key === 'ArrowLeft') {
        position.value -= 1;
        if (position.value < 0) {
            position.value = 0;
        }
        subposition.value = 0;
        changed = true;
    }
    if (evt.key === 'r') {
        data.value = [''];
        nextTick(() => {
            data.value = subcard();
        });
    }
    if (evt.key === ' ') {
        if (!evt.repeat) {
            click();
        }
        return;
    }
    if (changed) {
        data.value = subcard();
        console.log(`Position = ${position.value}, ${subposition.value}`);
    }
}

onMounted(() => {
    //scheduleGlitch();
    // scheduleRoll();
    //scheduleFlicker();
    data.value = subcard();
    window.addEventListener('click', click);
    window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', click);
    window.removeEventListener('keydown', onKeydown);
});

</script>

<template>
    <div ref="crt" tabindex="0" class="crt">
        <audio ref="clickSfx" src="/click.opus"></audio>
        <audio ref="bgMusic" src="/nomads.mp3" loop></audio>
        <div class="wrapper">
            <Typewriter :data=data :subposition=subposition @ready="onReady">
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
