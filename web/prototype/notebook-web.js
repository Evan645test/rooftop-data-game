/* Browser IME input sits directly on the existing notebook's right page. */
(() => {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `@font-face{font-family:PrototypeIansui;src:url('prototype/Iansui-Regular.ttf') format('truetype');font-display:swap}
    #rp-notebook-input{position:fixed;z-index:200;box-sizing:border-box;resize:none;border:0;outline:0;padding:0;margin:0;background:transparent;color:#254879;font-family:PrototypeIansui,serif;line-height:1.74;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;caret-color:#254879;scrollbar-width:thin;scrollbar-color:#9b9c83 transparent}`;
  document.head.append(style);
  const area = document.createElement('textarea');
  area.id = 'rp-notebook-input';
  area.setAttribute('aria-label', '我的採訪筆記：個人想法');
  area.maxLength = 800;
  area.spellcheck = false;
  area.hidden = true;
  document.body.append(area);
  let key = null;
  function layout() {
    if (area.hidden) return;
    const canvas = document.getElementById('canvas');
    const r = canvas.getBoundingClientRect();
    const scale = Math.min(r.width / 1920, r.height / 1080);
    Object.assign(area.style, {
      left: `${r.left + (r.width - 1920 * scale) / 2 + 1040 * scale}px`,
      top: `${r.top + (r.height - 1080 * scale) / 2 + 380 * scale}px`,
      width: `${650 * scale}px`, height: `${420 * scale}px`,
      fontSize: `${31 * scale}px`
    });
  }
  for (const event of ['keydown','keyup','keypress','mousedown','mouseup','mousemove','wheel','touchstart','touchmove','touchend']) {
    area.addEventListener(event, e => e.stopPropagation());
  }
  window.addEventListener('resize', layout);
  new ResizeObserver(layout).observe(document.getElementById('canvas'));
  window.rpNotebook = {
    show(data) {
      if (key !== data.key || area.hidden) area.value = String(data.value || '').slice(0, 800);
      key = data.key;
      area.hidden = false;
      layout();
    },
    read() { return area.hidden ? null : {key, value: area.value}; },
    hide() { area.hidden = true; area.blur(); key = null; }
  };
})();
