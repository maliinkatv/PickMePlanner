import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useMusic } from '../MusicContext';

export default function SettingsScreen({ navigation }) {
  const { playTrack, stopTrack, currentTrack } = useMusic();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>‧₊˚🖇️₊˚🎧⊹♡Музыкальный вайб ‧₊✩🎧⊹♡
      настроиться на написание 🎧 подробностей дня мrrr ‧₊♪ ₊˚🖇️𝄞₊⊹</Text>
      {[...Array(7).keys()].map((index) => (
        <OptionButton
          key={index}
          title={`⋆｡ﾟ♪ Трек ${index + 1} ♪｡ﾟ⋆`}
          selected={currentTrack === index}
          onPress={() => playTrack(index)}
        />
      ))}

      <OptionButton title="🚫 Выключить музыку (っ- ‸ - ς)" onPress={stopTrack} />

      <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.saveButtonText}>๋⭑♡⋆˚Вернуться к календарю ✧⭑๋♡</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function OptionButton({ title, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d63384',
    marginVertical: 12,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#ffe4e1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f4a6b1',
    marginVertical: 6,
  },
  selectedOption: {
    backgroundColor: '#fbb6c6',
    borderColor: '#d63384',
  },
  optionText: {
    color: '#5C2B2B',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#f38cab',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
