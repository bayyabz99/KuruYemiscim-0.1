function formatPrice(n) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function updateKargoProgress() {
  const container = document.getElementById('kargoProgressContainer');
  const msgEl = document.getElementById('kargoProgressMessage');
  const percentEl = document.getElementById('kargoProgressPercent');
  const barFill = document.getElementById('kargoProgressBarFill');
  if (!container || !msgEl || !percentEl || !barFill) return;

  const threshold = parseFloat(container.dataset.threshold) || 500;
  const total = Cart.total();

  if (total <= 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  const percent = Math.min(100, Math.round((total / threshold) * 100));
  barFill.style.width = percent + '%';
  percentEl.textContent = percent + '%';

  if (total >= threshold) {
    msgEl.innerHTML = '🎉 Tebrikler! Siparişinizde <strong>kargo ücretsiz</strong>!';
    barFill.style.background = 'var(--primary)';
  } else {
    const diff = threshold - total;
    const diffFormatted = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(diff);
    msgEl.innerHTML = `Ücretsiz kargo avantajı için <strong>${diffFormatted}</strong> daha ekleyin!`;
    barFill.style.background = '';
  }
}

function renderCart() {
  const items = Cart.get();
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');

  if (!items.length) {
    container.innerHTML =
      '<div class="empty-state"><p style="font-size:3.5rem; margin-bottom:1rem; animation: logoFloat 4s ease-in-out infinite;">🛒</p><p style="font-weight:600;">Sepetiniz henüz boş.</p><a href="/urunler" class="btn btn-primary" style="margin-top:1.5rem">Alışverişe Başla</a></div>';
    summary.style.display = 'none';
    const progressContainer = document.getElementById('kargoProgressContainer');
    if (progressContainer) progressContainer.style.display = 'none';
    return;
  }
  updateKargoProgress();

  container.innerHTML = items
    .map(
      (item, index) => `
    <div class="cart-item" data-cart-index="${index}">
      <div class="cart-item-info">
        <strong><a href="/urun/${escapeHtml(item.slug)}">${escapeHtml(item.title)}</a></strong>
        ${
          item.selected_color
            ? `<p class="cart-item-meta">Gramaj: <strong>${escapeHtml(item.selected_color)}</strong></p>`
            : ''
        }
        <p class="cart-item-meta">${formatPrice(item.price)} × ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <div class="cart-qty-control" aria-label="Adet">
          <button type="button" class="btn-qty btn-qty-minus" data-cart-index="${index}" aria-label="Azalt">−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button type="button" class="btn-qty btn-qty-plus" data-cart-index="${index}" aria-label="Artır">+</button>
        </div>
        <button type="button" class="btn-danger btn-remove" data-cart-index="${index}">Kaldır</button>
      </div>
    </div>`
    )
    .join('');

  document.getElementById('cartTotal').textContent = formatPrice(Cart.total());
  summary.style.display = 'block';

  container.querySelectorAll('.btn-remove').forEach((btn) => {
    btn.onclick = () => {
      const index = parseInt(btn.dataset.cartIndex, 10);
      Cart.removeAt(index);
      renderCart();
    };
  });

  container.querySelectorAll('.btn-qty-minus').forEach((btn) => {
    btn.onclick = () => {
      const index = parseInt(btn.dataset.cartIndex, 10);
      const items = Cart.get();
      const item = items[index];
      if (!item) return;
      if (item.quantity > 1) {
        Cart.updateQtyAt(index, item.quantity - 1);
      } else {
        Cart.removeAt(index);
      }
      renderCart();
    };
  });

  container.querySelectorAll('.btn-qty-plus').forEach((btn) => {
    btn.onclick = () => {
      const index = parseInt(btn.dataset.cartIndex, 10);
      const item = Cart.get()[index];
      if (!item) return;
      Cart.updateQtyAt(index, item.quantity + 1);
      renderCart();
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Cart.save(Cart.get());
  renderCart();

  document.getElementById('btnClearCart')?.addEventListener('click', () => {
    if (!Cart.get().length) return;
    if (confirm('Sepetteki tüm ürünler kaldırılacak. Emin misiniz?')) {
      Cart.clear();
      renderCart();
    }
  });

  const btnCheckout = document.getElementById('btnWhatsappCheckout');
  if (btnCheckout) {
    btnCheckout.onclick = () => {
      const items = Cart.get();
      if (!items.length) return;

      let msg = 'Merhaba, yeni bir sipariş vermek istiyorum:\n\n';
      msg += '📦 *SİPARİŞ LİSTESİ:*\n';
      msg += '───────────────────────\n';

      items.forEach((item, idx) => {
        const gramajText = item.selected_color ? ` [${item.selected_color}]` : '';
        msg += `*${idx + 1}.* ${item.title}${gramajText}\n`;
        msg += `   Adet: ${item.quantity} × ${formatPrice(item.price)}\n`;
        msg += `   Tutar: *${formatPrice(item.price * item.quantity)}*\n\n`;
      });

      msg += '───────────────────────\n';
      msg += `💵 *GENEL TOPLAM: ${formatPrice(Cart.total())}*\n\n`;
      msg += 'Bu ürünleri sipariş etmek istiyorum. Yardımcı olabilir misiniz?';

      let phone = btnCheckout.dataset.phone || '';
      phone = phone.replace(/\D/g, '');

      if (!phone) {
        alert('Satıcının WhatsApp iletişim numarası sistemde tanımlanmamış!');
        return;
      }

      const encodedText = encodeURIComponent(msg);
      window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    };
  }
});
