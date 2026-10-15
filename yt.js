/* yt.js — vista previa ligera de YouTube: se muestra la miniatura y el reproductor
   (más de 1 MB) solo se carga al pulsar. Modo de privacidad mejorada (youtube-nocookie). */
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.yt-lite');
  if (!btn) return;
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
  f.title = btn.dataset.title || 'Vídeo de YouTube';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  f.style.cssText = 'display:block;width:100%;height:100%;border:0;';
  btn.replaceWith(f);
  f.focus();
});
