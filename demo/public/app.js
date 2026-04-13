/* Demo: usa el bundle IIFE que expone QueryDemo.query en window. */

const average = (numbers) =>
  numbers.length === 0
    ? 0
    : numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

/** @type {Record<string, unknown[]>} */
const cache = {};

async function loadDataset(key) {
  if (cache[key]) {
    return cache[key];
  }
  const res = await fetch(`./data/${key}.json`);
  if (!res.ok) {
    throw new Error(`No se pudo cargar data/${key}.json (${res.status})`);
  }
  const data = await res.json();
  cache[key] = data;
  return data;
}

function getQuery() {
  if (typeof window.QueryDemo === "undefined" || !window.QueryDemo.query) {
    throw new Error(
      "Falta query-demo.js. En la raíz del repo ejecutá: npm install && npm run build:demo"
    );
  }
  return window.QueryDemo.query;
}

function columnsFromRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }
  const keys = rows.reduce((set, row) => {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      Object.keys(row).forEach((k) => set.add(k));
    }
    return set;
  }, new Set());
  return [...keys];
}

function renderTable(rows) {
  const cols = columnsFromRows(rows);
  if (cols.length === 0) {
    return '<p class="result-empty">Sin filas.</p>';
  }
  const thead = `<thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${cols
          .map((c) => `<td>${formatCell(row[c])}</td>`)
          .join("")}</tr>`
    )
    .join("")}</tbody>`;
  return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatCell(value) {
  if (value === null || value === undefined) {
    return '<span class="result-empty">—</span>';
  }
  if (typeof value === "object") {
    return `<pre class="json-fallback">${escapeHtml(JSON.stringify(value))}</pre>`;
  }
  return escapeHtml(String(value));
}

function isGroupedShape(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every((v) => Array.isArray(v));
}

function renderGrouped(grouped) {
  const entries = Object.entries(grouped).sort(([a], [b]) =>
    String(a).localeCompare(String(b))
  );
  const cards = entries
    .map(
      ([key, items]) =>
        `<article class="group-card"><h3>${escapeHtml(String(key))}</h3>${renderTable(
          items
        )}</article>`
    )
    .join("");
  return `<div class="group-cards">${cards}</div>`;
}

function renderResult(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '<p class="result-empty">Arreglo vacío.</p>';
    }
    if (value.every((x) => x && typeof x === "object" && !Array.isArray(x))) {
      return renderTable(value);
    }
  }
  if (isGroupedShape(value)) {
    return renderGrouped(value);
  }
  return `<pre class="json-fallback">${escapeHtml(JSON.stringify(value, null, 2))}</pre>`;
}

const examples = [
  {
    id: "users-chile",
    title: "Chile: nombre, ciudad, edad",
    blurb: "where + select",
    dataset: "users",
    pipelineText: `query(data)
  .where((u) => u.country === "Chile")
  .select(["name", "city", "age"])
  .execute()`,
    run: (data, query) =>
      query(data)
        .where((u) => u.country === "Chile")
        .select(["name", "city", "age"])
        .execute(),
  },
  {
    id: "users-age-order",
    title: "Mayores de 28, orden por edad",
    blurb: "where + orderBy + select",
    dataset: "users",
    pipelineText: `query(data)
  .where((u) => u.age > 28)
  .orderBy("age", "desc")
  .select(["name", "age", "city"])
  .execute()`,
    run: (data, query) =>
      query(data)
        .where((u) => u.age > 28)
        .orderBy("age", "desc")
        .select(["name", "age", "city"])
        .execute(),
  },
  {
    id: "tx-clp",
    title: "Transacciones CLP completadas",
    blurb: "where + orderBy + select",
    dataset: "transactions",
    pipelineText: `query(data)
  .where(
    (tx) =>
      tx.currency === "CLP" &&
      tx.status === "completed" &&
      tx.amount >= 50000
  )
  .orderBy("amount", "desc")
  .select(["id", "userId", "amount", "category", "status"])
  .execute()`,
    run: (data, query) =>
      query(data)
        .where(
          (tx) =>
            tx.currency === "CLP" &&
            tx.status === "completed" &&
            tx.amount >= 50000
        )
        .orderBy("amount", "desc")
        .select(["id", "userId", "amount", "category", "status"])
        .execute(),
  },
  {
    id: "users-group-city",
    title: "Agrupar por ciudad (Chile)",
    blurb: "where + groupBy",
    dataset: "users",
    pipelineText: `query(data)
  .where((u) => u.country === "Chile")
  .groupBy("city")
  .execute()`,
    run: (data, query) =>
      query(data).where((u) => u.country === "Chile").groupBy("city").execute(),
  },
  {
    id: "users-aggregate-city",
    title: "Resumen por ciudad",
    blurb: "where + groupBy + aggregate",
    dataset: "users",
    pipelineText: `query(data)
  .where((u) => u.country === "Chile")
  .groupBy("city")
  .aggregate({
    count: (items) => items.length,
    avgAge: (items) => average(items.map((x) => x.age)),
  })
  .execute()`,
    run: (data, query) =>
      query(data)
        .where((u) => u.country === "Chile")
        .groupBy("city")
        .aggregate({
          count: (items) => items.length,
          avgAge: (items) => average(items.map((x) => x.age)),
        })
        .execute(),
  },
  {
    id: "tx-aggregate-category",
    title: "Totales por categoría",
    blurb: "groupBy + aggregate",
    dataset: "transactions",
    pipelineText: `query(data)
  .where((tx) => tx.currency === "CLP" && tx.status === "completed")
  .groupBy("category")
  .aggregate({
    count: (items) => items.length,
    totalAmount: (items) =>
      items.reduce((sum, tx) => sum + tx.amount, 0),
  })
  .execute()`,
    run: (data, query) =>
      query(data)
        .where((tx) => tx.currency === "CLP" && tx.status === "completed")
        .groupBy("category")
        .aggregate({
          count: (items) => items.length,
          totalAmount: (items) => items.reduce((sum, tx) => sum + tx.amount, 0),
        })
        .execute(),
  },
];

function setError(message) {
  const el = document.getElementById("error");
  if (!message) {
    el.hidden = true;
    el.textContent = "";
    return;
  }
  el.hidden = false;
  el.textContent = message;
}

function buildExampleButtons() {
  const container = document.getElementById("example-buttons");
  container.innerHTML = examples
    .map(
      (ex) =>
        `<button type="button" class="example-btn" data-example="${ex.id}">
          <strong>${escapeHtml(ex.title)}</strong>
          <span>${escapeHtml(ex.blurb)} · ${escapeHtml(ex.dataset)}.json</span>
        </button>`
    )
    .join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-example]");
    if (!btn) {
      return;
    }
    const id = btn.getAttribute("data-example");
    const ex = examples.find((x) => x.id === id);
    if (ex) {
      void runExample(ex);
    }
  });
}

async function runExample(ex) {
  const pipelineView = document.getElementById("pipeline-view");
  const resultEl = document.getElementById("result");
  const datasetSelect = document.getElementById("dataset");
  setError(null);
  pipelineView.textContent = ex.pipelineText;
  resultEl.innerHTML = '<p class="result-empty">Ejecutando…</p>';

  try {
    datasetSelect.value = ex.dataset;
    updateDatasetMeta(await loadDataset(ex.dataset));
    const data = await loadDataset(ex.dataset);
    const query = getQuery();
    const out = ex.run(data, query);
    resultEl.innerHTML = renderResult(out);
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
    resultEl.innerHTML = "";
  }
}

function updateDatasetMeta(data) {
  const meta = document.getElementById("dataset-meta");
  meta.textContent = `${data.length} filas cargadas en memoria (solo lectura).`;
}

async function onDatasetChange() {
  const key = document.getElementById("dataset").value;
  try {
    const data = await loadDataset(key);
    updateDatasetMeta(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
  }
}

document.getElementById("dataset").addEventListener("change", () => {
  void onDatasetChange();
});

buildExampleButtons();

void (async () => {
  try {
    await onDatasetChange();
    const first = examples[0];
    document.getElementById("pipeline-view").textContent = first.pipelineText;
    setError(null);
    if (typeof window.QueryDemo !== "undefined" && window.QueryDemo.query) {
      const data = await loadDataset(first.dataset);
      const out = first.run(data, window.QueryDemo.query);
      document.getElementById("result").innerHTML = renderResult(out);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
    document.getElementById("result").innerHTML = "";
  }
})();
