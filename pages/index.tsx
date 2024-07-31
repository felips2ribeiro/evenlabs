import { useEffect, useState } from "react";

export default function Home() {
  const [voices, setVoices] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    async function fetchVoices() {
      const response = await fetch('/api/voices');
      const data = await response.json();
      setVoices(data.voices);
    }
    fetchVoices();
  }, []);

  const playVoiceSample = (previewUrl: string) => {
    const audio = new Audio(previewUrl);
    audio.play();
  };

  const handlePlayText = async (voiceId: string) => {
    console.log(voiceId)
    const response = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId }),
    });
    const data = await response.json();
    console.log(data.url)
    const audio = new Audio(data.url);  // Usa o URL do blob
    audio.play();
  };

  return (
    <div className="container">
      <h1 className="title">Text to Speech</h1>
      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite seu texto aqui..."
      />
      <div className="voiceList">
        {voices.map((voice) => (
          <div key={voice.id} className="voiceItem">
            <h2 className="voiceName">{voice.name}</h2>
            <p className="voiceDescription">{voice.description}</p>
            <button
              className="button"
              onClick={() => playVoiceSample(voice.preview_url)}
            >
              Play Sample
            </button>
            <button
              className="button"
              onClick={() => handlePlayText(voice.voice_id)}
            >
              Play Text
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
