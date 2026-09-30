const $=id=>document.getElementById(id),Q=(s,r=document)=>r.querySelector(s),QA=(s,r=document)=>[...r.querySelectorAll(s)];
const DB={get(k,d){try{const v=localStorage.getItem('hk_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('hk_'+k,JSON.stringify(v));return true}catch(e){alert('Storage is full. Use smaller images.');return false}},del(k){try{localStorage.removeItem('hk_'+k)}catch(e){}}};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let lang=DB.get('lang','en');
/* ---------- UI strings [en, ar] ---------- */
const U={home:['Home','الرئيسية'],services:['Services','خدماتنا'],portfolio:['Portfolio','شغلنا'],shop:['Shop','المتجر'],contact:['Contact','كلّمنا'],dash:['Dashboard','لوحة التحكم'],cart:['Cart','السلة'],login:['Log in','دخول'],logout:['Log out','خروج'],yc:['Your cart','سلتك'],empty:['Your cart is empty. Pick a package from the shop.','السلة فاضية. اختار باقة من المتجر.'],total:['Total','الإجمالي'],order:['Order on WhatsApp','اطلب على واتساب'],add:['Add to cart','ضيف للسلة'],all:['All','الكل'],Design:['Design','تصميم'],Content:['Content','محتوى'],'Media Buying':['Media Buying','ميديا باينج'],egp:['EGP','ج.م'],lang:['العربية','English'],night:['Night mode','الوضع الليلي'],
name:['Name','الاسم'],email:['Email','الإيميل'],pw:['Password','الباسورد'],register:['Create account','اعمل حساب'],noacct:['New here? Create an account','أول مرة؟ اعمل حساب'],hasacct:['Have an account? Log in','عندك حساب؟ ادخل'],bad:['Wrong email or password.','الإيميل أو الباسورد غلط.'],exists:['This email already has an account. Log in instead.','الإيميل ده عليه حساب. ادخل بيه.'],short:['Password must be at least 6 characters.','الباسورد لازم يكون 6 حروف على الأقل.'],
o1:['Social media','سوشيال ميديا'],o2:['Content','محتوى'],o3:['Design and branding','تصميم وهوية'],o4:['Media buying','ميديا باينج'],o5:['Not sure yet','لسه مش متأكد'],direct:['Direct','تواصل مباشر'],wait:['Loading…','ثانية واحدة…'],cpc:['EGP per conversation','ج.م للمحادثة'],conv:['conversations','محادثة'],brands:['brands','براند'],eg:['Egypt','مصر']};
const t=k=>(U[k]||[k,k])[lang=='ar'?1:0],L=o=>o?(o[lang]||o.en||''):'';
/* ---------- editable page texts [en, ar] ---------- */
const TX={
h1:['We help brands become unforgettable.','بنخلّي براندك محدش ينساه.'],
hp:["Hook is a full-service marketing agency built to grow brands and drive real results, whether you're launching, scaling or rebranding.",'هوك وكالة تسويق متكاملة، شغلتنا نكبّر البراند ونجيبلك نتايج بجد، سواء لسه بادئ أو عايز تكبر أو ناوي تغيّر هويتك.'],
b1:['Start a project','ابدأ مشروعك'],b2:['See our work','شوف شغلنا'],
ab:['About us','مين إحنا'],abh:['Right audience. Right message. Right time.','الجمهور الصح. الرسالة الصح. في الوقت الصح.'],
abp:['We handle everything from social media management, content creation and branding to strategic media buying and performance marketing.','بنظبطلك كل حاجة: من إدارة السوشيال ميديا وكتابة المحتوى والهوية، لحد الميديا باينج والتسويق بالأداء.'],
vis:['Vision','رؤيتنا'],visp:['To be the go-to digital partner for ambitious brands in the MENA region, turning ideas into impact and campaigns into legacies.','نبقى الشريك الرقمي الأول للبراندات الطموحة في المنطقة، ونحوّل الفكرة لتأثير والحملة لحاجة تفضل.'],
mis:['Mission','مهمتنا'],misp:['We craft data-driven strategies, compelling content, eye-catching designs and high-converting ad campaigns. We build growth, awareness and brand love.','بنعمل خطط مبنية على أرقام، ومحتوى يشد، وتصميمات تلفت، وإعلانات بتبيع، عشان البراند بتاعك يكبر ويتعرف وناسه يحبوه.'],
feat:['Featured work','شغل مختار'],
res:['Results','النتائج'],resh:['Numbers from real campaigns','أرقام من حملات حقيقية'],
s1:['conversations started for an education client at 4.56 EGP each','محادثة لعميل في التعليم، بـ 4.56 ج.م للمحادثة'],
s2:['conversations for a real estate project at 59.19 EGP each','محادثة لمشروع عقاري، بـ 59.19 ج.م للمحادثة'],
s3:['conversations for a second real estate project','محادثة لمشروع عقاري تاني'],
cl:['Our clients','عملاؤنا'],clh:['Brands that trust Hook','براندات وثقت في هوك'],
cta:['Ready to catch attention?','جاهز تشد الانتباه؟'],ctap:["Tell us about your brand and we'll come back with a plan.",'احكيلنا عن براندك وهنرجعلك بخطة.'],ctab:['Contact us','كلّمنا'],
sv_h:['Services','خدماتنا'],sv_p:['Strategy, content, design and paid media under one roof.','استراتيجية ومحتوى وتصميم وإعلانات مدفوعة في مكان واحد.'],
sv1:['Social media management','إدارة السوشيال ميديا'],sv1d:['Planning, posting and community management that keeps your brand active and consistent.','تخطيط ونشر وردود على الناس، عشان براندك يفضل شغّال وثابت.'],
sv2:['Content creation','كتابة المحتوى'],sv2d:['Strategically written posts, ad copy and brand storytelling for real estate, shipping, education and more.','بوستات وإعلانات وحكاية براند مكتوبة بتفكير، للعقارات والشحن والتعليم وغيرهم.'],
sv3:['Design and branding','التصميم والهوية'],sv3d:['Logos, social graphics, ads, brochures, site maps, packaging and labels.','لوجوهات وتصميمات سوشيال وإعلانات وبروشورات وخرائط وتغليف وليبلز.'],
sv4:['Media buying','الميديا باينج'],sv4d:['Data-driven Meta Ads and Google Display campaigns that turn impressions into leads.','حملات ميتا وجوجل ديسبلاي مبنية على أرقام، بتحوّل المشاهدة لعميل.'],
sv5:['Performance marketing','التسويق بالأداء'],sv5d:['We track cost per conversation and optimize until each campaign pays for itself.','بنتابع تكلفة كل محادثة ونظبط الحملة لحد ما تغطي تكلفتها.'],
sv6:['Rebranding','تغيير الهوية'],sv6d:['A fresh identity and message for brands that have outgrown their look.','شكل ورسالة جديدة للبراند اللي كبر على هويته القديمة.'],
svb:['Browse packages in the shop','شوف الباقات في المتجر'],
pf_h:['Portfolio','شغلنا'],pf_p:['Design, content and media buying for brands across real estate, shipping, education and lifestyle.','تصميم ومحتوى وميديا باينج لبراندات في العقارات والشحن والتعليم واللايف ستايل.'],
sh_h:['Marketing packages','باقات التسويق'],sh_p:['Pick a package, add it to your cart and send the order on WhatsApp.','اختار باقة وضيفها للسلة وابعت الطلب على واتساب.'],
ct_h:['Contact','كلّمنا'],ct_p:['Tell us about your brand. We reply on WhatsApp or email.','احكيلنا عن براندك. بنرد عليك على واتساب أو الإيميل.'],
f_n:['Name','اسمك'],f_b:['Brand or company','البراند أو الشركة'],f_s:['What do you need?','محتاج إيه؟'],f_m:['Message','رسالتك'],f_send:['Send on WhatsApp','ابعت على واتساب']};
/* ---------- default products & work (editable in the dashboard) ---------- */
const P=(id,n,na,tg,tga,price,per,pera,ie,ia)=>({id,name:{en:n,ar:na},tag:{en:tg,ar:tga},price,per:{en:per,ar:pera},items:{en:ie,ar:ia}});
const PRODUCTS=[
P(1,'Social Media Starter','باقة السوشيال الأساسية','Social media','سوشيال ميديا',3500,'month','شهرياً',['12 designed posts','4 stories','Basic community replies'],['12 بوست متصمم','4 ستوريز','ردود أساسية على الناس']),
P(2,'Social Media Growth','باقة السوشيال للنمو','Social media','سوشيال ميديا',6500,'month','شهرياً',['20 designed posts','8 videos or reels','Full community management','Monthly report'],['20 بوست متصمم','8 فيديوهات أو ريلز','إدارة كاملة للصفحة والرد على الناس','تقرير شهري']),
P(3,'Brand Identity','الهوية البصرية','Branding','هوية',8000,'one time','مرة واحدة',['Logo and color palette','Typography','Social media templates'],['لوجو وألوان البراند','الخطوط','قوالب للسوشيال ميديا']),
P(4,'Ads Management','إدارة الإعلانات','Media buying','ميديا باينج',4000,'month + ad spend','شهرياً + ميزانية الإعلان',['Meta Ads campaigns','Audience targeting','Weekly optimization'],['حملات إعلانات ميتا','استهداف الجمهور المناسب','تظبيط أسبوعي للحملة']),
P(5,'Content Pack','باقة المحتوى','Content','محتوى',2500,'one time','مرة واحدة',['15 written posts','Ad copy variations','Brand voice guide'],['15 بوست مكتوب','نسخ متعددة للإعلانات','دليل نبرة صوت البراند']),
P(6,'Full Launch Bundle','باقة الإطلاق الكاملة','Bundle','باقة متكاملة',15000,'one time','مرة واحدة',['Brand identity','1 month of social media','1 month of ads management'],['هوية بصرية','شهر سوشيال ميديا','شهر إدارة إعلانات'])];
const W=(id,cat,t,ta,d,da,img)=>({id,cat,t:{en:t,ar:ta},d:{en:d,ar:da},img});
const WORK=[
W(1,'Design','JMG Real Estate','جي إم جي العقارية','Designs that bring properties to life: social graphics, ads, brochures, site maps and branding that sells the lifestyle before the unit.','تصميمات بتخلّي العقار يتكلم: سوشيال وإعلانات وبروشورات وخرائط وهوية بتبيع الحياة قبل الوحدة.','img/jmg-design.jpg'),
W(2,'Design','M.A Express','إم إيه إكسبريس','Designs that deliver confidence: branded packaging, truck graphics, social visuals and ads for a shipping company.','تصميمات بتبني الثقة: تغليف وجرافيك للعربيات وسوشيال وإعلانات لشركة شحن.','img/ma-design.jpg'),
W(3,'Design','Lumière Candles','لوميير للشموع','Warm designs for warm moments: packaging, labels and social content for handmade candles.','تصميمات دافية للحظات دافية: تغليف وليبلز ومحتوى سوشيال لشموع يدوية.','img/lumiere-design.jpg'),
W(4,'Content','Global Premier Properties','جلوبال بريمير العقارية','Real estate content that sells before the site is built, from ad creatives to brand storytelling.','محتوى عقاري بيبيع قبل ما الموقع يتعمل، من الإعلانات لحكاية البراند.','img/gpp-content.jpg'),
W(5,'Content','BestRate','بيست ريت','Content for the shipping industry: social posts and ad copy that highlight speed, safety and trust.','محتوى لمجال الشحن: بوستات وإعلانات بتبرز السرعة والأمان والثقة.','img/bestrate-content.jpg'),
W(6,'Content','Silsal Corporation','سلسال','Persuasive content for postgraduate courses and executive diplomas.','محتوى مقنع لكورسات الدراسات العليا والدبلومات التنفيذية.','img/silsal-content.jpg'),
W(7,'Media Buying','JMG Real Estate','جي إم جي العقارية','Meta Ads and Google Display campaigns for qualified buyers. Two projects delivered 253 and 158 conversations.','حملات ميتا وجوجل ديسبلاي لمشترين جادين. مشروعين جابوا 253 و158 محادثة.','img/jmg-media.jpg'),
W(8,'Media Buying','The Act of Teaching','ذا أكت أوف تيتشينج','Ad campaigns for online courses: 362 conversations at 4.56 EGP per conversation.','حملات إعلانية لكورسات أونلاين: 362 محادثة بتكلفة 4.56 ج.م للمحادثة.','img/education-media.jpg')];
const getProducts=()=>DB.get('products',PRODUCTS),getWork=()=>DB.get('work',WORK);
const site=()=>Object.assign({wa:'201277204746',email:'info.h00k.marketing@gmail.com',phone:'+20 127 7204 746'},DB.get('site',{}));
const txt=k=>{const o=(DB.get('tx',{})[k]||{})[lang];return o||TX[k][lang=='ar'?1:0]};
/* ---------- auth (browser-only demo: see README) ---------- */
const H=async s=>{try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('hook|'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent('hook|'+s)))}};
const Auth={H,me:()=>DB.get('me',null),set:u=>DB.set('me',{name:u.name,email:u.email,role:u.role}),out(){DB.del('me');location.href='index.html'},
async users(){let u=DB.get('users');if(!u){u=[{name:'Admin',email:'admin@hook.com',pw:await H('Hook@2026'),role:'admin'}];DB.set('users',u)}return u}};
/* ---------- shell ---------- */
const pages=[['index.html','home'],['services.html','services'],['portfolio.html','portfolio'],['shop.html','shop'],['contact.html','contact']];
const here=location.pathname.split('/').pop()||'index.html';
document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="hook-ink.png"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400..700&family=Cairo:wght@400;700;900&family=Silkscreen&display=swap">');
document.body.insertAdjacentHTML('afterbegin',`<div id="pb"></div><header><nav>
<a class="logo" href="index.html" aria-label="Hook"><img class="lg-l" src="hook-ink.png" alt="Hook"><img class="lg-d" src="hook-cream.png" alt="Hook"></a>
<ul id="nv"></ul>
<div class="ctl"><button class="pill" id="lang"></button><a class="pill" id="acct" href="login.html"></a><button class="pill dk" id="cartbtn"></button>
<button class="ic" id="theme"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M21 14.6A9 9 0 0 1 9.4 3 9 9 0 1 0 21 14.6z"/></svg></button></div></nav></header>
<aside id="cart"><button class="x" id="cx">×</button><h2 id="ct"></h2><ul id="items"></ul><p id="tot"></p><button class="btn" id="order"></button></aside>`);
document.body.insertAdjacentHTML('beforeend','<footer><div class="wrap"><img class="flogo" src="hook-tag-cream.png" alt="Hook - Catch The Attention"><div id="fc"></div></div></footer>');
let cart=DB.get('cart',[]);
const money=n=>n+' '+t('egp'),sum=()=>cart.reduce((a,i)=>a+i.price*i.q,0);
function drawCart(){$('cartbtn').innerHTML=`${t('cart')} (${cart.reduce((a,i)=>a+i.q,0)})`;$('ct').textContent=t('yc');$('order').textContent=t('order');
$('items').innerHTML=cart.length?cart.map((i,n)=>`<li><span>${i.name} × ${i.q}</span><span>${money(i.price*i.q)} <button class="x" data-rm="${n}" aria-label="Remove">×</button></span></li>`).join(''):`<li>${t('empty')}</li>`;
$('tot').textContent=cart.length?t('total')+': '+money(sum()):'';$('order').style.display=cart.length?'':'none'}
const saveCart=()=>{DB.set('cart',cart);drawCart()};
window.addToCart=(name,price)=>{const f=cart.find(i=>i.name===name);f?f.q++:cart.push({name,price,q:1});saveCart();$('cart').classList.add('open')};
$('cartbtn').onclick=()=>$('cart').classList.toggle('open');$('cx').onclick=()=>$('cart').classList.remove('open');
$('items').onclick=e=>{const n=e.target.dataset.rm;if(n!==undefined){cart.splice(n,1);saveCart()}};
$('order').onclick=()=>{const me=Auth.me(),s=site();open(`https://wa.me/${s.wa}?text=`+encodeURIComponent((me?`Hi Hook, I'm ${me.name} (${me.email}). I want to order:\n`:'Hi Hook, I want to order:\n')+cart.map(i=>`- ${i.name} × ${i.q} (${i.price*i.q} EGP)`).join('\n')+'\nTotal: '+sum()+' EGP'),'_blank')};
/* ---------- language + theme ---------- */
const R=[];window.onL=f=>{R.push(f);f()};
function paint(){const me=Auth.me(),s=site();document.documentElement.lang=lang;document.documentElement.dir=lang=='ar'?'rtl':'ltr';
$('nv').innerHTML=[...pages,...(me&&me.role=='admin'?[['dashboard.html','dash']]:[])].map(([h,k])=>`<li><a href="${h}" ${h==here?'aria-current="page"':''}>${t(k)}</a></li>`).join('');
$('lang').textContent=t('lang');$('theme').setAttribute('aria-label',t('night'));$('theme').title=t('night');
const a=$('acct');a.textContent=me?`${me.name} · ${t('logout')}`:t('login');a.onclick=me?e=>{e.preventDefault();Auth.out()}:null;
$('fc').innerHTML=`<a href="https://wa.me/${s.wa}">${s.phone}</a><br><a href="mailto:${s.email}">${s.email}</a>`;
QA('[data-k]').forEach(e=>e.textContent=txt(e.dataset.k));QA('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
const h=Q('.hero h1');if(h&&!reduce){const x=h.textContent;h.setAttribute('aria-label',x);h.innerHTML=x.split(' ').map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ')}
drawCart();R.forEach(f=>f())}
$('lang').onclick=()=>{lang=lang=='ar'?'en':'ar';DB.set('lang',lang);paint()};
function setTheme(v){document.documentElement.dataset.theme=v;$('theme').setAttribute('aria-pressed',v=='dark');DB.set('theme',v);window.onTheme&&window.onTheme()}
setTheme(DB.get('theme','dark'));$('theme').onclick=()=>setTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');
/* ---------- motion ---------- */
function count(b){const n=+b.textContent;if(!n)return;const t0=performance.now();(function f(x){const p=Math.min((x-t0)/1300,1);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);el.classList.add('in');const b=el.classList.contains('stat')&&el.querySelector('b');if(b)count(b);setTimeout(()=>el.classList.remove('reveal','in'),1300)}),{threshold:.12});
function watch(){if(reduce)return;QA('main section:not(.hero) h2,main .sl,main .carousel').forEach(el=>{if(el.dataset.w)return;el.dataset.w=1;el.classList.add('reveal');el.style.setProperty('--d',[...el.parentNode.children].indexOf(el)%5*.09+'s');io.observe(el)})}
watch();new MutationObserver(watch).observe(Q('main'),{childList:true,subtree:true});
addEventListener('scroll',()=>{$('pb').style.transform=`scaleX(${scrollY/Math.max(1,document.body.scrollHeight-innerHeight)})`},{passive:true});
if(matchMedia('(pointer:fine)').matches&&!reduce){document.body.insertAdjacentHTML('beforeend','<i id="cd"></i><i id="cr"></i>');document.documentElement.classList.add('cur');let cx=-50,cy=-50,rx=-50,ry=-50;
addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY;$('cd').style.transform=`translate(${cx}px,${cy}px)`});
(function L(){rx+=(cx-rx)*.16;ry+=(cy-ry)*.16;$('cr').style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(L)})();
document.addEventListener('pointerover',e=>$('cr').classList.toggle('big',!!e.target.closest('a,button,input,textarea,select,.row,.card,.sl')));
document.addEventListener('pointerdown',()=>$('cr').classList.add('dn'));document.addEventListener('pointerup',()=>$('cr').classList.remove('dn'))}
QA('.btn').forEach(b=>{if(reduce)return;b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.15}px ${(e.clientY-r.top-r.height/2)*.25}px`});b.addEventListener('pointerleave',()=>b.style.translate='')});
paint();
