(function(){
if(typeof THREE==='undefined')return;
let R;try{R=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch(e){return}
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
R.setPixelRatio(Math.min(devicePixelRatio||1,1.5));R.setClearColor(0x000000,0);
const cv=R.domElement;cv.id='sea';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,200);C.position.z=18;
S.add(new THREE.HemisphereLight(0xffffff,0x445555,1.05));
const DL=new THREE.DirectionalLight(0xffffff,.9);DL.position.set(5,8,10);S.add(DL);
let HH=6.55,HW=11;
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();HH=Math.tan(THREE.MathUtils.degToRad(20))*C.position.z;HW=HH*C.aspect}
size();addEventListener('resize',size);

/* ---------- materials and shapes ---------- */
const M=(c,e)=>new THREE.MeshPhongMaterial({color:c,emissive:c,emissiveIntensity:e,shininess:70});
const sph=new THREE.SphereGeometry(1,18,12),cone=new THREE.ConeGeometry(1,1,10),cyl=new THREE.CylinderGeometry(1,1,1,6);
const eye=new THREE.MeshPhongMaterial({color:0x1d1d1b,shininess:90});
const mk=(g,m,sc,p,r)=>{const x=new THREE.Mesh(g,m);x.scale.set(sc[0],sc[1],sc[2]);x.position.set(p[0],p[1],p[2]);if(r)x.rotation.set(r[0],r[1],r[2]);return x};
const eyes=(g,x,y,s)=>{g.add(mk(sph,eye,[s,s,s],[x,y,.4]),mk(sph,eye,[s,s,s],[x,y,-.4]))};
function tailOf(g,m,x,sc){const t=new THREE.Group();t.position.set(x,0,0);t.add(mk(cone,m,sc,[-sc[1]/2,0,0],[0,0,-Math.PI/2]));g.add(t);g.userData.tail=t}
/* 0 surface: small reef fish */
function sp0(){const g=new THREE.Group(),a=M(0xfffdef,.35),b=M(0xfe502d,.3);
  g.add(mk(sph,a,[1.3,.78,.5],[0,0,0]),mk(cone,b,[.35,.6,.1],[-.1,.75,0],[0,0,-.3]),mk(sph,b,[.2,.7,.52],[.35,0,0]));
  tailOf(g,b,-1.2,[.75,.9,.12]);eyes(g,.8,.2,.12);return g}
/* 1 mid water: long mint fish with stripes */
function sp1(){const g=new THREE.Group(),a=M(0x7fe0d0,.3),b=M(0x005550,.4);
  g.add(mk(sph,a,[2,.6,.5],[0,0,0]),mk(cone,b,[.3,.6,.08],[.1,.6,0],[0,0,-.2]),mk(cone,b,[.2,.4,.06],[-.7,.55,0],[0,0,-.3]));
  [-.3,.4].forEach(x=>g.add(mk(sph,b,[.12,.6,.52],[x,0,0])));
  tailOf(g,a,-1.9,[.9,1.1,.1]);eyes(g,1.4,.15,.1);return g}
/* 2 deep: angler with a glowing lure */
function sp2(){const g=new THREE.Group(),a=M(0xfe502d,.25),d=M(0x3a1a12,.1),glow=new THREE.MeshBasicMaterial({color:0xfffdef});
  g.add(mk(sph,a,[1.2,1.05,.95],[0,0,0]),mk(sph,d,[.85,.3,.7],[.55,-.5,0]),mk(cyl,d,[.04,.95,.04],[.5,1.15,0],[0,0,-.75]),mk(sph,glow,[.22,.22,.22],[.9,1.55,0]),mk(sph,new THREE.MeshBasicMaterial({color:0xfffdef,transparent:true,opacity:.25}),[.5,.5,.5],[.9,1.55,0]));
  tailOf(g,a,-1.1,[.5,.6,.12]);eyes(g,.65,.25,.18);return g}
/* 3 abyss: glowing jelly lantern */
function sp3(){const g=new THREE.Group(),m=new THREE.MeshPhongMaterial({color:0xfffdef,emissive:0xfffdef,emissiveIntensity:.8,transparent:true,opacity:.8,side:THREE.DoubleSide});
  g.add(mk(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2),m,[1.1,.9,1.1],[0,0,0]));
  g.userData.tent=[];for(let i=0;i<5;i++){const a=i/5*Math.PI*2,x=Math.cos(a)*.55,z=Math.sin(a)*.55,p=new THREE.Group();p.position.set(x,0,z);p.add(mk(cyl,m,[.035,1.7,.035],[0,-.85,0]));g.add(p);g.userData.tent.push(p)}
  return g}
const ZS=[.3,.4,.52,.66],MAKE=[sp0,sp1,sp2,sp3];

/* ---------- 12 fish ---------- */
const fish=[];
for(let i=0;i<12;i++){
  const g=new THREE.Group(),v=MAKE.map(f=>{const x=f();g.add(x);x.scale.setScalar(.0001);return x});
  const f={g,v,s:[1,0,0,0],k:.85+Math.random()*.3,seed:Math.random()*100,dir:Math.random()<.5?-1:1,sp:.9+Math.random()*1.1,
    x:(Math.random()*2-1)*10,y:(Math.random()*2-1)*5,z:-3+Math.random()*5,vx:0,vy:0,y0:0};
  f.y0=f.y;f.vx=f.dir*f.sp;g.rotation.y=f.dir>0?0:Math.PI;S.add(g);fish.push(f);
}

/* ---------- hook (small) ---------- */
const pivot=new THREE.Group(),hook=new THREE.Group();
const steel=new THREE.MeshPhongMaterial({color:0xe8eeee,specular:0xffffff,shininess:120,emissive:0x1f3030});
const pts=[[0,3.2,0],[0,.4,0],[0,-.8,0],[.35,-1.55,0],[1.1,-1.85,0],[1.75,-1.3,0],[1.7,-.5,0],[1.38,-.05,0]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
hook.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,.13,10,false),steel));
hook.add(mk(cone,steel,[.2,.55,.2],[1.38,.1,0],[0,0,.15]));
const ring=new THREE.Mesh(new THREE.TorusGeometry(.26,.07,10,24),steel);ring.position.y=3.45;hook.add(ring);
hook.position.y=-3.45;pivot.add(hook);
const line=mk(cyl,new THREE.MeshBasicMaterial({color:0xfffdef,transparent:true,opacity:.7}),[.025,80,.025],[0,40,0]);pivot.add(line);
S.add(pivot);

/* ---------- pointer ---------- */
let mx=1e3,my=1e3,nx=0,ny=0;
addEventListener('pointermove',e=>{nx=e.clientX/innerWidth*2-1;ny=-(e.clientY/innerHeight*2-1);mx=nx*HW;my=ny*HH});
document.addEventListener('pointerleave',()=>{mx=my=1e3});
addEventListener('touchend',()=>{mx=my=1e3});

/* ---------- loop ---------- */
let last=performance.now(),raf=0;
function frame(now){
  const dt=reduce?0:Math.min(.05,(now-last)/1000),tm=now/1000;last=now;
  const D=window.DEPTH||0,zone=Math.min(3,Math.floor(D*4));
  const narrow=C.aspect<.9,sc=narrow?.4:.5;
  pivot.scale.setScalar(sc);
  pivot.position.set(HW*(narrow?.7:.62),HH*.5+scrollY*(2*HH/innerHeight),0);
  pivot.rotation.z=Math.sin(tm*.9)*.07;hook.rotation.y=Math.sin(tm*.6)*.9+nx*.35;hook.rotation.x=-ny*.12;
  const R2=3.3;
  for(const f of fish){
    f.v.forEach((v,i)=>{f.s[i]+=((i==zone?1:0)-f.s[i])*Math.min(1,dt*3);const k=f.s[i];v.visible=k>.02;v.scale.setScalar(Math.max(.0001,ZS[i]*f.k*k))});
    const cruise=f.sp*(zone==3?.45:zone==2?.8:1);
    f.vx+=(f.dir*cruise-f.vx)*Math.min(1,dt*.8);
    f.vy+=((Math.cos(tm*.7+f.seed)*.5+(f.y0-f.y)*.3)-f.vy)*Math.min(1,dt*1.2);
    const dx=f.x-mx,dy=f.y-my,d=Math.hypot(dx,dy);
    if(d<R2){const k=(1-d/R2)*34*dt;f.vx+=dx/(d||1)*k;f.vy+=dy/(d||1)*k}
    const sp=Math.hypot(f.vx,f.vy);if(sp>9){f.vx*=9/sp;f.vy*=9/sp}
    if(Math.abs(f.vx)>3)f.dir=Math.sign(f.vx);
    f.x+=f.vx*dt;f.y+=f.vy*dt;
    if(f.x>HW+3)f.x=-HW-3;else if(f.x<-HW-3)f.x=HW+3;
    if(f.y>HH-.6){f.y=HH-.6;f.vy=-Math.abs(f.vy)}else if(f.y<-HH+.6){f.y=-HH+.6;f.vy=Math.abs(f.vy)}
    f.g.position.set(f.x,f.y,f.z);
    const ty=f.vx>=0?0:Math.PI;let dr=ty-f.g.rotation.y;if(dr>Math.PI)dr-=2*Math.PI;if(dr<-Math.PI)dr+=2*Math.PI;
    f.g.rotation.y+=dr*Math.min(1,dt*7);f.g.rotation.z=Math.max(-.5,Math.min(.5,f.vy*.09*(f.vx>=0?1:-1)));
    const run=Math.min(2.5,sp/2+.6);
    for(let i=0;i<3;i++){const tl=f.v[i].userData.tail;if(tl)tl.rotation.y=Math.sin(tm*7*run+f.seed)*.5}
    const j=f.v[3];if(j.visible){j.scale.y=ZS[3]*f.k*f.s[3]*(1+Math.sin(tm*2+f.seed)*.12);j.userData.tent.forEach((p,n)=>p.rotation.z=Math.sin(tm*2+n+f.seed)*.25)}
  }
  R.render(S,C);
  if(!reduce&&!document.hidden)raf=requestAnimationFrame(frame);
}
const kick=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden){last=performance.now();kick()}});
if(reduce){addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick)}
kick();
})();
