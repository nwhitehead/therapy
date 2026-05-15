
import * as THREE from 'three';
import { perlin2 } from '../src/perlin.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

const width = 1024;
const height = 720;

function ring(sz, speed, material, ratio) {
    let result = new THREE.Mesh(new THREE.PlaneGeometry(sz * ratio, sz), material);
    result.update = (time) => {
        result.rotation.set(0, 0, time * speed + perlin2(0.3165816 * sz, time * 0.0001));
    };
    return result;
}

const range = (length) => Array.from({ length }, (_, i) => i);

window.addEventListener('DOMContentLoaded', async () => {
    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const map = await loader.loadAsync('/sigil2.png');
    const material = new THREE.MeshBasicMaterial({ map, transparent: true, color: 0xffffff });
    const aspectRatio = map.image.width / map.image.height;
    const camera = new THREE.PerspectiveCamera(75, width / height);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    let composer = null;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = Math.pow(1.2, 4.0);
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 0.1;
    bloomPass.radius = 0.1;
    const outputPass = new OutputPass();
    composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    camera.position.z = 200;
    let speed = 0.0003;
    let rings = [];
    let sz = 860;
    for (let i = 0; i < 13; i++) {
        const r = ring(sz, speed * (1 + perlin2(1.71675, i * 1.1)), material, aspectRatio);
        rings.push(r);
        sz /= 1.33;
        speed *= -0.8;
    }
    rings.map((elem) => scene.add(elem));
    renderer.setAnimationLoop((time) => {
        rings.map((elem) => elem.update(time));
        //renderer.render(scene, camera);
        composer.render();
    });
    console.log(map);
});
