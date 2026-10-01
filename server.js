'use strict';
/* Hook site server. No npm packages needed. Run: node server.js  (Node 18+) */
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=__dirname,DATA=path.join(ROOT,'data'),UP=path.join(ROOT,'uploads'),PORT=+process.env.PORT||3000;
const ADMIN_USER='mido',ADMIN_EMAIL='mm.Mido1270@gmail.com';
[DATA,UP].forEach(d=>fs.mkdirSync(d,{recursive:true}));

/* ---------- storage ---------- */
const DBF=path.join(DATA,'db.json');let db;
try{db=JSON.parse(fs.readFileSync(DBF,'utf8'))}catch(e){
  db={...JSON.parse(fs.readFileSync(path.join(ROOT,'seed.json'),'utf8')),users:[],orders:[],stats:{visits:0,days:{},pages:{},views:{},uv:{}}};
}
let tmr;const flush=()=>{const t=DBF+'.tmp';fs.writeFileSync(t,JSON.stringify(db));fs.renameSync(t,DBF)};
const save=()=>{clearTimeout(tmr);tmr=setTimeout(flush,300)};
['SIGINT','SIGTERM'].forEach(s=>process.on(s,()=>{flush();process.exit(0)}));
const KF=path.join(DATA,'secret.key');let SECRET;
try{SECRET=fs.readFileSync(KF,'utf8')}catch(e){SECRET=crypto.randomBytes(32).toString('hex');fs.writeFileSync(KF,SECRET,{mode:0o600})}

/* ---------- passwords and sessions ---------- */
const hash=pw=>{const s=crypto.randomBytes(16);return s.toString('hex')+':'+crypto.scryptSync(pw,s,64).toString('hex')};
const check=(pw,h)=>{const[a,b]=h.split(':');return crypto.timingSafeEqual(crypto.scryptSync(pw,Buffer.from(a,'hex'),64),Buffer.from(b,'hex'))};
if(!db.users.some(u=>u.role==='admin')){
  const pw=process.env.ADMIN_PASSWORD||crypto.randomBytes(9).toString('base64url');
  db.users.push({id:'u'+crypto.randomBytes(4).toString('hex'),username:ADMIN_USER,email:ADMIN_EMAIL,role:'admin',pass:hash(pw),at:new Date().toISOString()});
  fs.writeFileSync(path.join(DATA,'admin-credentials.txt'),`username: ${ADMIN_USER}\nemail: ${ADMIN_EMAIL}\npassword: ${pw}\n\nChange the password from the dashboard, then delete this file.\n`,{mode:0o600});
  console.log(`\n  ADMIN CREATED\n  username: ${ADMIN_USER}\n  email:    ${ADMIN_EMAIL}\n  password: ${pw}\n  (also saved in data/admin-credentials.txt)\n`);flush();
}
const sign=s=>crypto.createHmac('sha256',SECRET).update(s).digest('base64url');
const cookies=r=>Object.fromEntries((r.headers.cookie||'').split(';').map(c=>c.trim().split(/=(.*)/s).slice(0,2)).filter(a=>a[0]));
const makeSid=uid=>{const p=uid+'.'+(Date.now()+14*864e5);return p+'.'+sign(p)};
function sessionUser(req){
  const c=cookies(req).sid;if(!c)return null;const[uid,exp,sig]=c.split('.');if(!sig)return null;
  const a=Buffer.from(sig),b=Buffer.from(sign(uid+'.'+exp));
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b)||+exp<Date.now())return null;
  return db.users.find(u=>u.id===uid)||null;
}
const hits=new Map();
const limited=(k,max,win)=>{const n=Date.now(),a=(hits.get(k)||[]).filter(t=>n-t<win);a.push(n);hits.set(k,a);return a.length>max};

/* ---------- helpers ---------- */
const send=(res,code,obj,h={})=>{res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...h});res.end(JSON.stringify(obj))};
const body=(req,max=1e5)=>new Promise((ok,no)=>{const a=[];let n=0;req.on('data',c=>{n+=c.length;if(n>max){no(Object.assign(new Error('too large'),{code:413}));req.destroy()}else a.push(c)});req.on('end',()=>ok(Buffer.concat(a)));req.on('error',no)});
const jbody=async req=>{const b=await body(req);try{return JSON.parse(b.toString()||'{}')}catch(e){throw Object.assign(new Error('bad json'),{code:400})}};
const S=(v,n=300)=>String(v??'').trim().slice(0,n);
const LS=(o,n=300)=>({en:S(o&&o.en,n),ar:S(o&&o.ar,n)});
const href=h=>{h=S(h,300);return /^\s*(javascript|data|vbscript):/i.test(h)?'#':h};
const img=p=>{p=S(p,200);return /^(img|logos|uploads)\/[\w.\-]+$/.test(p)?p:''};
const CATS=['Design','Content','Media Buying'],rid=p=>p+crypto.randomBytes(4).toString('hex');
const digits=v=>{let d=String(v||'').replace(/\D/g,'');if(/^0\d{10}$/.test(d))d='20'+d.slice(1);return d};
const clean={
  work:b=>({cat:CATS.includes(b.cat)?b.cat:'Design',name:LS(b.name,100),desc:LS(b.desc,600),img:img(b.img)}),
  clients:b=>({name:S(b.name,80),logo:img(b.logo)}),
  products:b=>({name:LS(b.name,100),price:Math.max(0,Math.min(1e7,Number(b.price)||0)),per:LS(b.per,60),tag:LS(b.tag,60),items:(Array.isArray(b.items)?b.items:[]).slice(0,12).map(i=>LS(i,100))})
};
const named=(c)=>typeof c.name==='string'?!!c.name:!!(c.name.en||c.name.ar);
const pub=()=>({work:db.work,clients:db.clients,products:db.products,buttons:db.buttons,contact:db.contact});
const day=()=>new Date().toISOString().slice(0,10);

function stats(){
  const st=db.stats,days=[];
  for(let i=13;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);days.push({d,n:st.days[d]||0})}
  const sales={};let revenue=0;
  db.orders.filter(o=>o.status!=='cancelled').forEach(o=>{revenue+=o.total;o.items.forEach(i=>{const s=sales[i.id]||(sales[i.id]={id:i.id,name:i.name,qty:0,revenue:0});s.qty+=i.q;s.revenue+=i.q*i.price})});
  return{
    visits:st.visits,today:st.days[day()]||0,week:days.slice(-7).reduce((a,x)=>a+x.n,0),unique:Object.keys(st.uv).length,days,
    pages:Object.entries(st.pages).map(([p,n])=>({p,n})).sort((a,b)=>b.n-a.n),
    topWork:db.work.map(w=>({id:w.id,name:w.name.en||w.name.ar,views:st.views[w.id]||0})).sort((a,b)=>b.views-a.views),
    topProducts:Object.values(sales).sort((a,b)=>b.qty-a.qty),revenue,
    accounts:db.users.length,users:db.users.map(u=>({username:u.username,email:u.email,role:u.role,at:u.at})),
    orders:db.orders.slice(0,100),counts:{work:db.work.length,clients:db.clients.length,products:db.products.length}
  };
}

/* ---------- API ---------- */
async function api(req,res,p,m){
  const ip=(process.env.TRUST_PROXY&&(req.headers['x-forwarded-for']||'').split(',')[0].trim())||req.socket.remoteAddress||'?';
  if(m!=='GET'){const o=req.headers.origin;if(o){let h;try{h=new URL(o).host}catch(e){}if(h!==req.headers.host)return send(res,403,{error:'forbidden'})}}
  const me=sessionUser(req),secure=req.socket.encrypted||req.headers['x-forwarded-proto']==='https';
  const ck=(uid,age)=>`sid=${uid?makeSid(uid):''}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${secure?'; Secure':''}`;
  const pubUser=u=>u&&{username:u.username,email:u.email,role:u.role};

  if(p==='/api/content'&&m==='GET')return send(res,200,pub());
  if(p==='/api/me'&&m==='GET')return send(res,200,{user:pubUser(me)});
  if(p==='/api/logout'&&m==='POST')return send(res,200,{ok:1},{'set-cookie':ck('',0)});

  if(p==='/api/track'&&m==='POST'){
    const b=await jbody(req);if(me&&me.role==='admin')return send(res,200,{ok:1});
    let vid=cookies(req).vid;const h={};
    if(!vid){vid=crypto.randomBytes(8).toString('hex');h['set-cookie']=`vid=${vid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000${secure?'; Secure':''}`}
    const st=db.stats,d=day();
    if(b.k==='visit'){let pg=S(b.p,80).replace(/[^\w\-./]/g,'');if(!pg||pg==='/')pg='/index.html';st.visits++;st.days[d]=(st.days[d]||0)+1;st.pages[pg]=(st.pages[pg]||0)+1;if(!st.uv[vid])st.uv[vid]=d}
    else if(b.k==='view'&&db.work.some(w=>w.id===b.id))st.views[b.id]=(st.views[b.id]||0)+1;
    save();return send(res,200,{ok:1},h);
  }
  if(p==='/api/register'&&m==='POST'){
    if(limited('reg'+ip,10,36e5))return send(res,429,{error:'Too many attempts, try later'});
    const b=await jbody(req),username=S(b.username,24),email=S(b.email,120).toLowerCase(),pw=String(b.password||'');
    if(!/^[A-Za-z0-9_]{3,24}$/.test(username))return send(res,400,{error:'Username: 3-24 letters, numbers or _'});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return send(res,400,{error:'Invalid email'});
    if(pw.length<8||pw.length>100)return send(res,400,{error:'Password must be at least 8 characters'});
    if(db.users.some(u=>u.username.toLowerCase()===username.toLowerCase()||u.email.toLowerCase()===email))return send(res,409,{error:'Username or email already used'});
    const u={id:rid('u'),username,email,role:'user',pass:hash(pw),at:new Date().toISOString()};db.users.push(u);save();
    return send(res,200,{user:pubUser(u)},{'set-cookie':ck(u.id,1209600)});
  }
  if(p==='/api/login'&&m==='POST'){
    const b=await jbody(req),id=S(b.id,120).toLowerCase();
    if(limited('log'+ip,10,9e5)||limited('logu'+id,8,9e5))return send(res,429,{error:'Too many attempts, wait 15 minutes'});
    const u=db.users.find(x=>x.username.toLowerCase()===id||x.email.toLowerCase()===id);
    let ok=false;try{ok=!!u&&check(String(b.password||''),u.pass)}catch(e){}
    if(!ok)return send(res,401,{error:'Wrong username/email or password'});
    return send(res,200,{user:pubUser(u)},{'set-cookie':ck(u.id,1209600)});
  }
  if(p==='/api/order'&&m==='POST'){
    if(limited('ord'+ip,20,36e5))return send(res,429,{error:'Too many orders'});
    const b=await jbody(req),items=[];
    (Array.isArray(b.items)?b.items:[]).slice(0,20).forEach(i=>{const pr=db.products.find(x=>x.id===i.id),q=Math.max(1,Math.min(99,parseInt(i.q)||1));if(pr)items.push({id:pr.id,name:pr.name.en||pr.name.ar,q,price:pr.price})});
    if(!items.length)return send(res,400,{error:'empty'});
    const o={id:rid('o'),at:new Date().toISOString(),user:me?me.username:null,items,total:items.reduce((a,i)=>a+i.q*i.price,0),status:'new'};
    db.orders.unshift(o);db.orders.length=Math.min(db.orders.length,2000);save();return send(res,200,{ok:1,id:o.id});
  }

  /* ----- admin only ----- */
  if(p.startsWith('/api/admin/')){
    if(!me||me.role!=='admin')return send(res,401,{error:'Admin only'});
    if(p==='/api/admin/stats'&&m==='GET')return send(res,200,stats());
    if(p==='/api/admin/password'&&m==='POST'){
      const b=await jbody(req);if(!check(String(b.old||''),me.pass))return send(res,400,{error:'Current password is wrong'});
      const n=String(b.new||'');if(n.length<8)return send(res,400,{error:'New password must be at least 8 characters'});
      me.pass=hash(n);save();return send(res,200,{ok:1});
    }
    if(p==='/api/admin/upload'&&m==='POST'){
      const b=await body(req,6e6),h=b.subarray(0,12);let ext=null;
      if(h[0]===0x89&&h[1]===0x50&&h[2]===0x4e&&h[3]===0x47)ext='png';
      else if(h[0]===0xff&&h[1]===0xd8&&h[2]===0xff)ext='jpg';
      else if(h.toString('latin1',0,4)==='RIFF'&&h.toString('latin1',8,12)==='WEBP')ext='webp';
      if(!ext)return send(res,400,{error:'Only PNG, JPG or WEBP images'});
      const name=crypto.randomBytes(8).toString('hex')+'.'+ext;fs.writeFileSync(path.join(UP,name),b);
      return send(res,200,{path:'uploads/'+name});
    }
    let r;
    if((r=p.match(/^\/api\/admin\/(work|clients|products)(?:\/(\w+))?$/))){
      const col=r[1],id=r[2],list=db[col];
      if(m==='POST'&&!id){
        const c=clean[col](await jbody(req));if(!named(c))return send(res,400,{error:'Name is required'});
        if(col!=='products'&&!(c.img||c.logo))return send(res,400,{error:'Image is required'});
        const it={id:rid(col[0]),...c};list.push(it);save();return send(res,200,it);
      }
      const i=list.findIndex(x=>x.id===id);if(i<0)return send(res,404,{error:'Not found'});
      if(m==='PUT'){
        const c=clean[col](await jbody(req));if(!named(c))return send(res,400,{error:'Name is required'});
        if(!c.img)delete c.img;if(!c.logo)delete c.logo;
        Object.assign(list[i],c);save();return send(res,200,list[i]);
      }
      if(m==='DELETE'){list.splice(i,1);if(col==='work')delete db.stats.views[id];save();return send(res,200,{ok:1})}
    }
    if((r=p.match(/^\/api\/admin\/buttons\/(\w+)$/))&&m==='PUT'){
      if(!db.buttons[r[1]])return send(res,404,{error:'Not found'});
      const b=await jbody(req);db.buttons[r[1]]={label:LS(b.label,60),href:href(b.href)};save();return send(res,200,db.buttons[r[1]]);
    }
    if(p==='/api/admin/contact'&&m==='PUT'){
      const b=await jbody(req),email=S(b.email,120),wa=digits(b.whatsapp);
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return send(res,400,{error:'Invalid email'});
      if(wa.length<8||wa.length>15)return send(res,400,{error:'Invalid WhatsApp number'});
      db.contact={email,whatsapp:wa};save();return send(res,200,db.contact);
    }
    if((r=p.match(/^\/api\/admin\/orders\/(\w+)$/))&&m==='PATCH'){
      const o=db.orders.find(x=>x.id===r[1]),b=await jbody(req);
      if(!o||!['new','confirmed','done','cancelled'].includes(b.status))return send(res,400,{error:'Bad request'});
      o.status=b.status;save();return send(res,200,o);
    }
    return send(res,404,{error:'Not found'});
  }
  return send(res,404,{error:'Not found'});
}

/* ---------- static files ---------- */
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const OK=/^\/(?:(?!server\.js$)[\w\-.]+\.(?:html|js|css|png|jpg|webp|ico)|(?:img|logos|uploads)\/[\w\-.]+\.(?:png|jpg|webp))$/;
function serve(req,res,p){
  if(p==='/')p='/index.html';
  if(!OK.test(p)||p.includes('..')){res.writeHead(404,{'content-type':'text/plain'});return res.end('Not found')}
  const f=path.join(ROOT,p);
  fs.readFile(f,(e,b)=>{
    if(e){res.writeHead(404,{'content-type':'text/plain'});return res.end('Not found')}
    res.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream','cache-control':p.startsWith('/uploads/')?'public, max-age=86400':'no-cache'});res.end(b);
  });
}

http.createServer(async(req,res)=>{
  try{
    res.setHeader('x-content-type-options','nosniff');res.setHeader('x-frame-options','DENY');res.setHeader('referrer-policy','same-origin');
    const p=decodeURIComponent(new URL(req.url,'http://x').pathname);
    if(p.startsWith('/api/'))await api(req,res,p,req.method);else serve(req,res,p);
  }catch(e){
    const code=e.code===413?413:e.code===400?400:500;
    if(code===500)console.error(e);
    if(!res.headersSent)send(res,code,{error:code===500?'Server error':e.message});else res.end();
  }
}).listen(PORT,()=>console.log(`Hook site running on http://localhost:${PORT}`));
