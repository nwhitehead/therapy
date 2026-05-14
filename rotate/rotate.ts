
import * as THREE from 'three';

const width = 1024;
const height = 720;

function ring(sz, speed, material, ratio) {
    let result = new THREE.Mesh(new THREE.PlaneGeometry(sz * ratio, sz), material);
    result.update = (time) => {
        result.rotation.set(0, 0, time * speed);
    };
    return result;
}

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
    const speed = 0.0003;
    const r0 = ring(200, speed, material, aspectRatio);
    const r1 = ring(300, speed, material, aspectRatio);
    scene.add(r0);
    scene.add(r1);
    renderer.setAnimationLoop((time) => {
        r0.update(time);
        r1.update(time);
        renderer.render(scene, camera);
    });
    console.log(map);
});
