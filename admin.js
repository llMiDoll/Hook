(function(){
const ACTIONS={'index.html':[['+ Project','+ مشروع','work'],['+ Client','+ عميل','clients']],'portfolio.html':[['+ Project','+ مشروع','work']],'shop.html':[['+ Price quote','+ عرض سعر','products']]};
/* field: [path, 'EN|AR label', type, options] */
const FIELDS={
 work:[['cat','Category|التصنيف','select',['Design','Content','Media Buying']],['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],['desc.en','Description (EN)|الوصف (EN)','area'],['desc.ar','Description (AR)|الوصف (AR)','area'],['img','Image|الصورة','image']],
 clients:[['name','Client name|اسم العميل'],['logo','Logo|اللوجو','image']],
 products:[['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],['tag.en','Tag (EN)|التصنيف (EN)'],['tag.ar','Tag (AR)|التصنيف (AR)'],['price','Price EGP|السعر بالجنيه','number'],['per.en','Billing (EN)|الدفع (EN)'],['per.ar','Billing (AR)|الدفع (AR)'],['items.en','Features EN, one per line|المميزات EN، كل سطر ميزة','area'],['items.ar','Features AR, one per line|المميزات AR، كل سطر ميزة','area']],
 buttons:[['label.en','Label (EN)|النص (EN)'],['label.ar','Label (AR)|النص (AR)'],['href','Link|الرابط']],
 contact:[['email','Email|الإيميل'],['whatsapp','WhatsApp number with country code|رقم الواتساب بكود الدولة']]};
const TITLE={work:['project','المشروع'],clients:['client','العميل'],products:['price quote','عرض السعر'],buttons:['button','الزر'],contact:['contact details','بيانات التواصل']};
const lab=s=>t(...s.split('|'));
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const setp=(o,p,v)=>{const k=p.split('.');k.slice(0,-1).forEach(x=>o=o[x]=o[x]||{});o[k[k.length-1]]=v};
const find=(kind,id)=>kind==='buttons'?DB.buttons[id]:kind==='contact'?DB.contact:DB[kind].find(x=>x.id===id);

const dlg=document.createElement('dialog');document.body.appendChild(dlg);
function editor(kind,id){
  const it=id||kind==='contact'?find(kind,id):null,isNew=!it;
  const form=document.createElement('form'),h=document.createElement('h3');
  h.textContent=(isNew?t('Add ','إضافة '):t('Edit ','تعديل '))+t(...TITLE[kind]);form.appendChild(h);
  const inputs={};
  FIELDS[kind].forEach(([p,l,type,opts])=>{
    const w=document.createElement('label'),s=document.createElement('span');s.textContent=lab(l);w.appendChild(s);
    let el;
    if(type==='select'){el=document.createElement('select');opts.forEach(o=>{const op=document.createElement('option');op.textContent=op.value=o;el.appendChild(op)})}
    else if(type==='area'){el=document.createElement('textarea');el.rows=3}
    else{el=document.createElement('input');if(type==='number'){el.type='number';el.min=0}}
    let v=it?get(it,p):'';
    if(kind==='products'&&p.startsWith('items.'))v=it?it.items.map(x=>x[p.slice(6)]).join('\n'):'';
    el.value=v==null?'':v;inputs[p]=el;w.appendChild(el);
    if(type==='image'){
      const f=document.createElement('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';
      f.onchange=async()=>{const file=f.files[0];if(!file)return;msg.textContent=t('Uploading...','جاري الرفع...');
        const r=await fetch('/api/admin/upload',{method:'POST',body:file});const j=await r.json();
        if(r.ok){el.value=j.path;msg.textContent=''}else msg.textContent=j.error};
      w.appendChild(f);
    }
    form.appendChild(w);
  });
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';
  const ok=document.createElement('button');ok.className='btn';ok.type='submit';ok.textContent=t('Save','حفظ');
  const no=document.createElement('button');no.className='btn ghost';no.type='button';no.textContent=t('Cancel','إلغاء');no.onclick=()=>dlg.close();
  row.append(ok,no);
  if(it&&['work','clients','products'].includes(kind)){
    const del=document.createElement('button');del.className='btn del';del.type='button';del.textContent=t('Delete','حذف');
    del.onclick=async()=>{if(!confirm(t('Delete this item?','تحذف العنصر ده؟')))return;
      const r=await fetch(`/api/admin/${kind}/${id}`,{method:'DELETE'});if(r.ok){dlg.close();await reloadContent()}else msg.textContent=(await r.json()).error};
    row.appendChild(del);
  }
  form.appendChild(row);
  form.onsubmit=async e=>{
    e.preventDefault();const data={};
    Object.entries(inputs).forEach(([p,el])=>{if(!(kind==='products'&&p.startsWith('items.')))setp(data,p,el.value)});
    if(kind==='products'){const en=inputs['items.en'].value.split('\n').map(s=>s.trim()).filter(Boolean),a=inputs['items.ar'].value.split('\n').map(s=>s.trim()).filter(Boolean);
      data.items=Array.from({length:Math.max(en.length,a.length)},(_,i)=>({en:en[i]||a[i]||'',ar:a[i]||en[i]||''}))}
    const url=kind==='contact'?'/api/admin/contact':kind==='buttons'?`/api/admin/buttons/${id}`:`/api/admin/${kind}${id?'/'+id:''}`;
    const r=await fetch(url,{method:id||kind==='contact'?'PUT':'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
    if(r.ok){dlg.close();await reloadContent()}else msg.textContent=(await r.json()).error||'Error';
  };
  dlg.replaceChildren(form);dlg.showModal();
}

/* floating bar */
const bar=document.createElement('div');bar.className='abar';
function drawBar(){
  bar.replaceChildren();const b=document.createElement('b');b.textContent='✎ '+t('Admin','الأدمن');bar.appendChild(b);
  (ACTIONS[here]||[]).forEach(([en,a,k])=>{const x=document.createElement('button');x.textContent=t(en,a);x.onclick=()=>editor(k);bar.appendChild(x)});
  const c=document.createElement('button');c.textContent=t('Contact info','بيانات التواصل');c.onclick=()=>editor('contact');bar.appendChild(c);
  const d=document.createElement('a');d.href='dashboard.html';d.textContent=t('Dashboard','لوحة التحكم');bar.appendChild(d);
  const o=document.createElement('button');o.textContent=t('Logout','خروج');o.onclick=async()=>{await post('/api/logout',{});location.href='index.html'};bar.appendChild(o);
}
document.body.appendChild(bar);drawBar();document.addEventListener('langchange',drawBar);

/* per-item edit buttons */
function decorate(){
  document.querySelectorAll('[data-k]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;const b=document.createElement('button');b.className='edit';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit');
    b.onclick=e=>{e.preventDefault();e.stopPropagation();editor(el.dataset.k,el.dataset.id)};
    el.appendChild(b);
  });
  document.querySelectorAll('[data-btn]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;const b=document.createElement('button');b.className='edit inl';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit button');
    b.onclick=e=>{e.preventDefault();editor('buttons',el.dataset.btn)};el.insertAdjacentElement('afterend',b);
  });
}
let q;new MutationObserver(()=>{cancelAnimationFrame(q);q=requestAnimationFrame(decorate)}).observe(document.body,{childList:true,subtree:true});
decorate();
})();
