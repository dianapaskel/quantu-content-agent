import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  pillars: ["Data Intelligence", "Predictive AI", "Actionable Decisions"],
  audience: ["CEO/Founder", "Finance Manager", "Operations Manager"],
  keyMessages: [
    "Your data already knows.",
    "31 signals hidden inside your distribution data.",
    "Predict risks and opportunities.",
    "Know what to do next.",
    "AI Decision Intelligence for Distributors."
  ]
};

const PLATFORMS = ["LinkedIn","TikTok","Instagram","Facebook","YouTube"];
const PLATFORM_ICONS = { LinkedIn:"💼", TikTok:"🎵", Instagram:"📸", Facebook:"📘", YouTube:"▶️" };

const STEPS = ["Contexto","Trends","Noticias","Score","Script"];

export default function App() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(["LinkedIn","TikTok","Instagram"]);
  const [focus, setFocus] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("trends");
  const [teleprompter, setTeleprompter] = useState(null);

  const togglePlatform = (p) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const addLog = (icon, text, delay = 0) => new Promise(res =>
    setTimeout(() => {
      setLogs(prev => [...prev, { icon, text, id: Date.now() + Math.random() }]);
      res();
    }, delay)
  );

  const runAgent = async () => {
    if (!selectedPlatforms.length) return;
    setRunning(true);
    setResults(null);
    setLogs([]);
    setCurrentStep(0);

    await addLog("🧠", "Cargando contexto de marca: Quantu", 0);
    await addLog("📌", `Pilares: ${BRAND.pillars.join(" · ")}`, 400);
    setCurrentStep(1);
    await addLog("🔍", `Analizando trends en: ${selectedPlatforms.join(", ")}`, 900);
    await addLog("📊", "Escaneando señales en redes sociales...", 1400);
    setCurrentStep(2);
    await addLog("📰", "Buscando noticias sobre AI y distribución...", 1900);
    setCurrentStep(3);
    await addLog("⚡", "Calculando score de relevancia...", 2400);
    setCurrentStep(4);
    await addLog("✍️", "Generando scripts virales...", 2900);

    const systemPrompt = `You are a viral content strategy agent for Quantu, an AI Decision Intelligence platform for distribution companies.
Brand: Positioning as AI Decision Intelligence for Distributors. Pillars: ${BRAND.pillars.join(", ")}. Audience: ${BRAND.audience.join(", ")} in mid-size distribution companies. Key messages: ${BRAND.keyMessages.join(" | ")}.
Platforms: ${selectedPlatforms.join(", ")}.${focus ? ` Focus topic: "${focus}".` : ""}
Respond ONLY with valid JSON (no markdown, no explanation):
{"trends":[{"id":1,"title":"","type":"hot|viral|medium","platforms":[],"relevanceScore":85,"pillar":"","angle":""}],"news":[{"id":1,"title":"","source":"","pillar":"","relevanceScore":90,"hook":""}],"scripts":[{"platform":"","trendId":1,"viralPotential":"High|Very High|Explosive","hook":"","hooks":[],"body":"","cta":"","hashtags":[],"trendingHashtags":[],"format":"","duration":""}]}
Generate 6 trends, 5 news, 3 scripts. Make scripts genuinely viral with pattern interrupts, specific numbers, curiosity gaps.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: systemPrompt }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(i => i.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
      setCurrentStep(5);
      await addLog("✅", `${parsed.trends.length} trends · ${parsed.news.length} noticias · ${parsed.scripts.length} scripts`, 200);
    } catch (e) {
      await addLog("❌", `Error: ${e.message}`, 0);
    }
    setRunning(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "'DM Mono', monospace", padding: "32px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6b1a", boxShadow: "0 0 16px #ff6b1a88" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>Quantu</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#ff6b1a", border: "1px solid #ff6b1a", padding: "3px 12px", borderRadius: 100, letterSpacing: "0.1em" }}>CONTENT AGENT</span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
          Content <span style={{ color: "#ff6b1a" }}>Intelligence</span> Agent
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 40 }}>Detecta trends · Busca noticias · Genera scripts virales alineados a Quantu</p>

        {/* Steps */}
        <div style={{ display: "flex", gap: 0, marginBottom: 36, background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "12px 8px", textAlign: "center", fontSize: 11,
              background: currentStep === i ? "rgba(255,107,26,0.15)" : currentStep > i ? "rgba(34,197,94,0.08)" : "#111",
              color: currentStep === i ? "#ff6b1a" : currentStep > i ? "#22c55e" : "#555",
              borderRight: i < 4 ? "1px solid #222" : "none",
              transition: "all 0.3s"
            }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid currentColor`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: 10 }}>
                {currentStep > i ? "✓" : i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>

        {/* Config */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 700 }}>Plataformas</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => togglePlatform(p)} style={{
                padding: "7px 16px", borderRadius: 100, border: `1px solid ${selectedPlatforms.includes(p) ? "#ff6b1a" : "#333"}`,
                background: selectedPlatforms.includes(p) ? "rgba(255,107,26,0.15)" : "#1a1a1a",
                color: selectedPlatforms.includes(p) ? "#ff6b1a" : "#666",
                fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", transition: "all 0.2s"
              }}>
                {PLATFORM_ICONS[p]} {p}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>Tema de Enfoque (opcional)</div>
          <input value={focus} onChange={e => setFocus(e.target.value)}
            placeholder="ej: crisis de inventario, margen bruto..."
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#f0f0f0", fontFamily: "'DM Mono', monospace", fontSize: 12, outline: "none", marginBottom: 20, boxSizing: "border-box" }} />

          <button onClick={runAgent} disabled={running} style={{
            width: "100%", background: running ? "#333" : "#ff6b1a", color: running ? "#666" : "#000",
            border: "none", borderRadius: 10, padding: "14px 32px", fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 700, cursor: running ? "not-allowed" : "pointer", textTransform: "uppercase",
            letterSpacing: "0.06em", transition: "all 0.2s"
          }}>
            {running ? "⏳ Analizando..." : "⚡ Ejecutar Agente"}
          </button>
        </div>

        {/* Log */}
        {logs.length > 0 && (
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Agent Log</div>
            {logs.map(l => (
              <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", gap: 10, fontSize: 12, color: "#888", marginBottom: 4 }}>
                <span>{l.icon}</span><span>{l.text}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #222", paddingBottom: 0 }}>
              {["trends","news","scripts"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: "10px 20px", background: "none", border: "none",
                  borderBottom: `2px solid ${activeTab === t ? "#ff6b1a" : "transparent"}`,
                  color: activeTab === t ? "#ff6b1a" : "#666",
                  fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer", marginBottom: -1,
                  textTransform: "capitalize"
                }}>
                  {t === "trends" ? "📈 Trends" : t === "news" ? "📰 Noticias" : "✍️ Scripts"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                {activeTab === "trends" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {results.trends.map(t => (
                      <div key={t.id} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: 18, borderTop: `2px solid ${t.type === "hot" ? "#ff6b1a" : t.type === "viral" ? "#a855f7" : "#3b82f6"}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, flex: 1 }}>{t.title}</div>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(255,107,26,0.15)", color: "#ff6b1a", flexShrink: 0, marginLeft: 8 }}>{t.relevanceScore}%</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#ff6b1a", marginBottom: 6 }}>📌 {t.pillar}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                          {(t.platforms || []).map(p => <span key={p} style={{ fontSize: 10, padding: "2px 8px", border: "1px solid #333", borderRadius: 4, color: "#666" }}>{p}</span>)}
                        </div>
                        <div style={{ fontSize: 12, color: "#666", borderTop: "1px solid #222", paddingTop: 10 }}>{t.angle}</div>
                        <div style={{ marginTop: 10, height: 3, background: "#222", borderRadius: 2 }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${t.relevanceScore}%` }} transition={{ duration: 1, delay: 0.2 }}
                            style={{ height: "100%", background: "#ff6b1a", borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "news" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {results.news.map(n => (
                      <div key={n.id} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: 16, display: "flex", gap: 14 }}>
                        <div style={{ fontSize: 20, flexShrink: 0 }}>📦</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{n.source} · {n.pillar}</div>
                          <div style={{ fontSize: 11, color: "#22c55e" }}>✓ {n.hook}</div>
                        </div>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(255,107,26,0.15)", color: "#ff6b1a", alignSelf: "flex-start" }}>{n.relevanceScore}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "scripts" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {results.scripts.map((s, i) => (
                      <div key={i} style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                            {PLATFORM_ICONS[s.platform]} {s.platform}
                            <span style={{ fontSize: 12, color: "#666", fontFamily: "'DM Mono', monospace", fontWeight: 400 }}>{s.format} · {s.duration}</span>
                          </div>
                          <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 100, background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)" }}>🔥 {s.viralPotential}</span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>🎣 Hook Principal</div>
                          <div style={{ fontSize: 13, background: "#1a1a1a", borderRadius: 8, padding: "12px 14px", borderLeft: "2px solid #ff6b1a", lineHeight: 1.7 }}>{s.hook}</div>
                        </div>

                        {s.hooks?.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 10, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>🎯 Hooks Alternativos</div>
                            {s.hooks.map((h, j) => (
                              <div key={j} style={{ fontSize: 12, background: "#1a1a1a", borderRadius: 8, padding: "8px 12px", border: "1px solid #222", marginBottom: 6, display: "flex", gap: 8 }}>
                                <span style={{ color: "#ff6b1a" }}>{j + 1}.</span>{h}
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>📝 Script</div>
                          <div style={{ fontSize: 13, background: "#1a1a1a", borderRadius: 8, padding: "12px 14px", borderLeft: "2px solid #ff6b1a", lineHeight: 1.8, whiteSpace: "pre-wrap",
                            ...(teleprompter === i ? { height: 160, overflowY: "auto" } : {}) }}
                            ref={el => { if (teleprompter === i && el) { el.scrollTop = 0; const id = setInterval(() => { el.scrollTop += 1; if (el.scrollTop + el.clientHeight >= el.scrollHeight) { clearInterval(id); setTeleprompter(null); } }, 50); return () => clearInterval(id); } }}>
                            {s.body}
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 10, color: "#ff6b1a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>📣 CTA</div>
                          <div style={{ fontSize: 13, background: "#1a1a1a", borderRadius: 8, padding: "10px 14px", borderLeft: "2px solid #ff6b1a" }}>{s.cta}</div>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                          {(s.hashtags || []).map(h => <span key={h} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 100, background: "#1a1a1a", border: "1px solid #333", color: "#666" }}>#{h.replace("#","")}</span>)}
                          {(s.trendingHashtags || []).map(h => <span key={h} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 100, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>#{h.replace("#","")}</span>)}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => navigator.clipboard.writeText(s.body)} style={{ padding: "7px 14px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#666", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer" }}>📋 Copiar Script</button>
                          <button onClick={() => setTeleprompter(teleprompter === i ? null : i)} style={{ padding: "7px 14px", background: teleprompter === i ? "rgba(255,107,26,0.15)" : "#1a1a1a", border: `1px solid ${teleprompter === i ? "#ff6b1a" : "#333"}`, borderRadius: 8, color: teleprompter === i ? "#ff6b1a" : "#666", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer" }}>▶ Teleprompter</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
