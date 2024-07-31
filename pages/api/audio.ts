import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// Handler para o upload de áudio
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { text, voiceId } = await request.json();
  
  // Faça a solicitação para o serviço de texto-para-fala
  const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}/synthesize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const audioBuffer = await response.arrayBuffer();
  const fileName = `audio-${Date.now()}.mp3`;

  // Faça o upload para o Vercel Blob
  const blob = await put(fileName, new Uint8Array(audioBuffer), { access: 'public' });

  return NextResponse.json(blob);
}

// A configuração abaixo é necessária para rotas da API do Pages
export const config = {
  api: {
    bodyParser: false,
  },
};
