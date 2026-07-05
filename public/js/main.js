// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle?.addEventListener('click', () => {
  mainNav?.classList.toggle('open');
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mainNav?.classList.remove('open'));
});

// Header scroll effect
const siteHeader = document.getElementById('siteHeader');
if (siteHeader) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    siteHeader.classList.toggle('scrolled', scrollY > 20);
    lastScroll = scrollY;
  }, { passive: true });
}

// Live Search
const liveSearchInput = document.getElementById('liveSearchInput');
const searchDropdown = document.getElementById('searchDropdown');
let searchTimeout = null;

if (liveSearchInput && searchDropdown) {
  const formatPrice = (n) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

  liveSearchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = liveSearchInput.value.trim();

    if (query.length < 2) {
      searchDropdown.classList.remove('open');
      searchDropdown.innerHTML = '';
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        const products = await res.json();

        if (!products.length) {
          searchDropdown.innerHTML = '<div class="search-no-result">Sonuç bulunamadı</div>';
          searchDropdown.classList.add('open');
          return;
        }

        searchDropdown.innerHTML = products.slice(0, 6).map(p => {
          const price = p.sale_price || p.price;
          const imgHtml = p.image_path
            ? `<img src="${p.image_path}" alt="">`
            : `<div style="width:44px;height:44px;border-radius:6px;background:var(--bg-warm);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🥜</div>`;
          return `
            <a href="/urun/${p.slug}" class="search-result-item">
              ${imgHtml}
              <div class="sr-info">
                <div class="sr-title">${p.title}</div>
                <div class="sr-price">${formatPrice(price)} / kg</div>
              </div>
            </a>`;
        }).join('');

        if (products.length > 6) {
          searchDropdown.innerHTML += `
            <a href="/urunler?ara=${encodeURIComponent(query)}" class="search-result-item" style="justify-content:center; color:var(--primary); font-weight:600; font-size:0.85rem;">
              Tüm sonuçları gör (${products.length})
            </a>`;
        }

        searchDropdown.classList.add('open');
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#headerSearch')) {
      searchDropdown.classList.remove('open');
    }
  });

  // Enter key → navigate to products page
  liveSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = liveSearchInput.value.trim();
      if (query) {
        window.location.href = `/urunler?ara=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

  revealElements.forEach(el => observer.observe(el));
}
