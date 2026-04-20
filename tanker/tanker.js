(() => {
  const API = 'https://public-api.wordpress.com/wp/v2/sites/techbbq4.wordpress.com';
  const list = document.getElementById('thoughts-list');
  if (!list) return;

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || '').trim();
  };

  const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const renderError = (msg) => {
    list.innerHTML = `<div class="thoughts-error mono"><span class="ember">●</span> ${escape(msg)}</div>`;
  };

  const renderPosts = (posts) => {
    if (!posts.length) {
      list.innerHTML = `<div class="thoughts-empty mono">Ingen tanker publisert enda.</div>`;
      return;
    }
    list.innerHTML = posts.map((p) => {
      const title = stripHtml(p.title?.rendered || '');
      const excerpt = stripHtml(p.excerpt?.rendered || '').slice(0, 220);
      const date = fmtDate(p.date);
      return `
        <a class="thought" href="post.html?slug=${encodeURIComponent(p.slug)}">
          <div class="thought-meta mono">
            <span>${escape(date)}</span>
          </div>
          <h2 class="thought-title">${escape(title)}</h2>
          ${excerpt ? `<p class="thought-excerpt">${escape(excerpt)}${excerpt.length >= 220 ? '…' : ''}</p>` : ''}
          <div class="thought-more mono"><span class="ember">→</span> LES MER</div>
        </a>
      `;
    }).join('');
  };

  fetch(`${API}/posts?per_page=50&_embed=1`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(renderPosts)
    .catch((err) => {
      console.error('Feil ved henting av innlegg:', err);
      renderError(`Kunne ikke laste innlegg (${err.message}).`);
    });
})();
