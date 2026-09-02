# Ledger — Expense Tracker

A simple, professional-feeling expense tracker built with plain HTML, CSS, and JavaScript (ES modules) — no framework, no build step. Data is stored entirely in the browser's `localStorage`.

## Features

- Add, edit, and delete income or expense transactions (amount, category, date, description)
- Live-computed totals: income, expenses, and balance
- Filter transactions by type, category, and month
- Persists across page refreshes via `localStorage`
- Responsive layout — the transaction table becomes stacked cards on mobile
- **Bonus:** monthly summary panel, category-wise expense doughnut chart (Chart.js), inline form validation with helpful error messages

## Running it

No install, build step, or local server required — just open `index.html` directly in a browser (double-click it, or drag it into a browser window). The app uses plain `<script>` tags (no ES modules), so it works straight from the file system.

**Optional — local server**
If you prefer serving it (e.g. to match how it'll behave once deployed to GitHub Pages):
```bash
# from the project folder
npx serve .
# or
python3 -m http.server 8000
```
Then visit the printed local URL (e.g. `http://localhost:8000`).

## Project structure

```
expense-tracker-candidate-name/
├── index.html
├── css/
│   └── styles.css        design tokens + all component styles
├── js/
│   ├── storage.js         localStorage read/write
│   ├── state.js             in-memory store + subscribe/notify
│   ├── transactions.js  create/validate/save/delete transactions
│   ├── filters.js           filtering + totals + category breakdown
│   ├── chart.js              Chart.js doughnut chart wrapper
│   ├── ui.js                   all DOM rendering
│   ├── utils.js              currency/date formatting helpers
│   └── app.js               wires everything together (event listeners)
└── README.md
```

Each file is a plain script (no bundler, no ES modules) that attaches its
functions to a shared `window.Ledger` namespace object, so there's no global
variable pollution or load-order surprises — `index.html` loads them in
dependency order via individual `<script>` tags.

## Notes on behavior

- The **top stat strip** (income/expense/balance) always reflects *all* transactions — it's a dashboard total, not affected by the table filters below it, so it never looks like money "disappeared" just because you filtered the table.
- The **"This month" panel and category chart** default to the current calendar month, or to whichever month you've selected in the Month filter.
- Transactions are stored under the `localStorage` key `ledger.transactions.v1`. Clearing your browser's site data for this page will reset the app.

## Tech

- Vanilla JavaScript, plain `<script>` tags (no bundler, no ES modules)
- [Chart.js](https://www.chartjs.org/) via CDN, for the category breakdown chart
- Native OS system fonts (no external font request) — tabular monospace figures for all monetary amounts
- Currency: Indian Rupees (₹), formatted with the Indian numbering system (e.g. `₹1,23,456.70`)
