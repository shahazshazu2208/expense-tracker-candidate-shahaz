/* Ledger.chart — Chart.js wrapper for the category breakdown doughnut (plain script) */
window.Ledger = window.Ledger || {};

(function () {
  const { formatCurrency } = window.Ledger.utils;

  const PALETTE = ['#22615C', '#B3483F', '#C99A3E', '#4E6E9E', '#8E5B9E', '#5B8C6E', '#A85C7C', '#6E7B8C'];

  let chartInstance = null;

  function getPaletteColor(index) {
    return PALETTE[index % PALETTE.length];
  }

  function renderCategoryChart(canvas, data) {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (!data.length) return null;

    if (typeof Chart === 'undefined') {
      // Chart.js failed to load from the CDN (offline, blocked, etc).
      // Fail quietly so the rest of the app keeps working.
      console.warn('Chart.js is not available — skipping category chart render.');
      return null;
    }

    chartInstance = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.category),
        datasets: [
          {
            data: data.map((d) => d.total),
            backgroundColor: data.map((_, i) => getPaletteColor(i)),
            borderWidth: 2,
            borderColor: '#FFFFFF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}`,
            },
          },
        },
      },
    });

    return chartInstance;
  }

  window.Ledger.chart = { getPaletteColor, renderCategoryChart };
})();
