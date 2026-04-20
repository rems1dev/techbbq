(() => {
  const API = 'https://public-api.wordpress.com/wp/v2/sites/techbbq4.wordpress.com';
  const mount = document.getElementById('post');
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const renderError = (msg) => {
    mount.innerHTML = `
      <div class="post-error">
        <div class="mono eyebrow"><span class="ember">●</span> FEIL</div>
        <h1 class="post-error-title">${escape(msg)}</h1>
        <a class="mono post-back" href="./">← tilbake til tanker</a>
      </div>`;
  };

  if (!slug) {
    renderError('Manglende innlegg-slug.');
    return;
  }

  fetch(`${API}/posts?slug=${encodeURIComponent(slug)}&_embed=1`)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((posts) => {
      if (!posts.length) {
        renderError('Fant ikke innlegget.');
        return;
      }
      const p = posts[0];
      const title = p.title?.rendered || '';
      const content = p.content?.rendered || '';
      const date = fmtDate(p.date);
      const author = p._embedded?.author?.[0]?.name || '';

      document.title = `${title.replace(/<[^>]*>/g, '')} — Tech&BBQ`;

      mount.innerHTML = `
        <header class="post-header">
          <div class="mono eyebrow"><span class="ember">●</span> TANKER</div>
          <h1 class="post-title">${title}</h1>
          <div class="post-meta mono">
            <span>${escape(date)}</span>
            ${author ? `<span>·</span><span>${escape(author)}</span>` : ''}
          </div>
        </header>
        <div class="post-body">${content}</div>
        <footer class="post-footer">
          <a class="mono post-back" href="./">← tilbake til tanker</a>
        </footer>
      `;
    })
    .catch((err) => {
      console.error('Feil ved henting av innlegg:', err);
      renderError(`Kunne ikke laste innlegg (${err.message}).`);
    });
})();
