const https = require("https");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mediaType, mealType, userProfile } = req.body;

    const prompt = `Eres un nutricionista experto. Analiza esta foto de ${mealType} de un paciente con el siguiente perfil:
- Género: ${userProfile.genero}
- Edad: ${userProfile.edad} años
- Peso: ${userProfile.peso} kg
- Estatura: ${userProfile.estatura} cm
- Objetivo: ${userProfile.objetivo === "bajar" ? "bajar de peso" : userProfile.objetivo === "ganar" ? "ganar músculo" : "mantener peso"}
- Nivel de actividad: ${userProfile.actividad}

Identifica los alimentos visibles en el plato y estima las cantidades aproximadas. Luego responde ÚNICAMENTE con un JSON válido (sin texto adicional) con este formato exacto:
{
  "alimentos": ["alimento 1 (cantidad aprox)", "alimento 2 (cantidad aprox)"],
  "calorias_total": 450,
  "proteinas_g": 25,
  "carbohidratos_g": 55,
  "grasas_g": 15,
  "fibra_g": 5,
  "sodio_mg": 600,
  "vitamina_c_mg": 20,
  "calcio_mg": 80,
  "hierro_mg": 3,
  "semaforo": "verde",
  "comentario": "Este plato es nutritivo y equilibrado para tu objetivo.",
  "sugerencia": "Podrías agregar más verduras para aumentar la fibra."
}

El semaforo debe ser: "verde" (saludable para el objetivo), "amarillo" (aceptable pero mejorable), o "rojo" (no recomendado para el objetivo).`;

    const requestBody = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const result = await new Promise((resolve, reject) => {
      const request = https.request(
        {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        },
        (response) => {
          let data = "";
          response.on("data", (chunk) => (data += chunk));
          response.on("end", () => resolve(JSON.parse(data)));
        }
      );
      request.on("error", reject);
      request.write(requestBody);
      request.end();
    });

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    const text = result.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const nutrition = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    return res.status(200).json(nutrition);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
