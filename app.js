(()=>{const U={P:"♙",N:"♘",B:"♗",R:"♖",Q:"♕",K:"♔",p:"♟",n:"♞",b:"♝",r:"♜",q:"♛",k:"♚"},V={p:100,n:320,b:330,r:500,q:900,k:0};
const isW=c=>c&&c==c.toUpperCase();
const init=()=>({b:"rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR".split("").map(c=>c=="."?null:c),w:true,cs:{K:1,Q:1,k:1,q:1},ep:-1});
const D={n:[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],k:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],b:[[1,1],[1,-1],[-1,1],[-1,-1]],r:[[1,0],[-1,0],[0,1],[0,-1]]};D.q=[...D.b,...D.r];
function att(b,sq,byW){const r=sq>>3,f=sq&7;for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!=byW)continue;const pr=i>>3,pf=i&7,k=p.toLowerCase();
if(k=="p"){const d=byW?-1:1;if(pr+d==r&&Math.abs(pf-f)==1)return 1}else if(k=="n"||k=="k"){if(D[k].some(([a,c])=>pr+a==r&&pf+c==f))return 1}else{for(const[a,c]of D[k]){let y=pr+a,z=pf+c;while(y>=0&&y<8&&z>=0&&z<8){if(y==r&&z==f)return 1;if(b[y*8+z])break;y+=a;z+=c}}}}return 0}
const kingSq=(b,w)=>b.findIndex(p=>p==(w?"K":"k"));
function gen(s){const{b,w}=s,out=[];for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!=w)continue;const r=i>>3,f=i&7,k=p.toLowerCase();
if(k=="p"){const d=w?-1:1,st=w?6:1,pr=w?0:7;const add=(to,x={})=>{if(to>>3==pr)for(const q of"qrbn")out.push({f:i,t:to,pr:w?q.toUpperCase():q,...x});else out.push({f:i,t:to,...x})};
if(!b[i+d*8]){add(i+d*8);if(r==st&&!b[i+d*16])add(i+d*16,{dbl:1})}for(const c of[-1,1]){const nf=f+c;if(nf<0||nf>7)continue;const to=i+d*8+c;if(b[to]&&isW(b[to])!=w)add(to);else if(to==s.ep)add(to,{ep:1})}}
else if(k=="n"||k=="k"){for(const[a,c]of D[k]){const y=r+a,z=f+c;if(y<0||y>7||z<0||z>7)continue;const q=b[y*8+z];if(!q||isW(q)!=w)out.push({f:i,t:y*8+z})}
if(k=="k"){const R=w?7:0;if(i==R*8+4&&!att(b,i,!w)){if(s.cs[w?"K":"k"]&&!b[R*8+5]&&!b[R*8+6]&&b[R*8+7]&&!att(b,R*8+5,!w)&&!att(b,R*8+6,!w))out.push({f:i,t:R*8+6,cas:1});if(s.cs[w?"Q":"q"]&&!b[R*8+3]&&!b[R*8+2]&&!b[R*8+1]&&!att(b,R*8+3,!w)&&!att(b,R*8+2,!w))out.push({f:i,t:R*8+2,cas:-1})}}}
else for(const[a,c]of D[k]){let y=r+a,z=f+c;while(y>=0&&y<8&&z>=0&&z<8){const q=b[y*8+z];if(!q)out.push({f:i,t:y*8+z});else{if(isW(q)!=w)out.push({f:i,t:y*8+z});break}y+=a;z+=c}}}return out}
function make(s,m){const b=[...s.b],p=b[m.f];b[m.t]=m.pr||p;b[m.f]=null;if(m.ep)b[m.t+(s.w?8:-8)]=null;if(m.cas==1){b[m.t-1]=b[m.t+1];b[m.t+1]=null}if(m.cas==-1){b[m.t+1]=b[m.t-2];b[m.t-2]=null}
const cs={...s.cs};if(p=="K"){cs.K=cs.Q=0}if(p=="k"){cs.k=cs.q=0}for(const[q,k]of[[63,"K"],[56,"Q"],[7,"k"],[0,"q"]])if(m.f==q||m.t==q)cs[k]=0;return{b,w:!s.w,cs,ep:m.dbl?(m.f+m.t)/2:-1}}
const legal=s=>gen(s).filter(m=>{const n=make(s,m);return!att(n.b,kingSq(n.b,s.w),!s.w)});
const inChk=s=>att(s.b,kingSq(s.b,s.w),!s.w);
function ev(s){let v=0;for(let i=0;i<64;i++){const p=s.b[i];if(!p)continue;const k=p.toLowerCase(),r=i>>3,f=i&7,cen=3.5-Math.abs(f-3.5)+3.5-Math.abs(r-3.5);let x=V[k]+(k=="p"?(isW(p)?6-r:r-1)*8:k=="k"?0:cen*4);v+=isW(p)?x:-x}return v}
function srch(s,d,a,b){const ms=legal(s);if(!ms.length)return inChk(s)?(s.w?-99999-d:99999+d):0;if(!d)return ev(s);ms.sort((x,y)=>(s.b[y.t]?1:0)-(s.b[x.t]?1:0));
if(s.w){let v=-1e9;for(const m of ms){v=Math.max(v,srch(make(s,m),d-1,a,b));a=Math.max(a,v);if(a>=b)break}return v}let v=1e9;for(const m of ms){v=Math.min(v,srch(make(s,m),d-1,a,b));b=Math.min(b,v);if(a>=b)break}return v}
function best(s,d){const ms=legal(s);let bm=null,bv=s.w?-1e9:1e9;for(const m of shuffle(ms)){const v=srch(make(s,m),d-1,-1e9,1e9);if(s.w?v>bv:v<bv){bv=v;bm=m}}return bm}
let snaps=[],s=init(),sel=-1,hist=[],level=S.get("lv",2),over="";const nm=i=>"abcdefgh"[i&7]+(8-(i>>3));
app.innerHTML=`<div class="two" style="grid-template-columns:minmax(300px,520px) 1fr"><div id="bd" style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));width:100%;max-width:520px;direction:ltr;border-radius:12px;overflow:hidden;aspect-ratio:1"></div><div class="card col"><h3 id="st"></h3><label>${t("المستوى","Level")}<select id="lv"><option value="1">${t("مبتدئ","Easy")}</option><option value="2">${t("متوسط","Medium")}</option><option value="3">${t("صعب","Hard")}</option></select></label><button id="nw">${t("لعبة جديدة","New game")}</button><button id="un">${t("تراجع","Undo")}</button><div class="out small ltr" id="mv" style="max-height:200px;overflow:auto"></div><p class="small">${t("إنت الأبيض. فيه تبييت وترقية بيدق.","You are white. Castling and promotion included.")}</p></div></div>`;
$("#lv").value=level;$("#lv").onchange=()=>{level=+$("#lv").value;S.set("lv",level)};
function draw(){const L=legal(s),tg=new Set(sel>=0?L.filter(m=>m.f==sel).map(m=>m.t):[]);$("#bd").innerHTML=s.b.map((p,i)=>`<div data-i="${i}" style="aspect-ratio:1;min-width:0;overflow:hidden;display:grid;place-items:center;font-size:min(7vw,46px);cursor:pointer;background:${i==sel?"#f6e27a":((i>>3)+(i&7))%2?"#7a5a3c":"#e8d3ae"};position:relative;color:${p&&!isW(p)?"#111":"#fff"};text-shadow:${p&&isW(p)?"0 0 2px #000,0 0 2px #000,0 0 4px #000,1px 1px 0 #000,-1px -1px 0 #000":"0 0 2px #fff6"}">${p?U[p.toLowerCase()]:""}${tg.has(i)?`<i style="position:absolute;width:30%;height:30%;border-radius:50%;background:#2dbd6e99"></i>`:""}</div>`).join("");
$$("#bd div").forEach(d=>d.onclick=()=>click(+d.dataset.i));
const e=!L.length;over=e?(inChk(s)?(s.w?t("كش مات! الكمبيوتر كسب","Checkmate! Computer wins"):t("كش مات! كسبت 🎉","Checkmate! You win 🎉")):t("تعادل (stalemate)","Stalemate")):"";$("#st").textContent=over||(s.w?t("دورك","Your move")+(inChk(s)?" · "+t("كش!","Check!"):""):t("الكمبيوتر بيفكر...","Computer thinking..."));$("#mv").textContent=hist.join("  ")}
function click(i){if(!s.w||over)return;const L=legal(s),m=L.filter(z=>z.f==sel&&z.t==i);if(m.length){const mm=m.find(z=>!z.pr||z.pr=="Q")||m[0];hist.push(nm(mm.f)+nm(mm.t));snaps.push(s);s=make(s,mm);sel=-1;draw();setTimeout(cpu,60)}else{sel=s.b[i]&&isW(s.b[i])?i:-1;draw()}}
function cpu(){if(s.w||over)return;const m=best(s,level+1);if(m){hist.push(nm(m.f)+nm(m.t));s=make(s,m)}draw()}
$("#nw").onclick=()=>{s=init();hist=[];sel=-1;snaps=[];draw()};
$("#un").onclick=()=>{if(snaps.length&&s.w){s=snaps.pop();hist.length=Math.max(0,hist.length-2);sel=-1;draw()}};
draw()})();
