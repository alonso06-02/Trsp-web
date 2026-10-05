/* Trap In Spain · páginas de servicio · interactividad */
(function(){
  'use strict';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* barra de progreso de scroll + botón flotante */
  var bar=document.createElement('div');bar.className='sx-progress';document.body.appendChild(bar);
  var wa=$('.sx-cta a[href*="wa.me"]')||$('a.btn-primary[href*="wa.me"]');
  var fl=null;
  if(wa){
    fl=document.createElement('div');fl.className='sx-float';
    fl.innerHTML='<a class="sx-btn sx-btn-gold" target="_blank" rel="noopener noreferrer" href="'+wa.getAttribute('href')+'">Pedir presupuesto</a>';
    document.body.appendChild(fl);
  }
  function onScroll(){
    var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;
    bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';
    if(fl)fl.classList.toggle('show',h.scrollTop>window.innerHeight*0.7);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* foco de luz que sigue al ratón en tarjetas */
  document.addEventListener('pointermove',function(e){
    var t=e.target.closest&&e.target.closest('.svc-step,.svc-equip-card,.svc-stat-card,.svc-track-card,.svc-video-card,.sx-stage');
    if(!t)return;var r=t.getBoundingClientRect();
    t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px');
  },{passive:true});

  /* contadores de estadísticas */
  $$('.svc-stat-num').forEach(function(el){
    var m=el.textContent.trim().match(/^(\d+)(.*)$/);if(!m||reduce)return;
    var end=parseInt(m[1],10),suf=m[2],done=false;
    el.textContent='0'+suf;
    new IntersectionObserver(function(es,o){es.forEach(function(x){
      if(!x.isIntersecting||done)return;done=true;o.disconnect();
      var t0=performance.now(),d=1400;
      (function f(t){var p=Math.min(1,(t-t0)/d),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(f)})(t0);
    })},{threshold:.4}).observe(el);
  });

  /* showcase "Lo que ofrecemos" */
  $$('.sx-offer').forEach(function(box){
    var items=$$('.sx-item',box),stage=$('.sx-stage',box);
    var tag=$('.sx-stage-tag span',box),title=$('.sx-stage-title',box),text=$('.sx-stage-text',box),num=$('.sx-stage-num',box),cta=$('.sx-stage .sx-btn',box);
    var cur=0,timer=null,DUR=6000;
    box.style.setProperty('--sx-dur',(DUR/1000)+'s');
    if(wa&&cta)cta.setAttribute('href',wa.getAttribute('href'));
    function show(i,user){
      cur=i;
      items.forEach(function(b,k){b.classList.toggle('active',k===i);b.setAttribute('aria-selected',k===i)});
      var b=items[i];
      title.textContent=b.dataset.title;text.textContent=b.dataset.text;num.textContent=String(i+1).padStart(2,'0');
      tag.textContent='Incluido · '+String(i+1)+' de '+items.length;
      stage.classList.remove('sx-stage-in');void stage.offsetWidth;stage.classList.add('sx-stage-in');
      if(user){stop();box.classList.add('paused')}
    }
    function stop(){clearTimeout(timer);timer=null}
    function loop(){
      if(reduce)return;stop();
      timer=setTimeout(function(){if(!box.classList.contains('paused')){show((cur+1)%items.length);}loop()},DUR);
    }
    items.forEach(function(b,i){
      b.addEventListener('click',function(){show(i,true)});
      b.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover)').matches)show(i,true)});
      b.addEventListener('keydown',function(e){
        if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();var n=(i+1)%items.length;items[n].focus();show(n,true)}
        if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();var p=(i-1+items.length)%items.length;items[p].focus();show(p,true)}
      });
    });
    show(0);
    var vis=new IntersectionObserver(function(es){es.forEach(function(x){
      if(x.isIntersecting&&!box.classList.contains('paused'))loop();else stop();
    })},{threshold:.25});vis.observe(box);
  });

  /* Antes / Después */
  var ab=$('#sx-ab');
  if(ab){
    var view=$('#ab-demo',ab),bW=$('.sx-ab-before',ab),aW=$('.sx-ab-after',ab),cap=$('#ab-caption'),
        btnB=$('#ab-btn-before'),btnA=$('#ab-btn-after'),play=$('.sx-ab-play',ab),meters=$$('.sx-meter-fill',ab),vals=$$('.sx-meter-top b',ab);
    var N=window.innerWidth<600?34:58,seed=7;
    function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
    function mk(w,fn){for(var i=0;i<N;i++){var s=document.createElement('span');var v=fn(i);s.style.setProperty('--h',v+'%');s.style.setProperty('--dl',(rnd()*.9).toFixed(2)+'s');s.style.setProperty('--d',(.5+rnd()*.7).toFixed(2)+'s');w.appendChild(s)}}
    mk(bW,function(i){return Math.round(12+Math.pow(rnd(),1.6)*62)});          /* irregular y flojo */
    mk(aW,function(i){var e=Math.sin(i/N*Math.PI);return Math.round(34+e*30+rnd()*14)}); /* denso, potente y parejo */
    var base={before:[28,18,22,35],after:[92,88,90,95]},names=['Volumen','Espacio','Brillo','Claridad'];
    var pos=96;
    function set(p){
      pos=Math.max(4,Math.min(96,p));
      view.style.setProperty('--p',pos+'%');
      var k=(96-pos)/92;
      meters.forEach(function(m,i){var v=base.before[i]+(base.after[i]-base.before[i])*k;m.style.setProperty('--w',v+'%');if(vals[i])vals[i].textContent=k>.6?'Alto':(k>.3?'Medio':'Bajo')});
      var after=pos<50;
      btnB.classList.toggle('active',!after);btnA.classList.toggle('active',after);
      cap.textContent=after?'Voz mezclada y masterizada: volumen competitivo, espacio, brillo y lista para plataformas.':'Voz sin procesar: volumen irregular, sin espacio en la mezcla, sin brillo.';
    }
    var anim=null;
    function go(to){
      if(anim)cancelAnimationFrame(anim);
      if(reduce){set(to);return}
      var from=pos,t0=performance.now(),d=700;
      (function f(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);set(from+(to-from)*e);if(p<1)anim=requestAnimationFrame(f)})(t0);
    }
    btnB.onclick=function(){go(96)};btnA.onclick=function(){go(4)};
    var drag=false;
    function move(e){var r=view.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)}
    view.addEventListener('pointerdown',function(e){drag=true;view.setPointerCapture(e.pointerId);if(anim)cancelAnimationFrame(anim);move(e)});
    view.addEventListener('pointermove',function(e){if(drag)move(e)});
    view.addEventListener('pointerup',function(){drag=false});
    view.addEventListener('pointercancel',function(){drag=false});
    play.addEventListener('click',function(){
      var on=!view.classList.contains('playing');
      view.classList.toggle('playing',on);play.classList.toggle('on',on);
      play.lastChild.textContent=on?' Pausar demo':' Reproducir demo';
      if(on){go(96);setTimeout(function(){if(view.classList.contains('playing'))go(4)},1800)}
    });
    set(96);
    /* intro automática al entrar en pantalla: enseña que se puede arrastrar */
    if(!reduce)new IntersectionObserver(function(es,o){es.forEach(function(x){if(x.isIntersecting){o.disconnect();setTimeout(function(){go(30);setTimeout(function(){go(96)},1100)},400)}})},{threshold:.5}).observe(ab);
  }
})();
