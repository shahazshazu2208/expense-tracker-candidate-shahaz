/* Ledger.ui — all DOM rendering (plain script) */
window.Ledger = window.Ledger || {};

(function () {
  const { formatCurrency, formatDate } = window.Ledger.utils;
  const { getPaletteColor } = window.Ledger.chart;

  const els = {
    statIncome: document.getElementById('statIncome'),
    statExpense: document.getElementById('statExpense'),
    statBalance: document.getElementById('statBalance'),

    tableWrap: document.getElementById('tableWrap'),
    tableBody: document.getElementById('txnTableBody'),
    txnCount: document.getElementById('txnCount'),
    emptyState: document.getElementById('emptyState'),

    filterCategory: document.getElementById('filterCategory'),
    categoryList: document.getElementById('categoryList'),

    monthIncome: document.getElementById('monthIncome'),
    monthExpense: document.getElementById('monthExpense'),
    monthNet: document.getElementById('monthNet'),

    chartLegend: document.getElementById('chartLegend'),
    chartEmpty: document.getElementById('chartEmpty'),

    toast: document.getElementById('toast'),
  };

  function renderStats({ income, expense }) {
    els.statIncome.textContent = formatCurrency(income);
    els.statExpense.textContent = formatCurrency(expense);
    els.statBalance.textContent = formatCurrency(income - expense);
  }

  function renderTable(transactions, { onEdit, onDelete }) {
    const hasRows = transactions.length > 0;
    els.emptyState.hidden = hasRows;
    els.tableWrap.hidden = !hasRows;
    els.txnCount.textContent = `${transactions.length} ${transactions.length === 1 ? 'entry' : 'entries'}`;

    els.tableBody.innerHTML = '';

    transactions.forEach((t) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td class="txn-date">${formatDate(t.date)}</td>
        <td class="txn-desc">
          <span class="txn-desc__title">${escapeHtml(t.description) || '<span style="color:var(--text-tertiary)">—</span>'}</span>
        </td>
        <td>${escapeHtml(t.category)}</td>
        <td><span class="type-badge type-badge--${t.type}">${t.type === 'income' ? 'Income' : 'Expense'}</span></td>
        <td class="txn-amount txn-amount--${t.type}">${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount)}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn btn--icon" data-action="edit" aria-label="Edit transaction">✎</button>
            <button type="button" class="btn btn--icon" data-action="delete" aria-label="Delete transaction">🗑</button>
          </div>
        </td>
      `;

        tr.querySelector('[data-action="edit"]').addEventListener('click', () => onEdit(t.id));
        tr.querySelector('[data-action="delete"]').addEventListener('click', () => onDelete(t.id));

        // Tap-to-expand on mobile (harmless no-op look on desktop, since the
        // is-expanded class only has an effect inside the mobile media query).
        tr.addEventListener('click', (e) => {
          if (e.target.closest('.row-actions')) return;
          tr.classList.toggle('is-expanded');
    });

    els.tableBody.appendChild(tr);
    });
  }

  function renderCategoryFilterOptions(categories, selected) {
    const current = els.filterCategory.value || selected || 'all';
    els.filterCategory.innerHTML = '<option value="all">All categories</option>';
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      els.filterCategory.appendChild(opt);
    });
    if (categories.includes(current) || current === 'all') {
      els.filterCategory.value = current;
    }
  }

  function renderCategoryDatalist(categories) {
    els.categoryList.innerHTML = '';
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      els.categoryList.appendChild(opt);
    });
  }

  function renderMonthSummary({ income, expense }) {
    els.monthIncome.textContent = formatCurrency(income);
    els.monthExpense.textContent = formatCurrency(expense);
    const net = income - expense;
    els.monthNet.textContent = `${net < 0 ? '-' : ''}${formatCurrency(Math.abs(net))}`;
    els.monthNet.style.color = net < 0 ? 'var(--expense)' : 'var(--income)';
  }

  function renderChartLegend(breakdown) {
    els.chartEmpty.hidden = breakdown.length > 0;
    els.chartLegend.innerHTML = '';

    breakdown.forEach((item, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="chart-legend__swatch" style="background:${getPaletteColor(i)}"></span>
        <span class="chart-legend__label">${escapeHtml(item.category)}</span>
        <span class="chart-legend__value">${formatCurrency(item.total)}</span>
      `;
      els.chartLegend.appendChild(li);
    });
  }

  function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    const field = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message || '';
    if (field) field.closest('.field')?.classList.toggle('has-error', Boolean(message));
  }

  function clearFieldErrors(fieldIds) {
    fieldIds.forEach((id) => showFieldError(id, ''));
  }

  let toastTimer = null;
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
    }, 2600);
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  window.Ledger.ui = {
    renderStats,
    renderTable,
    renderCategoryFilterOptions,
    renderCategoryDatalist,
    renderMonthSummary,
    renderChartLegend,
    showFieldError,
    clearFieldErrors,
    showToast,
  };
})();
