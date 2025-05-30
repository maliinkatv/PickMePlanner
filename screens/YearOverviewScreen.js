//YearOverviewScreen
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const daysShort = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];

const generateCalendarMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const startDay = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix = [];
  let week = new Array(7).fill('');
  let day = 1;

  for (let i = startDay; i < 7 && day <= daysInMonth; i++) {
    week[i] = day++;
  }
  matrix.push(week);

  while (day <= daysInMonth) {
    week = new Array(7).fill('');
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      week[i] = day++;
    }
    matrix.push(week);
  }

  return matrix;
};

const monthNames = [
  '⊹ ࣪ ˖Янв⊹ ࣪ ˖', '⊹ ࣪ ˖Фев⊹ ࣪ ˖', '⊹ ࣪ ˖Март⊹ ࣪ ˖', '⊹ ࣪ ˖Апр⊹ ࣪ ˖',
  '⊹ ࣪ ˖Май⊹ ࣪ ˖', '⊹ ࣪ ˖Июнь⊹ ࣪ ˖', '⊹ ࣪ ˖Июль⊹ ࣪ ˖', '⊹ ࣪ ˖Авг⊹ ࣪ ˖',
  '⊹ ࣪ ˖Сен⊹ ࣪ ˖', '⊹ ࣪ ˖Окт⊹ ࣪ ˖', '⊹ ࣪ ˖Нояб⊹ ࣪ ˖', '⊹ ࣪ ˖Дек⊹ ࣪ ˖'
];

export default function YearOverviewScreen() {
  const navigation = useNavigation();
  const [year, setYear] = useState(new Date().getFullYear());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>🏠🔚</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Text style={{ fontSize: 20 }}>⚙️♪</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleMonthPress = (month) => {
    navigation.navigate('Calendar', { selectedMonth: month + 1, selectedYear: year });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Calendar')} style={styles.backButton}>
          <Text style={styles.backText}>← ⊹ ࣪ ˖Назад⊹ ࣪ ˖</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setYear(year - 1)}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.yearText}>{year}</Text>

        <TouchableOpacity onPress={() => setYear(year + 1)}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {Array.from({ length: 12 }, (_, month) => {
          const matrix = generateCalendarMatrix(year, month);
          return (
            <TouchableOpacity
              key={month}
              style={styles.monthBox}
              onPress={() => handleMonthPress(month)}
            >
              <Text style={styles.monthName}>{monthNames[month]}</Text>
              <View style={styles.weekRow}>
                {daysShort.map((day, index) => (
                  <Text key={index} style={styles.dayShort}>{day}</Text>
                ))}
              </View>
              {matrix.map((week, rowIndex) => (
                <View key={rowIndex} style={styles.weekRow}>
                  {week.map((day, colIndex) => (
                    <Text key={colIndex} style={styles.dayCell}>
                      {day ? String(day).padStart(2, ' ') : '  '}
                    </Text>
                  ))}
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#ffe4e1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f4a6b1',
  },
  backText: {
    fontSize: 14,
    color: '#d63384',
    fontWeight: '600',
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C2B2B',
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d63384',
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  monthBox: {
    width: Dimensions.get('window').width / 3 - 16,
    margin: 6,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#f4a6b1',
    borderWidth: 1,
    alignItems: 'center',
  },
  monthName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayShort: {
    fontSize: 10,
    color: '#999',
    width: '13%',
    textAlign: 'center',
  },
  dayCell: {
    fontSize: 10,
    color: '#5C2B2B',
    width: '13%',
    textAlign: 'center',
  },
});
