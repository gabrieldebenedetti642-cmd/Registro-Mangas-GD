const { useState, useEffect, useMemo } = React;
const CATEGORIAS = [
  "Vacas de cr\xEDa",
  "Vacas descarte",
  "Novillos 1-2",
  "Novillos 2-3",
  "Vaquillonas 1-2",
  "Vaquillonas 2-3",
  "Terneros",
  "Terneras",
  "Toros"
];
const INSUMO_GRUPOS = [
  {
    grupo: "Reproducci\xF3n",
    items: ["IATF", "IATF dispositivos", "IATF retiro", "Inseminaci\xF3n", "Reproductiva", "Ecograf\xEDas"]
  },
  {
    grupo: "Sanitario",
    items: [
      "Saguaypicida",
      "Mancha y gangrena",
      "Nitroxinil",
      "Aftosa",
      "Clorsulon",
      "Cobre",
      "Brucelosis",
      "Ricoverm",
      "Leptospira",
      "Carbuman"
    ]
  },
  {
    grupo: "Manejo",
    items: ["Marca", "Caravana mosca"]
  }
];
const ALL_INSUMOS = INSUMO_GRUPOS.flatMap((g) => g.items);
const CATEGORIA_COLOR = {
  "Vacas de cr\xEDa": "#C98A3D",
  "Vacas descarte": "#9C6B2C",
  "Novillos 1-2": "#7C8A63",
  "Novillos 2-3": "#5E6B49",
  "Vaquillonas 1-2": "#B5654A",
  "Vaquillonas 2-3": "#8F4B36",
  Terneros: "#D8C9A3",
  Terneras: "#C4B189",
  Toros: "#8B3A2B"
};
function hoyISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function fechaLegible(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function GDMark() {
  return /* @__PURE__ */ React.createElement("div", { className: "mark" }, /* @__PURE__ */ React.createElement("svg", { width: "46", height: "44", viewBox: "0 0 46 44" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "greenGrad", x1: "0.1", y1: "0", x2: "0.5", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#3C8B63" }), /* @__PURE__ */ React.createElement("stop", { offset: "45%", stopColor: "#1F5B40" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#123526" })), /* @__PURE__ */ React.createElement("linearGradient", { id: "goldGrad", x1: "0", y1: "0", x2: "0.15", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#FCE7AC" }), /* @__PURE__ */ React.createElement("stop", { offset: "40%", stopColor: "#D8A53C" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#8A6318" })), /* @__PURE__ */ React.createElement("clipPath", { id: "letters" }, /* @__PURE__ */ React.createElement("text", { x: "7", y: "32.5", fontFamily: "Arial, sans-serif", fontWeight: "900", fontSize: "26", letterSpacing: "-5.3" }, "G"), /* @__PURE__ */ React.createElement("text", { x: "21", y: "32.5", fontFamily: "Arial, sans-serif", fontWeight: "900", fontSize: "26", letterSpacing: "-5.3" }, "D"))), /* @__PURE__ */ React.createElement("path", { d: "M17,3 a7,7 0 0 1 12,0 L29,13 Q29,17 23,17 Q17,17 17,13 Z", fill: "url(#greenGrad)" }), /* @__PURE__ */ React.createElement("circle", { cx: "23", cy: "8.5", r: "3.1", fill: "var(--bg)" }), /* @__PURE__ */ React.createElement("circle", { cx: "23", cy: "8.5", r: "3.1", fill: "none", stroke: "#0E2318", strokeWidth: "0.6" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "14", width: "42", height: "28", rx: "7", fill: "url(#greenGrad)" }), /* @__PURE__ */ React.createElement(
    "text",
    {
      x: "7",
      y: "32.5",
      fontFamily: "Arial, sans-serif",
      fontWeight: "900",
      fontSize: "26",
      letterSpacing: "-5.3",
      fill: "url(#goldGrad)"
    },
    "G"
  ), /* @__PURE__ */ React.createElement(
    "text",
    {
      x: "21",
      y: "32.5",
      fontFamily: "Arial, sans-serif",
      fontWeight: "900",
      fontSize: "26",
      letterSpacing: "-5.3",
      fill: "url(#goldGrad)"
    },
    "D"
  ), /* @__PURE__ */ React.createElement("g", { clipPath: "url(#letters)" }, /* @__PURE__ */ React.createElement("rect", { x: "20.5", y: "10", width: "3", height: "42", fill: "#123526", opacity: "0.6", transform: "rotate(28 23 27)" }))));
}
function CorralApp() {
  const [tab, setTab] = useState("cargar");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editingLoteId, setEditingLoteId] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [syncError, setSyncError] = useState(false);
  const [fecha, setFecha] = useState(hoyISO());
  const [potrero, setPotrero] = useState("");
  const [categoria, setCategoria] = useState("");
  const [insumosSel, setInsumosSel] = useState([]);
  const [insumoOtro, setInsumoOtro] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [buscarPotrero, setBuscarPotrero] = useState("");
  const [buscarCategoria, setBuscarCategoria] = useState("");
  useEffect(() => {
    setSyncError(false);
    if (typeof window.db === "undefined") {
      setSyncError(true);
      setLoading(false);
      return;
    }
    let unsub = () => {
    };
    try {
      unsub = window.db.collection("app").doc("registros").onSnapshot(
        (doc) => {
          const data = doc.exists ? doc.data() : null;
          setEntries(data && data.value ? JSON.parse(data.value) : []);
          setLoading(false);
          setSyncError(false);
        },
        (e) => {
          setSyncError(true);
          setLoading(false);
        }
      );
    } catch (e) {
      setSyncError(true);
      setLoading(false);
    }
    (async () => {
      try {
        const t = await window.storage.get("tema", false);
        if (t && t.value) setTheme(t.value);
      } catch (e) {
      }
    })();
    return () => unsub();
  }, []);
  async function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      await window.storage.set("tema", next, false);
    } catch (e) {
    }
  }
  async function persist(next) {
    setEntries(next);
    try {
      if (typeof window.db === "undefined") throw new Error("sin conexi\xF3n con la base");
      const escritura = window.db.collection("app").doc("registros").set({ value: JSON.stringify(next), actualizadoEn: Date.now() });
      const tiempoLimite = new Promise(
        (_, reject) => setTimeout(() => reject(new Error("tiempo de espera agotado")), 1e4)
      );
      await Promise.race([escritura, tiempoLimite]);
    } catch (e) {
      setError(
        "Qued\xF3 guardado en este aparato, pero no se pudo confirmar en la nube (prob\xE1 con mejor se\xF1al). Los dem\xE1s aparatos todav\xEDa no lo van a ver."
      );
    }
  }
  function toggleInsumo(item) {
    setInsumosSel((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  }
  async function handleGuardar(e) {
    e.preventDefault();
    setError("");
    const cant = Number(cantidad);
    const otros = insumoOtro.split(",").map((s) => s.trim()).filter(Boolean);
    const todosInsumos = [...insumosSel, ...otros];
    if (!potrero.trim() || !categoria || !cantidad || cant <= 0) {
      setError("Complet\xE1 potrero, categor\xEDa y cantidad.");
      return;
    }
    if (todosInsumos.length === 0) {
      setError("Eleg\xED al menos un insumo.");
      return;
    }
    setSaving(true);
    const editando = !!editingLoteId;
    const loteId = editingLoteId || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const nuevos = todosInsumos.map((ins, idx) => ({
      id: `${loteId}-${Date.now().toString(36)}${idx}`,
      loteId,
      fecha,
      potrero: potrero.trim(),
      categoria,
      insumo: ins,
      cantidad: cant,
      observaciones: observaciones.trim()
    }));
    const base = editando ? entries.filter((en) => en.loteId !== loteId) : entries;
    await persist([...base, ...nuevos]);
    setSaving(false);
    setToast(editando ? "Cambios guardados" : nuevos.length > 1 ? `${nuevos.length} insumos guardados` : "Registro guardado");
    setTimeout(() => setToast(""), 1800);
    if (editando) {
      handleCancelarEdicion();
    } else {
      resetFormulario();
    }
  }
  function resetFormulario() {
    setFecha(hoyISO());
    setPotrero("");
    setCategoria("");
    setCantidad("");
    setInsumosSel([]);
    setInsumoOtro("");
    setObservaciones("");
  }
  function handleEditar(lote) {
    setEditingLoteId(lote.loteId);
    setFecha(lote.fecha);
    setPotrero(lote.potrero);
    setCategoria(lote.categoria);
    setCantidad(String(lote.cantidad));
    setObservaciones(lote.observaciones || "");
    const nombresInsumo = lote.items.map((it) => it.insumo);
    setInsumosSel(nombresInsumo.filter((ins) => ALL_INSUMOS.includes(ins)));
    setInsumoOtro(nombresInsumo.filter((ins) => !ALL_INSUMOS.includes(ins)).join(", "));
    setError("");
    setTab("cargar");
  }
  function handleCancelarEdicion() {
    setEditingLoteId(null);
    resetFormulario();
    setError("");
  }
  async function handleEliminar(id) {
    await persist(entries.filter((en) => en.id !== id));
  }
  async function handleEliminarLote(loteId) {
    if (!window.confirm("\xBFEliminar este registro completo?")) return;
    await persist(entries.filter((en) => en.loteId !== loteId));
    if (editingLoteId === loteId) handleCancelarEdicion();
  }
  async function handleVaciar() {
    if (!window.confirm("\xBFVaciar todos los registros? No se puede deshacer.")) return;
    await persist([]);
    handleCancelarEdicion();
  }
  const potrerosConocidos = useMemo(
    () => Array.from(new Set(entries.map((e) => e.potrero))).sort(),
    [entries]
  );
  const lotes = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    entries.forEach((e) => {
      const key = e.loteId || e.id;
      if (!map.has(key)) {
        map.set(key, {
          loteId: key,
          fecha: e.fecha,
          potrero: e.potrero,
          categoria: e.categoria,
          cantidad: e.cantidad,
          observaciones: e.observaciones,
          items: []
        });
      }
      map.get(key).items.push({ id: e.id, insumo: e.insumo });
    });
    return Array.from(map.values());
  }, [entries]);
  const totalAnimales = useMemo(() => lotes.reduce((s, l) => s + l.cantidad, 0), [lotes]);
  const porCategoria = useMemo(() => {
    const map = {};
    lotes.forEach((l) => {
      if (!map[l.categoria]) map[l.categoria] = { total: 0, count: 0 };
      map[l.categoria].total += l.cantidad;
      map[l.categoria].count += 1;
    });
    return CATEGORIAS.filter((c) => map[c]).map((c) => ({ categoria: c, ...map[c] }));
  }, [lotes]);
  const porInsumo = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      if (!map[e.insumo]) map[e.insumo] = { total: 0, count: 0 };
      map[e.insumo].total += e.cantidad;
      map[e.insumo].count += 1;
    });
    return Object.entries(map).map(([ins, v]) => ({ insumo: ins, ...v })).sort((a, b) => b.total - a.total);
  }, [entries]);
  const lotesOrdenados = useMemo(
    () => [...lotes].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.loteId.localeCompare(a.loteId)),
    [lotes]
  );
  const resultadosBusqueda = useMemo(() => {
    return lotesOrdenados.filter(
      (l) => !buscarPotrero.trim() || l.potrero.toLowerCase().includes(buscarPotrero.trim().toLowerCase())
    ).filter((l) => !buscarCategoria || l.categoria === buscarCategoria);
  }, [lotesOrdenados, buscarPotrero, buscarCategoria]);
  function exportarExcel() {
    const registroData = [...entries].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id)).map((e) => ({
      Fecha: fechaLegible(e.fecha),
      Potrero: e.potrero,
      Categor\u00EDa: e.categoria,
      Insumo: e.insumo,
      Cantidad: e.cantidad,
      Observaciones: e.observaciones
    }));
    const wsRegistro = XLSX.utils.json_to_sheet(registroData);
    wsRegistro["!cols"] = [
      { wch: 11 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 10 },
      { wch: 30 }
    ];
    const resumenRows = [
      ["Resumen por categor\xEDa"],
      ["Categor\xEDa", "Cantidad total de animales", "N\xBA de lotes"],
      ...porCategoria.map((r) => [r.categoria, r.total, r.count]),
      [],
      ["Resumen por insumo"],
      ["Insumo", "Cantidad total de animales", "N\xBA de aplicaciones"],
      ...porInsumo.map((r) => [r.insumo, r.total, r.count]),
      [],
      ["Total general"],
      ["Lotes trabajados", lotes.length],
      ["Animales procesados", totalAnimales],
      ["Aplicaciones registradas", entries.length]
    ];
    const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
    wsResumen["!cols"] = [{ wch: 26 }, { wch: 24 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsRegistro, "Registro");
    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");
    XLSX.writeFile(wb, `mangas_gd_${hoyISO()}.xlsx`);
  }
  function LoteCard({ lote, showDelete }) {
    return /* @__PURE__ */ React.createElement("div", { className: "lote-card" }, /* @__PURE__ */ React.createElement("div", { className: "lote-head" }, /* @__PURE__ */ React.createElement("span", { className: "tag", style: { background: CATEGORIA_COLOR[lote.categoria] || "#8a8a8a" } }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), lote.categoria), /* @__PURE__ */ React.createElement("div", { className: "entry-main" }, /* @__PURE__ */ React.createElement("div", { className: "l1" }, lote.potrero, " \xB7 ", lote.cantidad, " cab."), /* @__PURE__ */ React.createElement("div", { className: "l2" }, fechaLegible(lote.fecha), lote.observaciones ? ` \xB7 ${lote.observaciones}` : ""))), /* @__PURE__ */ React.createElement("div", { className: "chips-row" }, lote.items.map((it) => /* @__PURE__ */ React.createElement("span", { className: "mini-chip", key: it.id }, it.insumo, showDelete && /* @__PURE__ */ React.createElement("button", { className: "mini-x", onClick: () => handleEliminar(it.id), "aria-label": "Quitar insumo" }, "\u2715")))), /* @__PURE__ */ React.createElement("div", { className: "lote-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "link-btn", onClick: () => handleEditar(lote) }, "Editar"), /* @__PURE__ */ React.createElement("button", { type: "button", className: "link-btn danger", onClick: () => handleEliminarLote(lote.loteId) }, "Eliminar registro")));
  }
  const ultimosLotes = lotesOrdenados.slice(0, 8);
  return /* @__PURE__ */ React.createElement("div", { className: `app theme-${theme}` }, /* @__PURE__ */ React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }
        .app {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          padding: 20px 16px 60px;
          transition: background 0.15s, color 0.15s;
        }
        .app.theme-dark {
          --bg: #1C1815;
          --surface: #26211C;
          --surface-2: #302922;
          --border: #423A30;
          --brass: #C98A3D;
          --brass-light: #E0AD64;
          --text: #F1EAD9;
          --muted: #A9998A;
          --danger: #B5533C;
          --danger-bg: rgba(181,83,60,0.14);
          --success: #7A9471;
        }
        .app.theme-light {
          --bg: #F5F0E4;
          --surface: #FFFFFF;
          --surface-2: #F1EAD9;
          --border: #D9CBAE;
          --brass: #B8752E;
          --brass-light: #8A5A1F;
          --text: #2A2318;
          --muted: #8A7860;
          --danger: #A3402B;
          --danger-bg: rgba(163,64,43,0.10);
          --success: #4F7A46;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .mark { flex-shrink: 0; margin-top: -2px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.45)); }
        .mark svg { display: block; }
        .titles { min-width: 0; }
        .titles h1 {
          font-family: 'Bitter', serif;
          font-size: 19px;
          margin: 0;
          letter-spacing: 0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .titles p {
          margin: 2px 0 0;
          font-size: 12.5px;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .counter {
          margin-left: auto;
          text-align: right;
          flex-shrink: 0;
        }
        .counter .n {
          font-family: 'Bitter', serif;
          font-size: 20px;
          color: var(--brass-light);
          line-height: 1;
        }
        .counter .l {
          font-size: 10.5px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .theme-btn {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text);
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }
        .tabs {
          display: flex;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
          margin-bottom: 16px;
        }
        .tab-btn {
          flex: 1;
          padding: 10px 6px;
          background: transparent;
          border: none;
          border-radius: 7px;
          color: var(--muted);
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
        }
        .tab-btn.active {
          background: var(--brass);
          color: #1C1815;
        }
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 14px;
        }
        label {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin: 12px 0 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        label:first-child { margin-top: 0; }
        input, select, textarea {
          width: 100%;
          min-width: 0;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 8px;
          padding: 12px 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
        }
        input:focus, select:focus, textarea:focus {
          outline: 2px solid var(--brass);
          outline-offset: 1px;
        }
        textarea { resize: vertical; min-height: 60px; }
        input[type="date"] {
          text-align: left;
        }
        input[type="date"]::-webkit-date-and-time-value {
          text-align: left;
        }
        .row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .row2 > div {
          min-width: 0;
        }
        .btn {
          width: 100%;
          margin-top: 16px;
          padding: 13px;
          border-radius: 9px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .btn-primary { background: var(--brass); color: #1C1815; }
        .btn-primary:disabled { opacity: 0.6; }
        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
        }
        .btn-danger {
          background: transparent;
          border: 1px solid var(--danger);
          color: var(--danger);
        }
        .error {
          background: var(--danger-bg);
          border: 1px solid var(--danger);
          color: #E8A99A;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          margin-top: 12px;
        }
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--success);
          color: #14200F;
          padding: 10px 18px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13.5px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 9px 3px 6px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
          color: #1C1815;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tag .dot {
          width: 7px; height: 7px; border-radius: 50%; background: rgba(0,0,0,0.35);
        }
        .grupo-titulo {
          font-size: 12px;
          color: var(--brass-light);
          font-weight: 600;
          margin: 14px 0 6px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .checks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px 7px 9px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          cursor: pointer;
          font-size: 13px;
          margin: 0;
          text-transform: none;
          letter-spacing: normal;
          color: var(--text);
        }
        .chip input {
          width: 15px;
          height: 15px;
          accent-color: var(--brass);
          margin: 0;
        }
        .chip.checked {
          background: var(--brass);
          border-color: var(--brass);
          color: #1C1815;
          font-weight: 600;
        }
        .lote-card {
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .lote-card:last-child { border-bottom: none; }
        .lote-head {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .entry-main { flex: 1; min-width: 0; }
        .entry-main .l1 { font-size: 14px; font-weight: 600; }
        .entry-main .l2 { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 9px;
        }
        .mini-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 4px 5px 4px 10px;
          font-size: 12px;
          color: var(--text);
        }
        .mini-x {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          font-size: 11px;
          padding: 3px 5px;
        }
        .mini-x:hover { color: var(--danger); }
        .lote-actions {
          display: flex;
          gap: 18px;
          margin-top: 10px;
        }
        .link-btn {
          background: none;
          border: none;
          padding: 0;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--brass-light);
          cursor: pointer;
        }
        .link-btn.danger { color: var(--danger); }
        .edit-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface-2);
          border: 1px solid var(--brass);
          color: var(--brass-light);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 12px;
          border-radius: 8px;
          margin-bottom: 14px;
        }
        .edit-banner .link-btn { color: var(--text); }
        .section-title {
          font-family: 'Bitter', serif;
          font-size: 15px;
          margin: 0 0 10px;
          color: var(--brass-light);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th, td {
          text-align: left;
          padding: 8px 6px;
          border-bottom: 1px solid var(--border);
        }
        th {
          color: var(--muted);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .table-wrap { overflow-x: auto; }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .stat {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 8px;
          text-align: center;
        }
        .stat .n { font-family: 'Bitter', serif; font-size: 19px; color: var(--brass-light); }
        .stat .l { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.3px; }
        .empty {
          text-align: center;
          color: var(--muted);
          font-size: 13.5px;
          padding: 24px 10px;
        }
        @media (max-width: 380px) {
          .row2 { grid-template-columns: 1fr; }
        }
      `), /* @__PURE__ */ React.createElement("div", { className: "header" }, /* @__PURE__ */ React.createElement(GDMark, null), /* @__PURE__ */ React.createElement("div", { className: "titles" }, /* @__PURE__ */ React.createElement("h1", null, "Registro Mangas GD"), /* @__PURE__ */ React.createElement("p", null, "Trabajo con ganado por lote")), /* @__PURE__ */ React.createElement("div", { className: "counter" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, totalAnimales), /* @__PURE__ */ React.createElement("div", { className: "l" }, "animales")), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "theme-btn",
      onClick: toggleTheme,
      "aria-label": theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    },
    theme === "dark" ? "\u2600" : "\u263E"
  )), /* @__PURE__ */ React.createElement("div", { className: "tabs" }, /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "cargar" ? "active" : ""}`, onClick: () => setTab("cargar") }, "Cargar"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "resumen" ? "active" : ""}`, onClick: () => setTab("resumen") }, "Resumen"), /* @__PURE__ */ React.createElement("button", { className: `tab-btn ${tab === "buscar" ? "active" : ""}`, onClick: () => setTab("buscar") }, "Buscar")), syncError && /* @__PURE__ */ React.createElement("div", { className: "error", style: { marginBottom: 14 } }, "Sin conexi\xF3n con la base compartida. Revis\xE1 tu internet \u2014 mientras tanto pod\xE9s seguir viendo lo \xFAltimo sincronizado, pero lo que cargues ahora podr\xEDa no guardarse."), loading ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, "Cargando registros\u2026") : /* @__PURE__ */ React.createElement(React.Fragment, null, tab === "cargar" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card" }, editingLoteId && /* @__PURE__ */ React.createElement("div", { className: "edit-banner" }, "Editando registro", /* @__PURE__ */ React.createElement("button", { type: "button", className: "link-btn", onClick: handleCancelarEdicion }, "Cancelar")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleGuardar }, /* @__PURE__ */ React.createElement("label", null, "Fecha"), /* @__PURE__ */ React.createElement("input", { type: "date", value: fecha, onChange: (e) => setFecha(e.target.value) }), /* @__PURE__ */ React.createElement("label", null, "Cantidad de animales"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "1",
      inputMode: "numeric",
      placeholder: "0",
      value: cantidad,
      onChange: (e) => setCantidad(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("label", null, "Potrero"), /* @__PURE__ */ React.createElement(
    "input",
    {
      list: "potreros-list",
      placeholder: "Ej: Potrero Norte",
      value: potrero,
      onChange: (e) => setPotrero(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("datalist", { id: "potreros-list" }, potrerosConocidos.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }))), /* @__PURE__ */ React.createElement("label", null, "Categor\xEDa"), /* @__PURE__ */ React.createElement("select", { value: categoria, onChange: (e) => setCategoria(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Elegir categor\xEDa\u2026"), CATEGORIAS.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c))), /* @__PURE__ */ React.createElement("label", null, "Insumos aplicados"), INSUMO_GRUPOS.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.grupo }, /* @__PURE__ */ React.createElement("div", { className: "grupo-titulo" }, g.grupo), /* @__PURE__ */ React.createElement("div", { className: "checks" }, g.items.map((item) => {
    const checked = insumosSel.includes(item);
    return /* @__PURE__ */ React.createElement("label", { key: item, className: `chip ${checked ? "checked" : ""}` }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked, onChange: () => toggleInsumo(item) }), item);
  })))), /* @__PURE__ */ React.createElement("div", { className: "grupo-titulo" }, "Otro"), /* @__PURE__ */ React.createElement(
    "input",
    {
      placeholder: "Separ\xE1 con comas si son varios",
      value: insumoOtro,
      onChange: (e) => setInsumoOtro(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("label", null, "Observaciones"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: "Opcional",
      value: observaciones,
      onChange: (e) => setObservaciones(e.target.value)
    }
  ), error && /* @__PURE__ */ React.createElement("div", { className: "error" }, error), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", type: "submit", disabled: saving }, saving ? "Guardando\u2026" : editingLoteId ? "Guardar cambios" : "Guardar registro"))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "\xDAltimos registros"), ultimosLotes.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, "Todav\xEDa no cargaste ning\xFAn registro.") : ultimosLotes.map((l) => /* @__PURE__ */ React.createElement(LoteCard, { lote: l, showDelete: true, key: l.loteId }))), entries.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: exportarExcel }, "Descargar Excel"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-danger", onClick: handleVaciar }, "Vaciar todos los registros"))), tab === "resumen" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "stat-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, lotes.length), /* @__PURE__ */ React.createElement("div", { className: "l" }, "Lotes trabajados")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, totalAnimales), /* @__PURE__ */ React.createElement("div", { className: "l" }, "Animales procesados")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("div", { className: "n" }, entries.length), /* @__PURE__ */ React.createElement("div", { className: "l" }, "Aplicaciones"))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "Por categor\xEDa"), porCategoria.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, "Sin datos todav\xEDa.") : /* @__PURE__ */ React.createElement("div", { className: "table-wrap" }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Categor\xEDa"), /* @__PURE__ */ React.createElement("th", null, "Animales"), /* @__PURE__ */ React.createElement("th", null, "Lotes"))), /* @__PURE__ */ React.createElement("tbody", null, porCategoria.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.categoria }, /* @__PURE__ */ React.createElement("td", null, r.categoria), /* @__PURE__ */ React.createElement("td", null, r.total), /* @__PURE__ */ React.createElement("td", null, r.count))))))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "Por insumo"), porInsumo.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, "Sin datos todav\xEDa.") : /* @__PURE__ */ React.createElement("div", { className: "table-wrap" }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Insumo"), /* @__PURE__ */ React.createElement("th", null, "Animales"), /* @__PURE__ */ React.createElement("th", null, "Aplicaciones"))), /* @__PURE__ */ React.createElement("tbody", null, porInsumo.map((r) => /* @__PURE__ */ React.createElement("tr", { key: r.insumo }, /* @__PURE__ */ React.createElement("td", null, r.insumo), /* @__PURE__ */ React.createElement("td", null, r.total), /* @__PURE__ */ React.createElement("td", null, r.count))))))), entries.length > 0 && /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: exportarExcel }, "Descargar Excel")), tab === "buscar" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("label", null, "Potrero"), /* @__PURE__ */ React.createElement(
    "input",
    {
      list: "potreros-list-buscar",
      placeholder: "Ej: Potrero Norte",
      value: buscarPotrero,
      onChange: (e) => setBuscarPotrero(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("datalist", { id: "potreros-list-buscar" }, potrerosConocidos.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }))), /* @__PURE__ */ React.createElement("label", null, "Categor\xEDa"), /* @__PURE__ */ React.createElement("select", { value: buscarCategoria, onChange: (e) => setBuscarCategoria(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Todas"), CATEGORIAS.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, "Historial ", resultadosBusqueda.length > 0 ? `(${resultadosBusqueda.length})` : ""), resultadosBusqueda.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "empty" }, entries.length === 0 ? "Todav\xEDa no hay registros cargados." : "No hay registros para esa b\xFAsqueda.") : resultadosBusqueda.map((l) => /* @__PURE__ */ React.createElement(LoteCard, { lote: l, showDelete: false, key: l.loteId }))))), toast && /* @__PURE__ */ React.createElement("div", { className: "toast" }, toast));
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(CorralApp));
