const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body;
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: body.messages,
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(data),
        },
      };
      const apiReq = https.request(options, (apiRes) => {
        let chunks = '';
        apiRes.on('data', (c) => (chunks += c));
        apiRes.on('end', () => resolve(chunks));
      });
      apiReq.on('error', reject);
      apiReq.write(data);
      apiReq.end();
    });

    res.status(200).json(JSON.parse(result));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
