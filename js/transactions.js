/* Ledger.transactions — creation, validation, CRUD orchestration (plain script) */
window.Ledger = window.Ledger || {};

(function () {
  const { addTransaction, updateTransaction, deleteTransaction } = window.Ledger.state;

  function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function validateTransactionInput({ amount, category, date, description }) {
    const errors = {};

    if (amount === '' || amount === null || amount === undefined) {
      errors.amount = 'Amount is required.';
    } else {
      const numAmount = Number(amount);
      if (Number.isNaN(numAmount) || numAmount <= 0) {
        errors.amount = 'Enter an amount greater than 0.';
      } else if (numAmount > 100000000) {
        errors.amount = 'That amount looks too large.';
      }
    }

    if (!category || !category.trim()) {
      errors.category = 'Category is required.';
    } else if (category.trim().length > 40) {
      errors.category = 'Keep category under 40 characters.';
    }

    if (!date) {
      errors.date = 'Date is required.';
    } else {
      const parsed = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (Number.isNaN(parsed.getTime())) {
        errors.date = 'Enter a valid date.';
      } else if (parsed > today) {
        errors.date = "Date can't be in the future.";
      }
    }

    if (description && description.length > 140) {
      errors.description = 'Keep description under 140 characters.';
    }

    return errors;
  }

  function saveTransactionFromForm({ id, type, amount, category, date, description }) {
    const payload = {
      type,
      amount: Math.round(Number(amount) * 100) / 100,
      category: category.trim(),
      date,
      description: (description || '').trim(),
    };

    if (id) {
      updateTransaction(id, payload);
    } else {
      addTransaction({
        id: createId(),
        createdAt: Date.now(),
        ...payload,
      });
    }
  }

  function removeTransaction(id) {
    deleteTransaction(id);
  }

  window.Ledger.transactions = {
    createId,
    validateTransactionInput,
    saveTransactionFromForm,
    removeTransaction,
  };
})();
