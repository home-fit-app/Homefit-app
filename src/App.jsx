import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const NIVELES = [
  { val: "Principiante absoluto", icon: "🌱", sub: "Comienzo desde cero" },
  { val: "Algo de base",          icon: "🏃", sub: "Ejercito de vez en cuando" },
  { val: "Intermedio",            icon: "💪", sub: "Entreno con regularidad" },
];
const OBJETIVOS = [
  { val: "Perder peso",               icon: "🔥", sub: "Quemar grasa y tonificar" },
  { val: "Ganar músculo",             icon: "💪", sub: "Más fuerza y volumen" },
  { val: "Mejorar resistencia",       icon: "🏃", sub: "Cardio y vitalidad" },
  { val: "Sentirme con más energía",  icon: "⚡", sub: "Bienestar general" },
];
const TIEMPOS  = ["15 min", "30 min", "45 min", "60 min"];
const DIAS     = ["2 días", "3 días", "4 días", "5 días"];

const LOADING_MSGS = [
  "Analizando tu perfil...",
  "Diseñando ejercicios...",
  "Calculando series y reps...",
  "Estructurando tu semana...",
  "Últimos retoques...",
];

// ─── Global CSS ──────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hf-app {
    background: #060e06;
    min-height: 100vh;
    font-family: 'Inter', system-ui, sans-serif;
    color: #e8f5e8;
  }

  /* ── Option card (nivel / objetivo) ── */
  .hf-opt {
    display: flex; align-items: center; gap: 14px;
    padding: 15px 18px; border-radius: 14px;
    border: 1.5px solid #1a2a1a; background: #090f09;
    color: #5a7a5a; cursor: pointer;
    transition: all 0.18s ease; text-align: left; width: 100%;
    font-family: inherit;
  }
  .hf-opt:hover {
    border-color: #22c55e44; background: #0c1a0c; color: #a0c8a0;
    transform: translateY(-1px);
  }
  .hf-opt.sel {
    border-color: #22c55e; background: #22c55e0e; color: #e8f5e8;
  }
  .hf-opt .opt-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: #0e1a0e; display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0;
    transition: background 0.18s;
  }
  .hf-opt.sel .opt-icon { background: #22c55e1a; }
  .hf-opt .opt-title  { font-size: 14px; font-weight: 500; line-height: 1.2; }
  .hf-opt .opt-sub    { font-size: 12px; opacity: 0.55; margin-top: 2px; }
  .hf-opt .opt-check  {
    margin-left: auto; width: 20px; height: 20px; border-radius: 50%;
    background: #22c55e; display: flex; align-items: center;
    justify-content: center; font-size: 11px; color: #fff; flex-shrink: 0;
  }

  /* ── Pill (tiempo / días) ── */
  .hf-pill {
    padding: 10px 22px; border-radius: 100px;
    border: 1.5px solid #1a2a1a; background: transparent;
    color: #5a7a5a; cursor: pointer; font-size: 14px;
    font-family: inherit; font-weight: 500; transition: all 0.18s ease;
  }
  .hf-pill:hover { border-color: #22c55e44; color: #a0c8a0; }
  .hf-pill.sel {
    border-color: #22c55e; background: #22c55e18;
    color: #22c55e; font-weight: 600;
  }

  /* ── Step dots ── */
  .hf-dot-step {
    width: 7px; height: 7px; border-radius: 50%;
    background: #1a2e1a; transition: all 0.3s ease;
  }
  .hf-dot-step.done { background: #22c55e; }
  .hf-dot-step.cur  { background: #22c55e; transform: scale(1.5); }

  /* ── Input ── */
  .hf-input {
    width: 100%; padding: 14px 18px; border-radius: 12px;
    border: 1.5px solid #1a2a1a; background: #090f09;
    color: #e8f5e8; font-size: 15px; font-family: inherit;
    outline: none; transition: border-color 0.2s;
  }
  .hf-input::placeholder { color: #2a4a2a; }
  .hf-input:focus { border-color: #22c55e55; }

  /* ── Primary button ── */
  .hf-btn {
    width: 100%; padding: 17px; border-radius: 14px; border: none;
    font-size: 16px; font-weight: 600; font-family: inherit; cursor: pointer;
    transition: all 0.2s ease;
  }
  .hf-btn.on {
    background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff;
  }
  .hf-btn.on:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(34,197,94,0.35);
  }
  .hf-btn.off {
    background: #0d180d; color: #253525; cursor: not-allowed;
  }

  /* ── Secondary button ── */
  .hf-btn-sec {
    width: 100%; padding: 14px; border-radius: 12px;
    border: 1px solid #1a2a1a; background: transparent;
    color: #375037; font-size: 14px; font-family: inherit;
    cursor: pointer; transition: all 0.2s;
  }
  .hf-btn-sec:hover { border-color: #2a4a2a; color: #5a8a5a; }

  /* ── Section label ── */
  .hf-label {
    display: block; color: #3d6b3d; font-size: 11px;
    font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; margin-bottom: 10px;
  }

  /* ── Loading dots bounce ── */
  @keyframes hf-bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-11px); opacity: 1; }
  }
  .hf-loader-dot { animation: hf-bounce 1.4s infinite ease-in-out; }
  .hf-loader-dot:nth-child(1) { animation-delay: 0s; }
  .hf-loader-dot:nth-child(2) { animation-delay: 0.18s; }
  .hf-loader-dot:nth-child(3) { animation-delay: 0.36s; }

  /* ── Day card ── */
  .hf-day {
    border-radius: 14px; border: 1px solid #1a2a1a;
    overflow: hidden; margin-bottom: 10px;
  }
  .hf-day-head {
    padding: 13px 18px; background: #090f09;
    display: flex; align-items: center; gap: 10px;
  }
  .hf-day-num {
    width: 28px; height: 28px; border-radius: 8px;
    background: #22c55e18; border: 1px solid #22c55e33;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #22c55e; flex-shrink: 0;
  }
  .hf-day-title { font-size: 14px; font-weight: 600; color: #b8d8b8; }
  .hf-day-body {
    padding: 16px 18px; color: #7aaa7a; font-size: 14px;
    line-height: 1.9; white-space: pre-wrap;
    border-top: 1px solid #121e12;
  }

  /* ── Badge chip ── */
  .hf-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 100px; font-size: 12px;
    font-weight: 500; background: #0a160a;
    border: 1px solid #1a2e1a; color: #5a9a5a;
  }

  /* ── Subscribe card ── */
  .hf-sub-card {
    background: #090f09; border: 1px solid #1e3a1e;
    border-radius: 16px; padding: 28px 24px; text-align: center;
    position: relative; overflow: hidden;
  }
  .hf-sub-card::before {
    content: ''; position: absolute; top: -50px; left: -50px;
    width: 140px; height: 140px;
    background: radial-gradient(circle, #22c55e1a 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Logo pulse ── */
  @keyframes hf-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.25); }
    50%  { box-shadow: 0 0 0 9px rgba(34,197,94,0); }
  }
  .hf-logo-icon { animation: hf-pulse 3s infinite; }

  /* ── Fade-in entrance ── */
  @keyframes hf-fadein {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hf-fadein { animation: hf-fadein 0.38s ease forwards; }
`;

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div className="hf-logo-icon" style={{
        width: "36px", height: "36px", borderRadius: "10px",
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
      }}>🏠</div>
      <span style={{ fontSize: "18px", fontWeight: "700", color: "#e8f5e8", letterSpacing: "-0.5px" }}>
        Home<span style={{ color: "#22c55e" }}>Fit</span>
      </span>
    </div>
  );
}

// ─── OptionCard ───────────────────────────────────────────────────────────────
function OptionCard({ icon, title, sub, selected, onClick }) {
  return (
    <button className={`hf-opt${selected ? " sel" : ""}`} onClick={onClick}>
      <div className="opt-icon">{icon}</div>
      <div style={{ flex: 1 }}>
        <div className="opt-title">{title}</div>
        {sub && <div className="opt-sub">{sub}</div>}
      </div>
      {selected && <div className="opt-check">✓</div>}
    </button>
  );
}

// ─── PerfilForm ───────────────────────────────────────────────────────────────
function PerfilForm({ onGenerar }) {
  const [form, setForm] = useState({ nivel: "", objetivo: "", tiempo: "", dias: "", nombre: "" });
  const toggle = (key, val) => setForm(f => ({ ...f, [key]: f[key] === val ? "" : val }));
  const filled  = [form.nivel, form.objetivo, form.tiempo, form.dias].filter(Boolean).length;
  const completo = filled === 4;

  return (
    <div className="hf-fadein" style={{ maxWidth: "560px", margin: "0 auto", padding: "0 20px 64px" }}>
      {/* Top bar */}
      <div style={{ padding: "28px 0 0" }}><Logo /></div>

      {/* Hero */}
      <div style={{ padding: "36px 0 28px" }}>
        <h1 style={{ fontSize: "34px", fontWeight: "800", color: "#e8f5e8", lineHeight: 1.2, letterSpacing: "-0.5px", marginBottom: "12px" }}>
          Tu plan de entreno,<br />
          <span style={{ color: "#22c55e" }}>sin salir de casa</span>
        </h1>
        <p style={{ color: "#3d6b3d", fontSize: "15px" }}>
          {completo
            ? "¡Todo listo! Genera tu plan personalizado."
            : `Responde ${4 - filled} ${4 - filled === 1 ? "pregunta más" : "preguntas más"} y la IA crea tu plan`}
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "36px" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`hf-dot-step${i < filled ? " done" : i === filled ? " cur" : ""}`} />
        ))}
        <span style={{ fontSize: "12px", color: "#2a4a2a", marginLeft: "8px" }}>{filled}/4 completo</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Nombre */}
        <div>
          <label className="hf-label">
            ¿Cómo te llamas?{" "}
            <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, opacity: 0.5 }}>(opcional)</span>
          </label>
          <input
            className="hf-input"
            value={form.nombre}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            placeholder="Tu nombre..."
          />
        </div>

        {/* Nivel */}
        <div>
          <label className="hf-label">Nivel de condición física</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {NIVELES.map(o => (
              <OptionCard key={o.val} icon={o.icon} title={o.val} sub={o.sub}
                selected={form.nivel === o.val} onClick={() => toggle("nivel", o.val)} />
            ))}
          </div>
        </div>

        {/* Objetivo */}
        <div>
          <label className="hf-label">¿Cuál es tu objetivo?</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {OBJETIVOS.map(o => (
              <OptionCard key={o.val} icon={o.icon} title={o.val} sub={o.sub}
                selected={form.objetivo === o.val} onClick={() => toggle("objetivo", o.val)} />
            ))}
          </div>
        </div>

        {/* Tiempo */}
        <div>
          <label className="hf-label">Tiempo disponible por sesión</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {TIEMPOS.map(val => (
              <button key={val} className={`hf-pill${form.tiempo === val ? " sel" : ""}`}
                onClick={() => toggle("tiempo", val)}>{val}</button>
            ))}
          </div>
        </div>

        {/* Días */}
        <div>
          <label className="hf-label">Días a la semana</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {DIAS.map(val => (
              <button key={val} className={`hf-pill${form.dias === val ? " sel" : ""}`}
                onClick={() => toggle("dias", val)}>{val}</button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`hf-btn ${completo ? "on" : "off"}`}
          onClick={() => completo && onGenerar(form)}
          disabled={!completo}
        >
          {completo
            ? "✦ Generar mi plan con IA"
            : `Completa ${4 - filled} ${4 - filled === 1 ? "opción" : "opciones"} más`}
        </button>
      </div>
    </div>
  );
}

// ─── Generando ────────────────────────────────────────────────────────────────
function Generando() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MSGS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "44px", padding: "20px",
    }}>
      <Logo />
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="hf-loader-dot" style={{
              width: "12px", height: "12px", borderRadius: "50%",
              background: ["#22c55e", "#16a34a", "#0e7a2e"][i],
            }} />
          ))}
        </div>
        <p style={{ color: "#22c55e", fontSize: "15px", fontFamily: "monospace", marginBottom: "8px" }}>
          {LOADING_MSGS[msgIdx]}
        </p>
        <p style={{ color: "#1e3a1e", fontSize: "13px" }}>Tu entrenador IA está trabajando...</p>
      </div>
    </div>
  );
}

// ─── Plan parser ─────────────────────────────────────────────────────────────
function parseDays(text) {
  const re = /(?:^|\n)(?:#{1,3}\s*)?(?:\*{1,2})?(?:D[ÍI]A\s*\d+|LUNES|MARTES|MI[ÉE]RCOLES|JUEVES|VIERNES|S[ÁA]BADO|DOMINGO|DAY\s*\d+)(?:[:\s\-–—].*)?(?:\*{1,2})?/gim;
  const matches = [...text.matchAll(re)];
  if (matches.length < 2) return null;

  return matches.map((m, i) => {
    const start = m.index;
    const end   = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const chunk = text.slice(start, end).trim();
    const lines = chunk.split("\n");
    return {
      header: lines[0].replace(/[#*_]/g, "").trim(),
      body:   lines.slice(1).join("\n").trim(),
    };
  });
}

// ─── PlanView ─────────────────────────────────────────────────────────────────
function PlanView({ plan, perfil, onReset }) {
  const [copied, setCopied] = useState(false);
  const days = parseDays(plan);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const badges = [
    { icon: "🎯", val: perfil.objetivo },
    { icon: "⏱",  val: `${perfil.tiempo}/sesión` },
    { icon: "📅", val: `${perfil.dias}/semana` },
    { icon: "💪", val: perfil.nivel },
  ];

  return (
    <div className="hf-fadein" style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px 64px" }}>
      {/* Top bar */}
      <div style={{ padding: "28px 0 24px" }}><Logo /></div>

      {/* Title & badges */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#e8f5e8", letterSpacing: "-0.5px", marginBottom: "14px" }}>
          {perfil.nombre ? `Plan de ${perfil.nombre} 🎯` : "Tu plan personalizado 🎯"}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {badges.map(b => (
            <span key={b.val} className="hf-badge">{b.icon} {b.val}</span>
          ))}
        </div>
      </div>

      {/* Plan content */}
      <div style={{ marginBottom: "20px" }}>
        {days ? (
          days.map((day, i) => (
            <div key={i} className="hf-day">
              <div className="hf-day-head">
                <div className="hf-day-num">{i + 1}</div>
                <span className="hf-day-title">{day.header}</span>
              </div>
              {day.body && <div className="hf-day-body">{day.body}</div>}
            </div>
          ))
        ) : (
          <div style={{
            background: "#090f09", border: "1px solid #1a2a1a",
            borderRadius: "16px", padding: "24px",
            color: "#7aaa7a", fontSize: "14px", lineHeight: 1.9, whiteSpace: "pre-wrap",
          }}>{plan}</div>
        )}
      </div>

      {/* Copy */}
      <button onClick={handleCopy} className="hf-btn-sec" style={{ marginBottom: "12px" }}>
        {copied ? "✓ Copiado al portapapeles" : "📋 Copiar plan completo"}
      </button>

      {/* Subscribe */}
      <div className="hf-sub-card" style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>🔐</div>
        <h3 style={{ color: "#e8f5e8", fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>
          Plan de prueba gratuito
        </h3>
        <p style={{ color: "#3d6b3d", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
          Suscríbete para nuevos planes cada semana,<br />seguimiento de progreso y más.
        </p>
        <button className="hf-btn on" style={{ maxWidth: "280px", margin: "0 auto", display: "block" }}>
          Suscribirme por $9/mes →
        </button>
      </div>

      {/* Reset */}
      <button onClick={onReset} className="hf-btn-sec">← Crear otro plan</button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function HomeFitApp() {
  const [step,   setStep]   = useState("perfil");
  const [perfil, setPerfil] = useState(null);
  const [plan,   setPlan]   = useState("");

  const handleGenerar = async (form) => {
    setPerfil(form);
    setStep("generando");
    try {
      const prompt = `Eres un entrenador personal. Crea un plan de entrenamiento semanal en casa sin equipo para: Nivel: ${form.nivel}, Objetivo: ${form.objetivo}, Tiempo: ${form.tiempo}, Días: ${form.dias}. Organiza por días con ejercicios específicos, series y repeticiones.`;
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setPlan(data.content?.[0]?.text || data.plan || "Error generando el plan.");
    } catch {
      setPlan("Error de conexión. Intenta de nuevo.");
    }
    setStep("plan");
  };

  return (
    <div className="hf-app">
      <style>{CSS}</style>
      {step === "perfil"    && <PerfilForm onGenerar={handleGenerar} />}
      {step === "generando" && <Generando />}
      {step === "plan"      && <PlanView plan={plan} perfil={perfil} onReset={() => setStep("perfil")} />}
    </div>
  );
}
