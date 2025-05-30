// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CalendarScreen from './screens/CalendarScreen';
import DayScreen from './screens/DayScreen';
import SelectDateScreen from './screens/SelectDateScreen';
import SettingsScreen from './screens/SettingsScreen';
import YearOverviewScreen from './screens/YearOverviewScreen';
import { MusicProvider } from './MusicContext';
import CalcScreen from './screens/CalcScreen';
import MenuScreen from './screens/MenuScreen';
import AllNotesScreen from './screens/AllNotesScreen'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MusicProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
  <Stack.Screen name="Menu" component={MenuScreen} />
  <Stack.Screen name="Calendar" component={CalendarScreen} />
  <Stack.Screen name="Day" component={DayScreen} />
  <Stack.Screen name="SelectDate" component={SelectDateScreen} />
  <Stack.Screen name="Settings" component={SettingsScreen} />
  <Stack.Screen name="YearOverview" component={YearOverviewScreen} />
  <Stack.Screen name="Calc" component={CalcScreen} />
  <Stack.Screen name="AllNotes" component={AllNotesScreen} />
</Stack.Navigator>

      </NavigationContainer>
    </MusicProvider>
  );
}

