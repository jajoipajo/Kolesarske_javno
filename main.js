function getStoredTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.classList.toggle("theme-toggle--toggled", theme === "dark");
    btn.setAttribute("aria-pressed", theme === "dark");
    btn.setAttribute("aria-label", theme === "dark" ? "Preklopi na svetlo temo" : "Preklopi na temno temo");
    btn.setAttribute("title", theme === "dark" ? "Preklopi na svetlo temo" : "Preklopi na temno temo");
  }
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    setTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildToc() {
  const container = document.getElementById("content");
  const toc = document.getElementById("tocList");
  if (!container || !toc) return;

  toc.innerHTML = "";
  const headings = Array.from(container.querySelectorAll("h1, h2, h3"));
  headings.forEach((heading) => {
    if (!heading.id) {
      const base = slugify(heading.textContent || "");
      let id = base || "section";
      let i = 1;
      while (document.getElementById(id)) {
        id = `${base}-${i}`;
        i += 1;
      }
      heading.id = id;
    }

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent || "";
    link.dataset.level = heading.tagName.replace("H", "");
    toc.appendChild(link);
  });

  if (headings.length === 0) {
    toc.innerHTML = "<span class=\"toc-empty\">Ni naslovov</span>";
  }
}

function initTocToggle() {
  const btn = document.getElementById("tocToggle");
  const toc = document.getElementById("tocList");
  if (!btn || !toc) return;

  btn.addEventListener("click", () => {
    const isOpen = toc.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen);
    btn.textContent = isOpen ? "Skrij" : "Prikaži";
    toc.setAttribute("aria-hidden", (!isOpen).toString());
  });
}

function buildMapCard() {
  const card = document.createElement("section");
  card.className = "card map-card";
  card.innerHTML = `
    <div class="map-header">
      <div>
        <h2>Interaktivna karta</h2>
        <p class="map-subtitle">Preklopi prikaz med različnimi indeksi.</p>
      </div>
      <div class="map-controls">
        <label for="methodSelect">Metoda</label>
        <select id="methodSelect"></select>
        <label for="indexSelect">Indeks</label>
        <select id="indexSelect"></select>
      </div>
    </div>
    <div id="map" class="map" role="img" aria-label="Leaflet karta z merilnimi točkami"></div>
    <div id="mapLegend" class="map-legend" aria-live="polite"></div>
  `;
  return card;
}

function mountMapCard() {
  const marker = document.getElementById("mapMount");
  if (!marker) return false;
  const card = buildMapCard();
  marker.replaceWith(card);
  return true;
}

async function loadReadme() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("./README.md", { cache: "no-store" });
    if (!res.ok) throw new Error(`README.md ni dosegljiv (status ${res.status})`);

    const markdown = await res.text();

    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: true
    });

    container.innerHTML = marked.parse(markdown);
    const mounted = mountMapCard();
    buildToc();
    if (mounted) {
      initMap();
    }
  } catch (err) {
    container.innerHTML = `
      <h1>Napaka</h1>
      <p>${err.message}</p>
      <p>Preveri, da je <code>README.md</code> v isti mapi kot <code>index.html</code>.</p>
    `;
    console.error(err);
  }
}

function initToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

const INDEX_OPTIONS = [
  { key: "dci_acc_raw", label: "DCI (acc)" },
  { key: "dci_lin_recon_raw", label: "DCI (lin)" },
  { key: "bri_speedcorr", label: "BRI" },
  { key: "fii_max", label: "FII max" },
  { key: "rms_lin_z_mps2", label: "RMS lin z" },
  { key: "std_lin_z_mps2", label: "STD lin z" },
  { key: "p95_abs_lin_z_mps2", label: "P95 |lin z|" },
  { key: "mean_abs_lin_z_mps2", label: "Mean |lin z|" }
];

const METHOD_OPTIONS = [
  { key: "hex", label: "Hex 10 m", file: "./data/avg_hex.geojson" },
  { key: "snap", label: "Snap na mrežo", file: "./data/avg_snap.geojson" }
];

const JENKS_COLORS = ["#1b7837", "#5aae61", "#a6dba0", "#f4a582", "#b2182b"];
const N_CLASSES = 5;

function getValues(features, key) {
  return features
    .map((f) => Number(f.properties?.[key]))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
}

function jenksBreaks(data, nClasses) {
  if (!data.length) return [];
  if (data.length <= nClasses) {
    const min = data[0];
    const max = data[data.length - 1];
    const step = (max - min) / nClasses || 1;
    const breaks = [min];
    for (let i = 1; i <= nClasses; i += 1) {
      breaks.push(min + step * i);
    }
    return breaks;
  }

  const lower = Array.from({ length: data.length + 1 }, () =>
    Array.from({ length: nClasses + 1 }, () => 0)
  );
  const variance = Array.from({ length: data.length + 1 }, () =>
    Array.from({ length: nClasses + 1 }, () => 0)
  );

  for (let i = 1; i <= nClasses; i += 1) {
    lower[1][i] = 1;
    variance[1][i] = 0;
    for (let j = 2; j <= data.length; j += 1) {
      variance[j][i] = Infinity;
    }
  }

  for (let l = 2; l <= data.length; l += 1) {
    let sum = 0;
    let sumSquares = 0;
    let w = 0;
    for (let m = 1; m <= l; m += 1) {
      const i3 = l - m + 1;
      const val = data[i3 - 1];
      w += 1;
      sum += val;
      sumSquares += val * val;
      const v = sumSquares - (sum * sum) / w;
      if (i3 !== 1) {
        for (let j = 2; j <= nClasses; j += 1) {
          if (variance[l][j] >= v + variance[i3 - 1][j - 1]) {
            lower[l][j] = i3;
            variance[l][j] = v + variance[i3 - 1][j - 1];
          }
        }
      }
    }
    lower[l][1] = 1;
    variance[l][1] = sumSquares - (sum * sum) / w;
  }

  const breaks = Array.from({ length: nClasses + 1 }, () => 0);
  breaks[nClasses] = data[data.length - 1];
  breaks[0] = data[0];
  let k = data.length;
  for (let j = nClasses; j >= 2; j -= 1) {
    const id = lower[k][j] - 2;
    breaks[j - 1] = data[id];
    k = lower[k][j] - 1;
  }
  return breaks;
}

function classForValue(value, breaks) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  for (let i = 0; i < breaks.length - 1; i += 1) {
    if (value <= breaks[i + 1]) return i;
  }
  return breaks.length - 2;
}

function buildLegend(label, breaks) {
  const legend = document.getElementById("mapLegend");
  if (!legend) return;
  if (!breaks.length) {
    legend.innerHTML = `<div><strong>${label}</strong></div><div>Ni podatkov</div>`;
    return;
  }
  const items = breaks.slice(0, -1).map((b, i) => {
    const from = breaks[i].toFixed(2);
    const to = breaks[i + 1].toFixed(2);
    const color = JENKS_COLORS[i] || JENKS_COLORS[JENKS_COLORS.length - 1];
    return `
      <div class="legend-item">
        <span class="legend-swatch" style="background:${color}"></span>
        <span>${from} – ${to}</span>
      </div>
    `;
  });
  legend.innerHTML = `
    <div><strong>${label}</strong></div>
    <div class="legend-items">${items.join("")}</div>
  `;
}

async function initMap() {
  const mapEl = document.getElementById("map");
  const select = document.getElementById("indexSelect");
  const methodSelect = document.getElementById("methodSelect");
  if (!mapEl || !select || !methodSelect || typeof L === "undefined") return;

  INDEX_OPTIONS.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.key;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  METHOD_OPTIONS.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.key;
    option.textContent = opt.label;
    methodSelect.appendChild(option);
  });

  const map = L.map(mapEl, { scrollWheelZoom: true }).setView([46.05, 14.5], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let geoLayer = null;
  let features = [];
  let dataCache = {};
  let didFit = false;

  const initialKey = INDEX_OPTIONS[0].key;
  select.value = initialKey;
  methodSelect.value = METHOD_OPTIONS[0].key;

  async function loadData(methodKey) {
    if (dataCache[methodKey]) return dataCache[methodKey];
    const method = METHOD_OPTIONS.find((m) => m.key === methodKey);
    if (!method) throw new Error("Unknown method");
    const res = await fetch(method.file, { cache: "no-store" });
    if (!res.ok) throw new Error(`GeoJSON ni dosegljiv (${method.file}).`);
    const data = await res.json();
    dataCache[methodKey] = data;
    return data;
  }

  function renderLayer(key, data) {
    features = data.features || [];
    const values = getValues(features, key);
    const breaks = jenksBreaks(values, N_CLASSES);
    buildLegend(INDEX_OPTIONS.find((o) => o.key === key)?.label || key, breaks);

    if (geoLayer) {
      geoLayer.remove();
    }

    const currentZoom = map.getZoom();
    geoLayer = L.geoJSON(data, {
      style: (feature) => {
        const value = Number(feature.properties?.[key]);
        const classIdx = classForValue(value, breaks);
        const color = classIdx === null ? "#bdbdbd" : JENKS_COLORS[classIdx];
        const geomType = feature.geometry?.type || "";
        if (geomType.includes("Line")) {
          return {
            color,
            weight: Math.max(1, Math.min(6, currentZoom - 10)),
            opacity: 0.9
          };
        }
        return {
          color: "transparent",
          weight: 0,
          fillColor: color,
          fillOpacity: 0.85
        };
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        const content = `
          <strong>${key}</strong>: ${props[key] ?? "—"}<br>
          <span>Speed: ${props.mean_speed_kmh ?? "—"} km/h</span><br>
          <span>Points: ${props.n_points ?? "—"}</span>
        `;
        layer.bindPopup(content);
      }
    }).addTo(map);

    if (!didFit) {
      try {
        map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
        didFit = true;
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const initialData = await loadData(methodSelect.value);
  renderLayer(initialKey, initialData);

  map.on("zoomend", () => {
    if (!geoLayer) return;
    geoLayer.setStyle((feature) => {
      const value = Number(feature.properties?.[select.value]);
      const values = getValues(features, select.value);
      const breaks = jenksBreaks(values, N_CLASSES);
      const classIdx = classForValue(value, breaks);
      const color = classIdx === null ? "#bdbdbd" : JENKS_COLORS[classIdx];
      const geomType = feature.geometry?.type || "";
      if (geomType.includes("Line")) {
        return {
          color,
          weight: Math.max(1, Math.min(6, map.getZoom() - 10)),
          opacity: 0.9
        };
      }
      return {
        color: "transparent",
        weight: 0,
        fillColor: color,
        fillOpacity: 0.85
      };
    });
  });

  select.addEventListener("change", async (event) => {
    const data = await loadData(methodSelect.value);
    renderLayer(event.target.value, data);
  });

  methodSelect.addEventListener("change", async (event) => {
    const data = await loadData(event.target.value);
    renderLayer(select.value, data);
  });
}

initTheme();
initToggle();
initTocToggle();
loadReadme();
