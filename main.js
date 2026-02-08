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

function getColor(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) return "#bdbdbd";
  if (max === min) return "#2c7bb6";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const scale = [
    "#b2182b",
    "#d6604d",
    "#f4a582",
    "#fddbc7",
    "#d9f0d3",
    "#a6dba0",
    "#5aae61",
    "#1b7837"
  ];
  const idx = Math.min(scale.length - 1, Math.floor(t * (scale.length - 1)));
  return scale[idx];
}

function buildLegend(label, min, max) {
  const legend = document.getElementById("mapLegend");
  if (!legend) return;
  const minText = min === null ? "—" : min.toFixed(2);
  const maxText = max === null ? "—" : max.toFixed(2);
  legend.innerHTML = `
    <div><strong>${label}</strong></div>
    <div class="legend-scale">
      <div class="legend-bar"></div>
      <div class="legend-values"><span>${minText}</span><span>${maxText}</span></div>
    </div>
  `;
}

function getMinMax(features, key) {
  let min = null;
  let max = null;
  features.forEach((f) => {
    const value = Number(f.properties?.[key]);
    if (Number.isNaN(value)) return;
    if (min === null || value < min) min = value;
    if (max === null || value > max) max = value;
  });
  return { min, max };
}

async function initMap() {
  const mapEl = document.getElementById("map");
  const select = document.getElementById("indexSelect");
  if (!mapEl || !select || typeof L === "undefined") return;

  INDEX_OPTIONS.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.key;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  const map = L.map(mapEl, { scrollWheelZoom: true }).setView([46.05, 14.5], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let geoLayer = null;
  let features = [];
  let didFit = false;

  const res = await fetch("./data/windows.geojson", { cache: "no-store" });
  if (!res.ok) {
    console.error("GeoJSON ni dosegljiv.");
    return;
  }
  const data = await res.json();
  features = data.features || [];

  const initialKey = INDEX_OPTIONS[0].key;
  select.value = initialKey;

  function renderLayer(key) {
    const { min, max } = getMinMax(features, key);
    buildLegend(INDEX_OPTIONS.find((o) => o.key === key)?.label || key, min, max);

    if (geoLayer) {
      geoLayer.remove();
    }

    geoLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const value = Number(feature.properties?.[key]);
        return L.circleMarker(latlng, {
          radius: 4,
          stroke: false,
          weight: 0,
          fillOpacity: 0.9,
          fillColor: getColor(value, min ?? 0, max ?? 1)
        });
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties || {};
        const content = `
          <strong>${key}</strong>: ${props[key] ?? "—"}<br>
          <span>Speed: ${props.mean_speed_kmh ?? "—"} km/h</span><br>
          <span>Ride: ${props.ride_id ?? "—"}</span>
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

  renderLayer(initialKey);
  select.addEventListener("change", (event) => renderLayer(event.target.value));
}

initTheme();
initToggle();
initTocToggle();
loadReadme();
