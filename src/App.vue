<script setup lang="ts">
</script>

<template>
    <div class="crt">
        <div class="wrapper">
            <code>
                <span class="pink">import</span> <span class="lightblue">{ home }</span> from <span class="yellow">'./_site/home/'</span>;<span class="cursor">_</span>
            </code>
            <p>This is the game.</p>
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
    animation: blinkTextCursor 800ms infinite normal;
}

/* Animation */
.anim-typewriter {
}
@keyframes typewriter {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}
@keyframes blinkTextCursor {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
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
        //opacity: 0.5;
        mix-blend-mode: overlay;
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 1;
    }

    &:before {
        background: repeating-linear-gradient(
            var(--crt-red) 0px,
            var(--crt-green) 2px,
            var(--crt-blue) 4px
        );
    }
}

</style>
