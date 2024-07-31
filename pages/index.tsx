import { useEffect, useState } from "react";

export default function Home() {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
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
    const response = await fetch('/api/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId }),
    });
    const data = await response.json();
    console.log(data.filePath)
    const audio = new Audio("tmp/audio-1722442920751.mp3");
    audio.play();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Text to Speech</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite seu texto aqui..."
        style={styles.textarea}
      />
      <div style={styles.voiceList}>
        {voices.map((voice) => (
          <div key={voice.id} style={styles.voiceItem}>
            <h2 style={styles.voiceName}>{voice.name}</h2>
            <p style={styles.voiceDescription}>{voice.description}</p>
            <button
              style={styles.button}
              onClick={() => playVoiceSample(voice.preview_url)}
            >
              Play Sample
            </button>
            <button
              style={styles.button}
              onClick={() => handlePlayText(voice.id)}
            >
              Play Text
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  voiceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  voiceItem: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
  },
  voiceName: {
    margin: '0',
  },
  voiceDescription: {
    margin: '5px 0',
  },
  button: {
    marginRight: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};
