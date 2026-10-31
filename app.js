/* SKORKAMPUNG — vanilla JS, tanpa dependency. Modul: store, render, gerak, ekspor. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var motionOn=!reduced;

/* ---------- DATA ---------- */
var KEY="skorkampung.v1";
var TEAMS=[
 {id:"rt01",name:"Elang Malam",short:"EM"},{id:"rt02",name:"Garuda Lor",short:"GL"},
 {id:"rt03",name:"Macan Kidul",short:"MK"},{id:"rt04",name:"Kancil FC",short:"KFC"},
 {id:"rt05",name:"Rajawali",short:"RJW"},{id:"rt06",name:"Banteng Wetan",short:"BW"},
 {id:"rt07",name:"Naga Bonar",short:"NB"},{id:"rt08",name:"Tunas Muda",short:"TM"}
];
function fx(id,a,b,dt,venue,sa,sb,scorers){return{id:id,a:a,b:b,datetime:dt,venue:venue||"Lapangan Balai Warga",
  result:(sa==null?null:{sa:sa,sb:sb,scorers:scorers||[]})}}
function seedFixtures(){return[
 fx("f01","rt01","rt03","2026-10-24T19:30","Lapangan Balai Warga",2,1,[{n:"Dadang",t:"rt01",g:2},{n:"Udin",t:"rt03",g:1}]),
 fx("f02","rt02","rt05","2026-10-25T16:00","Lapangan Balai Warga",0,0,[]),
 fx("f03","rt01","rt05","2026-10-28T19:30","Lapangan Balai Warga",1,0,[{n:"Dadang",t:"rt01",g:1}]),
 fx("f04","rt06","rt08","2026-10-29T20:00","Lapangan Balai Warga",1,1,[{n:"Asep",t:"rt06",g:1},{n:"Rian",t:"rt08",g:1}]),
 fx("f05","rt04","rt07","2026-10-31T08:00","Lapangan Balai Warga",3,2,[{n:"Jajang",t:"rt04",g:2},{n:"Iwan",t:"rt04",g:1},{n:"Eko",t:"rt07",g:1},{n:"Bambang",t:"rt07",g:1}]),
 fx("f06","rt02","rt04","2026-11-07T19:30"),
 fx("f07","rt03","rt06","2026-11-08T16:00"),
 fx("f08","rt07","rt01","2026-11-14T19:30"),
 fx("f09","rt08","rt02","2026-11-15T16:00"),
 fx("f10","rt05","rt04","2026-11-21T19:30"),
 fx("f11","rt06","rt01","2026-11-22T16:00"),
 fx("f12","rt03","rt08","2026-11-28T19:30")
]}
var NEWS=[
 {t:"DRAMA 90 MENIT! Kancil FC Comeback 3–2 atas Naga Bonar",b:"Tertinggal dua gol di babak pertama, Kancil FC mengamuk di 20 menit terakhir. Jajang cetak brace, tribun bambu sampai goyang."},
 {t:"Dadang Cetak Brace, Elang Malam Puncaki Klasemen",b:"Tiga gol dari dua laga. Striker RT 01 itu sekarang diburu tanda tangan — dan diburu bek lawan tiap pekan."},
 {t:"Derby Lor–Kidul Pekan Depan: Karcis Ludes",b:"Garuda Lor vs Macan Kidul selalu panas. Panitia cetak 300 karcis, ludes dalam dua jam. Datang pagi kalau mau dapat tempat."},
 {t:"Wasit Karman Pimpin Tanpa VAR",b:"\"Di sini VAR itu Varung,\" kata Karman sambil meniup peluit. Keputusan wasit mutlak, protes dilayani setelah laga dengan segelas teh."},
 {t:"Lapangan Balai Warga Direnovasi",b:"Rumput diganti, gawang dicat ulang pink-oranye. Pemain diminta tidak parkir motor di garis gawang."}
];
function teamName(id){var t=TEAMS.find(function(x){return x.id===id});return t?t.name:id}

/* ---------- STORE ---------- */
function validStore(o){
  if(!o||typeof o!=="object"||o.version!==1||!Array.isArray(o.fixtures))return false;
  return o.fixtures.every(function(f){return f&&typeof f.a==="string"&&typeof f.b==="string"&&typeof f.datetime==="string"});
}
function load(){
  try{var raw=localStorage.getItem(KEY);if(!raw)return null;
    var o=JSON.parse(raw);return validStore(o)?o:null;
  }catch(e){return null}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){/* abaikan */}
}
var store=load()||{version:1,fixtures:seedFixtures()};
if(!load())save();

/* ---------- KLASMEN ---------- */
function compute(){
  var t={};TEAMS.forEach(function(x){t[x.id]={id:x.id,name:x.name,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0}});
  store.fixtures.forEach(function(f){if(!f.result)return;
    var A=t[f.a],B=t[f.b];if(!A||!B)return;
    A.p++;B.p++;A.gf+=f.result.sa;A.ga+=f.result.sb;B.gf+=f.result.sb;B.ga+=f.result.sa;
    if(f.result.sa>f.result.sb){A.w++;B.l++;A.pts+=3}
    else if(f.result.sa<f.result.sb){B.w++;A.l++;B.pts+=3}
    else{A.d++;B.d++;A.pts++;B.pts++}});
  return TEAMS.map(function(x){var r=t[x.id];r.gd=r.gf-r.ga;return r});
}
var sortState={key:"pts",dir:-1};
function sortedRows(){
  var rows=compute(),k=sortState.key,d=sortState.dir;
  return rows.sort(function(a,b){
    var va=k==="name"?a.name:a[k],vb=k==="name"?b.name:b[k];
    var c=va>vb?1:va<vb?-1:0;
    if(c===0&&k!=="pts")c=a.pts-b.pts;
    return c*d;
  });
}
function renderKlasmen(hlId){
  var tb=$("#klasmenBody");tb.innerHTML="";
  sortedRows().forEach(function(r,i){
    var tr=document.createElement("tr");
    if(r.id===hlId)tr.className="hl";
    if(i===0)tr.classList.add("pos1");
    tr.innerHTML="<td>"+(i+1)+"</td><td class='teamcell'>"+(i===0?"<span class='px px-trophy sm' aria-hidden='true'></span> ":"")+esc(r.name)+
      "</td><td>"+r.p+"</td><td>"+r.w+"</td><td>"+r.d+"</td><td>"+r.l+"</td><td>"+r.gf+
      "</td><td>"+r.ga+"</td><td>"+(r.gd>0?"+":"")+r.gd+"</td><td><strong>"+r.pts+"</strong></td>";
    tb.appendChild(tr);
  });
}
$$("#klasmen th[data-sort]").forEach(function(th){
  th.setAttribute("tabindex","0");th.setAttribute("role","button");
  th.setAttribute("aria-label","Urutkan kolom "+th.textContent);
  function go(){var k=th.dataset.sort;
    if(sortState.key===k)sortState.dir*=-1;else{sortState.key=k;sortState.dir=k==="name"?1:-1}
    renderKlasmen();}
  th.addEventListener("click",go);
  th.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}});
});

/* ---------- JADWAL ---------- */
var filterF="all";
function fmtDT(iso){try{return new Intl.DateTimeFormat("id-ID",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(iso))}catch(e){return iso}}
function renderFixtures(){
  var ul=$("#fixtureList");ul.innerHTML="";
  var now=new Date(),shown=0;
  store.fixtures.slice().sort(function(a,b){return new Date(a.datetime)-new Date(b.datetime)}).forEach(function(f){
    var done=!!f.result,up=new Date(f.datetime)>now;
    if(filterF==="up"&&(done||!up))return;
    if(filterF==="done"&&!done)return;
    shown++;
    var li=document.createElement("li");li.className="fixture"+(done?" done":"");
    var score=done?" <span class='skor'>"+f.result.sa+"–"+f.result.sb+"</span>":"";
    var tag=done?"<span class='tag done'>SELESAI</span>":(up?"<span class='tag soon'>MENDATANG</span>":"<span class='tag'>TUNDA?</span>");
    li.innerHTML="<span class='vs'>"+esc(teamName(f.a))+" <span class='skor'>vs</span> "+esc(teamName(f.b))+score+"</span>"+tag+
      "<span class='meta'><span class='px px-cal sm' aria-hidden='true'></span> "+esc(fmtDT(f.datetime))+" · "+esc(f.venue)+"</span>";
    ul.appendChild(li);
  });
  $("#fixtureEmpty").hidden=shown>0;
}
$$(".chip").forEach(function(c){c.addEventListener("click",function(){
  $$(".chip").forEach(function(x){x.classList.remove("on")});c.classList.add("on");
  filterF=c.dataset.filter;renderFixtures();});});

/* ---------- COUNTDOWN ---------- */
function nextFixture(){
  var now=new Date();
  return store.fixtures.filter(function(f){return !f.result&&new Date(f.datetime)>now})
    .sort(function(a,b){return new Date(a.datetime)-new Date(b.datetime)})[0]||null;
}
function tickCD(){
  var f=nextFixture(),m=$("#cdMatch"),t=$("#cdTime");
  if(!f){m.textContent="Musim selesai — sampai jumpa musim depan!";t.textContent="—";return}
  m.textContent=teamName(f.a)+" vs "+teamName(f.b);
  var ms=new Date(f.datetime)-new Date();
  var d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,mi=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;
  function p(n){return String(n).padStart(2,"0")}
  t.textContent=d+" hari "+p(h)+":"+p(mi)+":"+p(s);
}
setInterval(tickCD,1000);

/* ---------- TOP SKOR & WARTA ---------- */
function renderTop(){
  var agg={};
  store.fixtures.forEach(function(f){(f.result&&f.result.scorers||[]).forEach(function(s){
    if(!s.n)return;var k=s.n+"|"+s.t;agg[k]=agg[k]||{n:s.n,t:s.t,g:0};agg[k].g+=+s.g||0})});
  var list=Object.keys(agg).map(function(k){return agg[k]}).sort(function(a,b){return b.g-a.g}).slice(0,10);
  var ol=$("#topskor");ol.innerHTML="";
  list.forEach(function(s,ix){var li=document.createElement("li");
    li.innerHTML=(ix===0?"<span class='px px-star' aria-hidden='true'></span>":"")+"<span class='nm'>"+esc(s.n)+"</span><span class='tm'>"+esc(teamName(s.t))+"</span><span class='gl'>"+s.g+" gol</span>";
    ol.appendChild(li)});
  $("#topskorEmpty").hidden=list.length>0;
}
function renderNews(){
  var w=$("#news");w.innerHTML="";
  NEWS.forEach(function(n){var a=document.createElement("article");
    a.innerHTML="<h4>"+esc(n.t)+"</h4><p>"+esc(n.b)+"</p>";w.appendChild(a)});
}

/* ---------- FORM ---------- */
function fillTeams(){
  ["timA","timB"].forEach(function(id){var s=$("#"+id);s.innerHTML="";
    TEAMS.forEach(function(t){var o=document.createElement("option");o.value=t.id;o.textContent=t.name;s.appendChild(o)})});
  $("#timA").value="rt01";$("#timB").value="rt02";
}
function parseScorers(str,teamA,teamB){
  if(!str.trim())return{ok:true,list:[]};
  var list=[],parts=str.split(",");
  for(var i=0;i<parts.length;i++){
    var m=parts[i].trim().match(/^(.+?)\s+(\d{1,2})$/);
    if(!m)return{ok:false,msg:"Format pencetak gol salah di \""+parts[i].trim()+"\". Pakai: Nama jumlah, cth: Dadang 2"};
    list.push({n:m[1].trim().slice(0,30),t:teamA,g:+m[2]});
  }
  return{ok:true,list:list};
}
function say(msg){$("#live").textContent=msg}
$("#formHasil").addEventListener("submit",function(e){
  e.preventDefault();
  var err=$("#formError");err.hidden=true;
  var a=$("#timA").value,b=$("#timB").value;
  var sa=parseInt($("#skorA").value,10),sb=parseInt($("#skorB").value,10);
  function fail(m){err.textContent=m;err.hidden=false;say(m);return}
  if(a===b)return fail("Peluit belum ditiup, Bos — Tim A dan Tim B tidak boleh sama!");
  if(isNaN(sa)||isNaN(sb)||sa<0||sb<0||sa>30||sb>30)return fail("Skornya diisi dulu, Bos — angka 0 sampai 30.");
  var ps=parseScorers($("#gol").value,a,b);
  if(!ps.ok)return fail(ps.msg);
  var totA=0,totB=0;
  ps.list.forEach(function(s){if(s.t===a)totA+=s.g});
  // tim pencetak gol: yang ditulis dianggap tim A kecuali jumlah tak cocok — sederhanakan: validasi total ≤ skor timnya
  if(totA>sa)return fail("Gol "+ps.list[0].n+" kebanyakan, Bos — melebihi skor "+teamName(a)+".");
  store.fixtures.push(fx("r"+Date.now(),a,b,new Date().toISOString(),"Lapangan Balai Warga",sa,sb,ps.list));
  save();renderAll();tickCD();
  $("#skorA").value="";$("#skorB").value="";$("#gol").value="";
  say("Hasil dicatat! "+teamName(a)+" "+sa+"–"+sb+" "+teamName(b)+". Klasemen diperbarui.");
  confetti();
});
$("#resetData").addEventListener("click",function(){
  if(!window.confirm("Kembalikan ke data contoh awal? Catatanmu akan hilang."))return;
  store={version:1,fixtures:seedFixtures()};save();renderAll();tickCD();say("Data dikembalikan ke contoh awal.");
});

/* ---------- EKSPOR ---------- */
function download(name,content,type){
  var b=new Blob([content],{type:type}),u=URL.createObjectURL(b),a=document.createElement("a");
  a.href=u;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(u);a.remove()},400);
}
function expoMsg(m){var e=$("#exportMsg");e.textContent=m;e.hidden=false;say(m)}
$("#dlJson").addEventListener("click",function(){
  download("skorkampung-edisi.json",JSON.stringify(store,null,2),"application/json");expoMsg("JSON edisi ini diunduh, Bos!")});
$("#dlCsv").addEventListener("click",function(){
  var rows=[["tim","main","menang","seri","kalah","gm","gk","sg","poin"]];
  sortedRows().forEach(function(r){rows.push([r.name,r.p,r.w,r.d,r.l,r.gf,r.ga,r.gd,r.pts])});
  download("skorkampung-klasmen.csv",rows.map(function(r){return r.join(",")}).join("\n"),"text/csv");
  expoMsg("CSV klasemen diunduh, Bos!")});
function copyText(t,okMsg){
  function done(){expoMsg(okMsg)}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(done,function(){fallback()});
  }else fallback();
  function fallback(){var ta=document.createElement("textarea");ta.value=t;ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();try{document.execCommand("copy");done()}catch(e){expoMsg("Gagal menyalin — blokir browser, Bos.")}
    ta.remove()}
}
$("#copyWa").addEventListener("click",function(){
  var r=sortedRows().slice(0,3).map(function(x,i){return (i+1)+". "+x.name+" ("+x.pts+" poin)"}).join("\n");
  var f=nextFixture(),nx=f?("\nLaga berikutnya: "+teamName(f.a)+" vs "+teamName(f.b)+", "+fmtDT(f.datetime)):"";
  copyText("SKORKAMPUNG — Buletin Antar-RT\nKlasemen:\n"+r+nx+"\n"+location.href,"Ringkasan WA disalin! Sebarkan, Bos.")});
$("#copyLink").addEventListener("click",function(){copyText(location.href,"Link edisi disalin!")});

/* ---------- MARQUEE: velocity skew ---------- */
var lastY=window.scrollY,vel=0;
function skewLoop(){
  var y=window.scrollY;vel+=(y-lastY)*0.12;vel*=0.9;lastY=y;
  var sk=Math.max(-14,Math.min(14,vel*0.6));
  $$(".mtrack").forEach(function(m){m.style.transform="skewX("+(-sk)+"deg)"});
  requestAnimationFrame(skewLoop);
}

/* ---------- PANEL HORIZONTAL ---------- */
var hwrap=$("#hwrap"),htrack=$("#htrack"),panels=$$(".panel"),
    pageInd=$("#pageInd"),activePage=-1,panelHs=[];
function metrics(){
  var r=hwrap.getBoundingClientRect(),wh=window.innerHeight;
  return{top:r.top+window.scrollY,total:r.height-wh,vw:window.innerWidth};
}
function progress(){
  var m=metrics();
  if(m.total<=0)return 0;
  return Math.max(0,Math.min(1,(window.scrollY-m.top)/m.total));
}
function setPage(i,announce){
  if(i===activePage&&i>=0)return;activePage=i;
  pageInd.textContent="HAL. "+(i+1)+" / 4";
  panels.forEach(function(p,j){p.classList.toggle("on",j===i)});
  var inner=panels[i].querySelector(".panel-inner");
  $$("[data-split]",panels[i]).forEach(function(h){
    if(!h.classList.contains("in"))h.classList.add("in");
  });
  if(motionOn&&!reduced){inner.classList.remove("wipe");void inner.offsetWidth;inner.classList.add("wipe")}
  if(announce)say("Halaman "+(i+1)+" dari 4: "+panels[i].querySelector("h2").textContent);
}
function drive(){
  var p=progress(),m=metrics();
  var maxX=htrack.scrollWidth-m.vw;
  htrack.style.transform="translate3d("+(-p*maxX)+"px,0,0)";
  var i=Math.round(p*3);setPage(i,false);
  if(motionOn&&!reduced&&!document.body.classList.contains("lite")){
    var cx=m.vw/2;
    panels.forEach(function(panel,j){
      var c=j*m.vw-p*maxX+m.vw/2,dist=Math.min(1,Math.abs(c-cx)/m.vw);
      panel.querySelector(".panel-inner").style.transform="scale("+(1+0.05*(1-dist)).toFixed(3)+")";
    });
  }
  requestAnimationFrame(drive);
}
function gotoPage(i){
  var m=metrics();
  window.scrollTo({top:m.top+i*(m.total/3),behavior:(reduced||!motionOn)?"auto":"smooth"});
  setPage(i,true);
  panels[i].querySelector("h2").focus({preventScroll:true});
}
$("#prevPage").addEventListener("click",function(){gotoPage(Math.max(0,activePage-1))});
$("#nextPage").addEventListener("click",function(){gotoPage(Math.min(3,activePage+1))});
document.addEventListener("keydown",function(e){
  var r=hwrap.getBoundingClientRect();
  var inView=r.top<window.innerHeight&&r.bottom>0;
  if(!inView)return;
  if(e.key==="ArrowRight"){e.preventDefault();gotoPage(Math.min(3,activePage+1))}
  if(e.key==="ArrowLeft"){e.preventDefault();gotoPage(Math.max(0,activePage-1))}
});

/* ---------- SPLIT FLIP HEADLINES ---------- */
function splitHeads(){
  panelHs=$$("[data-split]");
  panelHs.forEach(function(h){
    var label=h.textContent;h.setAttribute("aria-label",label);
    var nodes=Array.prototype.slice.call(h.childNodes);h.innerHTML="";
    var idx=0;
    nodes.forEach(function(n){
      if(n.nodeName==="BR"){h.appendChild(document.createElement("br"));return}
      String(n.textContent).split("").forEach(function(c){
        var s=document.createElement("span");s.className="ch";s.setAttribute("aria-hidden","true");
        s.textContent=c===" "?"\u00a0":c;
        s.style.transitionDelay=(idx*22)+"ms";idx++;h.appendChild(s);
      });
    });
  });
}

/* ---------- DRAG STRIP INERTIA ---------- */
(function(){
  var el=$("#strip"),down=false,sx=0,sl=0,vx=0,raf=null,lastX=0,lastT=0;
  el.addEventListener("pointerdown",function(e){down=true;sx=e.clientX;sl=el.scrollLeft;lastX=e.clientX;lastT=performance.now();vx=0;
    el.classList.add("grabbing");el.setPointerCapture(e.pointerId);if(raf)cancelAnimationFrame(raf)});
  el.addEventListener("pointermove",function(e){if(!down)return;
    var now=performance.now(),dx=e.clientX-lastX;vx=dx/Math.max(1,now-lastT)*16;lastX=e.clientX;lastT=now;
    el.scrollLeft=sl-(e.clientX-sx)});
  function up(){if(!down)return;down=false;el.classList.remove("grabbing");
    (function inertia(){vx*=0.94;el.scrollLeft-=vx;
      if(Math.abs(vx)>0.4)raf=requestAnimationFrame(inertia)})()}
  el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
})();

/* ---------- TOGGLES & LITE ---------- */
var driveStarted=false;
function startDrive(){if(driveStarted||reduced)return;driveStarted=true;requestAnimationFrame(drive);requestAnimationFrame(skewLoop)}
$("#motionToggle").addEventListener("click",function(){
  motionOn=!motionOn;
  document.body.classList.toggle("no-motion",!motionOn);
  this.textContent="GERAK: "+(motionOn?"NYALA":"MATI");
  this.setAttribute("aria-pressed",String(motionOn));
  if(motionOn)startDrive();
  say("Gerak "+(motionOn?"dinyalakan":"dimatikan")+".");
});
var mqOn=true;
$("#marqueeToggle").addEventListener("click",function(){
  mqOn=!mqOn;document.body.classList.toggle("marquee-off",!mqOn);
  this.textContent="TEKS BERJALAN: "+(mqOn?"NYALA":"MATI");
  this.setAttribute("aria-pressed",String(mqOn));
});
if(reduced){motionOn=false;document.body.classList.add("no-motion");$("#motionToggle").textContent="GERAK: MATI";$("#motionToggle").setAttribute("aria-pressed","false")}
if((navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4||
   (navigator.connection&&navigator.connection.saveData))document.body.classList.add("lite");
// FPS watchdog → lite
(function(){var n=0,t0=performance.now();
  function w(){n++;if(performance.now()-t0>2000){
    if(n/2<40)document.body.classList.add("lite");return}
    requestAnimationFrame(w)}requestAnimationFrame(w)})();

/* ---------- EASTER EGG + CONFETTI ---------- */
function confetti(){
  var box=$("#confetti"),colors=["#ff5d8f","#ffa53b","#f2efe6"];
  for(var i=0;i<42;i++){var s=document.createElement("i");
    s.style.left=Math.random()*100+"%";
    s.style.background=colors[i%3];
    s.style.animationDuration=(1.6+Math.random()*1.6)+"s";
    box.appendChild(s);(function(el){setTimeout(function(){el.remove()},3400)})(s)}
}
var buf="";
document.addEventListener("keydown",function(e){
  if(e.key&&e.key.length===1){buf=(buf+e.key.toLowerCase()).slice(-3);
    if(buf==="gol"){var g=$("#gool");g.classList.remove("show");void g.offsetWidth;g.classList.add("show");confetti();say("GOOOL!")}}
});

/* ---------- DEEP LINK ---------- */
function deepLink(){
  var q=new URLSearchParams(location.search),tab=q.get("tab"),tim=q.get("tim");
  var map={klasmen:0,jadwal:1,warta:2,cetak:3};
  var page=map[tab]!=null?map[tab]:(tim?0:null);
  if(page==null)return;
  setTimeout(function(){
    var m=metrics();
    window.scrollTo({top:m.top+page*(m.total/3),behavior:"auto"});
    setPage(page,false);
    if(tim){renderKlasmen(tim);
      var row=$('#klasmenBody tr.hl');
      if(row)row.scrollIntoView({block:"nearest"});
      say("Menampilkan tim "+teamName(tim)+".")}
  },600);
}

/* ---------- INIT ---------- */
function renderAll(){renderKlasmen();renderFixtures();renderTop();renderNews()}
fillTeams();renderAll();tickCD();
function bootSplit(){
  splitHeads();
  var mh=$(".masthead-title");if(mh)mh.classList.add("in");
  setPage(0,false);
}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(bootSplit)}
else{bootSplit()}
if(motionOn&&!reduced){startDrive()}
else{setPage(0,false)}
deepLink();
})();
