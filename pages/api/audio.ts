// pages/api/audio.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { text, voiceId } = req.body;

    // Solicita o áudio do serviço de texto-para-fala
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': `sk_421db8e3bca06bcf8251dd9c80d8a099424c498dbaa16c4b`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });


    const audioBuffer = await response.arrayBuffer();
    const fileName = `audio-${Date.now()}.mp3`;

    // Faz o upload do áudio para o Vercel Blob
    const blob = await put(fileName, new Uint8Array(audioBuffer), { access: 'public' });

    res.status(200).json(blob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
