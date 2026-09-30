/* Immersive Hook sea: 15 small fish, mouse avoidance, scroll = dive depth. */
(()=>{const cv=document.getElementById('gl');if(!cv||!window.THREE)return;
const T=THREE,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let r;try{r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:false})}catch(e){cv.remove();return}
r.setPixelRatio(Math.min(devicePixelRatio,1.75));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(42,1,.1,100);cam.position.z=15;
const G=new T.Group(),H=new T.Group();sc.add(G);G.add(H);
function mat(a,b,c){const k=document.createElement('canvas');k.width=k.height=128;const x=k.getContext('2d');let g=x.createRadialGradient(48,40,2,64,64,70);g.addColorStop(0,a);g.addColorStop(.55,b);g.addColorStop(1,c);x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(k)}
const hookM=new T.MeshMatcapMaterial({matcap:mat('#ffd9cf','#ff512e','#5e1000')});
const fishM=new T.MeshMatcapMaterial({matcap:mat('#fffdef','#ff8b72','#5a1710')});
const deepM=new T.MeshMatcapMaterial({matcap:mat('#ffb29f','#b83b24','#2d0905')});
const lineM=new T.LineBasicMaterial();
const hookGroup=new T.Group();H.add(hookGroup);
/* smaller hook */
const cy=-1.05,R=1.35,pts=[];for(let y=2.7;y>=cy;y-=.24)pts.push(new T.Vector3(0,y,0));
const ae=2*Math.PI+.9;for(let a=Math.PI;a<=ae;a+=.11)pts.push(new T.Vector3(R+R*Math.cos(a),cy+R*Math.sin(a),0));
hookGroup.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),190,.17,18),hookM));
const tg=new T.Vector3(-Math.sin(ae),Math.cos(ae),0),ep=pts[pts.length-1],barb=new T.Mesh(new T.ConeGeometry(.2,.65,18),hookM);
barb.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),tg);barb.position.copy(ep).addScaledVector(tg,.27);hookGroup.add(barb);
const eye=new T.Mesh(new T.TorusGeometry(.28,.07,12,36),hookM);eye.position.y=3.05;hookGroup.add(eye);
const line=new T.Mesh(new T.CylinderGeometry(.014,.014,11,6),lineM);line.position.y=8.45;hookGroup.add(line);

const N=15,F=[];
const groups=[];
for(let i=0;i<N;i++){
  const g=new T.Group();
  const body=new T.Mesh(new T.SphereGeometry(1,14,10),i>9?deepM:fishM);
  const tail=new T.Mesh(new T.ConeGeometry(.38,.7,4),i>9?deepM:fishM);
  tail.rotation.z=-Math.PI/2; tail.position.x=-.92;
  g.add(body,tail); sc.add(g); groups.push(g);
  F.push({g,ph:Math.random()*6.28,sp:.14+Math.random()*.1,rx:4+Math.random()*6,ry:2+Math.random()*4,rz:(Math.random()-.5)*7,s:.16+Math.random()*.13,p:new T.Vector3(),a:0,oy:(Math.random()-.5)*2.4});
}
/* a few tiny deep silhouettes, still part of the same 15 fish */
function depthType(f,depth){
  const body=f.g.children[0],tail=f.g.children[1];
  const deep=depth>.42;
  body.material=deep?deepM:fishM;tail.material=deep?deepM:fishM;
  const d=depth>0.7?0.72:depth>0.4?.88:1;
  body.scale.set(1.75*d,.78*d,.42*d);
  tail.scale.setScalar(.72*d);
}
let depth=0,mouseX=0,mouseY=0,scrollTarget=0;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function seaColor(dk,d){
  // The sea follows the site's exact brand palette while becoming darker as you dive.
  const top=dk?[29,29,27]:[255,81,46], bottom=dk?[5,5,4]:[92,24,14], q=Math.pow(d,1.35);
  return new T.Color((top[0]*(1-q)+bottom[0]*q)/255,(top[1]*(1-q)+bottom[1]*q)/255,(top[2]*(1-q)+bottom[2]*q)/255);
}
function theme(){lineM.color.set(document.documentElement.dataset.theme=='dark'?'#fffdef':'#1d1d1b')}
window.onTheme=theme;theme();
addEventListener('pointermove',e=>{mouseX=e.clientX;mouseY=e.clientY});
addEventListener('scroll',()=>{const max=Math.max(1,document.body.scrollHeight-innerHeight);scrollTarget=clamp(scrollY/max,0,1)}, {passive:true});
function size(){const w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();G.position.y=0}
new ResizeObserver(size).observe(document.documentElement);
let vis=true,t=0;
function draw(){
  t+=.016; depth+=(scrollTarget-depth)*.035;
  const dk=document.documentElement.dataset.theme=='dark'; sc.background=seaColor(dk,depth);
  const sx=(mouseX/innerWidth-.5)*2, sy=(mouseY/innerHeight-.5)*2;
  hookGroup.scale.setScalar(.74); H.position.set((innerWidth/innerHeight>1.05?-3.0:0),.15-depth*1.5,0);
  H.rotation.y=Math.sin(t*.6)*.28+sx*.18; H.rotation.x=-sy*.1;
  for(let i=0;i<N;i++){
    const f=F[i],a=t*f.sp+f.ph;
    /* depth changes the shoal: deeper fish sit lower, become smaller and use deep-sea material */
    const layer=(i%5)*.55-depth*3.2;
    let x=Math.cos(a)*f.rx + Math.sin(t*.35+i)*.8;
    let y=Math.sin(a*1.25)*f.ry + f.oy + layer;
    let z=f.rz*Math.sin(a)+depth*2.5;
    /* mouse repulsion */
    const mx=sx*7,my=-sy*5,dx=x-mx,dy=y-my,dist=Math.hypot(dx,dy)||.01;
    const repel=Math.max(0,1-dist/4.2)*1.7;
    x+=dx/dist*repel;y+=dy/dist*repel;
    const ox=f.p.x,oy=f.p.y;f.p.x+=(x-f.p.x)*.055;f.p.y+=(y-f.p.y)*.055;f.p.z+=(z-f.p.z)*.055;
    const vx=f.p.x-ox,vy=f.p.y-oy;if(Math.abs(vx)+Math.abs(vy)>.0001){let ta=Math.atan2(vy,vx),df=ta-f.a;df=Math.atan2(Math.sin(df),Math.cos(df));f.a+=df*.12}
    f.g.position.copy(f.p);f.g.rotation.z=f.a;
    const sca=f.s*(1-depth*.52)*(1+(i%3)*.08);
    f.g.position.z += Math.sin(t*1.3+i)*.012;f.g.scale.setScalar(sca);depthType(f,depth);
  }
  r.render(sc,cam);
  if(!RM)requestAnimationFrame(draw)
}
size();draw();
})();
