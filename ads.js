/* ================= ads (Amazon アソシエイト) =================
   広告はこのファイルだけで管理する。index.html（タイトル画面・リザルト画面）と manual.html（先頭）の両方に表示される。
   広告を増やすときは ADS に1行追加するだけ。
   kind : 'event' = 期間限定（「期間限定」タグ付きで先頭に並ぶ） / 'item' = 商品
   title: 表示名、note: 補足（省略可）、url: アソシエイトのリンク
   img  : 商品画像のURL（省略可＝文字だけ）。Amazonの画像URL（https://m.media-amazon.com/images/I/～.jpg）をそのまま書く
   until: 'YYYY-MM-DD' — この日を過ぎると自動で非表示（省略可＝常に表示） */
'use strict';
const ADS = [
  {kind:'item', title:'キョウショウエッグ レーシングカートRC マリオ TV021', url:'https://link.amazon/B0eHa43El', img:'https://m.media-amazon.com/images/I/61kbOPmhiWL._AC_SL1500_.jpg'},
  {kind:'item', title:'Holy Stone ドローン 100g未満', note:'子供向け・小型・バッテリー3個付属', url:'https://link.amazon/B0iZxqDFV', img:'https://m.media-amazon.com/images/I/712pCjPl5RL._AC_SL1500_.jpg'},
];
const AD_NOTE = 'Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。';

function activeAds(){
  const now=Date.now();
  return ADS.filter(a=>a.url && (!a.until || now<=new Date(a.until+'T23:59:59').getTime()))
            .sort((a,b)=>(b.kind==='event')-(a.kind==='event'));
}
// boxes: the <aside class="ads"> elements to fill (each page brings its own .ads/.ad styles)
function renderAds(boxes){
  const list=activeAds();
  for(const box of boxes){
    if(!box) continue;
    box.innerHTML=''; box.hidden=!list.length; if(!list.length) continue;
    const head=document.createElement('p'); head.className='adhead'; head.innerHTML='<span class="pr">PR</span>AMAZON';
    const ul=document.createElement('div'); ul.className='adlist';
    for(const a of list){
      // no "noreferrer": Amazon uses the referrer to check the link comes from a registered site
      const el=document.createElement('a'); el.className='ad'; el.href=a.url; el.target='_blank'; el.rel='sponsored noopener';
      const tx=document.createElement('span'); tx.className='tx';
      // with a thumbnail, column 1 holds the image and the 期間限定 tag moves above the title
      if(a.img){
        const im=document.createElement('img'); im.className='thumb'; im.src=a.img; im.alt=''; im.loading='lazy'; im.width=56; im.height=56;
        im.addEventListener('error',()=>{ im.remove(); tx.classList.add('wide'); });
        el.append(im);
      }
      if(a.kind==='event'){ const tg=document.createElement('span'); tg.className='tag'; tg.textContent='期間限定'; (a.img?tx:el).append(tg); }
      const t=document.createElement('span'); t.className='t'; t.textContent=a.title; tx.append(t);
      if(a.note){ const s=document.createElement('span'); s.className='s'; s.textContent=a.note; tx.append(s); }
      if(a.kind!=='event' && !a.img) tx.classList.add('wide');
      const ar=document.createElement('span'); ar.className='arr'; ar.setAttribute('aria-hidden','true');
      ar.innerHTML='<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h6v6M10 2 2.5 9.5"/></svg>';
      el.append(tx,ar); el.setAttribute('aria-label',a.title+'（Amazon・新しいタブで開く）');
      el.addEventListener('click',()=>el.blur());
      ul.append(el);
    }
    const note=document.createElement('p'); note.className='adnote'; note.textContent=AD_NOTE;
    box.append(head,ul,note);
  }
}
