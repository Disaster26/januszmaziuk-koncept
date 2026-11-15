(function(){
  var d=document;
  // menu mobilne
  var bm=d.querySelector('.men'),pn=d.querySelector('.panel');
  if(bm&&pn){bm.addEventListener('click',function(){var o=pn.classList.toggle('otw');bm.setAttribute('aria-expanded',o);bm.textContent=o?'Zamknij':'Menu';d.body.style.overflow=o?'hidden':'';});}

  // przewijane tory: przeciaganie mysza + strzalki
  d.querySelectorAll('.przewin').forEach(function(w){
    var t=w.querySelector('.tor');if(!t)return;
    var sc=w.closest('section')||w;var p=sc.querySelector('.strz .p'),n=sc.querySelector('.strz .n');
    function krok(){var c=t.children[0];return c?c.offsetWidth+20:300;}
    function st(){if(!p)return;p.disabled=t.scrollLeft<4;n.disabled=t.scrollLeft+t.clientWidth>=t.scrollWidth-4;}
    if(p){p.addEventListener('click',function(){t.scrollBy({left:-krok(),behavior:'smooth'});});n.addEventListener('click',function(){t.scrollBy({left:krok(),behavior:'smooth'});});}
    t.addEventListener('scroll',st,{passive:true});window.addEventListener('resize',st);requestAnimationFrame(st);
    var dn=false,x0=0,s0=0,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;});
    window.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));if(ruch>5){t.classList.add('ciag');t.scrollLeft=s0-dx;}});
    window.addEventListener('pointerup',function(){if(!dn)return;dn=false;if(t.classList.contains('ciag')){var k=krok();var cel=Math.round(t.scrollLeft/k)*k;t.classList.remove('ciag');t.scrollTo({left:cel,behavior:'smooth'});}});
    t.addEventListener('click',function(e){if(ruch>5){e.preventDefault();e.stopPropagation();ruch=0;}},true);
    t.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  // lightbox: zdjecia i certyfikaty, przechodzenie w obrebie grupy (data-g)
  var wszystkie=[].slice.call(d.querySelectorAll('[data-lb]'));
  if(wszystkie.length){
    var lb=d.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Powiększenie');
    lb.innerHTML='<button class="zam" aria-label="Zamknij">Zamknij</button><button class="pop" aria-label="Poprzednie">&lsaquo;</button><img alt=""><p></p><button class="nas" aria-label="Następne">&rsaquo;</button>';
    d.body.appendChild(lb);
    var im=lb.querySelector('img'),tx=lb.querySelector('p'),bp=lb.querySelector('.pop'),bn=lb.querySelector('.nas'),gr=[],i=0,ost=null;
    function pokaz(k){i=(k+gr.length)%gr.length;var e=gr[i];im.src=e.getAttribute('data-lb');im.alt=e.getAttribute('data-t')||'';tx.innerHTML='';tx.appendChild(d.createTextNode(e.getAttribute('data-t')||''));if(gr.length>1){var s=d.createElement('small');s.textContent=(i+1)+' / '+gr.length;tx.appendChild(s);}}
    function otw(el){ost=d.activeElement;var g=el.getAttribute('data-g')||'';gr=wszystkie.filter(function(x){return (x.getAttribute('data-g')||'')===g;});bp.hidden=bn.hidden=gr.length<2;pokaz(gr.indexOf(el));lb.classList.add('otw');d.body.style.overflow='hidden';lb.querySelector('.zam').focus();}
    function zam(){lb.classList.remove('otw');d.body.style.overflow='';if(ost)ost.focus();}
    wszystkie.forEach(function(e){e.addEventListener('click',function(){otw(e);});});
    lb.querySelector('.zam').onclick=zam;bp.onclick=function(){pokaz(i-1);};bn.onclick=function(){pokaz(i+1);};
    lb.addEventListener('click',function(e){if(e.target===lb)zam();});
    d.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zam();if(gr.length>1&&e.key==='ArrowLeft')pokaz(i-1);if(gr.length>1&&e.key==='ArrowRight')pokaz(i+1);});
    var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(sx===null||gr.length<2)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)pokaz(i+(dx<0?1:-1));sx=null;});
  }

  // pasek mobilny po minieciu przyciskow z pierwszego ekranu
  var mob=d.querySelector('.mob'),cel=d.querySelector('[data-pasek]');
  if(mob&&cel&&'IntersectionObserver' in window){new IntersectionObserver(function(en){en.forEach(function(e){mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);});}).observe(cel);}
  else if(mob){mob.classList.add('widac');}

  // cookies + mapa Google
  function zgoda(){try{return localStorage.getItem('jm-cookies');}catch(e){return null;}}
  var mapa=d.querySelector('[data-mapa]');
  function wczytajMape(){if(!mapa||mapa.querySelector('iframe'))return;var f=d.createElement('iframe');f.src=mapa.getAttribute('data-mapa');f.title='Mapa: ul. Mickiewicza 6, Słubice';f.setAttribute('referrerpolicy','no-referrer-when-downgrade');f.setAttribute('allowfullscreen','');mapa.innerHTML='';mapa.appendChild(f);}
  if(mapa){
    var bt=mapa.querySelector('button');if(bt)bt.addEventListener('click',wczytajMape);
    if(zgoda()!=='nie'&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting&&zgoda()!=='nie'){io.disconnect();wczytajMape();}},{rootMargin:'300px'});io.observe(mapa);}
  }
  var c=d.querySelector('.cook');
  if(c){c.querySelectorAll('[data-c]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-c');try{localStorage.setItem('jm-cookies',v);}catch(e){}c.hidden=true;});});}
  d.querySelectorAll('.zmien-cookies').forEach(function(b){b.addEventListener('click',function(){try{localStorage.removeItem('jm-cookies');}catch(e){}if(c)c.hidden=false;});});

  // formularz kontaktowy
  var f=d.querySelector('form.form');
  if(f){
    var t0=Date.now(),ts=f.querySelector('[name=ts]');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var info=f.querySelector('.info-form'),btn=f.querySelector('[type=submit]');
      function komunikat(t,ok){info.textContent=t;info.className='info-form pel '+(ok?'ok':'blad');}
      var n=f.n.value.trim(),m=f.m.value.trim(),w=f.w.value.trim();
      if(!n||!w||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){komunikat('Proszę podać imię i nazwisko, poprawny adres e-mail i treść wiadomości.');return;}
      if(!f.z.checked){komunikat('Proszę zaznaczyć zgodę na przetwarzanie danych.');return;}
      if(/github\.io$/.test(location.hostname)){komunikat('To wersja testowa strony: po uruchomieniu pod adresem januszmaziuk.pl wiadomość trafi na adres j.maziuk@op.pl.',true);return;}
      ts.value=String(Math.round((Date.now()-t0)/1000));
      btn.disabled=true;komunikat('Wysyłanie...',true);
      fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(function(r){return r.json();}).then(function(j){
        if(j&&j.ok){komunikat('Dziękujemy, wiadomość została wysłana. Potwierdzenie wysłaliśmy na podany adres e-mail.',true);f.reset();}
        else{komunikat((j&&j.blad)||'Nie udało się wysłać wiadomości. Proszę zadzwonić: 605 438 002.');}
      }).catch(function(){komunikat('Nie udało się wysłać wiadomości. Proszę zadzwonić: 605 438 002.');}).then(function(){btn.disabled=false;});
    });
  }
})();
