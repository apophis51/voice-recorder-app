'use client'
import React, { useState, useEffect, useRef } from 'react';

function AudioPlayer() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Correctly initialize to null

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('sample-3s.mp3'); // Replace with your audio URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();

    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div>
      {audioUrl && (
        <div>
          <button onClick={togglePlayback} disabled={!audioUrl}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <audio ref={audioRef} src={audioUrl} controls style={{display: 'none'}}/>
        </div>
      )}
      {!audioUrl && <p>Loading audio...</p>}
    </div>
  );
}

export default AudioPlayer;