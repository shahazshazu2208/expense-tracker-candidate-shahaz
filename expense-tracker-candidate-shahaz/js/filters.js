/* Ledger.filters — filtering and aggregation logic (plain script, pure functions) */
window.Ledger = window.Ledger || {};

(function () {
  function applyFilters(transactions, filters) {
    const { type = 'all', category = 'all', month = '' } = filters || {};
    return transactions
      .filter((t) => {
        if (type !== 'all' && t.type !== type) return false;
        if (category !== 'all' && t.category !== category) return false;
        if (month && t.date.slice(0, 7) !== month) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }

  function computeTotals(transactions) {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }

  function computeCategoryBreakdown(transactions) {
    const totalsByCategory = new Map();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totalsByCategory.set(t.category, (totalsByCategory.get(t.category) || 0) + t.amount);
      });

    return Array.from(totalsByCategory.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);
  }

  function filterByMonth(transactions, month) {
    if (!month) return transactions;
    return transactions.filter((t) => t.date.slice(0, 7) === month);
  }

  window.Ledger.filters = { applyFilters, computeTotals, computeCategoryBreakdown, filterByMonth };
})();
