(() => {
  const PRICE_PER_PERSON = 450;
  const ORDER_EMAIL = 'remi@techbbq.no';

  const formatNok = (n) =>
    'kr ' + n.toLocaleString('nb-NO').replace(/,/g, ' ') + ',–';

  const form = document.getElementById('order-form');
  const peopleInput = document.getElementById('people');
  const addressInput = document.getElementById('address');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const sumPeople = document.getElementById('sum-people');
  const sumTotal = document.getElementById('sum-total');
  const hint = document.getElementById('form-hint');

  const today = new Date();
  const minDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  dateInput.min = minDate.toISOString().slice(0, 10);

  const clampPeople = () => {
    let n = parseInt(peopleInput.value, 10);
    if (!Number.isFinite(n) || n < 1) n = 1;
    if (n > 500) n = 500;
    peopleInput.value = String(n);
    return n;
  };

  const updateSummary = () => {
    const n = clampPeople();
    sumPeople.textContent = n;
    sumTotal.textContent = formatNok(n * PRICE_PER_PERSON);
  };

  peopleInput.addEventListener('input', updateSummary);
  peopleInput.addEventListener('blur', updateSummary);

  document.querySelectorAll('.stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.dataset.step, 10);
      peopleInput.value = String(clampPeople() + step);
      updateSummary();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = clampPeople();
    const address = addressInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!address || !date || !time) {
      hint.hidden = false;
      return;
    }
    hint.hidden = true;

    const total = formatNok(n * PRICE_PER_PERSON);
    const subject = `BBQ-bestilling — ${n} personer, ${date} ${time}`;
    const body = [
      'Hei Tech&BBQ,',
      '',
      'Jeg vil gjerne bestille BBQ-tallerken:',
      '',
      `• Antall personer: ${n}`,
      `• Adresse: ${address}`,
      `• Dato: ${date}`,
      `• Tid: ${time}`,
      `• Estimert totalpris: ${total}`,
      '',
      'Mvh,',
    ].join('\n');

    window.location.href =
      `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  updateSummary();
})();
