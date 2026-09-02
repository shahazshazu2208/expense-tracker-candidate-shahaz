/* Ledger.state — central in-memory store with subscribe/notify (plain script) */
window.Ledger = window.Ledger || {};

(function () {
  const { loadTransactions, saveTransactions } = window.Ledger.storage;

  let transactions = loadTransactions();
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => fn(transactions));
  }

  function persist() {
    saveTransactions(transactions);
    notify();
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function getTransactions() {
    return transactions;
  }

  function addTransaction(txn) {
    transactions = [txn, ...transactions];
    persist();
  }

  function updateTransaction(id, updates) {
    transactions = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    persist();
  }

  function deleteTransaction(id) {
    transactions = transactions.filter((t) => t.id !== id);
    persist();
  }

  function getCategories() {
    const set = new Set(transactions.map((t) => t.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  window.Ledger.state = {
    subscribe,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCategories,
  };
})();
