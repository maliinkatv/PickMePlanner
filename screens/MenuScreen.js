// screens/MenuScreen.js
import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const buttons = [
  { title: '⟡ ݁₊ .📆 Календарь месяца ⟡ ݁₊ .⌗', screen: 'Calendar' },
  { title: '⋆˚࿔🗓️ Календарь года₊˚⊹♡ ⌗', screen: 'YearOverview' },
  { title: '⋆.♬⋆🎧 Настройка вайбика🎧ྀི♪⋆', screen: 'Settings' },
  {
    title: '📓 Доложить обстановку         𓂃˖˳·˖ ִֶָ ⋆🌷͙⋆ ִֶָ˖·˳˖𓂃 ִֶָ',
    screen: 'Day',
    params: { date: new Date().toISOString().split('T')[0] },
  },
  { title: '🔎 Выбор года и месяца               ⋆｡‧˚ʚ🍓ɞ˚‧｡⋆', screen: 'SelectDate' },
  { title: '⋆.˚🧮 Математичка доканает ⋮ ⌗ ┆', screen: 'Calc' },
  { title: 'ᶻ 𝗓 𐰁 .ᐟ📒 Все заметки ᶻ 𝗓 𐰁 .ᐟ' , screen: 'AllNotes' }, // TODO
];

export default function MenuScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handlePress = (screen, params) => {
    navigation.navigate(screen, params);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>⋆˙⟡𐙚 Главная менюшкаrrr 𖹭⋆˙⟡</Text>
        </View>
        <View style={styles.grid}>
          {buttons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cell}
              onPress={() => handlePress(btn.screen, btn.params)}
            >
              <Text style={styles.cellText}>{btn.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff0f5',
  },
  container: {
    paddingVertical: 32,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  titleWrapper: {
    backgroundColor: '#ffe4e1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f4a6b1',
    marginBottom: 24,
    shadowColor: '#f8b4c0',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d63384',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    width: Dimensions.get('window').width / 2 - 36,
    height: 90,
    backgroundColor: '#fff7f9',
    borderWidth: 1,
    borderColor: '#f4a6b1',
    borderRadius: 18,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f4a6b1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cellText: {
    color: '#5C2B2B',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
