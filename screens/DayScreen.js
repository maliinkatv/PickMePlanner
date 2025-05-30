import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  parseISO,
  isBefore,
} from 'date-fns';

const emojiList = ['🥰', '😔', '🥺', '💀', '😈', '🥵', '🤬', '🍻', '🤙', '🌸', '🕷', '🚬', '💅', '🍓'];

export default function DayScreen({ route }) {
  const { date } = route.params;
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [dateDiffText, setDateDiffText] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>🏠🔚 </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Text style={{ fontSize: 20 }}>⚙️♪</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      const savedText = await AsyncStorage.getItem(`entry-${date}`);
      const savedPhotos = await AsyncStorage.getItem(`photos-${date}`);
      const savedMood = await AsyncStorage.getItem(`mood-${date}`);

      if (savedText) setText(savedText);

      try {
        const parsedPhotos = savedPhotos ? JSON.parse(savedPhotos) : [];
        setPhotos(Array.isArray(parsedPhotos) ? parsedPhotos : []);
      } catch {
        setPhotos([]);
      }

      try {
        const parsedMood = savedMood ? JSON.parse(savedMood) : [];
        setSelectedEmotions(Array.isArray(parsedMood) ? parsedMood : []);
      } catch {
        setSelectedEmotions([]);
      }
    };

    const calculateDiff = () => {
      const targetDate = parseISO(date);
      const today = new Date();
      const isFuture = isBefore(today, targetDate);
      const from = isFuture ? today : targetDate;
      const to = isFuture ? targetDate : today;

      const years = differenceInYears(to, from);
      const months = differenceInMonths(to, from) % 12;
      const weeks = differenceInWeeks(to, from) % 4;
      const days = differenceInDays(to, from) % 7;

      const prefix = isFuture ? 'До этой даты:' : 'Прошло:';
      const diffString = `${prefix} ${years} г., ${months} мес., ${weeks} нед., ${days} д.`;

      setDateDiffText(diffString);
    };

    loadData();
    calculateDiff();
  }, [date]);

  const toggleEmotion = (emoji) => {
    setSelectedEmotions((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const saveEntry = async () => {
    const existingMeta = await AsyncStorage.getItem(`meta-entry-${date}`);
    const createdAt = existingMeta ? JSON.parse(existingMeta)?.createdAt : new Date().toISOString();

    if (text.trim().length > 0) {
      await AsyncStorage.setItem(`entry-${date}`, text);
      await AsyncStorage.setItem(`meta-entry-${date}`, JSON.stringify({ createdAt }));
    } else {
      await AsyncStorage.removeItem(`entry-${date}`);
      await AsyncStorage.removeItem(`meta-entry-${date}`);
    }

    if (photos.length > 0) {
      await AsyncStorage.setItem(`photos-${date}`, JSON.stringify(photos));
    } else {
      await AsyncStorage.removeItem(`photos-${date}`);
    }

    await AsyncStorage.setItem(`mood-${date}`, JSON.stringify(selectedEmotions));

    Alert.alert('Сохранено!');
    navigation.navigate('Calendar', { refresh: true });
  };

  const pickImage = async () => {
    if (photos.length >= 10) {
      Alert.alert('Максимум 10 фото');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index) => {
    Alert.alert('Удалить фото?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => {
          const updatedPhotos = photos.filter((_, i) => i !== index);
          setPhotos(updatedPhotos);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.date}>        ⋆. 𐙚 ˚Денёчек: {date} ⋆. 𐙚 ˚</Text>
          <Text style={styles.diffText}>{dateDiffText}</Text>

          <Text style={styles.moodTitle}>Какую эмоцию юзнем?</Text>
          <View style={styles.emojiContainer}>
            {emojiList.map((emoji, i) => (
              <TouchableOpacity key={i} onPress={() => toggleEmotion(emoji)}>
                <Text
                  style={[
                    styles.emoji,
                    selectedEmotions.includes(emoji) ? styles.selected : styles.unselected,
                  ]}
                >
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            maxLength={3228}
            placeholder="❀.⊹.Запиши как прошел ⟡ твой денёк°⋆ೃ࿔ 
             ˙⋆✮ или поделись своими планами ૮ • ﻌ - ა
             ୨୧── если хочешь, прикрепи фоточки ──୨୧                            
             ദ്ദി(˵ •̀ ᴗ - ˵ )                                             
             ✧ -♡´-°⋆⟡ (до 10 штучек) ૮₍ ˃ ⤙ ˂ ₎ა"
            placeholderTextColor="#9b7b7b"
          />

          <Button title="── ୨୧ Добавить фоточку ୨୧ ──" onPress={pickImage} color="#f4a6b1" />

          <ScrollView style={styles.photoScroll}>
            {photos.map((uri, index) => (
              <TouchableOpacity key={index} onLongPress={() => removePhoto(index)}>
                <Image source={{ uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Button title="˚₊⊹ Сохранить запись ⊹₊˚" onPress={saveEntry} color="#f38cab" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#ffeef2',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  date: {
    fontSize: 18,
    color: '#5C2B2B',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  diffText: {
    fontSize: 14,
    color: '#8a4f52',
    marginBottom: 10,
    textAlign: 'center',
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#d63384',
    textAlign: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emoji: {
    fontSize: 28,
    margin: 6,
  },
  selected: {
    opacity: 1,
  },
  unselected: {
    opacity: 0.4,
  },
  input: {
    borderColor: '#f8c1cc',
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    padding: 10,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderRadius: 8,
    color: '#5C2B2B',
  },
  photoScroll: {
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f8c1cc',
  },
});
