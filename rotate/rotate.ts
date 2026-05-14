
async function newImg(src) {
    let img = new Image();
    img.src = src;
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img);
        };
    });
}
const width = 1960;
const height = 1024;

window.addEventListener('DOMContentLoaded', async () => {
    const src = "./public/sigil1.png";
    const canv = document.getElementById('canvas');
    console.log(canv);
    const ctx = canvas.value?.getContext('2d');
    const img = await newImg(src);
    console.log(img);
    function update(v: number, t: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.value?.height ?? 0);
        ctx.fillRect(0, 0, frameWidth, frameHeight);
        // // freq 0.3 1.0 3.0
        // const x = props.level + perlin2(0.23, t * noiseFreq * 0.001) * noiseAmp;
        // const frame = clamp(Math.floor(x * frameCount), 0, frameCount - 1);
        // ctx.drawImage(img, 0, frameHeight * frame, frameWidth, frameHeight, 0, 0, frameWidth * outputScale, frameHeight * outputScale);
    }

});
