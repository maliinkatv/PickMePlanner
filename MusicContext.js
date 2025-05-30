// MusicContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tracks = [
  require('./assets/sounds/track1.mp3'),
  require('./assets/sounds/track2.mp3'),
  require('./assets/sounds/track3.mp3'),
  require('./assets/sounds/track4.mp3'),
  require('./assets/sounds/track5.mp3'),
  require('./assets/sounds/track6.mp3'),// ахахахахаахаххахахахахаххахаххах
  require('./assets/sounds/track7.mp3'), // 👈 пикме нужна пажежка вкючи эта видео ччччччччччч ну ты тиво не растраивайся этафсиволишиграааанирастраивайся
];


const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [trackIndex, setTrackIndex] = useState(null);

  useEffect(() => {
    const loadMusic = async () => {
      const saved = await AsyncStorage.getItem('music');
      if (saved !== null) {
        playTrack(Number(saved));
      }
    };
    loadMusic();

    return () => {
      stopTrack();
    };
  }, []);

  const playTrack = async (index) => {
    try {
      await stopTrack();

      const { sound: newSound } = await Audio.Sound.createAsync(tracks[index], { isLooping: true });
      setSound(newSound);
      setTrackIndex(index);
      await newSound.playAsync();
      await AsyncStorage.setItem('music', index.toString());
    } catch (e) {
      console.warn('Ошибка воспроизведения:', e);
    }
  };

  const stopTrack = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setTrackIndex(null);
      await AsyncStorage.removeItem('music');
    }
  };

  return (
    <MusicContext.Provider value={{ playTrack, stopTrack, currentTrack: trackIndex }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
