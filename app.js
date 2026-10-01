const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ar=()=>document.documentElement.lang=='ar';
const t=(en,a)=>ar()?a:en;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=o=>o?(ar()?(o.ar||o.en):(o.en||o.ar))||'':'';
const fmtPhone=d=>/^20\d{10}$/.test(d)?`+20 ${d.slice(2,5)} ${d.slice(5,8)} ${d.slice(8)}`:'+'+d;
const pages=[['index.html','Home','الرئيسية'],['services.html','Services','خدماتنا'],['portfolio.html','Portfolio','أعمالنا'],['shop.html','Shop','المتجر'],['contact.html','Contact','تواصل معنا']];
const here=location.pathname.split('/').pop()||'index.html';
const post=(u,b)=>fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
let DB=null,ME=null;const hooks=[];
const onContent=fn=>{hooks.push(fn);if(DB)fn()};
const loadScript=s=>new Promise(r=>{const e=document.createElement('script');e.src=s;e.onload=e.onerror=r;document.head.appendChild(e)});

/* ---------- head, header, footer ---------- */
document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="favicon.png"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;800;900&family=Sacramento&family=Aref+Ruqaa:wght@700&family=Silkscreen&display=swap">');
document.body.insertAdjacentHTML('afterbegin',`<div id="bar"></div><header><nav>
<a class="logo" href="index.html" aria-label="Hook"><img src="logo-cream.png" alt="Hook" height="38"></a>
<ul>${pages.map(([h,e,a])=>`<li><a href="${h}" data-ar="${a}" ${h===here?'aria-current="page"':''}>${e}</a></li>`).join('')}</ul>
<div class="tools"><button class="ibtn" id="lang" aria-label="Language">العربية</button>
<button class="ibtn" id="theme" aria-pressed="false" aria-label="Night mode"><svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
<a class="ibtn" id="acct" href="login.html" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></a>
<button class="ibtn cartbtn" id="cartbtn"><span data-ar="السلة">Cart</span> (<span id="cnt">0</span>)</button></div></nav></header>
<aside id="cart" aria-label="Cart"><button class="x" id="cx" aria-label="Close">×</button>
<h2 data-ar="سلتك">Your cart</h2><ul id="items"></ul><p id="tot" style="margin:18px 0;font-weight:800"></p>
<button class="btn" id="order" data-ar="اطلب عبر واتساب">Order on WhatsApp</button></aside>`);
document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><img class="flogo" src="logotag-cream.png" alt="Hook - Catch The Attention"><div id="fcontact" data-k="contact"></div></div></footer>`);

/* ---------- language ---------- */
function splitHero(){const h=document.querySelector('.hero h1');if(!h||reduce)return;const s=h.textContent;h.setAttribute('aria-label',s);h.innerHTML=s.split(' ').map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ')}
function applyLang(l){
  const d=document.documentElement;d.lang=l;d.dir=l=='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-ar]').forEach(el=>{if(el.dataset.en===undefined)el.dataset.en=el.textContent;el.textContent=l=='ar'?el.dataset.ar:el.dataset.en});
  $('lang').textContent=l=='ar'?'EN':'العربية';
  try{localStorage.setItem('hooklang',l)}catch(e){}
  splitHero();if(DB)runHooks();
  document.dispatchEvent(new Event('langchange'));
}
$('lang').onclick=()=>applyLang(ar()?'en':'ar');

/* ---------- content ---------- */
function fillContact(){
  const c=DB.contact,wa='https://wa.me/'+c.whatsapp;
  $('fcontact').innerHTML=`<a href="${wa}" dir="ltr">${fmtPhone(c.whatsapp)}</a><br><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`;$('fcontact').removeAttribute('data-ed');
  document.querySelectorAll('[data-wa]').forEach(a=>{a.href=wa;a.textContent=fmtPhone(c.whatsapp)});
  document.querySelectorAll('[data-mail]').forEach(a=>{a.href='mailto:'+c.email;a.textContent=c.email});
}
function runHooks(){
  cart=cart.filter(i=>prod(i.id));
  document.querySelectorAll('[data-btn]').forEach(a=>{const b=DB.buttons&&DB.buttons[a.dataset.btn];if(b){a.textContent=L(b.label);a.href=b.href}});
  fillContact();renderCart();hooks.forEach(f=>f());
}
async function jget(u){try{const r=await fetch(u);return r.ok?await r.json():null}catch(e){return null}}
window.reloadContent=async()=>{DB=(await jget('/api/content'))||DB;runHooks()};

/* ---------- theme and sea depth color ---------- */
const PAL={light:[[255,81,46],[156,43,22],[29,29,27]],dark:[[0,85,80],[9,59,56],[12,18,17]]};
function paint(){
  const m=Math.max(1,document.documentElement.scrollHeight-innerHeight),d=window.DEPTH=Math.min(1,Math.max(0,scrollY/m));
  const P=PAL[document.documentElement.dataset.theme||'light'],a=d<.5?P[0]:P[1],b=d<.5?P[1]:P[2],k=d<.5?d*2:(d-.5)*2;
  document.documentElement.style.setProperty('--bg',`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k))})`);
  document.body.classList.toggle('deep',d>.5);
  $('bar').style.transform=`scaleX(${d})`;
}
function setTheme(m){document.documentElement.dataset.theme=m;$('theme').setAttribute('aria-pressed',m=='dark');try{localStorage.setItem('hooktheme',m)}catch(e){}paint()}
$('theme').onclick=()=>setTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');
addEventListener('scroll',paint,{passive:true});addEventListener('resize',paint);
new ResizeObserver(paint).observe(document.body);

/* ---------- cart ---------- */
let cart=[];try{cart=JSON.parse(localStorage.getItem('hookcart'))||[]}catch(e){}
const prod=id=>DB&&DB.products.find(p=>p.id===id);
const cur=()=>t('EGP','ج.م');
function saveCart(){try{localStorage.setItem('hookcart',JSON.stringify(cart))}catch(e){}renderCart()}
function renderCart(){
  $('cnt').textContent=cart.reduce((a,i)=>a+i.q,0);if(!DB)return;
  const tot=cart.reduce((a,i)=>a+prod(i.id).price*i.q,0);
  $('items').innerHTML=cart.length?cart.map((i,n)=>{const p=prod(i.id);return `<li><span>${esc(L(p.name))} × ${i.q}</span><span>${p.price*i.q} ${cur()} <button class="x" data-rm="${n}" aria-label="Remove">×</button></span></li>`}).join(''):`<li>${t('Your cart is empty. Pick a package from the shop.','سلتك فاضية. اختار باقة من المتجر.')}</li>`;
  $('tot').textContent=cart.length?`${t('Total','الإجمالي')}: ${tot} ${cur()}`:'';
  $('order').style.display=cart.length?'':'none';
}
window.addToCart=id=>{const f=cart.find(i=>i.id==id);f?f.q++:cart.push({id,q:1});saveCart();$('cart').classList.add('open')};
$('cartbtn').onclick=()=>$('cart').classList.toggle('open');
$('cx').onclick=()=>$('cart').classList.remove('open');
$('items').onclick=e=>{const n=e.target.dataset.rm;if(n!==undefined){cart.splice(n,1);saveCart()}};
$('order').onclick=()=>{
  post('/api/order',{items:cart.map(i=>({id:i.id,q:i.q}))}).catch(()=>{});
  const tot=cart.reduce((a,i)=>a+prod(i.id).price*i.q,0);
  const msg=t('Hi Hook, I want to order:','أهلاً هوك، عايز أطلب:')+'\n'+cart.map(i=>{const p=prod(i.id);return `- ${L(p.name)} × ${i.q} (${p.price*i.q} ${cur()})`}).join('\n')+`\n${t('Total','الإجمالي')}: ${tot} ${cur()}`;
  open(`https://wa.me/${DB.contact.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');
};

/* ---------- slider (LTR and RTL) ---------- */
function slider(root,ms){
  const tr=root.querySelector('.track'),dots=root.querySelector('.dots'),play=root.querySelector('.play');
  const rtl=()=>document.documentElement.dir=='rtl',pos=()=>Math.abs(tr.scrollLeft);
  const st=()=>tr.firstElementChild?tr.firstElementChild.offsetWidth+parseFloat(getComputedStyle(tr).columnGap||0):1;
  const go=d=>{if(d>0&&pos()>=tr.scrollWidth-tr.clientWidth-6)tr.scrollTo({left:0});else if(d<0&&pos()<=6)tr.scrollTo({left:rtl()?-tr.scrollWidth:tr.scrollWidth});else tr.scrollBy({left:d*st()*(rtl()?-1:1)})};
  let on=!reduce,hov=false,timer;
  const tick=()=>{clearInterval(timer);if(on)timer=setInterval(()=>{if(!hov)go(1)},ms)};
  root.querySelector('.prev').onclick=()=>{go(-1);tick()};root.querySelector('.next').onclick=()=>{go(1);tick()};
  if(play){play.textContent=on?'❚❚':'▶';play.onclick=()=>{on=!on;play.textContent=on?'❚❚':'▶';tick()}}
  root.onmouseenter=root.onfocusin=()=>hov=true;root.onmouseleave=root.onfocusout=()=>hov=false;
  const mark=()=>{if(dots){const i=Math.round(pos()/st());[...dots.children].forEach((b,k)=>b.classList.toggle('on',k==i))}};
  root._refresh=()=>{if(dots){dots.innerHTML=[...tr.children].map((_,i)=>`<button aria-label="${i+1}"></button>`).join('');mark()}};
  if(dots){dots.onclick=e=>{const i=[...dots.children].indexOf(e.target);if(i>=0){tr.scrollTo({left:(rtl()?-1:1)*i*st()});tick()}};tr.addEventListener('scroll',mark,{passive:true})}
  root._refresh();tick();
}

/* ---------- effects ---------- */
function count(b){const n=+b.textContent;if(!n)return;const t0=performance.now();(function f(x){const p=Math.min((x-t0)/1400,1);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);el.classList.add('in');
  const b=el.classList.contains('stat')&&el.querySelector('b');if(b)count(b);setTimeout(()=>el.classList.remove('reveal','in'),1400)}),{threshold:.12});
function watch(){if(reduce)return;document.querySelectorAll('main .card,main .panel,main h2,main .script,main .tabs,main .slider,main .lg,main form,.mq-wrap').forEach(el=>{if(el.dataset.w)return;el.dataset.w=1;el.classList.add('reveal');el.style.setProperty('--d',[...el.parentNode.children].indexOf(el)%5*.09+'s');io.observe(el)})}
if(!reduce&&matchMedia('(pointer:fine)').matches)document.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('main .card');
  document.querySelectorAll('.card[style*="--rx"]').forEach(x=>{if(x!==c){x.style.removeProperty('--rx');x.style.removeProperty('--ry')}});
  if(c){const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*7+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*7+'deg')}
});
function typeTag(){const px=document.querySelector('.hero .pix');if(!px||reduce)return;const s=px.dataset.full||(px.dataset.full=px.textContent);px.textContent='';px.classList.add('typing');[...s].forEach((c,i)=>setTimeout(()=>px.textContent+=c,500+i*70))}

/* ---------- tracking ---------- */
window.trackView=id=>{try{const s=JSON.parse(sessionStorage.getItem('hv')||'[]');if(s.includes(id))return;s.push(id);sessionStorage.setItem('hv',JSON.stringify(s))}catch(e){}post('/api/track',{k:'view',id}).catch(()=>{})};
document.addEventListener('click',e=>{const a=e.target.closest('[data-view]');if(a)trackView(a.dataset.view)});

/* ---------- start ---------- */
let th='light',lang='en';try{th=localStorage.getItem('hooktheme')||'light';lang=localStorage.getItem('hooklang')||'en'}catch(e){}
setTheme(th);applyLang(lang);typeTag();watch();
new MutationObserver(watch).observe(document.querySelector('main'),{childList:true,subtree:true});
(async()=>{
  DB=(await jget('/api/content'))||window.SEED;runHooks();
  if(here!=='dashboard.html'&&here!=='login.html')post('/api/track',{k:'visit',p:location.pathname}).catch(()=>{});
  const me=await jget('/api/me');ME=me&&me.user;
  if(ME){$('acct').href=ME.role==='admin'?'dashboard.html':'login.html';$('acct').title=ME.username}
  document.dispatchEvent(new Event('auth'));
  if(ME&&ME.role==='admin')loadScript('admin.js');
  loadScript('three.min.js').then(()=>loadScript('scene.js'));
})();
