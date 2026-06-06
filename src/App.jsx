import { useState } from "react";

const niveles = ["Principiante absoluto", "Algo de base", "Intermedio"];
const objetivos = ["Perder peso", "Ganar músculo", "Mejorar resistencia", "Sentirme con más energía"];
const tiempos = ["15 min", "30 min", "45 min", "60 min"];
const diasOpc = ["2 días", "3 días", "4 días", "5 días"];

const Tag = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "10px 18px", borderRadius: "100px",
    border: ⁠ 1.5px solid ${selected ? "#22c55e" : "#2a3a2a"} ⁠,
    background: selected ? "#22c55e18" : "transparent",
    color: selected ? "#22c55e" : "#6b7f6b",
    cursor: "pointer", fontSize: "14px", transition: "all 0.18s",
    fontFamily: "sans-serif", fontWeight: selected ? "600" : "400",
  }}>{label}</button>
);

function PerfilForm({ onGenerar }) {
  const [form, setForm] = useState({ nivel: "", objetivo: "", tiempo: "", dias: "", nombre: "" });
  const toggle = (key, val) => setForm(f => ({ ...f, [key]: f[key] === val ? "" : val }));
  const completo = form.nivel && form.objetivo && form.tiempo && form.dias;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 20px 60px" }}>
      <div style={{ textAlign: "center", padding: "52px 0 40px" }}>
        <h1 style={{ fontSize: "40px", color: "#e8f5e8", margin: "0 0 12px" }}>
          Tu plan de entreno,<br /><span style={{ color: "#22c55e" }}>sin salir de casa</span>
        </h1>
        <p style={{ color: "#6b7f6b", fontSize: "15px" }}>Responde 4 preguntas y la IA crea tu plan</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <label style={{ display: "block", color: "#a0b8a0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>¿Cómo te llamas? (opcional)</label>
          <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tu nombre..." style={{ width: "100%", padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #2a3a2a", background: "#0e1a0e", color: "#e8f5e8", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
        </div>
        {[
          { key: "nivel", label: "Nivel de condición física", opts: niveles },
          { key: "objetivo", label: "¿Cuál es tu objetivo?", opts: objetivos },
          { key: "tiempo", label: "Tiempo disponible por sesión", opts: tiempos },
          { key: "dias", label: "Días a la semana", opts: diasOpc },
        ].map(({ key, label, opts }) => (
          <div key={key}>
            <label style={{ display: "block", color: "#a0b8a0", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>{label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {opts.map(o => <Tag key={o} label={o} selected={form[key] === o} onClick={() => toggle(key, o)} />)}
            </div>
          </div>
        ))}
        <button onClick={() => completo && onGenerar(form)} style={{ width: "100%", padding: "18px", borderRadius: "14px", border: "none", background: completo ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#1a2a1a", color: completo ? "#fff" : "#3a4f3a", fontSize: "16px", fontWeight: "600", cursor: completo ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
          {completo ? "✦ Generar mi plan con IA" : "Completa las opciones para continuar"}
        </button>
      </div>
    </div>
  );
}

function Generando() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "28px" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "2px solid #22c55e", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <style>{⁠ @keyframes spin { to { transform: rotate(360deg); } } ⁠}</style>
      <p style={{ color: "#22c55e", fontFamily: "monospace", fontSize: "15px" }}>Generando tu plan...</p>
    </div>
  );
}

function PlanView({ plan, perfil, onReset }) {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px 60px" }}>
      <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
        <h2 style={{ fontSize: "28px", color: "#e8f5e8", margin: "0 0 8px" }}>
          {perfil.nombre ? ⁠ Plan de ${perfil.nombre} ⁠ : "Tu plan personalizado"}
        </h2>
        <p style={{ color: "#6b7f6b", fontSize: "14px", margin: 0 }}>{perfil.objetivo} · {perfil.tiempo}/sesión · {perfil.dias}/semana</p>
      </div>
      <div style={{ background: "#0e1a0e", border: "1px solid #2a3a2a", borderRadius: "16px", padding: "24px", color: "#c8e6c8", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {plan}
      </div>
      <div style={{ marginTop: "28px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "28px", textAlign: "center" }}>
        <h3 style={{ color: "#e8f5e8", fontSize: "18px", margin: "0 0 8px" }}>🔒 Este es tu plan de prueba gratis</h3>
        <p style={{ color: "#6b7f6b", fontSize: "13px", margin: "0 0 20px", lineHeight: 1.6 }}>Con la suscripción obtienes nuevos planes cada semana y seguimiento de progreso.</p>
        <button style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "15px", fontWeight: "600", cursor: "pointer", width: "100%" }}>
          Suscribirme por $9/mes →
        </button>
      </div>
      <button onClick={onReset} style={{ width: "100%", marginTop: "16px", padding: "14px", background: "transparent", border: "1px solid #2a3a2a", borderRadius: "10px", color: "#3a5a3a", cursor: "pointer", fontSize: "14px" }}>← Crear otro plan</button>
    </div>
  );
}

export default function HomeFitApp() {
  const [step, setStep] = useState("perfil");
  const [perfil, setPerfil] = useState(null);
  const [plan, setPlan] = useState("");

  const handleGenerar = async (form) => {
    setPerfil(form);
    setStep("generando");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: ⁠ Eres un entrenador personal. Crea un plan de entrenamiento semanal en casa sin equipo para: Nivel: ${form.nivel}, Objetivo: ${form.objetivo}, Tiempo: ${form.tiempo}, Días: ${form.dias}. Organiza por días con ejercicios específicos, series y repeticiones. ⁠ }],
        }),
      });
      const data = await res.json();
      setPlan(data.content?.[0]?.text || "Error generando el plan.");
    } catch {
      setPlan("Error de conexión. Intenta de nuevo.");
    }
    setStep("plan");
  };

  return (
    <div style={{ background: "#060e06", minHeight: "100vh" }}>
      {step === "perfil" && <PerfilForm onGenerar={handleGenerar} />}
      {step === "generando" && <Generando />}
      {step === "plan" && <PlanView plan={plan} perfil={perfil} onReset={() => setStep("perfil")} />}
    </div>
  );
}
