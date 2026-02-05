/* SVPROF: load automation news from /data/automation-news.json */
async function svprofRenderAutomationNews(opts){
  const el = document.getElementById(opts.containerId || 'newsList');
  if(!el) return;

  try{
    const r = await fetch(opts.url || '/data/automation-news.json', { cache: 'no-store' });
    if(!r.ok) throw new Error('HTTP ' + r.status);
    const items = await r.json();

    if(!Array.isArray(items) || items.length === 0){
      el.innerHTML = '<div class="news-loading">Пока нет новостей.</div>';
      return;
    }

    const limit = Number(opts.limit || 10);
    const safe = items.slice(0, limit);

    el.innerHTML = safe.map(x => {
      const date = (x.date || '').toString();
      const title = (x.title || '').toString();
      const url = (x.url || '').toString();
      const source = (x.source || '').toString();

      const sourceHtml = source ? ` <span style="opacity:.75;">· ${escapeHtml(source)}</span>` : '';
      return `
        <div class="news-item">
          <div class="news-date">${escapeHtml(date)}${sourceHtml}</div>
          <a class="news-link" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>
        </div>
      `;
    }).join('');
  }catch(e){
    el.innerHTML = '<div class="news-loading">Не удалось загрузить новости.</div>';
  }
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s){
  return s.replace(/"/g,'&quot;').replace(/</g,'').replace(/>/g,'');
}

document.addEventListener('DOMContentLoaded', () => {
  svprofRenderAutomationNews({ containerId: 'newsList', url: '/data/automation-news.json', limit: 10 });
});
