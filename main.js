async function loadReadme() {
  const container = document.getElementById("content");

  try {
    const res = await fetch("./README.md", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`README.md ni dosegljiv (status ${res.status})`);
    }

    const markdown = await res.text();

    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: true
    });

    container.innerHTML = marked.parse(markdown);
  } catch (err) {
    container.innerHTML = `
      <h1>Napaka</h1>
      <p>${err.message}</p>
      <p>Preveri, da je <code>README.md</code> v root mapi repozitorija.</p>
    `;
    console.error(err);
  }
}

loadReadme();
