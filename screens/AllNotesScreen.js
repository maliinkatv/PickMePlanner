import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AllNotesScreen() {
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
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

  const loadNotes = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const uniqueDates = [...new Set(
      keys
        .filter((key) => /^entry-|^photos-|^mood-/.test(key))
        .map((key) => key.replace(/^entry-|^photos-|^mood-/, ''))
    )];

    const data = [];

    for (const date of uniqueDates) {
      const text = await AsyncStorage.getItem(`entry-${date}`);
      const photoRaw = await AsyncStorage.getItem(`photos-${date}`);
      const moodRaw = await AsyncStorage.getItem(`mood-${date}`);
      const meta = await AsyncStorage.getItem(`meta-entry-${date}`);
      const createdAt = meta ? JSON.parse(meta)?.createdAt : new Date().toISOString();

      const hasText = text?.trim();
      const photos = photoRaw ? JSON.parse(photoRaw) : [];
      const moods = moodRaw ? JSON.parse(moodRaw) : [];

      if (hasText || photos.length || moods.length) {
        data.push({
          date,
          text,
          createdAt: new Date(createdAt),
          moods,
          photoUri: photos[0] ?? null,
        });
      }
    }

    const filtered = data
      .filter((item) =>
        item.text?.toLowerCase().includes(search.toLowerCase()) ||
        search.trim() === ''
      )
      .sort((a, b) => b.createdAt - a.createdAt);

    setNotes(filtered);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotes().finally(() => setRefreshing(false));
  }, [search]);

  useEffect(() => {
    loadNotes();
  }, [search]);

  const openNote = (date) => {
    navigation.navigate('Day', { date });
  };

  const deleteNote = async (date) => {
    Alert.alert('Удалить заметку?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(`entry-${date}`);
          await AsyncStorage.removeItem(`photos-${date}`);
          await AsyncStorage.removeItem(`mood-${date}`);
          await AsyncStorage.removeItem(`meta-entry-${date}`);
          loadNotes();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openNote(item.date)}
      onLongPress={() => deleteNote(item.date)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.date}>📅 {item.date}</Text>
        {item.moods?.length > 0 && (
          <Text style={styles.mood}>{item.moods.join(' ')}</Text>
        )}
      </View>

      {item.photoUri && (
        <Image
          source={{ uri: item.photoUri }}
          style={styles.previewImage}
        />
      )}

      {item.text ? (
        <Text style={styles.preview} numberOfLines={2}>
          {item.text}
        </Text>
      ) : (
        <Text style={styles.previewGray}>⋆˙⟡ туть нет текста ⋆˙⟡</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Поиск по тексту..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#9b7b7b"
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет заметок 🫧</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5',
    padding: 12,
  },
  searchBar: {
    backgroundColor: '#ffeef2',
    borderColor: '#f4a6b1',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    color: '#5C2B2B',
  },
  item: {
    backgroundColor: '#fff7fa',
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f4a6b1',
    shadowColor: '#f4a6b1',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  date: {
    fontWeight: 'bold',
    color: '#d63384',
  },
  mood: {
    fontSize: 16,
  },
  preview: {
    color: '#5C2B2B',
    fontSize: 14,
  },
  previewGray: {
    color: '#9b7b7b',
    fontStyle: 'italic',
  },
  previewImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f8c1cc',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
});
