import { useState, useEffect } from 'react';
import { Button, Loader, Textarea, Container, Title, Group, Paper } from '@mantine/core'; // Mantine components

const VoiceLabels = ({ labels }) => {
  const labelKeys = Object.keys(labels).sort();

  return (
    <div>
      {labelKeys.map((key) => (
        <p key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {labels[key]}
        </p>
      ))}
    </div>
  );
};

const AudioPlayer = ({ previewUrl }) => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio(previewUrl));
  }, [previewUrl]);

  const handlePlayPause = () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  return (
    <div>
      <Button onClick={handlePlayPause}>
        {playing ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
};

export default function Home() {
  const [voices, setVoices] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVoices() {
      setLoading(true);
      try {
        const response = await fetch('/api/voices');
        const data = await response.json();
        setVoices(data.voices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVoices();
  }, []);


  const handlePlayText = async (voiceId: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId }),
      });
      const data = await response.json();
      const audio = new Audio(data.url);
      audio.play();
    } catch (error) {
      console.error('Error playing text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title mt={20} order={1}>Texto Para ser Escrito</Title>
      <Paper shadow="xs">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite seu texto aqui..."
          minRows={4}
          style={{ marginBottom: 20, marginTop: 20 }}
        />
      </Paper>
      <div style={{ marginTop: 20 }}>
        <div className="voiceList">
          {voices.map((voice) => (
            <Paper shadow='lg' p="lg" key={voice.id} style={{ marginBottom: 10 }}>
              <Title order={3}>{voice.name}</Title>
              <p><strong>Category: </strong>{voice.category}</p>
              <VoiceLabels labels={voice.labels} />
              <p>{voice.description}</p>
              <Group spacing="md">
                <AudioPlayer previewUrl={voice.preview_url} />
                <Button
                  onClick={() => handlePlayText(voice.voice_id)}
                  disabled={loading || !text.trim()}
                >
                  {loading ? <Loader size="sm" /> : 'Play Text'}
                </Button>
              </Group>
            </Paper>
          ))}
        </div>
      </div>
    </Container>
  );
}