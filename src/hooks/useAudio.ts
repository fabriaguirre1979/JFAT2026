import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

interface AudioOptions {
  src: string[];
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
  preload?: boolean;
}

export function useAudio(options: AudioOptions) {
  const [sound, setSound] = useState<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(options.volume ?? 0.3);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const howl = new Howl({
      src: options.src,
      volume: options.volume ?? 0.3,
      loop: options.loop ?? false,
      autoplay: options.autoplay ?? false,
      preload: options.preload ?? true,
      html5: true,
      onload: () => setSound(howl),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });

    return () => {
      howl.unload();
    };
  }, [options.src.join(',')]);

  const play = () => sound?.play();
  const pause = () => sound?.pause();
  const stop = () => sound?.stop();
  const setVolume = (v: number) => {
    setVolumeState(v);
    sound?.volume(v);
  };
  const toggle = () => (isPlaying ? pause() : play());

  return { sound, isPlaying, volume, play, pause, stop, setVolume, toggle };
}

export function useAmbientAudio() {
  return useAudio({
    src: ['/sounds/ambient.mp3'],
    volume: 0.15,
    loop: true,
    autoplay: false,
    preload: true,
  });
}

export function useInteractionAudio() {
  return useAudio({
    src: ['/sounds/click.mp3'],
    volume: 0.25,
    loop: false,
    autoplay: false,
    preload: true,
  });
}

export function useHoverAudio() {
  return useAudio({
    src: ['/sounds/hover.mp3'],
    volume: 0.1,
    loop: false,
    autoplay: false,
    preload: true,
  });
}