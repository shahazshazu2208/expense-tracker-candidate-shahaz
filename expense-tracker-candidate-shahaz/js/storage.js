/* Ledger.storage — localStorage persistence layer (plain script) */
window.Ledger = window.Ledger || {};

(function () {
  const STORAGE_KEY = 'ledger.transactions.v1';

  function loadTransactions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Could not read transactions from local storage:', err);
      return [];
    }
  }

  function saveTransactions(transactions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      return true;
    } catch (err) {
      console.error('Could not save transactions to local storage:', err);
      return false;
    }
  }

  window.Ledger.storage = { loadTransactions, saveTransactions };
})();
