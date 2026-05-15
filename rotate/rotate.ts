
import * as THREE from 'three';
import { perlin2 } from '../src/perlin.js';

const width = 1024;
const height = 720;

function ring(sz, speed, material, ratio) {
    let result = new THREE.Mesh(new THREE.PlaneGeometry(sz * ratio, sz), material);
    result.update = (time) => {
        result.rotation.set(0, 0, time * speed + 0.2 * perlin2(sz, time * 0.0005));
    };
    return result;
}

const range = (length) => Array.from({ length }, (_, i) => i);

window.addEventListener('DOMContentLoaded', async () => {
    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const map = await loader.loadAsync('/sigil1.png');
    const material = new THREE.MeshBasicMaterial({ map, transparent: true });
    const aspectRatio = map.image.width / map.image.height;
    const camera = new THREE.PerspectiveCamera(75, width / height);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 200;
    let speed = 0.0003;
    let rings = [];
    let sz = 860;
    for (let i = 0; i < 13; i++) {
        const r = ring(sz, speed, material, aspectRatio);
        rings.push(r);
        sz /= 1.33;
        speed *= 0.8;
    }
    rings.map((elem) => scene.add(elem));
    renderer.setAnimationLoop((time) => {
        rings.map((elem) => elem.update(time));
        renderer.render(scene, camera);
    });
    console.log(map);
});
