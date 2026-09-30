/* Hook hero: a glossy 3D fishing hook with a shoal of fish circling it. The cursor is the bait. */
(()=>{const cv=document.getElementById('gl');if(!cv||!window.THREE)return;
const T=THREE,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let r;try{r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){cv.remove();return}
r.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,100);cam.position.z=14;
function mc(a,b,c){const k=document.createElement('canvas');k.width=k.height=256;const x=k.getContext('2d');let g=x.createRadialGradient(100,90,6,128,128,130);g.addColorStop(0,a);g.addColorStop(.55,b);g.addColorStop(1,c);x.fillStyle=g;x.fillRect(0,0,256,256);
g=x.createRadialGradient(88,78,0,88,78,50);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
g=x.createRadialGradient(128,128,88,128,128,128);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,235,200,.5)');x.fillStyle=g;x.fillRect(0,0,256,256);return new T.CanvasTexture(k)}
const hookM=new T.MeshMatcapMaterial({matcap:mc('#ffd6c8','#ff512e','#5e1000')}),fishM=new T.MeshMatcapMaterial({matcap:mc('#ffffff','#dedede','#707070')}),lineM=new T.MeshBasicMaterial();
const G=new T.Group(),H=new T.Group();sc.add(G);G.add(H);H.position.set(-1.6,-.2,0);
/* hook: shank + J bend + barb + eye + line */
const cy=-1.3,R=1.75,pts=[];for(let y=3.4;y>=cy;y-=.3)pts.push(new T.Vector3(0,y,0));
const aE=2*Math.PI+.85;for(let a=Math.PI;a<=aE;a+=.1)pts.push(new T.Vector3(R+R*Math.cos(a),cy+R*Math.sin(a),0));
H.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),240,.24,24),hookM));
const tg=new T.Vector3(-Math.sin(aE),Math.cos(aE),0),ep=pts[pts.length-1],barb=new T.Mesh(new T.ConeGeometry(.3,1,24),hookM);
barb.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),tg);barb.position.copy(ep).addScaledVector(tg,.4);H.add(barb);
const eye=new T.Mesh(new T.TorusGeometry(.42,.1,16,48),hookM);eye.position.y=3.85;H.add(eye);
const line=new T.Mesh(new T.CylinderGeometry(.022,.022,16,6),lineM);line.position.y=3.97+8;H.add(line);
/* shoal */
const N=64,F=[],col=new T.Color(),dm=new T.Object3D(),tm=new T.Matrix4(),wg=new T.Matrix4(),m4=new T.Matrix4();
const fb=new T.SphereGeometry(.5,18,14).scale(1.7,.85,.38),ft=new T.ConeGeometry(.5,.62,3).rotateZ(-Math.PI/2).scale(1,1.35,.22);
const bodies=new T.InstancedMesh(fb,fishM,N),tails=new T.InstancedMesh(ft,fishM,N);sc.add(bodies,tails);
for(let i=0;i<N;i++)F.push({ph:Math.random()*6.28,sp:.22+Math.random()*.18,rx:2.6+Math.random()*4.4,ry:.8+Math.random()*3,oy:(Math.random()-.5)*3,rz:(Math.random()-.5)*6,s:.22+Math.random()*.3,a:0,p:new T.Vector3((Math.random()-.5)*16,(Math.random()-.5)*8,(Math.random()-.5)*4)});
/* bubbles */
const B=90,bp=new Float32Array(B*3);for(let i=0;i<B;i++){bp[i*3]=(Math.random()-.5)*20;bp[i*3+1]=(Math.random()-.5)*12;bp[i*3+2]=(Math.random()-.5)*8}
const bg=new T.BufferGeometry();bg.setAttribute('position',new T.BufferAttribute(bp,3));const bm=new T.PointsMaterial({size:.07,transparent:true,opacity:.7}),bub=new T.Points(bg,bm);sc.add(bub);
function theme(){const dk=document.documentElement.dataset.theme=='dark';lineM.color.set(dk?'#fffdef':'#1d1d1b');bm.color.set(dk?'#fffdef':'#1d1d1b');
for(let i=0;i<N;i++){col.set(i%5==0?'#ff512e':dk?'#fffdef':'#1d1d1b');bodies.setColorAt(i,col);tails.setColorAt(i,col)}bodies.instanceColor.needsUpdate=tails.instanceColor.needsUpdate=true}
window.onTheme=theme;theme();
let cx=4.2,ks=1,mx=0,my=0;const mp=new T.Vector3(99,99,0),v=new T.Vector3();
function size(){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();const wide=w/h>1.05;const sg=document.documentElement.dir=='rtl'?-1:1;cx=wide?4.7*sg:0;ks=Math.min(1,w/h/1.7);G.position.set(cx,wide?0:-.8,0);G.scale.setScalar(wide?.82:.62)}
addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mx=(e.clientX-b.left)/b.width*2-1;my=-((e.clientY-b.top)/b.height*2-1);v.set(mx,my,.5).unproject(cam).sub(cam.position).normalize();mp.copy(cam.position).addScaledVector(v,-cam.position.z/v.z)});
let vis=true,t=0;
function draw(){if(vis){t+=.016;
G.rotation.y=Math.sin(t*.7)*.55+mx*.45;G.rotation.x=-my*.18;G.rotation.z=Math.sin(t*1.1)*.05;H.position.y=-.2+Math.sin(t*.9)*.15;
for(let i=0;i<N;i++){const f=F[i],a=t*f.sp+f.ph;let x=cx+Math.cos(a)*f.rx*ks,y=Math.sin(a*1.3)*f.ry+f.oy,z=f.rz*Math.sin(a);
const d=Math.hypot(x-mp.x,y-mp.y),w=Math.max(0,1-d/5)*.6;x+=(mp.x-x)*w;y+=(mp.y-y)*w;
const ox=f.p.x,oy=f.p.y;f.p.x+=(x-f.p.x)*.07;f.p.y+=(y-f.p.y)*.07;f.p.z+=(z-f.p.z)*.07;
const vx=f.p.x-ox,vy=f.p.y-oy;if(Math.abs(vx)+Math.abs(vy)>1e-4){let ta=Math.atan2(vy,vx),df=ta-f.a;df=Math.atan2(Math.sin(df),Math.cos(df));f.a+=df*.15}
dm.position.copy(f.p);dm.rotation.set(0,0,f.a);dm.scale.setScalar(f.s);dm.updateMatrix();bodies.setMatrixAt(i,dm.matrix);
tm.makeTranslation(-.88,0,0);wg.makeRotationY(Math.sin(t*9+i)*.55);m4.copy(dm.matrix).multiply(tm).multiply(wg);tails.setMatrixAt(i,m4)}
bodies.instanceMatrix.needsUpdate=tails.instanceMatrix.needsUpdate=true;
for(let i=0;i<B;i++){bp[i*3+1]+=.012+(i%4)*.004;if(bp[i*3+1]>6)bp[i*3+1]=-6}bg.attributes.position.needsUpdate=true;
r.render(sc,cam)}if(!RM)requestAnimationFrame(draw)}
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);new ResizeObserver(size).observe(cv);new MutationObserver(size).observe(document.documentElement,{attributes:true,attributeFilter:['dir']});size();draw();
if(RM)for(let k=0;k<200;k++)t+=.016,draw.call(null)})();
