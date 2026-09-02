# Expense Tracker App

A simple, professional-feeling expense tracker built with plain HTML, CSS, and JavaScript — no framework, no build step, no bundler. Data is stored entirely in the browser's `localStorage`.

# LIVE LINK
https://expense-tracker-candidate-shahaz.vercel.app/


## Features

- Add, edit, and delete income or expense transactions (amount, category, date, description)
- Live-computed totals: income, expenses, and balance
- Filter transactions by type, category, and month
- Persists across page refreshes via `localStorage`
- Responsive layout — on mobile, filters collapse to a single row with "Clear filters" below, and each transaction row is tap-to-expand (shows date + amount collapsed, full details on tap) instead of one long scrolling list
- **Bonus:** monthly summary panel, category-wise expense doughnut chart (Chart.js), inline form validation with helpful error messages

## Running it

No install, build step, or local server required — just open `index.html` directly in a browser (double-click it, or drag it into a browser window). 

## Project structure

expense-tracker-candidate-shahaz/
├── index.html
├── css/
│ └── styles.css design tokens + all component styles
├── js/
│ ├── storage.js localStorage read/write
│ ├── state.js in-memory store + subscribe/notify
│ ├── transactions.js create/validate/save/delete transactions
│ ├── filters.js filtering + totals + category breakdown
│ ├── chart.js Chart.js doughnut chart wrapper
│ ├── ui.js all DOM rendering
│ ├── utils.js currency/date formatting helpers
│ └── app.js wires everything together (event listeners)
└── README.md

