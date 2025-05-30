// screens/CalcScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { evaluate } from 'mathjs';

export default function CalcScreen() {
  const navigation = useNavigation();
  const [expression, setExpression] = useState('');
  const [secondMode, setSecondMode] = useState(false);
  const [history, setHistory] = useState([]);

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

  const handlePress = (value) => {
    setHistory([...history, expression]);
    setExpression((prev) => prev + value);
  };

  const handleEval = () => {
    try {
      const result = evaluate(expression);
      setExpression(result.toString());
    } catch {
      setExpression('Ошибка');
    }
  };

  const handleClear = () => setExpression('');
  const handleBackspace = () => setExpression(expression.slice(0, -1));
  const handleUndo = () => {
    if (history.length > 0) {
      const prev = [...history];
      setExpression(prev.pop());
      setHistory(prev);
    }
  };

  const toggleSecond = () => setSecondMode(!secondMode);

  const buttons = [
    ['2nd', 'π', 'e', '(', ')', '←', '⌫'],
    [secondMode ? 'asin' : 'sin', secondMode ? 'acos' : 'cos', secondMode ? 'atan' : 'tan', 'log', 'ln', '^', '√'],
    ['7', '8', '9', '/', 'x²', 'x³', secondMode ? 'csc' : 'cot'],
    ['4', '5', '6', '*', '%', '!', secondMode ? 'sec' : 'sinh'],
    ['1', '2', '3', '-', 'mod', ',', secondMode ? 'acsc' : 'cosh'],
    ['0', '.', '=', '+', '±', 'ncr', 'npr'],
  ];

  const handleSpecial = (btn) => {
    switch (btn) {
      case '⌫':
        handleBackspace();
        break;
      case '=':
        handleEval();
        break;
      case '2nd':
        toggleSecond();
        break;
      case '±':
        setExpression((prev) =>
          prev.startsWith('-') ? prev.slice(1) : '-' + prev
        );
        break;
      case '←':
        handleUndo();
        break;
      case 'π':
        handlePress('pi');
        break;
      case 'e':
        handlePress('e');
        break;
      case 'mod':
        handlePress('%');
        break;
      default:
        handlePress(btn);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Menu')}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      <ScrollView style={styles.displayWrapper}>
        <TextInput
          style={styles.display}
          value={expression}
          editable={false}
          multiline
          placeholder="    ♡｡⋆ вводи циферки ⋆｡♡"
          placeholderTextColor="#d69ba6"
        />
      </ScrollView>

      {buttons.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((btn, j) => (
            <TouchableOpacity
              key={j}
              style={styles.button}
              onPress={() => handleSpecial(btn)}
            >
              <Text style={styles.buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff0f5', paddingTop: 20 },
  displayWrapper: {
    backgroundColor: '#ffe4e1',
    borderRadius: 16,
    margin: 10,
    maxHeight: 140,
  },
  display: {
    fontSize: 24,
    padding: 20,
    color: '#5C2B2B',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  button: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fbb6c6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5C2B2B',
  },
  backButton: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffe4e1',
    borderWidth: 1,
    borderColor: '#f4a6b1',
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    color: '#d63384',
  },
});
