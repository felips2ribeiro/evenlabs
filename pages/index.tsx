import { useState, useEffect } from 'react';
import { Button, Loader, Textarea, Container, Title, Group, Paper } from '@mantine/core'; // Mantine components

interface Labels {
  [key: string]: string
}

interface AudioPlayerProps{
  previewUrl: string;
}

const VoiceLabels = ({ labels }: {labels: Labels}) => {
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

const AudioPlayer = ({ previewUrl }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio(previewUrl);
    setAudio(audioElement);

    return () => {
      // Limpar o áudio quando o componente desmontar ou o previewUrl mudar
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, [previewUrl]);

  useEffect(() => {
    if (audio) {
      playing ? audio.play() : audio.pause();
    }
  }, [playing, audio]);

  const handlePlayPause = () => {
    if (audio) {
      if (playing) {
        audio.pause();
      } else {
        audio.play();
      }
      setPlaying(!playing);
    }
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
      <Title mt={20} order={1}>Text to Speech</Title>
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
              <Group>
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