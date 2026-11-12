(function(){
  var d=document;
  // menu mobilne
  var bm=d.querySelector('.ikon.men'),pn=d.querySelector('.panel');
  if(bm&&pn){bm.addEventListener('click',function(){var o=pn.classList.toggle('otw');bm.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':'';});}

  // przewijane tory: przeciaganie mysza + strzalki
  d.querySelectorAll('.przewin').forEach(function(w){
    var t=w.querySelector('.tor');if(!t)return;
    var sc=w.closest('section')||w;var p=sc.querySelector('.strz .p'),n=sc.querySelector('.strz .n');
    function krok(){var c=t.children[0];return c?c.getBoundingClientRect().width+20:300;}
    function st(){if(!p)return;p.disabled=t.scrollLeft<4;n.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4;}
    if(p){p.addEventListener('click',function(){t.scrollBy({left:-krok(),behavior:'smooth'});});n.addEventListener('click',function(){t.scrollBy({left:krok(),behavior:'smooth'});});}
    t.addEventListener('scroll',st,{passive:true});window.addEventListener('resize',st);st();
    var dn=false,x0=0,s0=0,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));if(ruch>5){t.classList.add('ciag');t.scrollLeft=s0-dx;}});
    window.addEventListener('pointerup',function(){if(!dn)return;dn=false;if(t.classList.contains('ciag')){var k=krok();var cel=Math.round(t.scrollLeft/k)*k;t.classList.remove('ciag');t.scrollTo({left:cel,behavior:'smooth'});}});
    t.addEventListener('click',function(e){if(ruch>5){e.preventDefault();e.stopPropagation();ruch=0;}},true);
    t.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  // lightbox certyfikatow
  var certy=[].slice.call(d.querySelectorAll('[data-lb]'));
  if(certy.length){
    var lb=d.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Certyfikat');
    var ic=function(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="'+p+'"/></svg>';};
    lb.innerHTML='<button class="zam" aria-label="Zamknij">'+ic('M6 6l12 12M18 6L6 18')+'</button><button class="pop" aria-label="Poprzedni">'+ic('M15 6l-6 6 6 6')+'</button><img alt=""><p></p><button class="nas" aria-label="Następny">'+ic('M9 6l6 6-6 6')+'</button>';
    d.body.appendChild(lb);
    var im=lb.querySelector('img'),tx=lb.querySelector('p'),i=0,ost=null;
    // grupy: lightbox przechodzi tylko po certyfikatach z tego samego zbioru (strona)
    function pokaz(k){i=(k+certy.length)%certy.length;var e=certy[i];im.src=e.getAttribute('data-lb');im.alt=e.getAttribute('data-t')||'';tx.innerHTML=(e.getAttribute('data-t')||'')+'<small>'+(i+1)+' / '+certy.length+'</small>';}
    function otw(k){ost=d.activeElement;pokaz(k);lb.classList.add('otw');d.body.style.overflow='hidden';lb.querySelector('.zam').focus();}
    function zam(){lb.classList.remove('otw');d.body.style.overflow='';if(ost)ost.focus();}
    certy.forEach(function(e,k){e.addEventListener('click',function(){otw(k);});});
    lb.querySelector('.zam').onclick=zam;lb.querySelector('.pop').onclick=function(){pokaz(i-1);};lb.querySelector('.nas').onclick=function(){pokaz(i+1);};
    lb.addEventListener('click',function(e){if(e.target===lb)zam();});
    d.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zam();if(e.key==='ArrowLeft')pokaz(i-1);if(e.key==='ArrowRight')pokaz(i+1);});
    var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)pokaz(i+(dx<0?1:-1));sx=null;});
  }

  // pasek mobilny po minieciu przyciskow z pierwszego ekranu
  var mob=d.querySelector('.mob'),cel=d.querySelector('[data-pasek]');
  if(mob&&cel&&'IntersectionObserver' in window){new IntersectionObserver(function(en){en.forEach(function(e){mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);});}).observe(cel);}
  else if(mob){mob.classList.add('widac');}

  // formularz pokazowy
  var f=d.querySelector('form.form');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();var i=f.querySelector('.info-form');if(i)i.textContent='To wersja pokazowa: w gotowej stronie wiadomość trafi na adres j.maziuk@op.pl.';});}

  // cookies
  var c=d.querySelector('.cook');
  try{if(c&&!localStorage.getItem('jm-cookies'))c.classList.add('wid');}catch(e){if(c)c.classList.add('wid');}
  if(c){c.querySelectorAll('[data-c]').forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('jm-cookies',b.getAttribute('data-c'));}catch(e){}c.classList.remove('wid');});});}
})();
