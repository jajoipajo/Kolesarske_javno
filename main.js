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
    buildToc();
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

initTheme();
initToggle();
initTocToggle();
loadReadme();
