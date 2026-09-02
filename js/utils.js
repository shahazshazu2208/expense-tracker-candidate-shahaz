/* Ledger.utils — shared formatting helpers (plain script, attaches to window.Ledger) */
window.Ledger = window.Ledger || {};

(function () {
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  function formatCurrency(value) {
    return currencyFormatter.format(Number(value) || 0);
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function todayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  function currentMonthKey() {
    return todayISO().slice(0, 7);
  }

  function debounce(fn, wait) {
    wait = wait || 200;
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  window.Ledger.utils = { formatCurrency, formatDate, todayISO, currentMonthKey, debounce };
})();
