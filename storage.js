// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Сохранение заметки по дате
export const saveNote = async (date, note) => {
  try {
    await AsyncStorage.setItem(date, note);
  } catch (e) {
    console.error('Ошибка сохранения заметки:', e);
  }
};

// Загрузка заметки по дате
export const loadNote = async (date) => {
  try {
    const note = await AsyncStorage.getItem(date);
    return note || '';
  } catch (e) {
    console.error('Ошибка загрузки заметки:', e);
    return '';
  }
};
