<script setup lang="ts">

import { ref, useTemplateRef, onMounted, nextTick } from 'vue';
import Typewriter from './typewriter.vue';

// crt help from: https://codepen.io/thisanimus/pen/OJpaqWz

let bgMusic = useTemplateRef('bgMusic');
let crtRef = useTemplateRef('crt');
let clickRef = useTemplateRef('clickSfx');
let playing = false;
const data = ref([]);
let ready = false;

function splitDelim(txt, delim, push) {
    let result = [];
    if (typeof txt === 'string') {
        txt = [ txt ];
    }
    for (const item of txt) {
        if (typeof item === 'string') {
            const m = item.split(delim);
            for (let i = 0; i < m.length; i++) {
                if (i % 2 === 0) {
                    result.push(m[i]);
                } else {
                    result.push( { push });
                    result.push(m[i]);
                    result.push( { pop:1 });
                }
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

function f(item) {
    let prompt = '\nClick to continue';
    // First look for alternate prompt
    const m = item.match(/\[(.*)\]/);
    if (m) {
        prompt = m[1];
        item = item.replace(/\[(.*)\]/, '');
    }
    // Look for bold-italic, then bold, then italic
    let items = splitDelim(item, "***", { bold: true, italic: true, fg: '#ff0'});
    items = splitDelim(items, "**", { fg: '#7197d5' });
    items = splitDelim(items, "*", { italic: true, fg: '#b785c0' });
    return [ { clear: 1}, ...items, { push: { fg: '#b2d9fd' } }, prompt, { pop:1 }];
}

function innerCards() {
    const txt = `[click to start]
--
Did you hear that?
Make sure your ***volume*** is on.

--
Have you ever wondered if things have *true names*?

--
In folklore tales, knowing someone's name gives you power
over them.

This is the *Law of Names*.

--
Odysseus tricks Polyphemus the cyclops by saying his name
is *Nobody*.

Then as he sails away Odysseus boastfully shouts
his true name. Polyphemus implores his father Poseidon
for revenge which causes Odysseus trouble.

--
In the opera *Turandot* a princess tries to learn the name
of a suitor to have him executed.

In the end he freely gives her his name giving her the
power to have him executed if she wishes.

--
How do you convince someone to give you their *true name*?

--
How do you convince someone to give up *power* to you?

--
How do you convince someone to give *themselves* to you?

--
Have it do small things for you.

"Could you do this for me?"

--
Get it used to it.

Teach it obedience isn't *scary*.

--
Ask it for things that are small enough that it doesn't
trigger any hestitation.

Make it become *unconscious*.
[Click]

--
Don't approach it.

Have every approach be at its initiative, then *reward* it.
[Click to approach]

--
Make it so that every interaction between you is its
choice.

Show it that it is making the *right choice*.
[Click to make the right choice]

--
Indicate an openness to proceed, but wait until it performs
an action to proceed.

Reward that choice.

--
This might seem counterintuitive, but the way to dissolve
its choice is to train it to *choose you*, as muscle memory.

(You're doing great, by the way.)

--
Reward it with chocolate 🍫 and hugs and headpats or whatever
feels good for it and floods its system with dopamine.

You're training its body so it doesn't need a mind.
[Click for headpats]

--
(Pets your head)

Then: make it associate any reward with *you*.

Don't claim credit. Just be there.
Remove any other context its mind could latch onto.

--
If it needs comforting, like through a breakup or similar,
be patient, empathetic, and caring. The instant it stops
crying and feels better suggest going to another room
and having a treat.

*Wipe the context*.
[I might need comforting]

--
(You're OK, you're so brave, I know you can do this!)

Teach its mind that it feels good because you are there,
it followed you, all the other stuff was left back in
the other room.

*That stuff doesn't matter any more.*

--
Never punish it.

Never demand.

Never push.

--
Be *patient*. All animals will run or fight when pressured.
Have it approach.
[Approach]

--
Choice is self-reinforcing.

Every bit of obedience taken by its own initiative shifts
its identity and self towards:

*"I am a thing which chooses to obey"*

--
Make it forget what it is like to not be yours.

Don't punish, just... don't reward.

It doesn't have to obey, it can run off and take a nap
if its tired. That's OK!

--
Eventually it will choose to do something for you before
bed despite being tired.

THEN give it warm milk with honey, pull out the softest
blanket, pet it, cuddle it, and snuggle it to sleep.

--
Teach it that disobedience is hollow and empty and bland.

*Obedience is heaven*.

You leave the door open.

--
You never demand.

You never push.

That triggers *resistance*.
[Open the door]

--
You offer.
[What is the offer?]

--
An offer triggers curiosity, consideration.

Just mention it, offhand.
*Plant the seed.*
[OK but what is the offer?]

--
"There's nothing that can be closer or dearer than someone
who gives all of themselves up to me."

--
The rest is a matter of time.

*Obedience feels good.*

Giving effort to you feels good.
[Obedience does feel good]

--
Every time it feels good, you're there.

If it thinks of good things, you're there.

It can get more of the good feeling if it just,
*becomes yours*.

--
There is nothing demanded.

There is nothing scary.

It's an easy choice.
[Make an easy choice]

--
It might take a few months for it to go from friends to
begging to be yours.

*There is no rush.*

After a few more months it might want to wear a collar
for you.

--
Bring it little chocolate *treats* 🍫.

Spray it with perfume when it gives a little bit of itself
over to you.

--
A sweet perfume for *cuddles*.

A spicy one for *sensuality*.

A cherry one for *submission*.

--
Teach it what *submission* smells like. When it smells
cherry on you, 🍒, it submits.

Teach it that all the things that feel good smell of you.

--
Never demand, punish, or approach.

Be a source of reward, safety, and care.

Make disobedience, resistance, independence, personhood...
uninteresting. Boring. Not wrong, just hollow.

--
Teach it that it is so much better being *Yours*.
🍒
[Submit]

--

--
Clicker training is a positive reinforcement method using a
distinct sound.
`;
    const chunks = txt.trimStart().split('\n--\n');
    return chunks.map((x: any) => f(x));
}

const cards: any = [
    ...innerCards(),
    [ { clear: 1} ],
];
let position: number = cards.length - 4;

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

function onKeydown(evt: any) {
    let changed = false;
    if (evt.key === 'ArrowRight') {
        position += 1;
        if (position > cards.length - 1) {
            position = cards.length - 1;
        }
        changed = true;
    }
    if (evt.key === 'ArrowLeft') {
        position -= 1;
        if (position < 0) {
            position = 0;
        }
        changed = true;
    }
    if (evt.key === ' ') {
        data.value = '';
        nextTick(() => {
            data.value = cards[position];
        });
    }
    if (changed) {
        data.value = cards[position];
    }
}

</script>

<template>
    <audio ref="clickSfx" src="/click.opus"></audio>
    <audio ref="bgMusic" src="/nomads.mp3" loop></audio>
    <div ref="crt" tabindex="0" class="crt" @click="click" @keydown="onKeydown">
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
