/* Ledger app entry point — wires state, UI, and DOM events together (plain script) */
(function () {
  const { subscribe, getTransactions, getCategories } = window.Ledger.state;
  const { saveTransactionFromForm, validateTransactionInput, removeTransaction } = window.Ledger.transactions;
  const { applyFilters, computeTotals, computeCategoryBreakdown, filterByMonth } = window.Ledger.filters;
  const { renderCategoryChart } = window.Ledger.chart;
  const { todayISO, currentMonthKey } = window.Ledger.utils;
  const {
    renderStats,
    renderTable,
    renderCategoryFilterOptions,
    renderCategoryDatalist,
    renderMonthSummary,
    renderChartLegend,
    showFieldError,
    clearFieldErrors,
    showToast,
  } = window.Ledger.ui;

  // ---- DOM references ----
  const openAddTxnBtn = document.getElementById('openAddTxn');
  const emptyStateAddBtn = document.getElementById('emptyStateAdd');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelFormBtn = document.getElementById('cancelForm');
  const modalTitle = document.getElementById('modalTitle');
  const txnForm = document.getElementById('txnForm');

  const deleteOverlay = document.getElementById('deleteOverlay');
  const cancelDeleteBtn = document.getElementById('cancelDelete');
  const confirmDeleteBtn = document.getElementById('confirmDelete');

  const filterType = document.getElementById('filterType');
  const filterCategory = document.getElementById('filterCategory');
  const filterMonth = document.getElementById('filterMonth');
  const clearFiltersBtn = document.getElementById('clearFilters');

  const categoryChartCanvas = document.getElementById('categoryChart');

  const FIELD_IDS = ['amount', 'category', 'date', 'description'];

  let filterState = { type: 'all', category: 'all', month: '' };
  let pendingDeleteId = null;

  // ---- Render ----
  function render() {
    try {
      const all = getTransactions();
      const categories = getCategories();

      renderCategoryFilterOptions(categories, filterState.category);
      renderCategoryDatalist(categories);

      const filtered = applyFilters(all, filterState);
      renderTable(filtered, { onEdit: openEditModal, onDelete: openDeleteConfirm });

      renderStats(computeTotals(all));

      const effectiveMonth = filterState.month || currentMonthKey();
      const monthTxns = filterByMonth(all, effectiveMonth);
      renderMonthSummary(computeTotals(monthTxns));

      const breakdown = computeCategoryBreakdown(monthTxns);
      categoryChartCanvas.hidden = breakdown.length === 0;
      renderCategoryChart(categoryChartCanvas, breakdown);
      renderChartLegend(breakdown);
    } catch (err) {
      // Never let a rendering error take down button/event wiring.
      console.error('Render failed:', err);
    }
  }

  // ---- Filters ----
  filterType.addEventListener('change', () => {
    filterState.type = filterType.value;
    render();
  });

  filterCategory.addEventListener('change', () => {
    filterState.category = filterCategory.value;
    render();
  });

  filterMonth.addEventListener('change', () => {
    filterState.month = filterMonth.value;
    render();
  });

  clearFiltersBtn.addEventListener('click', () => {
    filterState = { type: 'all', category: 'all', month: '' };
    filterType.value = 'all';
    filterCategory.value = 'all';
    filterMonth.value = '';
    render();
  });

  // ---- Add / Edit modal ----
  function openAddModal() {
    txnForm.reset();
    document.getElementById('txnId').value = '';
    document.getElementById('typeIncome').checked = true;
    document.getElementById('date').value = todayISO();
    modalTitle.textContent = 'Add transaction';
    clearFieldErrors(FIELD_IDS);
    openModal(modalOverlay);
    document.getElementById('amount').focus();
  }

  function openEditModal(id) {
    const txn = getTransactions().find((t) => t.id === id);
    if (!txn) return;

    document.getElementById('txnId').value = txn.id;
    document.getElementById(txn.type === 'income' ? 'typeIncome' : 'typeExpense').checked = true;
    document.getElementById('amount').value = txn.amount;
    document.getElementById('category').value = txn.category;
    document.getElementById('date').value = txn.date;
    document.getElementById('description').value = txn.description || '';

    modalTitle.textContent = 'Edit transaction';
    clearFieldErrors(FIELD_IDS);
    openModal(modalOverlay);
    document.getElementById('amount').focus();
  }

  openAddTxnBtn.addEventListener('click', openAddModal);
  emptyStateAddBtn.addEventListener('click', openAddModal);
  closeModalBtn.addEventListener('click', () => closeModal(modalOverlay));
  cancelFormBtn.addEventListener('click', () => closeModal(modalOverlay));

  txnForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = {
      id: document.getElementById('txnId').value || null,
      type: document.querySelector('input[name="type"]:checked').value,
      amount: document.getElementById('amount').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value,
      description: document.getElementById('description').value,
    };

    const errors = validateTransactionInput(values);
    clearFieldErrors(FIELD_IDS);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => showFieldError(field, message));
      return;
    }

    const isEdit = Boolean(values.id);
    saveTransactionFromForm(values);
    closeModal(modalOverlay);
    showToast(isEdit ? 'Transaction updated' : 'Transaction added');
  });

  // ---- Delete confirmation ----
  function openDeleteConfirm(id) {
    pendingDeleteId = id;
    openModal(deleteOverlay);
  }

  cancelDeleteBtn.addEventListener('click', () => {
    pendingDeleteId = null;
    closeModal(deleteOverlay);
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (pendingDeleteId) {
      removeTransaction(pendingDeleteId);
      showToast('Transaction deleted');
    }
    pendingDeleteId = null;
    closeModal(deleteOverlay);
  });

  // ---- Modal helpers ----
  function openModal(overlay) {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  [modalOverlay, deleteOverlay].forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modalOverlay.hidden) closeModal(modalOverlay);
      if (!deleteOverlay.hidden) closeModal(deleteOverlay);
    }
  });

  // ---- Initial render ----
  // All buttons/listeners above are wired up first, so even if this first
  // render fails (e.g. the Chart.js CDN didn't load), the app stays interactive.
  subscribe(render);
  render();
})();
