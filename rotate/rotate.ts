
import * as THREE from 'three';

const width = 1024;
const height = 720;

window.addEventListener('DOMContentLoaded', async () => {
    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const map = await loader.loadAsync('/sigil1.png');
    const material = new THREE.SpriteMaterial({ map, color: 0xffffff });
    const aspectRatio = map.image.width / map.image.height;
    //const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(200 * aspectRatio, 200, 1)
    scene.add(sprite);
    const camera = new THREE.PerspectiveCamera(75, width / height);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 200;
    renderer.render(scene, camera);
    console.log(map);
});
