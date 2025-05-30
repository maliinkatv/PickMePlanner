import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedMonth, selectedYear } = route.params || {};

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
  const displayedMonth = selectedMonth ?? today.getMonth() + 1;
  const displayedYear = selectedYear ?? today.getFullYear();
  const displayedDate = `${displayedYear}-${String(displayedMonth).padStart(2, '0')}-01`;

  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const loadMarkedDates = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const entryKeys = keys.filter(
        (k) => k.startsWith('entry-') || k.startsWith('photos-') || k.startsWith('mood-')
      );

      const datesSet = new Set();

      for (const key of entryKeys) {
        const date = key.replace(/^entry-|^photos-|^mood-/, '');
        const note = await AsyncStorage.getItem(`entry-${date}`);
        const photoRaw = await AsyncStorage.getItem(`photos-${date}`);
        const moodRaw = await AsyncStorage.getItem(`mood-${date}`);

        const hasNote = note && note.trim() !== '';
        const hasPhotos = photoRaw && JSON.parse(photoRaw || '[]').length > 0;
        const hasMood = moodRaw && JSON.parse(moodRaw || '[]').length > 0;

        if (hasNote || hasPhotos || hasMood) {
          datesSet.add(date);
        }
      }

      const datesMap = {};
      datesSet.forEach((date) => {
        datesMap[date] = {
          marked: true,
          dotColor: '#ff69b4',
          selectedColor: '#ffe4e1',
        };
      });

      setMarkedDates(datesMap);
    };

    loadMarkedDates();
  }, []);

  const handleDayPress = (day) => {
    navigation.navigate('Day', { date: day.dateString });
  };

  const goToDatePicker = () => {
    navigation.navigate('SelectDate');
  };

  const goToYearOverview = () => {
    navigation.navigate('YearOverview');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToDatePicker} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>⋆｡ﾟ☁︎ Выбрать период ☁︎｡ﾟ⋆</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToYearOverview} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>⋆｡ﾟ☁︎ 12 месяцев ☁︎｡ﾟ⋆</Text>
      </TouchableOpacity>

      <Calendar
        current={displayedDate}
        markingType="dot"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        firstDay={1}
        theme={{
          backgroundColor: '#fff0f5',
          calendarBackground: '#fff0f5',
          todayBackgroundColor: '#ffb6c1',
          todayTextColor: '#5C2B2B',
          selectedDayBackgroundColor: '#ffb6c1',
          selectedDayTextColor: '#5C2B2B',
          textDayFontWeight: '500',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          monthTextColor: '#5C2B2B',
          textDayHeaderFontWeight: 'bold',
          textSectionTitleColor: '#2e8b57',
          textDisabledColor: '#e0dede',
          dayTextColor: '#5C2B2B',
          weekendTextColor: '#ffb6c1',
          arrowColor: '#d63384',
          dotColor: '#ff69b4',
          selectedDotColor: '#ff69b4',
        }}
        style={{
          marginBottom: 20,
          borderRadius: 12,
          paddingBottom: 5,
          borderWidth: 1,
          borderColor: '#f4a6b1',
          height: Dimensions.get('window').height * 0.65,
        }}
        dayComponent={({ date, state, marking }) => {
          const isWeekend =
            new Date(date.dateString).getDay() === 0 || new Date(date.dateString).getDay() === 6;

          const textColor =
            state === 'disabled'
              ? '#e0dede'
              : isWeekend
              ? '#f4a6b1'
              : '#5C2B2B';

          const backgroundColor =
            date.dateString === new Date().toISOString().split('T')[0]
              ? '#ffb6c1'
              : marking?.selected
              ? '#ffe4e1'
              : 'transparent';

          return (
            <TouchableOpacity
              onPress={() => handleDayPress(date)}
              style={{
                borderWidth: 0.6,
                borderColor: '#f4a6b1',
                borderStyle: 'dotted',
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                margin: 1,
                backgroundColor,
              }}
            >
              <Text style={{ color: textColor, fontWeight: '500' }}>{date.day}</Text>
              {marking?.marked && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff0f5' },
  pickerButton: {
    backgroundColor: '#ffe4e1',
    padding: 10,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4a6b1',
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d63384',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#ff69b4',
    marginTop: 2,
  },
});
