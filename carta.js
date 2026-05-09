const CAT_INFO = {
    all:               { emoji: "🩵", label: "Todo" },
    bebidas_calientes: { emoji: "☕",  label: "Bebidas calientes" },
    bebidas_frias:     { emoji: "🍹", label: "Bebidas frías" },
    dulces:            { emoji: "🍪", label: "Dulce" },
    salados:           { emoji: "🥪", label: "Salado" },
    tortas:            { emoji: "🍰", label: "Tortas" },
    postres:           { emoji: "🍮", label: "Postres" },
    meriendas:         { emoji: "🧁", label: "Meriendas" },
    eventos:           { emoji: "⭐", label: "Eventos" },
  };

  let allItems = [];
  let activeFilter = "all";

  // ── Load data ──
  async function loadData() {
    showLoading();
    try {
      const res = await fetch(SHEET_URL);
      const text = await res.text();
      allItems = text.split(/\r?\n/).map(row => {
        const [id, name, description, price, img, cat, cant_ventas, mostrar] = row.split(",");
        return { id, name, description, price, img, cat, mostrar};
      }).filter(i => i.id && i.id.trim() !== "" && i.mostrar == 1);
      render();
    } catch (e) {
      showError();
    }
  }

  // ── Render ──
  function render() {
    const menu = document.getElementById("menu");
    const heading = document.getElementById("cat-heading");
    const catEmoji = document.getElementById("cat-emoji");
    const catTitle = document.getElementById("cat-title");

    const filtered = activeFilter === "all"
      ? allItems
      : allItems.filter(i => i.cat === activeFilter);

    // Category heading
    if (activeFilter !== "all") {
      catEmoji.textContent = CAT_INFO[activeFilter]?.emoji || "";
      catTitle.textContent = CAT_INFO[activeFilter]?.label || "";
      heading.style.display = "flex";
    } else {
      heading.style.display = "none";
    }

    // Empty state
    if (filtered.length === 0) {
      menu.innerHTML = `
        <div class="state-box">
          <span class="state-icon">🔍</span>
          <p class="state-title">Sin productos en esta categoría</p>
        </div>`;
      return;
    }

    // Grid
    const catEmojiFn = (cat) => CAT_INFO[cat]?.emoji || "🍽️";

    menu.innerHTML = `
      <div class="grid">
        ${filtered.map(item => `
          <div class="card">
            ${item.img
              ? `<img class="card-img" src="${item.img}" alt="${item.name || ''}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
              : ""}
            <div class="card-img-placeholder" style="display:${item.img ? 'none' : 'flex'}">
              ${catEmojiFn(item.cat)}
            </div>
            <div class="card-body">
              <div class="card-name">${item.name || ""}</div>
              ${item.description ? `<div class="card-desc">${item.description}</div>` : ""}
              <div class="card-price">$${item.price || ""}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <p class="item-count">${filtered.length} ${filtered.length === 1 ? "producto" : "productos"}</p>`;
  }

  function showLoading() {
    document.getElementById("cat-heading").style.display = "none";
    document.getElementById("menu").innerHTML = `
      <div class="state-box">
        <div class="spinner"></div>
        <p>Cargando carta...</p>
      </div>`;
  }

  function showError() {
    document.getElementById("menu").innerHTML = `
      <div class="state-box">
        <span class="state-icon">😕</span>
        <p class="state-title">No se pudo cargar la carta</p>
        <p>Revisá tu conexión a internet e intentá de nuevo</p>
        <button class="retry-btn" onclick="loadData()">Reintentar</button>
      </div>`;
  }

  // ── Filter ──
  function setFilter(btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.cat;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Header shrink on scroll ──
  const header = document.getElementById("header");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      header.classList.add("small");
    } else {
      header.classList.remove("small");
    }
    if (window.scrollY > 250) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }, { passive: true });

  loadData();
