import Veda from 'vedajs';

const ID = '____SONGKRANIZER____';

if (!window._____veda) {
  window._____veda = new Veda({});
}
const veda = window._____veda;

const resize = () => {
  veda.resize(window.innerWidth, window.innerHeight);
}

window.chrome.runtime.onMessage.addListener(msg => {
 
  const body = document.body;
  if (!body) { return; }

  if (msg.type === 'songkranizer:load') {
    let canvas = document.getElementById(ID);
    if (canvas) {
      veda.stop();
      veda.loadTexture('image', msg.imageUrl);
      veda.play();
    } else {

      canvas = document.createElement('canvas');
      canvas.id = ID;
      canvas.style.position = 'fixed';
      canvas.style.zIndex = '9999';
      canvas.style.top = '0px';
      canvas.style.left = '0px';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.background = 'transparent';
      canvas.style.pointerEvents = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.style.mixBlendMode = msg.shader.blend;

      body.appendChild(canvas);

      window.addEventListener('resize', resize);

      veda.loadTexture('image', msg.imageUrl);
      veda.setCanvas(canvas);
      veda.loadFragmentShader(msg.shader.code);
      veda.play();
    }
  } 
});