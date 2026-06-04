document.addEventListener('DOMContentLoaded', () => {
  const items = Cart.get();
  if (!items.length) {
    window.location.href = '/sepet';
    return;
  }

  const formatPrice = (n) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

  // Render order summary
  const summaryArea = document.getElementById('checkoutItems');
  if (summaryArea) {
    summaryArea.innerHTML = items
      .map(item => {
        const gramaj = item.selected_color ? ` (${item.selected_color})` : '';
        return `<div class="checkout-summary-item">
          <span>${item.title}${gramaj} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>`;
      })
      .join('');
  }

  document.getElementById('checkoutTotal').textContent = formatPrice(Cart.total());

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const payment = f.payment_method?.value;
    if (!payment) return alert('Ödeme yöntemi seçin');

    const detailedNotes = (f.notes.value ? f.notes.value + '\n\n' : '') +
      '📦 [MÜŞTERİ SEPET DETAYI (GRAMAJ & FİYAT)]:\n' +
      items.map((i, idx) => `• ${idx + 1}. ${i.title} (${i.selected_color || '1 kg'}) x ${i.quantity} - Adet Fiyatı: ${formatPrice(i.price)} - Toplam: ${formatPrice(i.price * i.quantity)}`).join('\n') +
      `\n💵 Müşteriye Gösterilen Genel Toplam: ${formatPrice(Cart.total())}`;

    const body = {
      customer: {
        name: f.name.value,
        phone: f.phone.value,
        email: f.email.value,
        address: f.address.value,
        city: f.city.value,
        district: f.district.value,
      },
      items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      payment_method: payment,
      notes: detailedNotes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sipariş oluşturulamadı');

      Cart.clear();
      f.style.display = 'none';
      document.getElementById('checkoutSummaryArea').style.display = 'none';

      // Advance Stepper
      const stepInfo = document.getElementById('stepInfo');
      const stepComplete = document.getElementById('stepComplete');
      if (stepInfo) {
        stepInfo.classList.remove('active');
        stepInfo.classList.add('completed');
        stepInfo.querySelector('.step-badge').textContent = '✓';
      }
      if (stepComplete) {
        stepComplete.classList.add('active');
      }

      document.getElementById('orderSuccess').style.display = 'block';
      document.getElementById('orderNumber').textContent = data.order_number;
    } catch (err) {
      alert(err.message);
    }
  });
});
