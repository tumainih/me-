const KEY="love-time-matter-space-v2";
const db=JSON.parse(localStorage.getItem(KEY)||'{"records":[],"words":["Pray","Read Bible","Praise","Study","Lead","Relate","Eat","Cloth","Reside well"],"places":["Dar"]}');
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let selectedUnit=null, recordMode="Plan", media=null;

const defs=[
 {group:"MICRO TIME",desc:"The smallest live units",items:[
  ["MILLISECOND","ms",p=>p.ms],["SECOND","second",p=>p.s],["MINUTE","minute",p=>p.m],
  ["HOUR","hour",p=>p.h]
 ]},
 {group:"DAY STRUCTURE",desc:"24-hour architecture",items:[
  ["QUA-DAY","0–3 / 3–6 / 6–9 / 9–12 / 12–15 / 15–18 / 18–21 / 21–24",p=>`${Math.floor(p.h/3)*3}–${Math.floor(p.h/3)*3+3}`],
  ["QUARTER DAY","0–6 / 6–12 / 12–18 / 18–24",p=>`${Math.floor(p.h/6)*6}–${Math.floor(p.h/6)*6+6}`],
  ["NOON","06:00–18:00",p=>p.h>=6&&p.h<18?"NOON":"—"],
  ["NIGHT","18:00–06:00",p=>p.h>=18||p.h<6?"NIGHT":"—"],
  ["DAY","24 hours",p=>p.d.toLocaleDateString(undefined,{weekday:"long"})]
 ]},
 {group:"WEEK",desc:"Sunday → Saturday • Wednesday is the peak",items:[
  ["WEEK","Sunday–Saturday",p=>weekLabel(p.d)],["SUNDAY","upper row",p=>weekDay(p,0)],["MONDAY","upper row",p=>weekDay(p,1)],["TUESDAY","upper row",p=>weekDay(p,2)],
  ["WEDNESDAY • PEAK","central peak",p=>weekDay(p,3)],["THURSDAY","lower row",p=>weekDay(p,4)],["FRIDAY","lower row",p=>weekDay(p,5)],["SATURDAY","lower row",p=>weekDay(p,6)]
 ]},
 {group:"10-DAY",desc:"1–10 • 11–20 • remainder of month",items:[
  ["10-DAY","cycle",p=>{let d=p.d.getDate();return d<=10?"1–10":d<=20?"11–20":`21–${new Date(p.d.getFullYear(),p.d.getMonth()+1,0).getDate()}`}]
 ]},
 {group:"MONTH",desc:"Weeks and dates",items:[
  ["MONTH","calendar month",p=>p.d.toLocaleDateString(undefined,{month:"long"})],["MONTH WEEK","week of month",p=>Math.ceil(p.d.getDate()/7)]
 ]},
 {group:"QUARTER",desc:"Jan–Mar • Apr–Jun • Jul–Sep • Oct–Dec",items:[
  ["QUARTER","3 months",p=>`Q${Math.floor(p.d.getMonth()/3)+1}`],["FASTING MONTH","3 / 6 / 9 / 12",p=>[2,5,8,11].includes(p.d.getMonth())?"FASTING":"—"],["8-WEEK PATTERN","other 2-month span",p=>`${((p.d.getMonth()%2)*4)+Math.ceil(p.d.getDate()/7)}`]
 ]},
 {group:"LARGE TIME",desc:"Half-year → century",items:[
  ["HALF-YEAR","Jan–Jun / Jul–Dec",p=>p.d.getMonth()<6?"H1":"H2"],["YEAR","calendar year",p=>p.d.getFullYear()],
  ["4-YEAR","divisible-by-4 block",p=>{let s=Math.floor(p.d.getFullYear()/4)*4;return `${s}–${s+3}`}],
  ["7-YEAR","2004–2010 arrangement",p=>{let s=2004+Math.floor((p.d.getFullYear()-2004)/7)*7;return `${s}–${s+6}` }],
  ["7×7 PRODUCT","7-year arrangement",p=>{let s=2004+Math.floor((p.d.getFullYear()-2004)/49)*49;return `${s}–${s+48}`}],
  ["10-YEAR","decade",p=>`${Math.floor(p.d.getFullYear()/10)*10}s`],["100-YEAR","century",p=>`${Math.floor(p.d.getFullYear()/100)*100}–${Math.floor(p.d.getFullYear()/100)*100+99}`]
 ]}
];

function parts(){
 const d=new Date(), day=d.getDay(), start=new Date(d);start.setHours(0,0,0,0);
 const week=Math.floor((d-new Date(d.getFullYear(),0,1))/(7*86400000))+1;
 return {d,ms:d.getMilliseconds(),s:d.getSeconds(),m:d.getMinutes(),h:d.getHours(),day,week};
}
function pad(n,l=2){return String(n).padStart(l,"0")}
function weekLabel(d){let s=new Date(d);s.setDate(d.getDate()-d.getDay());let e=new Date(s);e.setDate(s.getDate()+6);return `${s.toLocaleDateString(undefined,{month:"short",day:"numeric"})} → ${e.toLocaleDateString(undefined,{month:"short",day:"numeric"})}`}
function weekDay(p,n){let target=new Date(p.d);target.setDate(p.d.getDate()-p.d.getDay()+n);return target.getDate()===p.d.getDate()&&target.getMonth()===p.d.getMonth()?"NOW":target.toLocaleDateString(undefined,{weekday:"short",day:"numeric"})}
function unitKey(name,value){return `${name}|${value}|${new Date().toISOString().slice(0,10)}`}
function escape(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function isCurrent(name){
 const p=parts();
 return ["MILLISECOND","SECOND","MINUTE","HOUR","QUA-DAY","QUARTER DAY","NOON","NIGHT","DAY","WEEK"].includes(name);
}
function renderTime(){
 const p=parts(), root=$("#timeUnits");
 root.innerHTML=defs.map((g,gi)=>{
   let html=`<div class="unitGroup"><div class="groupTitle"><b>${g.group}</b><small>${g.desc}</small></div><div class="units">`;
   html+=g.items.map((it,i)=>{
     let value=it[2](p), key=unitKey(it[0],value), has=db.records.some(r=>r.unitKey===key);
     return `<button class="unitBtn ${isCurrent(it[0])?'current':''}" data-gi="${gi}" data-i="${i}">${has?'<i class="recDot"></i>':''}<div class="unitName">${it[0]}</div><div class="unitValue">${escape(value)}</div><div class="unitSub">${it[1]}</div></button>`
   }).join("");
   return html+"</div></div>"
 }).join("");
 $$(".unitBtn").forEach(b=>b.onclick=()=>openUnit(defs[+b.dataset.gi].items[+b.dataset.i]));
}
function updateLive(){
 const p=parts();
 $("#liveClock").textContent=`${pad(p.h)}:${pad(p.m)}:${pad(p.s)}.${pad(p.ms,3)}`;
 $("#liveDate").textContent=p.d.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
 $("#liveContext").textContent=`${p.h>=6&&p.h<18?"NOON":"NIGHT"}  →  ${p.h>=6&&p.h<18?"SPIRIT / SOUL / BODY":"REST / REFLECTION"}  →  ${weekLabel(p.d)}`;
 renderTime();
}
function fillLists(){
 $("#eventList").innerHTML=db.words.map(x=>`<option value="${escape(x)}">`).join("");
 $("#placeList").innerHTML=db.places.map(x=>`<option value="${escape(x)}">`).join("");
}
function openUnit(item){
 const p=parts(), value=item[2](p);
 selectedUnit={name:item[0],sub:item[1],value,date:p.d.toISOString().slice(0,10),unitKey:unitKey(item[0],value)};
 $("#modalKicker").textContent="TIME DATABASE";
 $("#modalTitle").textContent=item[0];
 $("#modalSubtitle").textContent=item[1];
 $("#unitSummary").innerHTML=`<div><b>CURRENT VALUE</b><span>${escape(value)}</span></div><div><b>DATE</b><span>${p.d.toLocaleDateString()}</span></div><div><b>TIME</b><span>${pad(p.h)}:${pad(p.m)}:${pad(p.s)}.${pad(p.ms,3)}</span></div>`;
 ["eventText","place","coords","description"].forEach(x=>$("#"+x).value="");
 $("#category").value="Love"; recordMode="Plan"; $$(".recordTab").forEach(x=>x.classList.toggle("active",x.dataset.record==="Plan"));
 $("#mediaPreview").innerHTML="";media=null;
 renderUnitRecords();
 $("#modal").classList.add("open");
}
function renderUnitRecords(){
 const rows=db.records.filter(r=>r.unitKey===selectedUnit?.unitKey);
 $("#recordsForUnit").innerHTML=rows.length?rows.map(r=>`<div class="miniRecord"><small>${escape(r.type)} · ${escape(r.category)} · ${new Date(r.timestamp).toLocaleString()}</small><p><b>${escape(r.text)}</b>${r.description?" — "+escape(r.description):""}</p><small>${escape([r.place,r.coords].filter(Boolean).join(" · "))}</small></div>`).join(""):"<div class='miniRecord'><small>NO RECORD YET</small><p>This time unit is ready to receive plan, record or evaluation data.</p></div>";
}
$$(".nav").forEach(b=>b.onclick=()=>{ $$(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".view").forEach(x=>x.classList.remove("active"));$("#"+b.dataset.view+"View").classList.add("active"); if(b.dataset.view==="fetch")renderFetch();if(b.dataset.view==="analyse")renderAnalysis()});
$$(".recordTab").forEach(b=>b.onclick=()=>{$$(".recordTab").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordMode=b.dataset.record});
$$(".lifeRail button").forEach(b=>b.onclick=()=>{const map={Faith:["Faith","Pray"],Hope:["Hope","Study"],Love:["Love","Eat"]};$("#category").value=map[b.dataset.life][0];$("#eventText").value=map[b.dataset.life][1]});
$("#closeModal").onclick=$("#cancel").onclick=()=>$("#modal").classList.remove("open");
$("#gps").onclick=()=>navigator.geolocation?.getCurrentPosition(pos=>{$("#coords").value=`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`},()=>alert("GPS permission was not granted."));
$("#camera").onclick=()=>$("#cameraInput").click();$("#video").onclick=()=>$("#videoInput").click();
$("#cameraInput").onchange=e=>showMedia(e.target.files[0]);$("#videoInput").onchange=e=>showMedia(e.target.files[0]);
function showMedia(f){if(!f)return;media={name:f.name,type:f.type,size:f.size};let u=URL.createObjectURL(f);$("#mediaPreview").innerHTML=f.type.startsWith("video")?`<video controls src="${u}"></video>`:`<img src="${u}" alt="capture">`}
$("#saveRecord").onclick=()=>{
 if(!selectedUnit)return;let text=$("#eventText").value.trim();if(!text)return alert("Write or select an activity.");
 if(!db.words.includes(text)){db.words.push(text)}
 let place=$("#place").value.trim();if(place&&!db.places.includes(place))db.places.push(place);
 db.records.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),timestamp:new Date().toISOString(),type:recordMode,unitKey:selectedUnit.unitKey,unit:selectedUnit.name,value:selectedUnit.value,date:selectedUnit.date,text,category:$("#category").value,place,coords:$("#coords").value.trim(),description:$("#description").value.trim(),media});
 save();fillLists();renderUnitRecords();renderTime();
 $("#eventText").value="";$("#description").value="";media=null;$("#mediaPreview").innerHTML="";
};
function renderFetch(){
 let q=$("#search").value.toLowerCase(),cat=$("#fetchCategory").value,type=$("#fetchType").value;
 let rows=db.records.filter(r=>(!q||JSON.stringify(r).toLowerCase().includes(q))&&(!cat||r.category===cat)&&(!type||r.type===type)).slice().reverse();
 $("#fetchResults").innerHTML=rows.length?rows.map(r=>`<article class="fetchCard"><b>${escape(r.type)} · ${escape(r.unit)}</b><h3>${escape(r.text)}</h3><p>${escape(r.description)}</p><small>${escape([r.category,r.place,r.coords,new Date(r.timestamp).toLocaleString()].filter(Boolean).join(" · "))}</small></article>`).join(""):"<div class='fetchCard'>No matching records.</div>";
}
["search","fetchCategory","fetchType"].forEach(x=>$("#"+x).addEventListener("input",renderFetch));
function renderAnalysis(){
 let all=db.records, plan=all.filter(x=>x.type==="Plan").length,rec=all.filter(x=>x.type==="Record").length,ev=all.filter(x=>x.type==="Evaluate").length;
 let cats=["Love","Hope","Faith"].map(c=>[c,all.filter(x=>x.category===c).length]);
 $("#stats").innerHTML=[["ALL",all.length],["PLAN",plan],["RECORD",rec],["EVALUATE",ev]].map(x=>`<div class="stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join("");
 $("#analysisCards").innerHTML=cats.map(x=>`<article class="analysisCard"><h3>${x[0]}</h3><p>${x[1]} records. ${x[0]==="Faith"?"Spirit anchors include prayer, Bible reading and praise around 03, 06, 09, 12, 15, 18 and 21.":x[0]==="Hope"?"Soul activities can follow spirit anchors: study, lead and relate.":"Body activities can follow soul time: eat, clothe and reside well."}</p></article>`).join("");
}
$("#jsonExport").onclick=()=>download("love-time-matter-space.json",JSON.stringify(db,null,2),"application/json");
$("#csvExport").onclick=()=>{let h=["timestamp","type","unit","value","text","category","place","coords","description"], rows=db.records.map(r=>h.map(k=>`"${String(r[k]??"").replaceAll('"','""')}"`).join(","));download("love-time-matter-space.csv",[h.join(","),...rows].join("\n"),"text/csv")};
function download(name,data,type){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("#clearData").onclick=()=>{if(confirm("Delete ALL locally stored LOVE records? This cannot be undone unless you exported them.")){localStorage.removeItem(KEY);location.reload()}};
$("#todayBtn").onclick=()=>{renderTime();scrollTo({top:0,behavior:"smooth"})};
fillLists();renderTime();updateLive();setInterval(updateLive,40);
