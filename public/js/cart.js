const Cart = {
  key: 'manset_cart',

  normalizeColor(color) {
    if (color == null || color === '') return null;
    const s = String(color).trim();
    return s || null;
  },

  normalizeProductId(id) {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  },

  normalizeItem(raw) {
    if (!raw || raw.product_id == null) return null;
    const productId = this.normalizeProductId(raw.product_id);
    if (productId == null) return null;
    return {
      product_id: productId,
      title: String(raw.title || ''),
      price: Number(raw.price) || 0,
      slug: String(raw.slug || ''),
      quantity: Math.max(1, parseInt(raw.quantity, 10) || 1),
      selected_color: this.normalizeColor(raw.selected_color),
    };
  },

  matchesItem(item, productId, selectedColor) {
    return (
      item.product_id === this.normalizeProductId(productId) &&
      item.selected_color === this.normalizeColor(selectedColor)
    );
  },

  get() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.key) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw.map((i) => this.normalizeItem(i)).filter(Boolean);
    } catch {
      return [];
    }
  },

  save(items) {
    const normalized = items.map((i) => this.normalizeItem(i)).filter(Boolean);
    localStorage.setItem(this.key, JSON.stringify(normalized));
    this.updateBadge();
    this.renderDrawer();
  },

  add(item) {
    const items = this.get();
    const normalized = this.normalizeItem({
      ...item,
      quantity: item.quantity || 1,
    });
    if (!normalized) return;

    const existing = items.find((i) => this.matchesItem(i, normalized.product_id, normalized.selected_color));
    if (existing) {
      existing.quantity += normalized.quantity;
    } else {
      items.push(normalized);
    }
    this.save(items);
    this.openDrawer();
  },

  remove(productId, selectedColor = null) {
    this.save(
      this.get().filter((i) => !this.matchesItem(i, productId, selectedColor))
    );
  },

  removeAt(index) {
    const items = this.get();
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    this.save(items);
  },

  updateQty(productId, selectedColor, quantity) {
    const items = this.get();
    const item = items.find((i) => this.matchesItem(i, productId, selectedColor));
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save(items);
    }
  },

  updateQtyAt(index, quantity) {
    const items = this.get();
    if (index < 0 || index >= items.length) return;
    items[index].quantity = Math.max(1, quantity);
    this.save(items);
  },

  total() {
    return this.get().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  count() {
    return this.get().reduce((sum, i) => sum + i.quantity, 0);
  },

  updateBadge() {
    const el = document.getElementById('cartCount');
    if (el) {
      el.textContent = this.count();
      el.classList.remove('cart-bounce');
      void el.offsetWidth; // trigger reflow to restart animation
      el.classList.add('cart-bounce');
    }
  },

  clear() {
    localStorage.removeItem(this.key);
    this.updateBadge();
    this.renderDrawer();
  },

  // ---- Sidebar Cart Drawer ----
  formatPrice(n) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
  },

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  openDrawer() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartDrawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartDrawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  },

  renderDrawer() {
    const body = document.getElementById('cartDrawerBody');
    const footer = document.getElementById('cartDrawerFooter');
    const totalEl = document.getElementById('cartDrawerTotal');
    if (!body) return;

    const items = this.get();

    if (!items.length) {
      body.innerHTML = `
        <div class="cart-drawer-empty">
          <div class="empty-icon">🛒</div>
          <p>Sepetiniz boş</p>
          <a href="/urunler" class="btn btn-primary btn-sm" style="margin-top:1rem">Alışverişe Başla</a>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    body.innerHTML = items.map((item, index) => `
      <div class="cart-drawer-item">
        <div class="cart-drawer-item-info">
          <div class="cart-drawer-item-title">${this.escapeHtml(item.title)}</div>
          ${item.selected_color ? `<div class="cart-drawer-item-meta">${this.escapeHtml(item.selected_color)}</div>` : ''}
          <div class="cart-drawer-item-price">${this.formatPrice(item.price * item.quantity)}</div>
          <div class="cart-drawer-qty">
            <button type="button" data-drawer-minus="${index}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-drawer-plus="${index}">+</button>
          </div>
        </div>
        <button type="button" class="cart-drawer-remove" data-drawer-remove="${index}" title="Kaldır">×</button>
      </div>
    `).join('');

    if (footer) footer.style.display = 'block';
    if (totalEl) totalEl.textContent = this.formatPrice(this.total());

    // Bind drawer events
    body.querySelectorAll('[data-drawer-minus]').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.drawerMinus);
        const item = this.get()[idx];
        if (!item) return;
        if (item.quantity > 1) {
          this.updateQtyAt(idx, item.quantity - 1);
        } else {
          this.removeAt(idx);
        }
      };
    });

    body.querySelectorAll('[data-drawer-plus]').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.drawerPlus);
        const item = this.get()[idx];
        if (!item) return;
        this.updateQtyAt(idx, item.quantity + 1);
      };
    });

    body.querySelectorAll('[data-drawer-remove]').forEach(btn => {
      btn.onclick = () => {
        this.removeAt(parseInt(btn.dataset.drawerRemove));
      };
    });
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.save(Cart.get());
  Cart.updateBadge();
  Cart.renderDrawer();

  // Drawer toggle
  document.getElementById('cartDrawerToggle')?.addEventListener('click', (e) => {
    e.preventDefault();
    Cart.openDrawer();
  });
  document.getElementById('cartDrawerClose')?.addEventListener('click', () => Cart.closeDrawer());
  document.getElementById('cartDrawerOverlay')?.addEventListener('click', () => Cart.closeDrawer());

  // Add to cart buttons (on product grids)
  document.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled) return;
      Cart.add({
        product_id: +btn.dataset.addCart,
        title: btn.dataset.title,
        price: +btn.dataset.price,
        slug: btn.dataset.slug,
        quantity: 1,
        selected_color: null,
      });
      const orig = btn.textContent;
      btn.textContent = '✓ Eklendi';
      setTimeout(() => {
        btn.textContent = orig;
      }, 1200);
    });
  });
});
