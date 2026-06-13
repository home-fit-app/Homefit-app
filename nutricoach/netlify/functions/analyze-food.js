const https = require("https");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const { imageBase64, mediaType, mealType, userProfile } = JSON.parse(event.body);

    const prompt = `Eres un nutricionista experto. Analiza esta foto de ${mealType} de un paciente con el siguiente perfil:
- Género: ${userProfile.genero}
- Edad: ${userProfile.edad} años
- Peso: ${userProfile.peso} kg
- Estatura: ${userProfile.estatura} cm
- Objetivo: ${userProfile.objetivo === "bajar" ? "bajar de peso" : userProfile.objetivo === "ganar" ? "ganar músculo" : "mantener peso"}

Identifica los alimentos visibles y estima cantidades. Responde ÚNICAMENTE con JSON válido:
{
  "alimentos": ["alimento 1 (cantidad)", "alimento 2 (cantidad)"],
  "calorias_total": 450,
  "proteinas_g": 25,
  "carbohidratos_g": 55,
  "grasas_g": 15,
  "fibra_g": 5,
  "sodio_mg": 600,
  "semaforo": "verde",
  "comentario": "Evaluación breve.",
  "sugerencia": "Qué mejorar."
}
Semaforo: verde=saludable, amarillo=mejorable, rojo=no recomendado.`;

    const requestBody = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } }, { type: "text", text: prompt }] }],
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({ hostname: "api.anthropic.com", path: "/v1/messages", method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "Content-Length": Buffer.byteLength(requestBody) }
      }, (res) => { let data = ""; res.on("data", c => data += c); res.on("end", () => resolve(JSON.parse(data))); });
      req.on("error", reject); req.write(requestBody); req.end();
    });

    if (result.error) return { statusCode: 500, headers, body: JSON.stringify({ error: result.error.message }) };
    const text = result.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return { statusCode: 200, headers, body: jsonMatch ? jsonMatch[0] : text };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
