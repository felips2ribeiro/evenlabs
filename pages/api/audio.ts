import type { NextApiRequest, NextApiResponse } from 'next';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text, voiceId } = req.body;
  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/synthesize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const audioBuffer = await response.arrayBuffer();
  const filePath = `.public/tmp/audio-${Date.now()}.mp3`;
  await writeFileAsync(filePath, new Uint8Array(audioBuffer));

  res.status(200).json({ filePath });
}
