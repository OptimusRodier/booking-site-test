/* ===== CONFIG: edit these two lines ===== */
var CONFIG = { GTM_ID: 'GTM-N2RZCPP', MID: '12345' };   // booking site's own GTM container + Awin advertiser ID
/* ======================================== */

window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
var CK = 'bk_consent';

/* 1. Consent Mode defaults (denied) BEFORE GTM; restore a saved choice right after */
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
function setConsent(v){
  var s = v === 'granted' ? 'granted' : 'denied';
  gtag('consent','update',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s});
  try{ localStorage.setItem(CK, s); }catch(e){}
  dataLayer.push({event:'consent_update', consent_state:s});
}
try{ var saved = localStorage.getItem(CK); if(saved) gtag('consent','update',{ad_storage:saved,ad_user_data:saved,ad_personalization:saved,analytics_storage:saved}); }catch(e){}

/* 2. GTM (skipped until you set a real container ID) */
if (/^GTM-[A-Z0-9]+$/.test(CONFIG.GTM_ID) && CONFIG.GTM_ID !== 'GTM-XXXXXXX') {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',CONFIG.GTM_ID);
}

/* 3. Remember incoming params for the debug panel and events.
      IMPORTANT: this does NOT write the awc cookie. The Awin MasterTag in GTM must do that, that is what you are testing. */
var KEYS = ['awc','utm_source','utm_medium','utm_campaign','clickref','publisher','source','gclid','fbclid'];
function params(){
  var out = {}; try{ out = JSON.parse(sessionStorage.getItem('bk_params')||'{}'); }catch(e){}
  var q = new URLSearchParams(location.search);
  KEYS.forEach(function(k){ if(q.get(k)) out[k]=q.get(k); });
  try{ sessionStorage.setItem('bk_params', JSON.stringify(out)); }catch(e){}
  return out;
}
var P = params();

/* 4. Rooms and helpers */
var ROOMS = [
  {id:'R101', name:'Classic Double', price:120, desc:'Garden view, king bed'},
  {id:'R201', name:'Deluxe King',    price:180, desc:'Large room, lounge area'},
  {id:'R301', name:'Garden Suite',   price:260, desc:'Suite with private terrace'}
];
function nightsBetween(a,b){ var n=Math.round((new Date(b)-new Date(a))/864e5); return n>0?n:1; }
function item(r,n){ return {item_id:r.id,item_name:r.name,price:r.price,quantity:n}; }
function track(ev, ecom){
  dataLayer.push({ecommerce:null});
  var o = {event:ev, tracking_params:P};
  if (ecom) o.ecommerce = ecom;
  dataLayer.push(o);
}

/* 5. Consent banner */
document.addEventListener('DOMContentLoaded', function(){
  var has=false; try{ has=!!localStorage.getItem(CK); }catch(e){}
  if(!has){
    var b=document.createElement('div'); b.id='cb';
    b.innerHTML='<span>We use cookies for tracking tests. Choose an option.</span><button id="cy">Accept</button><button id="cn">Reject</button>';
    document.body.appendChild(b);
    document.getElementById('cy').onclick=function(){ setConsent('granted'); b.remove(); };
    document.getElementById('cn').onclick=function(){ setConsent('denied'); b.remove(); };
  }
  if (new URLSearchParams(location.search).get('debug')==='true') sessionStorage.setItem('bk_debug','1');
  if (sessionStorage.getItem('bk_debug')) debugPanel();
});

/* 6. Debug panel (?debug=true) */
function debugPanel(){
  var d=document.createElement('div'); d.id='dbg'; document.body.appendChild(d);
  function esc(s){ return String(s).replace(/</g,'&lt;'); }
  function draw(){
    var ck = document.cookie ? document.cookie.split('; ') : [];
    var aw = ck.filter(function(c){ return /^(_aw_|AwinChannelCookie|awin)/i.test(c); });
    var last = dataLayer.filter(function(x){ return x && x.event; }).slice(-6);
    var c='unset'; try{ c=localStorage.getItem(CK)||'unset'; }catch(e){}
    d.innerHTML='<b>URL params (this site, session)</b>\n'+esc(JSON.stringify(P,null,1))+
      '\n\n<b>Awin cookies set on THIS domain</b>\n<i>'+(aw.length?esc(aw.join('\n')):'none yet')+'</i>'+
      '\n\n<b>All cookies</b>\n'+esc(ck.join('\n')||'none')+
      '\n\n<b>Consent</b> '+c+'\n\n<b>Last events</b>\n'+esc(last.map(function(x){return x.event;}).join(' > '))+
      '\n\n<a href="#" id="rst" style="color:#fca5a5">reset test state</a>';
    var r=document.getElementById('rst'); if(r) r.onclick=function(e){ e.preventDefault(); sessionStorage.clear(); try{ localStorage.removeItem('bk_done'); localStorage.removeItem(CK);}catch(x){} location.href='index.html?debug=true'; };
  }
  draw(); setInterval(draw,1000);
}
