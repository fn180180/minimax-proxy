// api/proxy.js
export default async function handler(req, res) {
  // 只允許 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 從 body 取參數
  const { text, voice_id, api_key } = req.body;

  if (!text || !voice_id || !api_key) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // 發給 Minimax
  const externalRes = await fetch(
    'https://api.minimax.chat/v1/t2a/create',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'speech-01',
        text,
        voice_id,
        speed: 1.0,
        vol: 1.0
      })
    }
  );

  if (!externalRes.ok) {
    const err = await externalRes.text();
    return res.status(externalRes.status).json({ error: err });
  }

  const data = await externalRes.json();
  return res.status(200).json(data);
}
