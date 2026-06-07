const https = require('https');

exports.handler = async function(event) {
  const body = JSON.parse(event.body);
  
  const response = await new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: body.messages
    });
    
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => { resolve(responseData); });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
  
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: response
  };
};
