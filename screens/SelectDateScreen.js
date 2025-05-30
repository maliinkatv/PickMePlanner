import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function SelectDateScreen() {
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

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);
  const months = [
    '𖹭── Январь ૮ ․ ․ ྀིა ────୨ৎ────', '𖹭──₍^. .^₎⟆ Февраль ────୨ৎ────', '𖹭── Март ꒰ᐢ. .ᐢ꒱ ────୨ৎ────', '𖹭── >⩊< Апрель ────୨ৎ────',
    '𖹭── Май ≽^• ˕ • ྀི≼ ────୨ৎ────', '𖹭── ‧₊˚♪ 𝄞₊˚⊹ Июнь ────୨ৎ────', '𖹭── Июль ૮꒰ ˶• ༝ •˶꒱ა ♡ ────୨ৎ────', '𖹭──(˶˃ ᵕ ˂˶)Август ────୨ৎ────',
    '𖹭──Сентябрь૮₍ ˃ ⤙ ˂ ₎ა ────୨ৎ────', '𖹭── ₍ᐢ. .ᐢ₎ Октябрь ────୨ৎ────', '𖹭── Ноябрь  ᓚ₍⑅^..^₎♡ ────୨ৎ────', '𖹭──૮₍˃̵֊ ˂̵ ₎ა Декабрь ────୨ৎ────'
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const handleConfirm = () => {
    navigation.navigate('Calendar', {
      selectedYear,
      selectedMonth: selectedMonth + 1,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>✿ Выбери годик ✿</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={selectedYear} onValueChange={setSelectedYear}>
          {years.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>❀ Выбери месяц ❀</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={index} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>⋆｡ﾟ Перейти к календарю ⋆｡ﾟ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff0f5' },
  label: { fontSize: 18, fontWeight: 'bold', color: '#d63384', marginVertical: 10, textAlign: 'center' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#f4a6b1',
    borderRadius: 12,
    backgroundColor: '#ffe4e1',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#f38cab',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
