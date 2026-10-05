/* Trap In Spain · blog · interactividad de artículos */
(function(){
  'use strict';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  var bar=document.createElement('div');bar.className='bp-progress';document.body.appendChild(bar);
  var toastEl=document.createElement('div');toastEl.className='bp-toast';document.body.appendChild(toastEl);
  var tt;function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('on')},2000)}

  var body=$('.article-body');
  var float=document.createElement('div');float.className='bp-float';document.body.appendChild(float);
  var wa=$('.article-cta a[href*="wa.me"]');
  if(wa)float.innerHTML='<a target="_blank" rel="noopener noreferrer" href="'+wa.getAttribute('href')+'">Hablar con nosotros</a>';
  else if($('.bl-hero')){float.innerHTML='<a href="#biblioteca">Buscar artículo</a>';}
  var now=null,tocLinks=[],heads=[];

  function onScroll(){
    var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    var p=max>0?h.scrollTop/max:0;bar.style.width=(p*100)+'%';
    float.classList.toggle('show',h.scrollTop>window.innerHeight*0.8&&float.firstChild);
    if(body&&now){
      var r=body.getBoundingClientRect();
      now.classList.toggle('show',r.top<-200&&r.bottom>300);
      var cur=0;heads.forEach(function(x,i){if(x.getBoundingClientRect().top<140)cur=i});
      if(heads.length){now.firstChild.textContent=String(cur+1).padStart(2,'0');now.lastChild.textContent=heads[cur].textContent.replace(/^\s+|\s+$/g,'');
        tocLinks.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
    }
  }
  window.addEventListener('scroll',onScroll,{passive:true});

  if(!body){onScroll();return}

  /* tiempo de lectura + chips + compartir */
  var words=(body.textContent||'').trim().split(/\s+/).length;
  var mins=Math.max(1,Math.round(words/200));
  var hero=$('.article-hero > div');
  var crumb=$('nav[aria-label="breadcrumb"]',hero);
  var cat=crumb?crumb.textContent.replace(/^\s*BLOG\s*\/\s*/i,'').trim():'';
  if(hero){
    var meta=document.createElement('div');meta.className='bp-meta';
    var url=location.href.split('#')[0],title=document.title.split('|')[0].trim();
    meta.innerHTML='<span class="bp-chip"><i></i>'+mins+' min de lectura</span>'+(cat?'<span class="bp-chip">'+cat+'</span>':'')+
      '<div class="bp-share"><button type="button" aria-label="Copiar enlace" title="Copiar enlace"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg></button>'+
      '<a aria-label="Compartir por WhatsApp" title="Compartir por WhatsApp" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text='+encodeURIComponent(title+' '+url)+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg></a></div>';
    hero.appendChild(meta);
    $('button',meta).addEventListener('click',function(){
      if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast('Enlace copiado')},function(){toast(url)});else toast(url);
    });
  }

  /* listas ✅ ❌ → tarjetas */
  $$('.article-bullets li').forEach(function(li){
    var lines=li.textContent.split(/\n+/).map(function(s){return s.trim()}).filter(Boolean);
    if(lines.length<1)return;
    var frag=document.createDocumentFragment();
    lines.forEach(function(l){
      var kind='plain',ic='→';
      if(/^(✅|✔️?|☑️?)/.test(l)){kind='good';ic='✓';l=l.replace(/^(✅|✔️?|☑️?)\s*/,'')}
      else if(/^(❌|✖️?|🚫)/.test(l)){kind='bad';ic='✕';l=l.replace(/^(❌|✖️?|🚫)\s*/,'')}
      var d=document.createElement('div');d.className='bp-li '+kind;
      var i=document.createElement('span');i.className='ic';i.textContent=ic;
      var t=document.createElement('span');t.textContent=l;
      d.appendChild(i);d.appendChild(t);frag.appendChild(d);
    });
    li.textContent='';li.appendChild(frag);
  });

  /* párrafos con carácter */
  $$('.article-body .article-section p').forEach(function(p){
    if(p.closest('.article-cta,.faq-item,.related-links'))return;
    var t=p.textContent.trim();
    if(/^[“"«]/.test(t)&&/[”"»]$/.test(t)&&t.length>20)p.classList.add('bp-quote');
    else if(/^(error|ojo|ojo\.|spoiler|importante|no|sí|si|mentira|cierto)\.?$/i.test(t)||(t.length<=18&&/[.!]$/.test(t)&&!/[,;:]/.test(t)&&t.split(' ').length<=3&&p.previousElementSibling&&p.previousElementSibling.tagName==='P'&&p.nextElementSibling))p.classList.add('bp-punch');
    else if(/:$/.test(t)&&t.length<70)p.classList.add('bp-lead');
  });

  /* índice */
  var secs=$$('.article-body .article-section').filter(function(s){var h=$('h2',s);return h&&!/te puede interesar|sigue leyendo/i.test(h.textContent)&&!s.classList.contains('article-intro')});
  heads=secs.map(function(s){return $('h2',s)});
  heads.forEach(function(h,i){h.setAttribute('data-n',String(i+1).padStart(2,'0'));h.id=h.id||('sec-'+(i+1))});
  if(heads.length>=3){
    var toc=document.createElement('nav');toc.className='bp-toc';toc.setAttribute('aria-label','Índice del artículo');
    var btn=document.createElement('button');btn.type='button';btn.className='bp-toc-h';btn.innerHTML='<span>En este artículo · '+heads.length+' apartados</span><span>▾</span>';
    var ol=document.createElement('ol');
    heads.forEach(function(h,i){
      var li=document.createElement('li'),a=document.createElement('a');a.href='#'+h.id;
      a.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b><span></span>';a.lastChild.textContent=h.textContent;
      a.addEventListener('click',function(e){e.preventDefault();h.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});if(window.innerWidth<700)toc.classList.add('closed')});
      li.appendChild(a);ol.appendChild(li);tocLinks.push(a);
    });
    btn.addEventListener('click',function(){toc.classList.toggle('closed')});
    toc.appendChild(btn);toc.appendChild(ol);
    var intro=$('.article-intro',body);
    if(intro&&intro.nextSibling)intro.parentNode.insertBefore(toc,intro.nextSibling);else body.insertBefore(toc,body.firstChild);
    if(window.innerWidth<700)toc.classList.add('closed');
    now=document.createElement('div');now.className='bp-now';now.innerHTML='<b>01</b><span></span>';
    now.addEventListener('click',function(){toc.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});toc.classList.remove('closed')});
    document.body.appendChild(now);
  }
  onScroll();
})();
